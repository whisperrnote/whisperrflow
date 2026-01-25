'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  IconButton,
  Typography,
  Divider,
  useTheme,
  alpha,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Folder as FolderIcon,
  Label as LabelIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTask } from '@/context/TaskContext';
import { Priority, TaskStatus } from '@/types';
import { taskAttachments } from '@/lib/storage';
import { tablesDB } from '@/lib/appwrite';

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#94a3b8' },
  { value: 'medium', label: 'Medium', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f59e0b' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

export default function TaskDialog() {
  const theme = useTheme();
  const {
    taskDialogOpen,
    setTaskDialogOpen,
    addTask,
    projects,
    labels,
    selectedProjectId,
    userId,
  } = useTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [projectId, setProjectId] = useState(selectedProjectId || 'inbox');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<{ id: string, name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [contacts, setContacts] = useState<{ id: string, name: string }[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  // Bridge: Load contacts from Connect
  useEffect(() => {
    if (taskDialogOpen && userId) {
      tablesDB.listRows({
        databaseId: 'chat',
        tableId: 'contacts',
        queries: []
      }).then((res: any) => {
        // Map contacts to simple {id, name}
        const mapped = (res.rows || res.documents).map((c: any) => ({
          id: c.contactUserId,
          name: c.nickname || 'Unknown Contact'
        }));
        setContacts(mapped);
      }).catch(() => {});
    }
  }, [taskDialogOpen, userId]);

  const handleClose = () => {
    setTaskDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setProjectId(selectedProjectId || 'inbox');
    setSelectedLabels([]);
    setDueDate(null);
    setEstimatedTime('');
    setPendingAttachments([]);
    setIsUploading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await taskAttachments.upload(file);
        return { id: result.$id, name: file.name };
      });

      const newAttachments = await Promise.all(uploadPromises);
      setPendingAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      console.error('Failed to upload attachments:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = async (id: string) => {
    try {
      await taskAttachments.delete(id);
      setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to delete attachment:', error);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      projectId,
      labels: selectedLabels,
      dueDate: dueDate || undefined,
      estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : undefined,
      subtasks: [],
      comments: [],
      attachments: pendingAttachments.map(a => ({
        id: a.id,
        name: a.name,
        url: '', // Will be hydrated by service/maper if needed
        type: 'file',
        size: 0,
        uploadedAt: new Date()
      })),
      reminders: [],
      timeEntries: [],
      assigneeIds: selectedAssignees,
      creatorId: userId || 'guest',
      isArchived: false,
    });

    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={taskDialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage: 'none',
            backgroundColor: '#050505',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            pt: 3,
            pb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#F2F2F2' }}>
                NEW TASK
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em' }}>
                INITIALIZE EXECUTION TRACK
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.disabled', '&:hover': { color: '#F2F2F2' } }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box
            component="form"
            onKeyDown={handleKeyDown}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}
          >
            {/* Title */}
            <TextField
              autoFocus
              placeholder="What's the primary objective?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { 
                    fontSize: '1.5rem', 
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#F2F2F2',
                    padding: 0,
                    '&::placeholder': {
                        opacity: 0.3,
                    }
                },
              }}
            />

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

            {/* Description */}
            <TextField
              placeholder="Detailed parameters and context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { 
                    fontSize: '0.95rem',
                    color: 'text.secondary',
                    lineHeight: 1.6,
                },
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                {/* Project & Priority Row */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Project */}
                <FormControl variant="filled" fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>PROJECT</InputLabel>
                    <Select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    disableUnderline
                    sx={{ borderRadius: 2, bgcolor: 'transparent' }}
                    renderValue={(selected) => {
                        const project = projects.find(p => p.id === selected);
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: project?.color }} />
                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{project?.name}</Typography>
                            </Box>
                        );
                    }}
                    >
                    {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id} sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: project.color,
                            }}
                            />
                            <Typography sx={{ fontWeight: 500 }}>{project.name}</Typography>
                        </Box>
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                {/* Priority */}
                <FormControl variant="filled" fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>PRIORITY</InputLabel>
                    <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    disableUnderline
                    sx={{ borderRadius: 2, bgcolor: 'transparent' }}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlagIcon sx={{ fontSize: 16, color: priorityOptions.find(p => p.value === selected)?.color }} />
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{priorityOptions.find(p => p.value === selected)?.label.toUpperCase()}</Typography>
                        </Box>
                    )}
                    >
                    {priorityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <FlagIcon sx={{ fontSize: 18, color: option.color }} />
                            <Typography sx={{ fontWeight: 500 }}>{option.label}</Typography>
                        </Box>
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>

                {/* Due Date & Status Row */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Due Date */}
                <DatePicker
                    label="DEADLINE"
                    value={dueDate}
                    onChange={(newValue) => setDueDate(newValue)}
                    slotProps={{
                    textField: {
                        fullWidth: true,
                        variant: 'filled',
                        size: 'small',
                        InputProps: { disableUnderline: true, sx: { borderRadius: 2 } },
                        InputLabelProps: { sx: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' } }
                    },
                    }}
                />

                {/* Status */}
                <FormControl variant="filled" fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>STATUS</InputLabel>
                    <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    disableUnderline
                    sx={{ borderRadius: 2, bgcolor: 'transparent' }}
                    >
                    {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ py: 1.5 }}>
                            {option.label}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>
            </Box>

            {/* Attachments Section */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
                        ATTACHMENTS
                    </Typography>
                    <Button
                        component="label"
                        size="small"
                        startIcon={<AttachFileIcon sx={{ fontSize: 16 }} />}
                        sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#00F5FF' }}
                    >
                        ADD ATTACHMENT
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
                
                {isUploading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CircularProgress size={12} sx={{ color: '#00F5FF' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Uploading files...</Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {pendingAttachments.map((file) => (
                        <Chip
                            key={file.id}
                            label={file.name}
                            size="small"
                            onDelete={() => handleRemoveAttachment(file.id)}
                            deleteIcon={<DeleteIcon sx={{ fontSize: '14px !important' }} />}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                color: 'text.secondary',
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                '& .MuiChip-deleteIcon': { color: 'rgba(255, 255, 255, 0.3)', '&:hover': { color: '#ef4444' } }
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Assignees Section - Bridge from Connect */}
            <Box>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', mb: 1 }}>
                    ASSIGNEES (FROM CONNECT)
                </Typography>
                <Autocomplete
                    multiple
                    options={contacts}
                    getOptionLabel={(option) => option.name}
                    value={contacts.filter(c => selectedAssignees.includes(c.id))}
                    onChange={(_, newValue) => setSelectedAssignees(newValue.map(v => v.id))}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            placeholder={contacts.length > 0 ? "Add collaborators..." : "No contacts found in Connect"}
                            InputProps={{ ...params.InputProps, disableUnderline: true }}
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                {...getTagProps({ index })}
                                key={option.id}
                                label={option.name}
                                size="small"
                                icon={<PersonIcon sx={{ fontSize: '14px !important' }} />}
                                sx={{
                                    bgcolor: 'rgba(0, 245, 255, 0.1)',
                                    color: '#00F5FF',
                                    fontWeight: 700,
                                    borderRadius: 1
                                }}
                            />
                        ))
                    }
                />
            </Box>

            {/* Labels */}
            <Autocomplete
              multiple
              options={labels}
              value={labels.filter((l) => selectedLabels.includes(l.id))}
              onChange={(_, newValue) => setSelectedLabels(newValue.map((l) => l.id))}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="TAGS"
                  variant="standard"
                  placeholder="Categorize task..."
                  InputLabelProps={{ sx: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' } }}
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.name.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: alpha(option.color, 0.1),
                      color: option.color,
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      borderRadius: 1,
                      border: `1px solid ${alpha(option.color, 0.2)}`,
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5 }}
                >
                  <Box sx={{ width: 4, height: 16, borderRadius: 1, bgcolor: option.color }} />
                  <Typography sx={{ fontWeight: 500 }}>{option.name}</Typography>
                </Box>
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 3, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
                '&:hover': { color: '#F2F2F2' }
            }}
          >
            CANCEL REQUEST
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!title.trim()}
            sx={{
                px: 3,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 800,
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
                bgcolor: '#00F5FF',
                color: '#000',
                '&:hover': {
                    bgcolor: '#00D1D9',
                },
                '&.Mui-disabled': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            }}
          >
            CREATE TASK
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
