// Aura Personal Finance Dashboard — Sample Data

export interface NetWorthAsset {
  label: string;
  amount: number;
}

export interface NetWorthData {
  total: number;
  trend: number;
  assets: NetWorthAsset[];
  liabilities: NetWorthAsset[];
}

export interface CashFlowDataPoint {
  month: string;
  income: number;
  spending: number;
}

export interface CashFlowSummary {
  totalIncome: number;
  totalSpending: number;
  incomeTrend: number;
  spendingTrend: number;
}

export type BudgetStatus = 'ok' | 'warning' | 'danger';

export interface BudgetCategory {
  name: string;
  spent: number;
  total: number;
  status: BudgetStatus;
}

export type TransactionType = 'debit' | 'credit';

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  merchantIcon: string;
  category: string;
  categoryVariant: 'emerald' | 'purple' | 'teal' | 'blue' | 'orange' | 'rose';
  amount: number;
  type: TransactionType;
}

export type GoalColor = 'emerald' | 'blue' | 'violet' | 'amber';

export interface SavingsGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  deadline: string;
  color: GoalColor;
}

export type InsightType = 'info' | 'warning' | 'success';

export interface Insight {
  id: string;
  iconName: string;
  prefix: string;
  highlight: string;
  suffix: string;
  type: InsightType;
}

export type NotificationType = 'info' | 'warning' | 'success';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

export interface LinkedAccount {
  id: string;
  name: string;
  bank: string;
  type: AccountType;
  balance: number;
  lastFour: string;
  color: 'primary' | 'secondary' | 'emerald' | 'violet';
}

// ─── Net Worth ────────────────────────────────────────────────────────────────

export const netWorthData: NetWorthData = {
  total: 142580.45,
  trend: 3.2,
  assets: [
    { label: 'Checking & Savings', amount: 28450.0 },
    { label: 'Investments', amount: 98340.5 },
    { label: 'Real Estate', amount: 15789.95 },
  ],
  liabilities: [
    { label: 'Credit Cards', amount: -4280.0 },
    { label: 'Student Loans', amount: -8720.0 },
  ],
};

// ─── Cash Flow ───────────────────────────────────────────────────────────────

export const cashFlowData: CashFlowDataPoint[] = [
  { month: 'Aug', income: 6200, spending: 4100 },
  { month: 'Sep', income: 7100, spending: 5200 },
  { month: 'Oct', income: 6800, spending: 4800 },
  { month: 'Nov', income: 7400, spending: 5600 },
  { month: 'Dec', income: 8200, spending: 6100 },
  { month: 'Jan', income: 7600, spending: 5400 },
];

export const cashFlowSummary: CashFlowSummary = {
  totalIncome: 7600,
  totalSpending: 5400,
  incomeTrend: 8.5,
  spendingTrend: -4.3,
};

// ─── Budget Overview ──────────────────────────────────────────────────────────

export const budgetCategories: BudgetCategory[] = [
  { name: 'Housing', spent: 1800, total: 2000, status: 'ok' },
  { name: 'Food & Dining', spent: 680, total: 700, status: 'warning' },
  { name: 'Transportation', spent: 320, total: 400, status: 'ok' },
  { name: 'Entertainment', spent: 290, total: 250, status: 'danger' },
  { name: 'Healthcare', spent: 120, total: 300, status: 'ok' },
  { name: 'Shopping', spent: 840, total: 600, status: 'danger' },
];

// ─── All Transactions ─────────────────────────────────────────────────────────

export const allTransactions: Transaction[] = [
  {
    id: 'txn-1',
    date: 'Jan 18',
    merchant: 'Whole Foods Market',
    merchantIcon: '🛒',
    category: 'Groceries',
    categoryVariant: 'emerald',
    amount: 84.32,
    type: 'debit',
  },
  {
    id: 'txn-2',
    date: 'Jan 17',
    merchant: 'Netflix',
    merchantIcon: '🎬',
    category: 'Entertainment',
    categoryVariant: 'purple',
    amount: 15.99,
    type: 'debit',
  },
  {
    id: 'txn-3',
    date: 'Jan 17',
    merchant: 'Salary Deposit',
    merchantIcon: '💼',
    category: 'Income',
    categoryVariant: 'teal',
    amount: 4800.0,
    type: 'credit',
  },
  {
    id: 'txn-4',
    date: 'Jan 16',
    merchant: 'Shell Gas Station',
    merchantIcon: '⛽',
    category: 'Transport',
    categoryVariant: 'blue',
    amount: 62.4,
    type: 'debit',
  },
  {
    id: 'txn-5',
    date: 'Jan 15',
    merchant: 'Amazon',
    merchantIcon: '📦',
    category: 'Shopping',
    categoryVariant: 'orange',
    amount: 127.8,
    type: 'debit',
  },
  {
    id: 'txn-6',
    date: 'Jan 14',
    merchant: 'Freelance Payment',
    merchantIcon: '💰',
    category: 'Income',
    categoryVariant: 'teal',
    amount: 850.0,
    type: 'credit',
  },
  {
    id: 'txn-7',
    date: 'Jan 13',
    merchant: 'Spotify',
    merchantIcon: '🎵',
    category: 'Entertainment',
    categoryVariant: 'purple',
    amount: 9.99,
    type: 'debit',
  },
  {
    id: 'txn-8',
    date: 'Jan 12',
    merchant: 'Trader Joe\'s',
    merchantIcon: '🛍️',
    category: 'Groceries',
    categoryVariant: 'emerald',
    amount: 67.45,
    type: 'debit',
  },
  {
    id: 'txn-9',
    date: 'Jan 11',
    merchant: 'Uber',
    merchantIcon: '🚗',
    category: 'Transport',
    categoryVariant: 'blue',
    amount: 24.5,
    type: 'debit',
  },
  {
    id: 'txn-10',
    date: 'Jan 10',
    merchant: 'Target',
    merchantIcon: '🎯',
    category: 'Shopping',
    categoryVariant: 'orange',
    amount: 56.22,
    type: 'debit',
  },
  {
    id: 'txn-11',
    date: 'Jan 9',
    merchant: 'Dr. Smith Dental',
    merchantIcon: '🦷',
    category: 'Healthcare',
    categoryVariant: 'rose',
    amount: 120.0,
    type: 'debit',
  },
  {
    id: 'txn-12',
    date: 'Jan 8',
    merchant: 'Chipotle',
    merchantIcon: '🌯',
    category: 'Food & Dining',
    categoryVariant: 'orange',
    amount: 14.75,
    type: 'debit',
  },
  {
    id: 'txn-13',
    date: 'Jan 7',
    merchant: 'Dividend Income',
    merchantIcon: '📈',
    category: 'Income',
    categoryVariant: 'teal',
    amount: 320.0,
    type: 'credit',
  },
  {
    id: 'txn-14',
    date: 'Jan 6',
    merchant: 'Planet Fitness',
    merchantIcon: '🏋️',
    category: 'Healthcare',
    categoryVariant: 'rose',
    amount: 24.99,
    type: 'debit',
  },
  {
    id: 'txn-15',
    date: 'Jan 5',
    merchant: 'Apple Store',
    merchantIcon: '🍎',
    category: 'Shopping',
    categoryVariant: 'orange',
    amount: 79.0,
    type: 'debit',
  },
];

