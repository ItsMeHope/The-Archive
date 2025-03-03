// server/api/categories.ts
import { defineEventHandler } from 'h3';

interface Category {
  _id: string;
  name: string;
}

interface CategoriesResponse {
  categories: Category[];
}

export default defineEventHandler(async () => {
  try {
    const response = await $fetch<CategoriesResponse>('http://localhost:3001/categories', {
      method: 'GET'
    });

    return response;
  } catch (error) {
    const fetchError = error as { data?: { error: string } };
    throw new Error(fetchError.data?.error || 'Erreur lors de la récupération des catégories');
  }
});