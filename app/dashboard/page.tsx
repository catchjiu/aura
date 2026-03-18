'use client';

import { useState } from 'react';
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

import {
  netWorthData,
  cashFlowData,
  cashFlowSummary,
  budgetCategories,
  allTransactions,
  savingsGoals,
  smartInsights,
  notifications as initialNotifications,
  linkedAccounts,
  type Transaction,
  type AppNotification,
} from '@/data/dashboard-data';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] =
    useState<Transaction[]>(allTransactions);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(initialNotifications);

  const handleAddTransaction = (txn: Transaction) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const navigate = (view: DashboardView) => {
    setActiveView(view);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recentTxns = transactions.slice(0, 6);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={navigate}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top header */}
        <DashboardHeader
          onMenuOpen={() => setSidebarOpen(true)}
          onAddTransaction={() => setShowAddModal(true)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onNavigateSettings={() => navigate('settings')}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto p-5 sm:p-6">
            {activeView === 'dashboard' && (
              <>
                {/* Greeting */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    Good morning, Alex 👋
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Here&apos;s your financial overview for January 2025.
                  </p>
                </div>

                {/* Bento grid */}
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
                    <BudgetOverviewCard categories={budgetCategories} />
                  </div>

                  <div className="lg:col-span-1 xl:col-span-2">
                    <RecentTransactionsCard
                      transactions={recentTxns}
                      onViewAll={() => navigate('transactions')}
                    />
                  </div>

                  <div className="lg:col-span-1 xl:col-span-2">
                    <SavingsGoalsCard goals={savingsGoals} />
                  </div>

                  <div className="lg:col-span-1 xl:col-span-1">
                    <SmartInsightsCard insights={smartInsights} />
                  </div>
                </div>
              </>
            )}

            {activeView === 'transactions' && (
              <TransactionsView
                transactions={transactions}
                onAddTransaction={() => setShowAddModal(true)}
              />
            )}

            {activeView === 'cashflow' && <CashFlowView />}

            {activeView === 'savings' && <SavingsView goals={savingsGoals} />}

            {activeView === 'reports' && <ReportsView />}

            {activeView === 'accounts' && (
              <AccountsView accounts={linkedAccounts} />
            )}

            {activeView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}
