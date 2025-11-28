import { TrendingDown, Receipt, PieChart } from 'lucide-react';
import { Category, categoryLabels, categoryIcons, Expense } from '@/types/expense';
import { cn } from '@/lib/utils';

interface ExpenseSummaryProps {
  expenses: Expense[];
  selectedCategory: Category | 'all';
}

const categoryColorClasses: Record<Category, string> = {
  food: 'bg-category-food',
  transport: 'bg-category-transport',
  entertainment: 'bg-category-entertainment',
  health: 'bg-category-health',
  education: 'bg-category-education',
  bills: 'bg-category-bills',
  shopping: 'bg-category-shopping',
  other: 'bg-category-other',
};

export function ExpenseSummary({ expenses, selectedCategory }: ExpenseSummaryProps) {
  const totalValue = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const expenseCount = expenses.length;

  // Calculate category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.value;
    return acc;
  }, {} as Record<Category, number>);

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Card */}
      <div className="p-6 rounded-xl bg-card border shadow-card animate-scale-in">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg gradient-primary">
            <TrendingDown className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de Despesas</p>
            <p className="text-2xl font-bold text-foreground">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Count Card */}
      <div className="p-6 rounded-xl bg-card border shadow-card animate-scale-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-secondary">
            <Receipt className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {selectedCategory === 'all' ? 'Registros no Mês' : `Registros em ${categoryLabels[selectedCategory]}`}
            </p>
            <p className="text-2xl font-bold text-foreground">{expenseCount}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="p-6 rounded-xl bg-card border shadow-card sm:col-span-2 lg:col-span-1 animate-scale-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Por Categoria</p>
        </div>
        
        {sortedCategories.length > 0 ? (
          <div className="space-y-2">
            {sortedCategories.map(([cat, value]) => {
              const category = cat as Category;
              const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
              
              return (
                <div key={category} className="flex items-center gap-2">
                  <span className="text-sm">{categoryIcons[category]}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', categoryColorClasses[category])}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sem dados</p>
        )}
      </div>
    </div>
  );
}
