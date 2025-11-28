import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/expense';
import { exportExpensesToCSV, downloadCSV, parseCSV } from '@/lib/csvUtils';
import { toast } from '@/hooks/use-toast';

interface ImportExportButtonsProps {
  expenses: Expense[];
  onImport: (expenses: Omit<Expense, 'id' | 'createdAt'>[]) => void;
}

export function ImportExportButtons({ expenses, onImport }: ImportExportButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (expenses.length === 0) {
      toast({
        title: 'Nenhuma despesa',
        description: 'Não há despesas para exportar.',
        variant: 'destructive',
      });
      return;
    }

    const csv = exportExpensesToCSV(expenses);
    const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    downloadCSV(csv, `despesas-${date}.csv`);
    
    toast({
      title: 'Exportado com sucesso!',
      description: `${expenses.length} despesas exportadas.`,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = parseCSV(content);
      
      if (parsed.length === 0) {
        toast({
          title: 'Erro ao importar',
          description: 'Nenhuma despesa válida encontrada no arquivo.',
          variant: 'destructive',
        });
        return;
      }

      onImport(parsed);
      toast({
        title: 'Importado com sucesso!',
        description: `${parsed.length} despesas importadas.`,
      });
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-1" />
        Exportar CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleImportClick}>
        <Upload className="h-4 w-4 mr-1" />
        Importar CSV
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
