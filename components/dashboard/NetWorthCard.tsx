import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import type { NetWorthData } from '@/data/dashboard-data';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(value));
}

interface TrendBadgeProps {
  value: number;
}

function TrendBadge({ value }: TrendBadgeProps) {
  const isPositive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        isPositive
          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
          : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
      }`}
    >
      {isPositive ? (
        <TrendingUpIcon className="w-3 h-3" />
      ) : (
        <TrendingDownIcon className="w-3 h-3" />
      )}
      {isPositive ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  );
}

interface NetWorthCardProps {
  data: NetWorthData;
}

export function NetWorthCard({ data }: NetWorthCardProps) {
  const totalAssets = data.assets.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = data.liabilities.reduce(
    (sum, l) => sum + l.amount,
    0,
  );

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-slate-900 dark:to-slate-800 border border-sky-200/60 dark:border-slate-700 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Total Net Worth
          </p>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {formatCurrency(data.total)}
          </p>
        </div>
        <TrendBadge value={data.trend} />
      </div>

      {/* Divider */}
      <div className="h-px bg-sky-200/70 dark:bg-slate-700" />

      {/* Assets */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Assets
        </p>
        <div className="space-y-2">
          {data.assets.map((asset) => (
            <div key={asset.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {asset.label}
              </span>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                +{formatCurrency(asset.amount)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1 border-t border-sky-200/70 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Assets
            </span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              +{formatCurrency(totalAssets)}
            </span>
          </div>
        </div>
      </div>

      {/* Liabilities */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Liabilities
        </p>
        <div className="space-y-2">
          {data.liabilities.map((liability) => (
            <div key={liability.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {liability.label}
              </span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(liability.amount)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1 border-t border-sky-200/70 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Liabilities
            </span>
            <span className="text-sm font-bold text-red-600 dark:text-red-400">
              -{formatCurrency(Math.abs(totalLiabilities))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
