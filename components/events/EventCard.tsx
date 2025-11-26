'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Share,
  MoreVert,
  AccessTime,
} from '@mui/icons-material';
import { Event } from '@/types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={event.coverImage || 'https://source.unsplash.com/random/800x600?event'}
          alt={event.title}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            boxShadow: theme.shadows[2],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
            {format(new Date(event.startTime), 'MMM')}
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>
            {format(new Date(event.startTime), 'd')}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
            {event.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
            <AccessTime sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
            </Typography>
          </Box>
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography variant="body2" noWrap>
                {event.location}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
            {event.attendees.map((id) => (
              <Avatar key={id} alt="User" src={`https://i.pravatar.cc/150?u=${id}`} />
            ))}
          </AvatarGroup>
          <Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); }}>
              <Share fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
