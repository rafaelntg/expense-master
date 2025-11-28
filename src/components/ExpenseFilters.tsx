import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category, categoryLabels, categoryIcons } from '@/types/expense';

interface ExpenseFiltersProps {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function ExpenseFilters({
  selectedCategory,
  onCategoryChange,
  selectedMonth,
  onMonthChange,
}: ExpenseFiltersProps) {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={selectedCategory}
          onValueChange={(value) => onCategoryChange(value as Category | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <span>📊</span>
                <span>Todas categorias</span>
              </span>
            </SelectItem>
            {(Object.keys(categoryLabels) as Category[]).map((cat) => (
              <SelectItem key={cat} value={cat}>
                <span className="flex items-center gap-2">
                  <span>{categoryIcons[cat]}</span>
                  <span>{categoryLabels[cat]}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[120px] text-center capitalize">
          {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