export const recentTransactions: Transaction[] = allTransactions.slice(0, 6);

// ─── Savings Goals ────────────────────────────────────────────────────────────

export const savingsGoals: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    current: 8500,
    target: 12000,
    deadline: 'Jun 2025',
    color: 'emerald',
  },
  {
    id: 'goal-2',
    title: 'Vacation to Japan',
    current: 3200,
    target: 5000,
    deadline: 'Aug 2025',
    color: 'blue',
  },
  {
    id: 'goal-3',
    title: 'New MacBook Pro',
    current: 1800,
    target: 2500,
    deadline: 'Mar 2025',
    color: 'violet',
  },
];

// ─── Smart Insights ───────────────────────────────────────────────────────────

export const smartInsights: Insight[] = [
  {
    id: 'ins-1',
    iconName: 'TrendingDown',
    prefix: 'Your dining spending is up',
    highlight: '23%',
    suffix: 'compared to last month.',
    type: 'warning',
  },
  {
    id: 'ins-2',
    iconName: 'Lightbulb',
    prefix: 'Moving savings to a high-yield account could earn you an extra',
    highlight: '$420/yr',
    suffix: '',
    type: 'success',
  },
  {
    id: 'ins-3',
    iconName: 'AlertTriangle',
    prefix: 'Shopping budget exceeded by',
    highlight: '$240',
    suffix: 'this month.',
    type: 'warning',
  },
  {
    id: 'ins-4',
    iconName: 'BadgeCheck',
    prefix: 'You saved',
    highlight: '12% more',
    suffix: 'than last month. Keep it up!',
    type: 'success',
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Budget Alert',
    message: 'Shopping budget exceeded by $240 this month.',
    time: '2h ago',
    read: false,
    type: 'warning',
  },
  {
    id: 'n-2',
    title: 'Goal Milestone',
    message: "Emergency fund is 70% complete — you're on track!",
    time: '5h ago',
    read: false,
    type: 'success',
  },
  {
    id: 'n-3',
    title: 'Large Transaction',
    message: 'Amazon purchase of $127.80 was recorded.',
    time: '1d ago',
    read: true,
    type: 'info',
  },
  {
    id: 'n-4',
    title: 'Bill Due Soon',
    message: 'Electricity bill of ~$95 is due in 3 days.',
    time: '1d ago',
    read: true,
    type: 'warning',
  },
];

// ─── Linked Accounts ──────────────────────────────────────────────────────────

export const linkedAccounts: LinkedAccount[] = [
  {
    id: 'acc-1',
    name: 'Chase Checking',
    bank: 'Chase Bank',
    type: 'checking',
    balance: 12480.5,
    lastFour: '4291',
    color: 'secondary',
  },
  {
    id: 'acc-2',
    name: 'Chase Savings',
    bank: 'Chase Bank',
    type: 'savings',
    balance: 15969.5,
    lastFour: '8834',
    color: 'primary',
  },
  {
    id: 'acc-3',
    name: 'Fidelity Investments',
    bank: 'Fidelity',
    type: 'investment',
    balance: 98340.5,
    lastFour: '2201',
    color: 'emerald',
  },
  {
    id: 'acc-4',
    name: 'Amex Platinum',
    bank: 'American Express',
    type: 'credit',
    balance: -4280.0,
    lastFour: '7745',
    color: 'violet',
  },
];

export const transactionCategories = [
  'Groceries',
  'Entertainment',
  'Income',
  'Transport',
  'Shopping',
  'Healthcare',
  'Food & Dining',
  'Utilities',
  'Other',
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];
