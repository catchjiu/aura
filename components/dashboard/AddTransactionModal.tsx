'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { transactionCategories, type Transaction } from '@/data/dashboard-data';

const categoryVariantMap: Record<string, Transaction['categoryVariant']> = {
  Groceries: 'emerald',
  Entertainment: 'purple',
  Income: 'teal',
  Transport: 'blue',
  Shopping: 'orange',
  Healthcare: 'rose',
  'Food & Dining': 'orange',
  Utilities: 'blue',
  Other: 'blue',
};

const merchantIcons: Record<string, string> = {
  Groceries: '🛒',
  Entertainment: '🎬',
  Income: '💼',
  Transport: '🚗',
  Shopping: '🛍️',
  Healthcare: '💊',
  'Food & Dining': '🍽️',
  Utilities: '⚡',
  Other: '💳',
};

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Transaction) => void;
}

export function AddTransactionModal({
  open,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  const today = new Date().toISOString().split('T')[0];

  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [submitted, setSubmitted] = useState(false);

  const valid = merchant.trim() && date && category && Number(amount) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    const dateObj = new Date(date + 'T00:00:00');
    const formatted = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      date: formatted,
      merchant: merchant.trim(),
      merchantIcon: merchantIcons[category] ?? '💳',
      category,
      categoryVariant: categoryVariantMap[category] ?? 'blue',
      amount: Number(amount),
      type,
    };

    onAdd(txn);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setMerchant('');
      setDate(today);
      setCategory('');
      setAmount('');
      setType('debit');
      onClose();
    }, 1200);
  };

  const handleClose = () => {
    if (submitted) return;
    setMerchant('');
    setDate(today);
    setCategory('');
    setAmount('');
    setType('debit');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Add Transaction
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Transaction added!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Type toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('debit')}
                className={`flex-1 h-9 rounded-xl text-sm font-medium transition-colors border ${
                  type === 'debit'
                    ? 'bg-red-50 dark:bg-red-500/15 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                − Expense
              </button>
              <button
                type="button"
                onClick={() => setType('credit')}
                className={`flex-1 h-9 rounded-xl text-sm font-medium transition-colors border ${
                  type === 'credit'
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                + Income
              </button>
            </div>

            {/* Merchant */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Merchant / Description
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Whole Foods Market"
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-colors"
                required
              />
            </div>

            {/* Category + Date row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-primary-500/30">
                    <SelectValue placeholder="Pick one" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    {transactionCategories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-sm text-slate-700 dark:text-slate-200"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500 pointer-events-none">
                  NT$
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-colors"
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-2 gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!valid}
                className="flex-1 h-9 rounded-xl bg-primary-500 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Transaction
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
