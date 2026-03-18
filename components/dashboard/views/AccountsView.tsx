import { PlusIcon, RefreshCwIcon, BuildingIcon } from 'lucide-react';
import type { LinkedAccount } from '@/data/dashboard-data';
import { formatCurrency } from '@/lib/currency';

const colorMap: Record<
  LinkedAccount['color'],
  { from: string; icon: string; badge: string }
> = {
  primary: {
    from: 'from-primary-400 to-primary-600',
    icon: 'text-primary-600 dark:text-primary-400',
    badge: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400',
  },
  secondary: {
    from: 'from-secondary-400 to-secondary-600',
    icon: 'text-secondary-600 dark:text-secondary-400',
    badge: 'bg-secondary-100 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-400',
  },
  emerald: {
    from: 'from-emerald-400 to-emerald-600',
    icon: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  },
  violet: {
    from: 'from-violet-400 to-violet-600',
    icon: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400',
  },
};

const typeLabel: Record<LinkedAccount['type'], string> = {
  checking: 'Checking',
  savings: 'Savings',
  credit: 'Credit Card',
  investment: 'Investment',
};

interface AccountCardProps {
  account: LinkedAccount;
}

function AccountCard({ account }: AccountCardProps) {
  const { name, bank, type, balance, lastFour, color } = account;
  const colors = colorMap[color];
  const isCredit = type === 'credit';

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Card top gradient strip */}
      <div className={`h-2 w-full bg-gradient-to-r ${colors.from}`} />

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.from} flex items-center justify-center`}
            >
              <BuildingIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{bank}</p>
            </div>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${colors.badge}`}
          >
            {typeLabel[type]}
          </span>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {isCredit ? 'Outstanding Balance' : 'Available Balance'}
            </p>
            <p
              className={`text-2xl font-bold mt-0.5 ${
                isCredit
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {isCredit ? '−' : ''}{formatCurrency(Math.abs(balance))}
            </p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            •••• {lastFour}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AccountsViewProps {
  accounts: LinkedAccount[];
}

export function AccountsView({ accounts }: AccountsViewProps) {
  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts
    .filter((a) => a.balance < 0)
    .reduce((s, a) => s + Math.abs(a.balance), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Linked Accounts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {accounts.length} accounts connected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <RefreshCwIcon className="w-4 h-4" />
            Sync
          </button>
          <button className="flex items-center gap-2 h-9 px-4 bg-primary-500 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0">
            <PlusIcon className="w-4 h-4" />
            Connect Account
          </button>
        </div>
      </div>

      {/* Total summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Assets
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalAssets)}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Liabilities
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            −{formatCurrency(totalLiabilities)}
          </p>
        </div>
      </div>

      {/* Accounts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
