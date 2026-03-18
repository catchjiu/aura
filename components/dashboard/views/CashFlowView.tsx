'use client';

import { CashFlowCard } from '@/components/dashboard/CashFlowCard';
import { cashFlowData, cashFlowSummary } from '@/data/dashboard-data';
import { formatCompact, formatCurrency } from '@/lib/currency';

const monthlyBreakdown = [
  { month: 'August', income: 6200, spending: 4100, net: 2100 },
  { month: 'September', income: 7100, spending: 5200, net: 1900 },
  { month: 'October', income: 6800, spending: 4800, net: 2000 },
  { month: 'November', income: 7400, spending: 5600, net: 1800 },
  { month: 'December', income: 8200, spending: 6100, net: 2100 },
  { month: 'January', income: 7600, spending: 5400, net: 2200 },
];

const totalIncome = monthlyBreakdown.reduce((s, m) => s + m.income, 0);
const totalSpending = monthlyBreakdown.reduce((s, m) => s + m.spending, 0);
const totalNet = totalIncome - totalSpending;

export function CashFlowView() {
  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Cash Flow
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Income vs. spending over the last 6 months
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Income
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCompact(totalIncome)}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Spending
          </p>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-1">
            {formatCompact(totalSpending)}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Net Saved</p>
          <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mt-1">
            {formatCompact(totalNet)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <CashFlowCard data={cashFlowData} summary={cashFlowSummary} />

      {/* Monthly breakdown table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Monthly Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Spending
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Net
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown.map((row) => (
                <tr
                  key={row.month}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {row.month}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{formatCurrency(row.income)}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-slate-600 dark:text-slate-300 tabular-nums">
                    −{formatCurrency(row.spending)}
                  </td>
                  <td className="px-5 py-3 text-sm text-right font-semibold text-secondary-600 dark:text-secondary-400 tabular-nums">
                    +{formatCurrency(row.net)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <td className="px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Total
                </td>
                <td className="px-5 py-3 text-sm font-bold text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +{formatCurrency(totalIncome)}
                </td>
                <td className="px-5 py-3 text-sm font-bold text-right text-slate-700 dark:text-slate-200 tabular-nums">
                  −{formatCurrency(totalSpending)}
                </td>
                <td className="px-5 py-3 text-sm font-bold text-right text-secondary-600 dark:text-secondary-400 tabular-nums">
                  +{formatCurrency(totalNet)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
