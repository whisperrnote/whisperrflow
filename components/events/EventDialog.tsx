'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  useTheme,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn,
  Link as LinkIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addHours } from 'date-fns';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
}

export default function EventDialog({ open, onClose, onSubmit }: EventDialogProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(addHours(new Date(), 1));
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !startTime || !endTime) return;

    onSubmit({
      title,
      description,
      startTime,
      endTime,
      location,
      url,
      coverImage,
    });

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime(new Date());
    setEndTime(addHours(new Date(), 1));
    setLocation('');
    setUrl('');
    setCoverImage('');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Create New Event
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Title */}
            <TextField
              autoFocus
              label="Event title"
              placeholder="Event Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              InputProps={{
                sx: { fontSize: '1.1rem' },
              }}
            />

            {/* Description */}
            <TextField
              label="Description"
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            {/* Date Time Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DateTimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DateTimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>

            {/* Location */}
            <TextField
              label="Location"
              placeholder="Add location or link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* URL */}
            <TextField
              label="Event Link"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Cover Image URL */}
            <TextField
              label="Cover Image URL"
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!title.trim() || !startTime || !endTime}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
