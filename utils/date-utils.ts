export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getCurrentMonth = (): string => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getMonthStartEnd = (date: Date = new Date()): { start: Date; end: Date } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  
  return { start, end };
};

export const groupExpensesByDate = (expenses: any[]) => {
  return expenses.reduce((groups, expense) => {
    const date = new Date(expense.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});
};

export const groupExpensesByCategory = (expenses: any[]) => {
  return expenses.reduce((groups, expense) => {
    const { category } = expense;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(expense);
    return groups;
  }, {});
};