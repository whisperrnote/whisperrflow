'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, CalendarMonth, List as ListIcon } from '@mui/icons-material';
import EventCard from './EventCard';
import { Event } from '@/types';
import { addDays, addHours } from 'date-fns';

// Dummy data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Product Design Weekly',
    description: 'Weekly sync with the design team to review progress and blockers.',
    startTime: addHours(new Date(), 2),
    endTime: addHours(new Date(), 3),
    location: 'Google Meet',
    url: 'https://meet.google.com/abc-defg-hij',
    attendees: ['1', '2', '3'],
    isPublic: false,
    creatorId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    coverImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'WhisperrFlow Launch Party',
    description: 'Celebrating the launch of our new productivity app!',
    startTime: addDays(new Date(), 2),
    endTime: addDays(addHours(new Date(), 2), 2),
    location: 'San Francisco, CA',
    attendees: ['1', '2', '3', '4', '5'],
    isPublic: true,
    creatorId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Deep Work Session',
    description: 'Group focus session for deep work.',
    startTime: addDays(new Date(), 1),
    endTime: addDays(addHours(new Date(), 1), 1),
    location: 'Online',
    attendees: ['1'],
    isPublic: true,
    creatorId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
  },
];

export default function EventList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and manage your schedule
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 50, px: 3 }}
        >
          Create Event
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="event tabs">
          <Tab label="Upcoming" />
          <Tab label="Past" />
          <Tab label="My Events" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <EventCard event={event} onClick={() => console.log('Clicked event', event.id)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
