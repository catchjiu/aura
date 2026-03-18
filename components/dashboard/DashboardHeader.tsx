'use client';

import { useState } from 'react';
import {
  SearchIcon,
  BellIcon,
  PlusIcon,
  MenuIcon,
  CheckCheckIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  UserIcon,
  LogOutIcon,
  UserCircleIcon,
} from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shared/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu';
import type { AppNotification, NotificationType } from '@/data/dashboard-data';

const notifIcon: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  warning: AlertTriangleIcon,
  success: CheckCircleIcon,
  info: InfoIcon,
};

const notifIconClass: Record<NotificationType, string> = {
  warning: 'text-amber-500 dark:text-amber-400',
  success: 'text-emerald-500 dark:text-emerald-400',
  info: 'text-secondary-500 dark:text-secondary-400',
};

interface DashboardHeaderProps {
  onMenuOpen: () => void;
  onAddTransaction: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNavigateSettings: () => void;
}

export function DashboardHeader({
  onMenuOpen,
  onAddTransaction,
  notifications = [],
  onMarkAllRead,
  onNavigateSettings,
}: DashboardHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-[72px] shrink-0 flex items-center gap-4 px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        aria-label="Open navigation"
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search transactions, accounts…"
          className="w-full h-10 pl-9 pr-4 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary-400 dark:focus:border-primary-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <ThemeSwitch />

        {/* Notification bell */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 p-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 transition-colors"
                >
                  <CheckCheckIcon className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = notifIcon[n.type];
                return (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      !n.read
                        ? 'bg-slate-50 dark:bg-slate-800/60'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${notifIconClass[n.type]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs font-semibold truncate ${
                            n.read
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {n.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>

        {/* Add Transaction CTA */}
        <button
          onClick={onAddTransaction}
          className="hidden sm:flex items-center gap-2 h-9 px-4 bg-primary-500 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          Add Transaction
        </button>

        {/* User Avatar / Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              aria-label="User menu"
            >
              <span className="text-white text-sm font-semibold">A</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <DropdownMenuLabel className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              Signed in as
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                Alex Johnson
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem
              onClick={onNavigateSettings}
              className="gap-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
              <UserCircleIcon className="w-4 h-4" />
              Switch Account
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem className="gap-2 text-sm text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 dark:focus:text-red-400">
              <LogOutIcon className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
