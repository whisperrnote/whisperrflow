'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  IconButton,
  Badge,
  Tooltip,
  Divider,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  HomeIcon as DashboardIcon,
  ListBulletIcon as TasksIcon,
  CalendarIcon,
  CalendarDaysIcon as EventIcon,
  FlagIcon as FocusIcon,
  InboxIcon,
  CalendarDaysIcon as TodayIcon,
  ClockIcon as ScheduleIcon,
  CheckCircleIcon as CompletedIcon,
  TagIcon as LabelIcon,
  PlusIcon as AddIcon,
  ChevronUpIcon as ExpandLess,
  ChevronDownIcon as ExpandMore,
  StarIcon,
  ViewColumnsIcon as KanbanIcon,
  TableCellsIcon as MatrixIcon,
  ChartBarIcon as TimelineIcon,
  Cog6ToothIcon as SettingsIcon,
} from '@heroicons/react/24/outline';
import { useTask } from '@/context/TaskContext';

const DRAWER_WIDTH = 256;

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  color?: string;
  href?: string;
}

export default function Sidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarOpen,
    projects,
    labels,
    tasks,
    selectedProjectId,
    selectProject,
    setFilter,
    filter,
    updateProject,
  } = useTask();

  const [projectsOpen, setProjectsOpen] = useState(true);
  const [labelsOpen, setLabelsOpen] = useState(true);

  // Calculate stats
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const inboxCount = tasks.filter(
    (t) => t.projectId === 'inbox' && t.status !== 'done' && !t.isArchived
  ).length;

  const todayCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'done' || t.isArchived) return false;
    const due = new Date(t.dueDate);
    return due >= today && due < tomorrow;
  }).length;

  const upcomingCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'done' || t.isArchived) return false;
    const due = new Date(t.dueDate);
    return due >= tomorrow && due < nextWeek;
  }).length;

  const overdueCount = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done' && !t.isArchived
  ).length;

  const completedCount = tasks.filter(
    (t) => t.status === 'done' && !t.isArchived
  ).length;

  const mainNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
    { id: 'tasks', label: 'Tasks', icon: <TasksIcon />, href: '/tasks' },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon />, href: '/calendar' },
    { id: 'events', label: 'Events', icon: <EventIcon />, href: '/events' },
    { id: 'focus', label: 'Focus Mode', icon: <FocusIcon />, href: '/focus' },
  ];

  const smartLists: NavItem[] = [
    { id: 'inbox', label: 'Inbox', icon: <InboxIcon />, badge: inboxCount },
    { id: 'today', label: 'Today', icon: <TodayIcon />, badge: todayCount, color: '#10b981' },
    { id: 'upcoming', label: 'Upcoming', icon: <ScheduleIcon />, badge: upcomingCount, color: '#3b82f6' },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: <CalendarIcon />,
      badge: overdueCount,
      color: '#ef4444',
    },
    { id: 'completed', label: 'Completed', icon: <CompletedIcon />, badge: completedCount },
  ];

  const viewModes: NavItem[] = [
    { id: 'board', label: 'Board View', icon: <KanbanIcon /> },
    { id: 'calendar', label: 'Calendar View', icon: <CalendarIcon /> },
    { id: 'timeline', label: 'Timeline', icon: <TimelineIcon /> },
    { id: 'matrix', label: 'Priority Matrix', icon: <MatrixIcon /> },
  ];

  const handleSmartListClick = (id: string) => {
    router.push('/tasks');
    switch (id) {
      case 'inbox':
        selectProject('inbox');
        setFilter({ ...filter, projectId: 'inbox' });
        break;
      case 'today':
        selectProject(null);
        setFilter({
          ...filter,
          projectId: undefined,
          dueDate: { from: today, to: tomorrow },
          showCompleted: false,
        });
        break;
      case 'upcoming':
        selectProject(null);
        setFilter({
          ...filter,
          projectId: undefined,
          dueDate: { from: tomorrow, to: nextWeek },
          showCompleted: false,
        });
        break;
      case 'overdue':
        selectProject(null);
        setFilter({
          ...filter,
          projectId: undefined,
          dueDate: { to: now },
          showCompleted: false,
        });
        break;
      case 'completed':
        selectProject(null);
        setFilter({
          ...filter,
          projectId: undefined,
          status: ['done'],
          showCompleted: true,
        });
        break;
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push('/tasks');
    selectProject(projectId);
    setFilter({ ...filter, projectId, status: undefined, dueDate: undefined });
  };

  const toggleFavorite = (projectId: string, isFavorite: boolean) => {
    updateProject(projectId, { isFavorite: !isFavorite });
  };

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter(
      (t) => t.projectId === projectId && t.status !== 'done' && !t.isArchived
    ).length;
  };

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId && !t.isArchived);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter((t) => t.status === 'done').length;
    return (completed / projectTasks.length) * 100;
  };

  const favoriteProjects = projects.filter((p) => p.isFavorite && !p.isArchived);
  const regularProjects = projects.filter((p) => !p.isFavorite && !p.isArchived && p.id !== 'inbox');

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          mt: '64px',
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', py: 1 }}>
        {/* Main Navigation */}
        <List dense sx={{ px: 1 }}>
          {mainNav.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href || '#'}
                selected={pathname === item.href}
                sx={{
                  borderRadius: 3,
                  py: 1.25,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0.9,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: pathname === item.href ? '#fff' : theme.palette.text.secondary,
                  }}
                >
                  {React.cloneElement(item.icon as React.ReactElement, { className: 'h-6 w-6' } as any)}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: pathname === item.href ? 700 : 500,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Smart Lists */}
        <Typography
          variant="overline"
          sx={{ px: 3, color: 'text.secondary', display: 'block', mt: 1, mb: 1, fontWeight: 700 }}
        >
          Smart Lists
        </Typography>
        <List dense sx={{ px: 1 }}>
          {smartLists.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={pathname === '/tasks' && (filter.projectId === item.id || (item.id === 'completed' && filter.status?.includes('done')))}
                onClick={() => handleSmartListClick(item.id)}
                sx={{
                  borderRadius: 3,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    color: theme.palette.primary.main,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: item.color || theme.palette.text.secondary,
                  }}
                >
                  {React.cloneElement(item.icon as React.ReactElement, { className: 'h-5 w-5' } as any)}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    badgeContent={item.badge}
                    color={item.id === 'overdue' ? 'error' : 'default'}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor:
                          item.id === 'overdue'
                            ? theme.palette.error.main
                            : alpha(theme.palette.text.primary, 0.1),
                        color: item.id === 'overdue' ? '#fff' : theme.palette.text.primary,
                        fontWeight: 700,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* View Modes */}
        <Typography
          variant="overline"
          sx={{ px: 3, color: 'text.secondary', display: 'block', mt: 1, mb: 1, fontWeight: 700 }}
        >
          Views
        </Typography>
        <List dense sx={{ px: 1 }}>
          {viewModes.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 3,
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  {React.cloneElement(item.icon as React.ReactElement, { className: 'h-5 w-5' } as any)}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Favorite Projects */}
        {favoriteProjects.length > 0 && (
          <>
            <Typography
              variant="overline"
              sx={{ px: 3, color: 'text.secondary', display: 'block', mt: 1, mb: 1, fontWeight: 700 }}
            >
              Favorites
            </Typography>
            <List dense sx={{ px: 1 }}>
              {favoriteProjects.map((project) => (
                <ListItem key={project.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={pathname === '/tasks' && selectedProjectId === project.id}
                    onClick={() => handleProjectClick(project.id)}
                    sx={{
                      borderRadius: 3,
                      py: 1,
                      '&.Mui-selected': {
                        backgroundColor: alpha(project.color, 0.15),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: project.color,
                          boxShadow: `0 0 8px ${alpha(project.color, 0.5)}`,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={project.name}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(project.id, project.isFavorite);
                      }}
                      sx={{ color: theme.palette.warning.main }}
                    >
                      <StarIcon className="h-4 w-4" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2, mx: 2 }} />
          </>
        )}

        {/* Projects */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 0.5,
            mb: 1,
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => setProjectsOpen(!projectsOpen)}
          >
            Projects
          </Typography>
          <IconButton size="small" onClick={() => setProjectsOpen(!projectsOpen)}>
            {projectsOpen ? <ExpandLess className="h-4 w-4" /> : <ExpandMore className="h-4 w-4" />}
          </IconButton>
          <Tooltip title="Add project">
            <IconButton size="small">
              <AddIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </Box>

        <Collapse in={projectsOpen}>
          <List dense sx={{ px: 1 }}>
            {regularProjects.map((project) => (
              <ListItem key={project.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={pathname === '/tasks' && selectedProjectId === project.id}
                  onClick={() => handleProjectClick(project.id)}
                  sx={{
                    borderRadius: 3,
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: alpha(project.color, 0.1),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: project.color,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={project.name}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                    secondary={
                      <LinearProgress
                        variant="determinate"
                        value={getProjectProgress(project.id)}
                        sx={{
                          mt: 0.75,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: alpha(project.color, 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: project.color,
                          },
                        }}
                      />
                    }
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontWeight: 700 }}>
                    {getProjectTaskCount(project.id)}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Labels */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 0.5,
            mb: 1,
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => setLabelsOpen(!labelsOpen)}
          >
            Labels
          </Typography>
          <IconButton size="small" onClick={() => setLabelsOpen(!labelsOpen)}>
            {labelsOpen ? <ExpandLess className="h-4 w-4" /> : <ExpandMore className="h-4 w-4" />}
          </IconButton>
          <Tooltip title="Add label">
            <IconButton size="small">
              <AddIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </Box>

        <Collapse in={labelsOpen}>
          <List dense sx={{ px: 1 }}>
            {labels.map((label) => (
              <ListItem key={label.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() =>
                    setFilter({
                      ...filter,
                      labels: filter.labels?.includes(label.id)
                        ? filter.labels.filter((l) => l !== label.id)
                        : [...(filter.labels || []), label.id],
                    })
                  }
                  sx={{
                    borderRadius: 3,
                    py: 1,
                    backgroundColor: filter.labels?.includes(label.id)
                      ? alpha(label.color, 0.1)
                      : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LabelIcon style={{ color: label.color }} className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText
                    primary={label.name}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Bottom Actions */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Divider sx={{ mx: 2 }} />
          <List dense sx={{ px: 1, py: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/settings"
                selected={pathname === '/settings'}
                sx={{ borderRadius: 3, py: 1.25 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SettingsIcon className="h-5 w-5" />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
