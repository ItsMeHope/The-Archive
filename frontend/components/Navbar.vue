<!-- components/Navbar.vue -->
<script setup>
  import { useCategoriesStore } from '~/stores/categories';
  import { useRoute } from 'vue-router';

  const store = useCategoriesStore();
  const route = useRoute();

  const isActive = (categoryId) => {
    return route.params.id === categoryId;
  };

  if (!store.categories.length) {
    store.fetchCategories();
  }
</script>

<template>
  <div class="navbar">
    <NuxtLink
      v-for="category in store.categories"
      :key="category._id"
      :to="`/categories/${category.name}`"
      :class="{ 'active': isActive(category.name) }"
      class="nav-link"
    >
      {{ category.name }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

.nav-link {
  text-decoration: none;
  font-weight: 500;
}

.nav-link:hover {
  color: #3498db;
}

.nav-link.active {
  text-decoration: underline;
}
</style>