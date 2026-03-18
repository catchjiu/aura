'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DashboardSidebar,
  type DashboardView,
} from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal';

// Dashboard overview cards
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { CashFlowCard } from '@/components/dashboard/CashFlowCard';
import { BudgetOverviewCard } from '@/components/dashboard/BudgetOverviewCard';
import { RecentTransactionsCard } from '@/components/dashboard/RecentTransactionsCard';
import { SavingsGoalsCard } from '@/components/dashboard/SavingsGoalsCard';
import { SmartInsightsCard } from '@/components/dashboard/SmartInsightsCard';

// Section views
import { TransactionsView } from '@/components/dashboard/views/TransactionsView';
import { CashFlowView } from '@/components/dashboard/views/CashFlowView';
import { SavingsView } from '@/components/dashboard/views/SavingsView';
import { ReportsView } from '@/components/dashboard/views/ReportsView';
import { AccountsView } from '@/components/dashboard/views/AccountsView';
import { SettingsView } from '@/components/dashboard/views/SettingsView';

// Static data that isn't in the DB (net worth / cash flow aggregates / insights)
import {
  netWorthData,
  cashFlowData,
  cashFlowSummary,
  smartInsights,
} from '@/data/dashboard-data';

import type {
  Transaction,
  SavingsGoal,
  BudgetCategory,
  AppNotification,
  LinkedAccount,
} from '@/data/dashboard-data';

interface DashboardData {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  budgetCategories: BudgetCategory[];
  notifications: AppNotification[];
  linkedAccounts: LinkedAccount[];
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl bg-slate-200 dark:bg-slate-800 h-64 ${
            i % 3 === 1 ? 'xl:col-span-2' : ''
          }`}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all dashboard data from the API ─────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json: DashboardData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Add transaction (persists to DB via API) ──────────────────────────────
  const handleAddTransaction = async (txn: Transaction) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateLabel: txn.date,
          merchant: txn.merchant,
          merchantIcon: txn.merchantIcon,
          category: txn.category,
          categoryVariant: txn.categoryVariant,
          amount: txn.amount,
          type: txn.type,
        }),
      });
      if (!res.ok) throw new Error('Failed to save transaction');
      const saved: Transaction = await res.json();
      setData((prev) =>
        prev ? { ...prev, transactions: [saved, ...prev.transactions] } : prev,
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ── Mark all notifications read ───────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', { method: 'PATCH' });
      setData((prev) =>
        prev
          ? {
              ...prev,
              notifications: prev.notifications.map((n) => ({
                ...n,
                read: true,
              })),
            }
          : prev,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = (view: DashboardView) => {
    setActiveView(view);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recentTxns = data?.transactions.slice(0, 6) ?? [];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={navigate}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardHeader
          onMenuOpen={() => setSidebarOpen(true)}
          onAddTransaction={() => setShowAddModal(true)}
          notifications={data?.notifications ?? []}
          onMarkAllRead={handleMarkAllRead}
          onNavigateSettings={() => navigate('settings')}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto p-5 sm:p-6">

            {/* Global error state */}
            {error && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
                <span>⚠ {error}</span>
                <button
                  onClick={loadData}
                  className="ml-auto text-xs font-medium underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {activeView === 'dashboard' && (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    Good morning, Alex 👋
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Here&apos;s your financial overview for January 2025.
                  </p>
                </div>

                {loading ? (
                  <DashboardSkeleton />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 xl:col-span-1">
                      <NetWorthCard data={netWorthData} />
                    </div>

                    <div className="lg:col-span-1 xl:col-span-2">
                      <CashFlowCard
                        data={cashFlowData}
                        summary={cashFlowSummary}
                        onViewDetails={() => navigate('cashflow')}
                      />
                    </div>

                    <div className="lg:col-span-1 xl:col-span-1">
                      <BudgetOverviewCard
                        categories={data?.budgetCategories ?? []}
                      />
                    </div>

                    <div className="lg:col-span-1 xl:col-span-2">
                      <RecentTransactionsCard
                        transactions={recentTxns}
                        onViewAll={() => navigate('transactions')}
                      />
                    </div>

                    <div className="lg:col-span-1 xl:col-span-2">
                      <SavingsGoalsCard goals={data?.savingsGoals ?? []} />
                    </div>

                    <div className="lg:col-span-1 xl:col-span-1">
                      <SmartInsightsCard insights={smartInsights} />
                    </div>
                  </div>
                )}
              </>
            )}

            {activeView === 'transactions' && (
              <TransactionsView
                transactions={data?.transactions ?? []}
                onAddTransaction={() => setShowAddModal(true)}
              />
            )}

            {activeView === 'cashflow' && <CashFlowView />}

            {activeView === 'savings' && (
              <SavingsView goals={data?.savingsGoals ?? []} />
            )}

            {activeView === 'reports' && <ReportsView />}

            {activeView === 'accounts' && (
              <AccountsView accounts={data?.linkedAccounts ?? []} />
            )}

            {activeView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      <AddTransactionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}
