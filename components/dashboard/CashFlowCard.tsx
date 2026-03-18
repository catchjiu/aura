'use client';

import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUpIcon, TrendingDownIcon, ArrowRightIcon } from 'lucide-react';
import { useThemeSwitch } from '@/components/shared/useThemeSwitch';
import type { CashFlowDataPoint, CashFlowSummary } from '@/data/dashboard-data';
import { formatCompact, formatCurrency } from '@/lib/currency';

interface MetricPillProps {
  label: string;
  value: number;
  trend: number;
}

function MetricPill({ label, value, trend }: MetricPillProps) {
  const isPositive = trend >= 0;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {formatCompact(value)}
      </p>
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
          isPositive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-500 dark:text-red-400'
        }`}
      >
        {isPositive ? (
          <TrendingUpIcon className="w-3 h-3" />
        ) : (
          <TrendingDownIcon className="w-3 h-3" />
        )}
        {isPositive ? '+' : ''}
        {trend.toFixed(1)}% vs last month
      </span>
    </div>
  );
}

interface CashFlowCardProps {
  data: CashFlowDataPoint[];
  summary: CashFlowSummary;
  onViewDetails?: () => void;
}

export function CashFlowCard({ data, summary, onViewDetails }: CashFlowCardProps) {
  const { currentTheme } = useThemeSwitch();
  const isDark = currentTheme === 'dark';

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const axisColor = isDark ? '#64748b' : '#94a3b8';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText = isDark ? '#f1f5f9' : '#334155';

  // Primary (teal/green) for income bars, secondary (blue) for spending area
  const incomeColor = isDark ? '#10B981' : '#00B884';
  const spendingColor = isDark ? '#60A5FA' : '#3B82F6';

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Cash Flow
        </h2>
        <button
          onClick={onViewDetails}
          className="inline-flex items-center gap-1 text-xs font-medium text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors"
        >
          View Details
          <ArrowRightIcon className="w-3 h-3" />
        </button>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricPill
          label="Monthly Income"
          value={summary.totalIncome}
          trend={summary.incomeTrend}
        />
        <MetricPill
          label="Monthly Spending"
          value={summary.totalSpending}
          trend={summary.spendingTrend}
        />
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `NT$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                color: tooltipText,
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'income' ? 'Income' : 'Spending',
              ]}
            />
            <Bar
              dataKey="income"
              name="income"
              fill={incomeColor}
              radius={[4, 4, 0, 0]}
              opacity={0.9}
              barSize={18}
            />
            <Area
              dataKey="spending"
              name="spending"
              type="monotone"
              fill={spendingColor}
              stroke={spendingColor}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) =>
                value === 'income' ? 'Income' : 'Spending'
              }
              wrapperStyle={{ fontSize: '11px', color: axisColor }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
