// stores/categories.js
import { defineStore } from 'pinia';

interface Category {
  _id: string;
  name: string;
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const data = await $fetch<{ categories: Category[] }>('/api/categories');
        this.categories = data.categories || data;
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message || 'Erreur lors de la récupération des catégories';
        } else {
          this.error = 'Erreur inconnue lors de la récupération des catégories';
        }
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
});