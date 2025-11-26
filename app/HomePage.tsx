'use client';

import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ChecklistRtl as TasksIcon,
  CalendarMonth as CalendarIcon,
  Settings as SettingsIcon,
  Event as EventIcon,
  CenterFocusStrong as FocusIcon,
} from '@mui/icons-material';
import { TaskList, TaskDialog, TaskDetails, BottomNav } from '@/components';
import { Dashboard } from '@/components/dashboard';
import { CalendarView } from '@/components/calendar';
import { SettingsPanel } from '@/components/settings';
import FocusMode from '@/components/focus/FocusMode';
import EventList from '@/components/events/EventList';
import { useTask } from '@/context/TaskContext';
import { AppView } from '@/types';

export default function HomePage() {
  const theme = useTheme();
  const { activeView, setActiveView } = useTask();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (_: React.SyntheticEvent, newValue: AppView) => {
    setActiveView(newValue);
  };

  return (
    <>
      {/* Page Tabs - only visible on desktop */}
      {!isMobile && (
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeView}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5,
                backgroundColor: theme.palette.primary.main,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                minHeight: 48,
                px: 2,
              },
            }}
          >
            <Tab
              value="dashboard"
              label="Dashboard"
              icon={<DashboardIcon />}
              iconPosition="start"
            />
            <Tab
              value="tasks"
              label="Tasks"
              icon={<TasksIcon />}
              iconPosition="start"
            />
            <Tab
              value="calendar"
              label="Calendar"
              icon={<CalendarIcon />}
              iconPosition="start"
            />
            <Tab
              value="events"
              label="Events"
              icon={<EventIcon />}
              iconPosition="start"
            />
            <Tab
              value="focus"
              label="Focus"
              icon={<FocusIcon />}
              iconPosition="start"
            />
            <Tab
              value="settings"
              label="Settings"
              icon={<SettingsIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      )}

      {/* Tab Content */}
      <Box sx={{ height: isMobile ? 'calc(100vh - 160px)' : 'auto' }}>
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'tasks' && <TaskList />}
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'events' && <EventList />}
        {activeView === 'focus' && <FocusMode />}
        {activeView === 'settings' && <SettingsPanel />}
      </Box>

      {/* Task Dialog */}
      <TaskDialog />

      {/* Task Details Drawer */}
      <TaskDetails />

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNav />
      )}
    </>
  );
}
