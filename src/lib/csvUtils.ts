import { Expense, Category, categoryLabels } from '@/types/expense';

const categoryKeys = Object.keys(categoryLabels) as Category[];

export function exportExpensesToCSV(expenses: Expense[]): string {
  const header = 'Descrição,Valor,Categoria,Data';
  const rows = expenses.map((expense) => {
    const description = `"${expense.description.replace(/"/g, '""')}"`;
    const value = expense.value.toFixed(2).replace('.', ',');
    const category = categoryLabels[expense.category];
    const date = new Date(expense.date).toLocaleDateString('pt-BR');
    return `${description},${value},${category},${date}`;
  });
  return [header, ...rows].join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSV(content: string): Omit<Expense, 'id' | 'createdAt'>[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const labelToCategory: Record<string, Category> = {};
  categoryKeys.forEach((key) => {
    labelToCategory[categoryLabels[key].toLowerCase()] = key;
  });

  const expenses: Omit<Expense, 'id' | 'createdAt'>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 4) continue;

    const [description, valueStr, categoryStr, dateStr] = values;
    
    const value = parseFloat(valueStr.replace(',', '.').replace(/[^\d.-]/g, ''));
    if (isNaN(value)) continue;

    const category = labelToCategory[categoryStr.toLowerCase().trim()] || 'other';
    
    const dateParts = dateStr.split('/');
    let date: Date;
    if (dateParts.length === 3) {
      date = new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[0])
      );
    } else {
      date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) date = new Date();

    expenses.push({
      description: description.trim(),
      value,
      category,
      date,
    });
  }

  return expenses;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
