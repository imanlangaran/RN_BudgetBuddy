export interface Transaction {
  id: number;
  category_id: number;
  amount: number;
  data: number;
  description: string;
  type: 'Expense' | 'Income';
}

export interface Category {
  id: number;
  name: string;
  type: 'Expense' | 'Income';
}