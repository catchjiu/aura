import { PlusIcon, CalendarIcon, TargetIcon } from 'lucide-react';
import type { SavingsGoal, GoalColor } from '@/data/dashboard-data';

const goalColorMap: Record<
  GoalColor,
  { stroke: string; trackStroke: string; text: string; bar: string; badge: string }
> = {
  emerald: {
    stroke: '#10B981',
    trackStroke: '#d1fae5',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  },
  blue: {
    stroke: '#3B82F6',
    trackStroke: '#dbeafe',
    text: 'text-secondary-600 dark:text-secondary-400',
    bar: 'bg-secondary-500 dark:bg-secondary-400',
    badge: 'bg-secondary-100 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-400',
  },
  violet: {
    stroke: '#8B5CF6',
    trackStroke: '#ede9fe',
    text: 'text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-500 dark:bg-violet-400',
    badge: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400',
  },
  amber: {
    stroke: '#F59E0B',
    trackStroke: '#fef3c7',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500 dark:bg-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  },
};

interface CircularProgressProps {
  percentage: number;
  color: GoalColor;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({
  percentage,
  color,
  size = 60,
  strokeWidth = 5,
}: CircularProgressProps) {
  const { stroke, trackStroke } = goalColorMap[color];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackStroke}
        strokeWidth={strokeWidth}
        className="dark:opacity-20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

interface GoalCardProps {
  goal: SavingsGoal;
}

function GoalCard({ goal }: GoalCardProps) {
  const { title, current, target, deadline, color } = goal;
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const remaining = target - current;
  const colors = goalColorMap[color];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <CircularProgress percentage={percentage} color={color} size={60} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 rotate-90">
            {percentage}%
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
              {percentage}%
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <CalendarIcon className="w-3 h-3" />
            Target: {deadline}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colors.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Saved</p>
          <p className={`text-sm font-semibold mt-0.5 ${colors.text}`}>
            ${current.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Remaining</p>
          <p className="text-sm font-semibold mt-0.5 text-slate-600 dark:text-slate-300">
            ${remaining.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Target</p>
          <p className="text-sm font-semibold mt-0.5 text-slate-700 dark:text-slate-200">
            ${target.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SavingsViewProps {
  goals: SavingsGoal[];
}

export function SavingsView({ goals }: SavingsViewProps) {
  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overallPct = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Savings Goals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {goals.length} active goals · {overallPct}% overall progress
          </p>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 bg-primary-500 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0">
          <PlusIcon className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Overall progress */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TargetIcon className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Overall Progress
            </span>
          </div>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            ${totalSaved.toLocaleString()} / ${totalTarget.toLocaleString()}
          </span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 dark:bg-primary-400 rounded-full transition-all"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          ${(totalTarget - totalSaved).toLocaleString()} remaining across all goals
        </p>
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
