'use client';

import { useState } from 'react';
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  SaveIcon,
} from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface SectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <Icon className="w-4 h-4 text-slate-400" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      </div>
      <div className="p-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

export function SettingsView() {
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex@example.com');
  const [currency, setCurrency] = useState('USD');

  const [notifBudget, setNotifBudget] = useState(true);
  const [notifGoals, setNotifGoals] = useState(true);
  const [notifLarge, setNotifLarge] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);

  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const inputClass =
    'w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-colors';

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile */}
      <Section icon={UserIcon} title="Profile">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Profile Photo
            </p>
            <button className="text-xs text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 transition-colors mt-0.5">
              Change photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Default Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
            >
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="JPY">JPY — Japanese Yen</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 h-9 px-5 bg-primary-500 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors">
            <SaveIcon className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={BellIcon} title="Notifications">
        <Toggle
          checked={notifBudget}
          onChange={setNotifBudget}
          label="Budget Alerts"
          description="Notify when a category is near or over budget"
        />
        <Toggle
          checked={notifGoals}
          onChange={setNotifGoals}
          label="Goal Milestones"
          description="Celebrate progress on your savings goals"
        />
        <Toggle
          checked={notifLarge}
          onChange={setNotifLarge}
          label="Large Transactions"
          description="Alert for transactions over $100"
        />
        <Toggle
          checked={notifEmail}
          onChange={setNotifEmail}
          label="Weekly Email Summary"
          description="Receive a weekly digest by email"
        />
      </Section>

      {/* Appearance */}
      <Section icon={PaletteIcon} title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Dark Mode
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Toggle between light and dark theme
            </p>
          </div>
          <ThemeSwitch />
        </div>
      </Section>

      {/* Security */}
      <Section icon={ShieldIcon} title="Security">
        <Toggle
          checked={twoFA}
          onChange={setTwoFA}
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        />
        <Toggle
          checked={biometric}
          onChange={setBiometric}
          label="Biometric Login"
          description="Use Face ID or fingerprint to sign in"
        />
        <div className="pt-1">
          <button className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
            Change Password
          </button>
        </div>
      </Section>
    </div>
  );
}
