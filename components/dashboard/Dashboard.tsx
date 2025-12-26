'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle2 as CheckIcon,
  Clock as ScheduleIcon,
  AlertTriangle as WarningIcon,
  Flag as FlagIcon,
  ArrowRight as ArrowIcon,
  Lightbulb as TipIcon,
  Flame as StreakIcon,
} from 'lucide-react';
import { useTask } from '@/context/TaskContext';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import TaskItem from '@/components/tasks/TaskItem';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

function StatCard({ title, value, subtitle, icon, color, trend, onClick }: StatCardProps) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick
          ? {
            borderColor: '#404040',
            transform: 'translateY(-4px)',
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
          }
          : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#A1A1AA', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1, display: 'block' }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#F2F2F2', fontFamily: 'var(--font-mono)', mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: '#404040', fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            backgroundColor: alpha(color, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            border: `1px solid ${alpha(color, 0.2)}`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const { tasks, setFilter, setTaskDialogOpen } = useTask();

  // Calculate stats
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const {
    activeTasks,
    completedTasks,
    overdueTasks,
    todayTasks,
    tomorrowTasks,
    inProgressTasks,
    urgentTasks,
    highPriorityTasks,
    completionRate,
  } = React.useMemo(() => {
    const active = tasks.filter((t) => !t.isArchived);
    const completed = active.filter((t) => t.status === 'done');
    const incomplete = active.filter((t) => t.status !== 'done');

    const overdue = incomplete.filter(
      (t) => t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
    );

    const todayT = incomplete.filter(
      (t) => t.dueDate && isToday(new Date(t.dueDate))
    );

    const tomorrowT = incomplete.filter(
      (t) => t.dueDate && isTomorrow(new Date(t.dueDate))
    );

    const inProgress = incomplete.filter((t) => t.status === 'in-progress');
    const urgent = incomplete.filter((t) => t.priority === 'urgent');
    const highPriority = incomplete.filter((t) => t.priority === 'high');

    const rate = active.length > 0
      ? Math.round((completed.length / active.length) * 100)
      : 0;

    return {
      activeTasks: active,
      completedTasks: completed,
      overdueTasks: overdue,
      todayTasks: todayT,
      tomorrowTasks: tomorrowT,
      inProgressTasks: inProgress,
      urgentTasks: urgent,
      highPriorityTasks: highPriority,
      completionRate: rate,
    };
  }, [tasks]);

  const handleViewTasks = React.useCallback((filterType: string) => {
    switch (filterType) {
      case 'today':
        setFilter({
          showCompleted: false,
          showArchived: false,
          dueDate: { from: today, to: tomorrow },
        });
        break;
      case 'overdue':
        setFilter({
          showCompleted: false,
          showArchived: false,
          dueDate: { to: today },
        });
        break;
      case 'in-progress':
        setFilter({
          showCompleted: false,
          showArchived: false,
          status: ['in-progress'],
        });
        break;
      case 'urgent':
        setFilter({
          showCompleted: false,
          showArchived: false,
          priority: ['urgent'],
        });
        break;
    }
  }, [setFilter, today, tomorrow]);

  const productivityTips = [
    'Focus on one task at a time to increase efficiency.',
    'Take regular breaks to maintain high energy levels.',
    'Plan your day the night before for a smoother start.',
    'Organize your workspace to reduce distractions.',
  ];

  const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          Welcome back.
        </Typography>
        <Typography variant="body1" sx={{ color: '#A1A1AA' }}>
          {format(now, 'EEEE, MMMM d, yyyy')} • You have{' '}
          <span style={{ color: '#00F0FF', fontWeight: 700 }}>{todayTasks.length} tasks</span> due today
          {overdueTasks.length > 0 && (
            <>
              {' '}and <span style={{ color: '#ef4444', fontWeight: 700 }}>{overdueTasks.length} overdue</span>
            </>
          )}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Due Today"
            value={todayTasks.length}
            subtitle={`${tomorrowTasks.length} due tomorrow`}
            icon={<ScheduleIcon size={20} />}
            color="#00F0FF"
            onClick={() => handleViewTasks('today')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={overdueTasks.length}
            subtitle="Need attention"
            icon={<WarningIcon size={20} />}
            color="#ef4444"
            onClick={() => handleViewTasks('overdue')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={inProgressTasks.length}
            subtitle={`${urgentTasks.length} urgent`}
            icon={<FlagIcon size={20} />}
            color="#f59e0b"
            onClick={() => handleViewTasks('in-progress')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={completedTasks.length}
            subtitle={`${completionRate}% completion rate`}
            icon={<CheckIcon size={20} />}
            color="#10b981"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Priority Tasks */}
          {(urgentTasks.length > 0 || highPriorityTasks.length > 0) && (
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(10, 10, 10, 0.5)',
                border: '1px solid #222222',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FlagIcon size={20} color="#ef4444" />
                  <Typography variant="h3" sx={{ fontSize: '18px' }}>
                    Priority Tasks
                  </Typography>
                  <Chip 
                    label={urgentTasks.length + highPriorityTasks.length} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444', 
                      fontWeight: 700,
                      borderRadius: 1,
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }} 
                  />
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowIcon size={14} />}
                  onClick={() => handleViewTasks('urgent')}
                  sx={{ color: '#A1A1AA' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[...urgentTasks, ...highPriorityTasks].slice(0, 3).map((task) => (
                  <TaskItem key={task.id} task={task} compact />
                ))}
              </Box>
            </Paper>
          )}

          {/* Today's Tasks */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(10, 10, 10, 0.5)',
              border: '1px solid #222222',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ScheduleIcon size={20} color="#00F0FF" />
                <Typography variant="h3" sx={{ fontSize: '18px' }}>
                  Today&apos;s Tasks
                </Typography>
                <Chip 
                  label={todayTasks.length} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(0, 240, 255, 0.1)', 
                    color: '#00F0FF', 
                    fontWeight: 700,
                    borderRadius: 1,
                    border: '1px solid rgba(0, 240, 255, 0.2)'
                  }} 
                />
              </Box>
              <Button
                size="small"
                endIcon={<ArrowIcon size={14} />}
                onClick={() => handleViewTasks('today')}
                sx={{ color: '#A1A1AA' }}
              >
                View All
              </Button>
            </Box>
            {todayTasks.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {todayTasks.slice(0, 5).map((task) => (
                  <TaskItem key={task.id} task={task} compact />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6, color: '#404040', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckIcon size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>No tasks due today!</Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 3 }}
                  onClick={() => setTaskDialogOpen(true)}
                >
                  Add a Task
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Progress Overview */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(10, 10, 10, 0.5)',
              border: '1px solid #222222',
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '18px', mb: 3 }}>
              Weekly Progress
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#A1A1AA', fontWeight: 600 }}>
                  TASKS COMPLETED
                </Typography>
                <Typography variant="caption" sx={{ color: '#F2F2F2', fontWeight: 700 }}>
                  {completedTasks.length}/{activeTasks.length}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#141414',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor: '#10b981',
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b'
                }}
              >
                <StreakIcon size={20} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#A1A1AA', fontWeight: 600, display: 'block' }}>
                  CURRENT STREAK
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#f59e0b' }}>
                  5 days 🔥
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Productivity Tip */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(0, 240, 255, 0.03)',
              border: '1px solid rgba(0, 240, 255, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <TipIcon size={18} color="#00F0FF" />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#00F0FF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Productivity Tip
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#A1A1AA', lineHeight: 1.6 }}>
              {randomTip}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
