
import { categoryColors } from '@/constants/Colors';
import { Category } from '@/types';

export const categories: Category[] = [
  { id: 'food', name: 'Food & Drinks', color: categoryColors.food },
  { id: 'transport', name: 'Transport', color: categoryColors.transport },
  { id: 'housing', name: 'Housing', color: categoryColors.housing },
  { id: 'entertainment', name: 'Entertainment', color: categoryColors.entertainment },
  { id: 'shopping', name: 'Shopping', color: categoryColors.shopping },
  { id: 'health', name: 'Health', color: categoryColors.health },
  { id: 'education', name: 'Education', color: categoryColors.education },
  { id: 'utilities', name: 'Utilities', color: categoryColors.utilities },
  { id: 'other', name: 'Other', color: categoryColors.other },
];