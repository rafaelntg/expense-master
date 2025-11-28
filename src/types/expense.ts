export type Category = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'bills'
  | 'shopping'
  | 'other';

export interface Expense {
  id: string;
  description: string;
  value: number;
  category: Category;
  date: Date;
  createdAt: Date;
}

export const categoryLabels: Record<Category, string> = {
  food: 'Alimentação',
  transport: 'Transporte',
  entertainment: 'Entretenimento',
  health: 'Saúde',
  education: 'Educação',
  bills: 'Contas',
  shopping: 'Compras',
  other: 'Outros',
};

export const categoryIcons: Record<Category, string> = {
  food: '🍔',
  transport: '🚗',
  entertainment: '🎬',
  health: '💊',
  education: '📚',
  bills: '📄',
  shopping: '🛒',
  other: '📦',
};
