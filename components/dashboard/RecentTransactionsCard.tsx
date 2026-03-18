import { ArrowRightIcon } from 'lucide-react';
import type { Transaction } from '@/data/dashboard-data';

const categoryStyles: Record<
  Transaction['categoryVariant'],
  { bg: string; text: string }
> = {
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-500/20',
    text: 'text-purple-700 dark:text-purple-400',
  },
  teal: {
    bg: 'bg-primary-100 dark:bg-primary-500/20',
    text: 'text-primary-700 dark:text-primary-400',
  },
  blue: {
    bg: 'bg-secondary-100 dark:bg-secondary-500/20',
    text: 'text-secondary-700 dark:text-secondary-400',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-500/20',
    text: 'text-orange-700 dark:text-orange-400',
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
  },
};

interface TransactionRowProps {
  transaction: Transaction;
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const { date, merchant, merchantIcon, category, categoryVariant, amount, type } =
    transaction;
  const catStyle = categoryStyles[categoryVariant];
  const isCredit = type === 'credit';

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* Date */}
      <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
        {date}
      </td>

      {/* Merchant */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base leading-none">{merchantIcon}</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px] sm:max-w-none">
            {merchant}
          </span>
        </div>
      </td>

      {/* Category */}
      <td className="hidden sm:table-cell px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text}`}
        >
          {category}
        </span>
      </td>

      {/* Amount */}
      <td className="px-4 py-3 text-right">
        <span
          className={`text-sm font-semibold tabular-nums ${
            isCredit
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          {isCredit ? '+' : '-'}$
          {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </td>
    </tr>
  );
}

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export function RecentTransactionsCard({
  transactions,
  onViewAll,
}: RecentTransactionsCardProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Transactions
        </h2>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-medium text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors"
        >
          View All
          <ArrowRightIcon className="w-3 h-3" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Merchant
              </th>
              <th className="hidden sm:table-cell px-4 py-2.5 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <TransactionRow key={txn.id} transaction={txn} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
