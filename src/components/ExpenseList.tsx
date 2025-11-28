import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Expense, categoryLabels, categoryIcons, Category } from '@/types/expense';
import { cn } from '@/lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categoryColorClasses: Record<Category, string> = {
  food: 'bg-category-food/10 text-category-food border-category-food/20',
  transport: 'bg-category-transport/10 text-category-transport border-category-transport/20',
  entertainment: 'bg-category-entertainment/10 text-category-entertainment border-category-entertainment/20',
  health: 'bg-category-health/10 text-category-health border-category-health/20',
  education: 'bg-category-education/10 text-category-education border-category-education/20',
  bills: 'bg-category-bills/10 text-category-bills border-category-bills/20',
  shopping: 'bg-category-shopping/10 text-category-shopping border-category-shopping/20',
  other: 'bg-category-other/10 text-category-other border-category-other/20',
};

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-foreground">Nenhuma despesa encontrada</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione sua primeira despesa ou ajuste os filtros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => (
        <div
          key={expense.id}
          className="group flex items-center justify-between p-4 rounded-lg bg-card border shadow-card hover:shadow-card-hover transition-all duration-200 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full text-lg shrink-0',
                categoryColorClasses[expense.category]
              )}
            >
              {categoryIcons[expense.category]}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{expense.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full border',
                    categoryColorClasses[expense.category]
                  )}
                >
                  {categoryLabels[expense.category]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground whitespace-nowrap">
              R$ {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDeleteExpense(expense.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
