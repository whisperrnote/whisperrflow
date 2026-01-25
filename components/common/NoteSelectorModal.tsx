'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Description as NoteIcon,
} from '@mui/icons-material';
import { notes as notesApi } from '@/lib/whisperrflow';

interface Note {
  $id: string;
  title: string;
  content: string;
}

interface NoteSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (noteId: string) => void;
}

export function NoteSelectorModal({ isOpen, onClose, onSelect }: NoteSelectorModalProps) {
  const theme = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchNotes = async () => {
        setLoading(true);
        try {
          const res = await notesApi.list();
          setNotes(res.documents as any[]);
        } catch (err) {
          console.error('Failed to fetch notes:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchNotes();
    }
  }, [isOpen]);

  const filteredNotes = notes.filter(note => 
    (note.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (note.content || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundImage: 'none',
          backgroundColor: '#050505',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#F2F2F2' }}>
            ATTACH NOTE
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em' }}>
            SELECT RESOURCE FROM WHISPERRNOTE
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.disabled', '&:hover': { color: '#F2F2F2' } }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ minHeight: '300px', maxHeight: '500px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="filled"
            InputProps={{
              disableUnderline: true,
              sx: { borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.03)' },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress size={32} sx={{ color: '#00F5FF' }} />
            </Box>
          ) : filteredNotes.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.3 }}>
              <NoteIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2">No notes found</Typography>
            </Box>
          ) : (
            <List sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredNotes.map((note) => (
                <ListItemButton
                  key={note.$id}
                  onClick={() => onSelect(note.$id)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 245, 255, 0.05)',
                      borderColor: 'rgba(0, 245, 255, 0.2)',
                    }
                  }}
                >
                  <ListItemText 
                    primary={note.title || 'Untitled Note'} 
                    secondary={note.content ? (note.content.substring(0, 60) + '...') : ''}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 700,
                      color: '#F2F2F2'
                    }} 
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: 'text.secondary'
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
