'use client';

import { useState, useMemo } from 'react';
import { SearchIcon, FilterIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { Transaction, TransactionType } from '@/data/dashboard-data';
import { formatCurrency, formatSigned } from '@/lib/currency';

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

type FilterType = 'all' | TransactionType;

const PER_PAGE = 8;

interface TransactionsViewProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

export function TransactionsView({
  transactions,
  onAddTransaction,
}: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return ['all', ...Array.from(cats)];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.merchant.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat =
        filterCategory === 'all' || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, search, filterType, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePagedPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePagedPage - 1) * PER_PAGE,
    safePagedPage * PER_PAGE,
  );

  const totalDebit = filtered
    .filter((t) => t.type === 'debit')
    .reduce((s, t) => s + t.amount, 0);
  const totalCredit = filtered
    .filter((t) => t.type === 'credit')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filtered.length} records found
          </p>
        </div>
        <button
          onClick={onAddTransaction}
          className="flex items-center gap-2 h-9 px-4 bg-primary-500 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Summary strips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Income</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            +{formatCurrency(totalCredit)}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Expenses</p>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-1">
            −{formatCurrency(totalDebit)}
          </p>
        </div>
        <div className="hidden sm:block rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Net</p>
          <p
            className={`text-xl font-bold mt-1 ${
              totalCredit - totalDebit >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatSigned(totalCredit - totalDebit)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search merchant or category…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['all', 'debit', 'credit'] as FilterType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setFilterType(t);
                setPage(1);
              }}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors capitalize ${
                filterType === t
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t === 'all' ? 'All' : t === 'debit' ? 'Expenses' : 'Income'}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-white dark:bg-slate-900">
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                  >
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                paged.map((txn) => {
                  const catStyle = categoryStyles[txn.categoryVariant];
                  const isCredit = txn.type === 'credit';
                  return (
                    <tr
                      key={txn.id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {txn.date}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base leading-none">
                            {txn.merchantIcon}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[140px] sm:max-w-xs">
                            {txn.merchant}
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text}`}
                        >
                          {txn.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            isCredit
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {isCredit ? '+' : '−'}{formatCurrency(txn.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {(safePagedPage - 1) * PER_PAGE + 1}–
              {Math.min(safePagedPage * PER_PAGE, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePagedPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {safePagedPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePagedPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
