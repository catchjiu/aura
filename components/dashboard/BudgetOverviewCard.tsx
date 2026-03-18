import type { BudgetCategory, BudgetStatus } from '@/data/dashboard-data';
import { formatCurrency } from '@/lib/currency';

function statusLabel(status: BudgetStatus, spent: number, total: number): string {
  if (status === 'danger') {
    return `${formatCurrency(spent - total)} over`;
  }
  if (status === 'warning') {
    const pct = Math.round((spent / total) * 100);
    return `${pct}% used`;
  }
  return `${formatCurrency(total - spent)} left`;
}

function statusBarClass(status: BudgetStatus): string {
  if (status === 'danger') return 'bg-red-500 dark:bg-red-400';
  if (status === 'warning') return 'bg-amber-400 dark:bg-amber-400';
  return 'bg-primary-500 dark:bg-primary-500';
}

function statusTextClass(status: BudgetStatus): string {
  if (status === 'danger') return 'text-red-600 dark:text-red-400';
  if (status === 'warning') return 'text-amber-600 dark:text-amber-400';
  return 'text-slate-500 dark:text-slate-400';
}

interface BudgetRowProps {
  category: BudgetCategory;
}

function BudgetRow({ category }: BudgetRowProps) {
  const { name, spent, total, status } = category;
  const pct = Math.min((spent / total) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
          {name}
        </span>
        <span className={`text-xs font-medium shrink-0 ${statusTextClass(status)}`}>
          {statusLabel(status, spent, total)}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${statusBarClass(status)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {formatCurrency(spent)} of {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

interface BudgetOverviewCardProps {
  categories: BudgetCategory[];
}

export function BudgetOverviewCard({ categories }: BudgetOverviewCardProps) {
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalBudget = categories.reduce((s, c) => s + c.total, 0);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Budget Overview
        </h2>
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">Monthly</p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <BudgetRow key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
}
