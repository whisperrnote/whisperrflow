'use client';

import React, { useState } from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Bars3Icon as MenuIcon,
  MagnifyingGlassIcon as SearchIcon,
  PlusIcon as AddIcon,
  BellIcon as NotificationsIcon,
  Cog6ToothIcon as SettingsIcon,
  MoonIcon as DarkModeIcon,
  SunIcon as LightModeIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  UserIcon as PersonIcon,
  QuestionMarkCircleIcon as HelpIcon,
  CommandLineIcon as KeyboardIcon,
  Squares2X2Icon as AppsIcon,
  SparklesIcon as AutoAwesomeIcon,
} from '@heroicons/react/24/outline';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/auth/AuthContext';
import { useThemeMode } from '@/theme';
import { Logo } from '@/components/common';
import { ECOSYSTEM_APPS } from '@/lib/constants';
import dynamic from 'next/dynamic';

const AICommandModal = dynamic(() => import('@/components/ai/AICommandModal'), { ssr: false });

function getInitials(user: { name?: string | null; email?: string | null } | null) {
  const text = user?.name?.trim() || user?.email?.split('@')[0] || '';
  if (!text) return 'U';
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function AppBar() {
  const theme = useTheme();
  const { toggleSidebar, setSearchQuery, searchQuery, setTaskDialogOpen } = useTask();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [appsAnchorEl, setAppsAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAppsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppsAnchorEl(event.currentTarget);
  };

  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAppsAnchorEl(null);
    setNotifAnchorEl(null);
  };


  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #222222',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Menu Toggle - only on desktop */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
          sx={{
            color: '#F2F2F2',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <MenuIcon className="h-5 w-5" />
        </IconButton>

        {/* Logo */}
        <Box sx={{ mr: { xs: 0, md: 2 }, display: { xs: 'none', sm: 'flex' } }}>
          <Logo size="medium" showText={true} />
        </Box>
        <Box sx={{ mr: { xs: 0, md: 2 }, display: { xs: 'flex', sm: 'none' } }}>
          <Logo size="small" showText={false} />
        </Box>

        {/* Search */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid #222222',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: '#404040',
            },
            width: { xs: 0, sm: 300, md: 400 },
            maxWidth: '100%',
            display: { xs: 'none', sm: 'block' },
            transition: 'all 0.2s ease',
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon className="h-5 w-5" style={{ color: '#A1A1AA' }} />
          </Box>
          <InputBase
            placeholder="Search tasks... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: '#F2F2F2',
              width: '100%',
              fontFamily: 'var(--font-mono)',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1.25, 1.5, 1.25, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                width: '100%',
                fontSize: '0.85rem',
                fontWeight: 500,
              },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* AI Assistant Button */}
          <Tooltip title="AI Assistant">
            <IconButton
              onClick={() => setAiModalOpen(true)}
              sx={{
                backgroundColor: 'rgba(0, 240, 255, 0.05)',
                color: '#00F0FF',
                borderRadius: 2,
                p: 1.25,
                border: '1px solid rgba(0, 240, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  borderColor: '#00F0FF',
                },
              }}
            >
              <AutoAwesomeIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>

          {/* Add Task Button */}
          <Tooltip title="Add task (Ctrl+N)">
            <IconButton
              onClick={() => setTaskDialogOpen(true)}
              sx={{
                backgroundColor: '#00F0FF',
                color: '#000000',
                borderRadius: 2,
                p: 1.25,
                '&:hover': {
                  backgroundColor: alpha('#00F0FF', 0.8),
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <AddIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>

          {/* Ecosystem Apps - hidden on mobile */}
          <Tooltip title="Whisperr Apps">
            <IconButton
              onClick={handleAppsClick}
              sx={{
                color: '#A1A1AA',
                display: { xs: 'none', sm: 'flex' },
                borderRadius: 2,
                p: 1.25,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#F2F2F2',
                }
              }}
            >
              <AppsIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotifClick}
              sx={{
                color: '#A1A1AA',
                borderRadius: 2,
                p: 1.25,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#F2F2F2',
                }
              }}
            >
              <Badge
                badgeContent={3}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    backgroundColor: '#00F0FF',
                    color: '#000000',
                  }
                }}
              >
                <NotificationsIcon className="h-5 w-5" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="User Profile">
            <IconButton onClick={handleProfileClick} sx={{ ml: 0.5 }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 1.5,
                  bgcolor: '#141414',
                  color: '#00F0FF',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  border: '1px solid #222222',
                }}
              >
                {getInitials(user)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { width: 240, mt: 1.5 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {user && (
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          )}
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <PersonIcon className="h-5 w-5" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            const domain = process.env.NEXT_PUBLIC_DOMAIN || 'whisperrnote.space';
            const authSub = process.env.NEXT_PUBLIC_AUTH_SUBDOMAIN || 'accounts';
            window.location.href = `https://${authSub}.${domain}/settings?source=${encodeURIComponent(window.location.origin)}`;
          }}>
            <ListItemIcon>
              <SettingsIcon className="h-5 w-5" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Vault Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            alert('Exporting your data...');
            handleClose();
          }}>
            <ListItemIcon>
              <LogoutIcon className="h-5 w-5 rotate-180" style={{ color: '#FFC107' }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 700, color: '#FFC107' }}>Export Data</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <KeyboardIcon className="h-5 w-5" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Keyboard shortcuts</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <HelpIcon className="h-5 w-5" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Help & Support</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem sx={{ color: 'error.main' }} onClick={() => logout()}>
            <ListItemIcon>
              <LogoutIcon className="h-5 w-5" style={{ color: theme.palette.error.main }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Sign out</ListItemText>
          </MenuItem>
        </Menu>

        {/* Apps Menu */}
        <Menu
          anchorEl={appsAnchorEl}
          open={Boolean(appsAnchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { width: 320, mt: 1.5, p: 1 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Typography variant="overline" sx={{ px: 1, color: 'text.secondary' }}>
            Whisperr Ecosystem
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0.5,
              mt: 1,
            }}
          >
            {ECOSYSTEM_APPS.map((app) => (
              <Box
                key={app.name}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: app.active
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  border: app.active
                    ? `1px solid ${theme.palette.primary.main}`
                    : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: alpha(app.color, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    mb: 0.5,
                  }}
                >
                  {app.icon}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: app.active ? 600 : 400,
                    textAlign: 'center',
                  }}
                >
                  {app.shortName}
                </Typography>
              </Box>
            ))}
          </Box>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { width: 360, mt: 1.5 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer' }}
            >
              Mark all read
            </Typography>
          </Box>
          <Divider />
          {[
            {
              title: 'Task due soon',
              message: '"Fix login bug" is due today',
              time: '5m ago',
              unread: true,
            },
            {
              title: 'Comment added',
              message: 'Sarah commented on "Design dashboard"',
              time: '1h ago',
              unread: true,
            },
            {
              title: 'Task completed',
              message: 'You completed "Set up CI/CD pipeline"',
              time: '2h ago',
              unread: true,
            },
          ].map((notif, index) => (
            <MenuItem
              key={index}
              sx={{
                py: 1.5,
                backgroundColor: notif.unread
                  ? alpha(theme.palette.primary.main, 0.05)
                  : 'transparent',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {notif.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notif.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notif.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem sx={{ justifyContent: 'center' }}>
            <Typography color="primary" variant="body2">
              View all notifications
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
      <AICommandModal open={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </MuiAppBar>
  );
}
