'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Checkbox,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Flag as FlagIcon,
  Clock as ScheduleIcon,
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  MoreVertical as MoreIcon,
  List as SubtaskIcon,
  MessageSquare as CommentIcon,
  Paperclip as AttachmentIcon,
  Archive as ArchiveIcon,
  Copy as CopyIcon,
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import { Task, Priority } from '@/types';
import { useTask } from '@/context/TaskContext';
import { useLayout } from '@/context/LayoutContext';

interface TaskItemProps {
  task: Task;
  onClick?: () => void;
  compact?: boolean;
}

const priorityColors: Record<Priority, string> = {
  low: '#A1A1AA',
  medium: '#00F0FF',
  high: '#f59e0b',
  urgent: '#ef4444',
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export default React.memo(function TaskItem({ task, onClick, compact = false }: TaskItemProps) {
  const theme = useTheme();
  const { completeTask, deleteTask, updateTask, labels, projects, selectTask } = useTask();
  const { openSecondarySidebar } = useLayout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const project = projects.find((p) => p.id === task.projectId);
  const taskLabels = labels.filter((l) => task.labels.includes(l.id));
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleComplete = (event: React.MouseEvent) => {
    event.stopPropagation();
    completeTask(task.id);
  };

  const handleDelete = () => {
    handleMenuClose();
    deleteTask(task.id);
  };

  const handleArchive = () => {
    handleMenuClose();
    updateTask(task.id, { isArchived: true });
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const getDueDateColor = () => {
    if (!task.dueDate) return '#A1A1AA';
    if (task.status === 'done') return '#10b981';
    if (isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))) return '#ef4444';
    if (isToday(new Date(task.dueDate))) return '#f59e0b';
    return '#A1A1AA';
  };

  return (
    <>
      <Paper
        elevation={0}
        onClick={() => {
          selectTask(task.id);
          openSecondarySidebar('task', task.id);
          onClick?.();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          p: compact ? 1.5 : 2,
          mb: 1,
          cursor: 'pointer',
          borderRadius: 2,
          backgroundColor: isHovered ? 'rgba(20, 20, 20, 0.8)' : 'rgba(10, 10, 10, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          opacity: task.status === 'done' ? 0.5 : 1,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateX(4px)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          {/* Checkbox */}
          <Checkbox
            checked={task.status === 'done'}
            onClick={handleComplete}
            sx={{
              p: 0,
              mt: 0.25,
              color: 'rgba(255, 255, 255, 0.2)',
              '&.Mui-checked': {
                color: '#00F0FF',
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 240, 255, 0.05)',
              }
            }}
          />

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Title */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: task.status === 'done' ? '#404040' : '#F2F2F2',
                textDecoration: task.status === 'done' ? 'line-through' : 'none',
                mb: 0.5,
              }}
            >
              {task.title}
            </Typography>

            {/* Description (if not compact) */}
            {!compact && task.description && (
              <Typography
                variant="body2"
                sx={{
                  color: '#A1A1AA',
                  fontSize: '0.85rem',
                  mb: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {task.description}
              </Typography>
            )}

            {/* Meta Info */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {/* Project */}
              {project && project.id !== 'inbox' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.25, borderRadius: 1, backgroundColor: alpha(project.color, 0.1), border: `1px solid ${alpha(project.color, 0.2)}` }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: project.color }} />
                  <Typography variant="caption" sx={{ color: project.color, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {project.name}
                  </Typography>
                </Box>
              )}

              {/* Priority */}
              {task.priority !== 'medium' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 1, backgroundColor: alpha(priorityColors[task.priority], 0.1), border: `1px solid ${alpha(priorityColors[task.priority], 0.2)}` }}>
                  <FlagIcon size={10} color={priorityColors[task.priority]} />
                  <Typography variant="caption" sx={{ color: priorityColors[task.priority], fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {priorityLabels[task.priority]}
                  </Typography>
                </Box>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 1, backgroundColor: alpha(getDueDateColor(), 0.05), border: `1px solid ${alpha(getDueDateColor(), 0.1)}` }}>
                  <ScheduleIcon size={10} color={getDueDateColor()} />
                  <Typography variant="caption" sx={{ color: getDueDateColor(), fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {formatDueDate(new Date(task.dueDate))}
                  </Typography>
                </Box>
              )}

              {/* Indicators */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
                {totalSubtasks > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#404040' }}>
                    <SubtaskIcon size={12} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{completedSubtasks}/{totalSubtasks}</Typography>
                  </Box>
                )}
                {task.comments.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#404040' }}>
                    <CommentIcon size={12} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{task.comments.length}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Actions */}
          <IconButton 
            size="small" 
            onClick={handleMenuClick}
            sx={{ 
              p: 0.5, 
              color: '#404040',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s',
              '&:hover': { color: '#F2F2F2' }
            }}
          >
            <MoreIcon size={16} />
          </IconButton>
        </Box>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            minWidth: 180, 
            borderRadius: 2,
            backgroundColor: '#0A0A0A',
            border: '1px solid #222222',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          },
        }}
      >
        <MenuItem onClick={() => { 
          selectTask(task.id); 
          openSecondarySidebar('task', task.id);
          handleMenuClose(); 
        }}>
          <ListItemIcon><EditIcon size={16} color="#A1A1AA" /></ListItemIcon>
          <ListItemText primary="Edit Task" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><CopyIcon size={16} color="#A1A1AA" /></ListItemIcon>
          <ListItemText primary="Duplicate" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={handleArchive}>
          <ListItemIcon><ArchiveIcon size={16} color="#A1A1AA" /></ListItemIcon>
          <ListItemText primary="Archive" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }} />
        </MenuItem>
        <Box sx={{ my: 0.5, height: '1px', backgroundColor: '#222222' }} />
        <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
          <ListItemIcon><DeleteIcon size={16} color="#ef4444" /></ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
        </MenuItem>
      </Menu>
    </>
  );
});
