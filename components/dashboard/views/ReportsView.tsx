import {
  DownloadIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  FileTextIcon,
} from 'lucide-react';

const monthlySummary = [
  { month: 'January', income: 7600, expenses: 5400, savings: 2200, trend: 4.1 },
  { month: 'December', income: 8200, expenses: 6100, savings: 2100, trend: -2.3 },
  { month: 'November', income: 7400, expenses: 5600, savings: 1800, trend: 8.7 },
];

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  positive?: boolean;
}

function StatCard({ label, value, sub, positive }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
        {value}
      </p>
      <p
        className={`text-xs mt-1 font-medium ${
          positive === undefined
            ? 'text-slate-400 dark:text-slate-500'
            : positive
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-500 dark:text-red-400'
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

export function ReportsView() {
  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Year-to-date financial summary
          </p>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
          <DownloadIcon className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* YTD stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="YTD Income"
          value="$43.3k"
          sub="+11% vs last year"
          positive
        />
        <StatCard
          label="YTD Expenses"
          value="$31.2k"
          sub="+6% vs last year"
          positive={false}
        />
        <StatCard
          label="YTD Savings"
          value="$12.1k"
          sub="27.9% savings rate"
        />
        <StatCard
          label="Net Worth Growth"
          value="+$4.4k"
          sub="+3.2% since Jan 1"
          positive
        />
      </div>

      {/* Monthly summary table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Monthly Summaries
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
                  Expenses
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Savings
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  vs Prior
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((row) => (
                <tr
                  key={row.month}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {row.month}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${row.income.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-slate-600 dark:text-slate-300 tabular-nums">
                    ${row.expenses.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm text-right font-medium text-secondary-600 dark:text-secondary-400 tabular-nums">
                    ${row.savings.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        row.trend >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {row.trend >= 0 ? (
                        <TrendingUpIcon className="w-3 h-3" />
                      ) : (
                        <TrendingDownIcon className="w-3 h-3" />
                      )}
                      {row.trend >= 0 ? '+' : ''}
                      {row.trend}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export options */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <FileTextIcon className="w-4 h-4 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Download Reports
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['January 2025', 'December 2024', 'November 2024'].map((month) => (
            <button
              key={month}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span className="text-sm font-medium">{month}</span>
              <DownloadIcon className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
