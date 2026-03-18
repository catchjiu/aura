import { CalendarIcon } from 'lucide-react';
import type { SavingsGoal, GoalColor } from '@/data/dashboard-data';

const goalColorMap: Record<
  GoalColor,
  { stroke: string; trackStroke: string; text: string; bar: string }
> = {
  emerald: {
    stroke: '#10B981',
    trackStroke: '#d1fae5',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500 dark:bg-emerald-400',
  },
  blue: {
    stroke: '#3B82F6',
    trackStroke: '#dbeafe',
    text: 'text-secondary-600 dark:text-secondary-400',
    bar: 'bg-secondary-500 dark:bg-secondary-400',
  },
  violet: {
    stroke: '#8B5CF6',
    trackStroke: '#ede9fe',
    text: 'text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-500 dark:bg-violet-400',
  },
  amber: {
    stroke: '#F59E0B',
    trackStroke: '#fef3c7',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500 dark:bg-amber-400',
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
  size = 44,
  strokeWidth = 4,
}: CircularProgressProps) {
  const { stroke, trackStroke } = goalColorMap[color];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackStroke}
        strokeWidth={strokeWidth}
        className="dark:opacity-20"
      />
      {/* Progress */}
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

interface GoalItemProps {
  goal: SavingsGoal;
}

function GoalItem({ goal }: GoalItemProps) {
  const { title, current, target, deadline, color } = goal;
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const colors = goalColorMap[color];

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <CircularProgress percentage={percentage} color={color} />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200 rotate-90">
            {percentage}%
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {title}
            </p>
            <p className={`text-xs font-semibold shrink-0 ${colors.text}`}>
              ${current.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <CalendarIcon className="w-3 h-3" />
              {deadline}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              of ${target.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      {/* Linear progress bar */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colors.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </li>
  );
}

interface SavingsGoalsCardProps {
  goals: SavingsGoal[];
}

export function SavingsGoalsCard({ goals }: SavingsGoalsCardProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Savings Goals
        </h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400">
          {goals.length} Active
        </span>
      </div>

      <ul className="space-y-5">
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} />
        ))}
      </ul>
    </div>
  );
}
