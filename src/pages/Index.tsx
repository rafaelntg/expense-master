import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseFilters } from '@/components/ExpenseFilters';
import { ExpenseSummary } from '@/components/ExpenseSummary';
import { useExpenses } from '@/hooks/useExpenses';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    expenses,
    selectedCategory,
    setSelectedCategory,
    selectedMonth,
    setSelectedMonth,
    addExpense,
    deleteExpense,
  } = useExpenses();

  const handleAddExpense = (expense: Parameters<typeof addExpense>[0]) => {
    addExpense(expense);
    toast({
      title: 'Despesa adicionada!',
      description: `${expense.description} - R$ ${expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast({
      title: 'Despesa removida',
      description: 'A despesa foi excluída com sucesso.',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Controle de Despesas</h1>
              <p className="text-sm text-muted-foreground">Organize suas finanças</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Add Expense Form */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Nova Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm onAddExpense={handleAddExpense} />
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <ExpenseSummary expenses={expenses} selectedCategory={selectedCategory} />

          {/* Filters and List */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-4">
              <ExpenseFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </CardHeader>
            <CardContent>
              <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Feito com 💜 para organizar suas finanças
        </div>
      </footer>
    </div>
  );
};

export default Index;
