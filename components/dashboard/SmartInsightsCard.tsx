import {
  TrendingDownIcon,
  LightbulbIcon,
  AlertTriangleIcon,
  BadgeCheckIcon,
  InfoIcon,
} from 'lucide-react';
import type { Insight, InsightType } from '@/data/dashboard-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingDown: TrendingDownIcon,
  Lightbulb: LightbulbIcon,
  AlertTriangle: AlertTriangleIcon,
  BadgeCheck: BadgeCheckIcon,
  Info: InfoIcon,
};

const typeStyles: Record<
  InsightType,
  { iconBg: string; iconColor: string; highlight: string }
> = {
  success: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    highlight: 'text-emerald-700 dark:text-emerald-400',
  },
  warning: {
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    highlight: 'text-amber-700 dark:text-amber-400',
  },
  info: {
    iconBg: 'bg-secondary-100 dark:bg-secondary-500/20',
    iconColor: 'text-secondary-600 dark:text-secondary-400',
    highlight: 'text-secondary-700 dark:text-secondary-400',
  },
};

interface InsightItemProps {
  insight: Insight;
}

function InsightItem({ insight }: InsightItemProps) {
  const { iconName, prefix, highlight, suffix, type } = insight;
  const Icon = iconMap[iconName] ?? InfoIcon;
  const styles = typeStyles[type];

  return (
    <li className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${styles.iconBg}`}
      >
        <Icon className={`w-4 h-4 ${styles.iconColor}`} />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {prefix}{' '}
        <strong className={`font-semibold ${styles.highlight}`}>
          {highlight}
        </strong>{' '}
        {suffix}
      </p>
    </li>
  );
}

interface SmartInsightsCardProps {
  insights: Insight[];
}

export function SmartInsightsCard({ insights }: SmartInsightsCardProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Smart Insights
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Powered by AI
        </span>
      </div>

      <ul className="space-y-4">
        {insights.map((insight) => (
          <InsightItem key={insight.id} insight={insight} />
        ))}
      </ul>
    </div>
  );
}
