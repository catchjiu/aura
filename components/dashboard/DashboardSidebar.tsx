'use client';

import {
  LayoutDashboardIcon,
  CreditCardIcon,
  PiggyBankIcon,
  BarChart2Icon,
  FileTextIcon,
  LinkIcon,
  SettingsIcon,
  XIcon,
} from 'lucide-react';

export type DashboardView =
  | 'dashboard'
  | 'transactions'
  | 'cashflow'
  | 'savings'
  | 'reports'
  | 'accounts'
  | 'settings';

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-colors ${
        active
          ? 'bg-primary-100 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 ${
          active
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-400 dark:text-slate-500'
        }`}
      />
      <span>{label}</span>
    </button>
  );
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: DashboardView;
  onNavigate: (view: DashboardView) => void;
}

export function DashboardSidebar({
  isOpen,
  onClose,
  activeView,
  onNavigate,
}: DashboardSidebarProps) {
  const navigate = (view: DashboardView) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-60 flex flex-col
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Aura
            </span>
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Close sidebar"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-2 pb-1">
            Main
          </p>
          <NavItem
            icon={LayoutDashboardIcon}
            label="Dashboard"
            active={activeView === 'dashboard'}
            onClick={() => navigate('dashboard')}
          />
          <NavItem
            icon={CreditCardIcon}
            label="Transactions"
            active={activeView === 'transactions'}
            onClick={() => navigate('transactions')}
          />
          <NavItem
            icon={BarChart2Icon}
            label="Cash Flow"
            active={activeView === 'cashflow'}
            onClick={() => navigate('cashflow')}
          />
          <NavItem
            icon={PiggyBankIcon}
            label="Savings Goals"
            active={activeView === 'savings'}
            onClick={() => navigate('savings')}
          />
          <NavItem
            icon={FileTextIcon}
            label="Reports"
            active={activeView === 'reports'}
            onClick={() => navigate('reports')}
          />
        </nav>

        {/* Bottom utilities */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <NavItem
            icon={LinkIcon}
            label="Linked Accounts"
            active={activeView === 'accounts'}
            onClick={() => navigate('accounts')}
          />
          <NavItem
            icon={SettingsIcon}
            label="Settings"
            active={activeView === 'settings'}
            onClick={() => navigate('settings')}
          />
        </div>
      </aside>
    </>
  );
}
