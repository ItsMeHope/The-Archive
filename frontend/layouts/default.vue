<!-- layouts/default.vue -->
<script setup lang="ts">
    import { ref } from 'vue';
    import type { Ref } from 'vue';
    import Navbar from '~/components/Navbar.vue';
    import { useCategoriesStore } from '~/stores/categories';
    import { LoginResponse } from '~/types/auth';

    const store = useCategoriesStore();
    const username = ref('');
    const password = ref('');
    const showLogin = ref(false);
    const isLoggedIn = ref(false);

    interface User {
        id: string;
        username: string;
    }
    const user: Ref<User | null> = ref(null);
    const token = useCookie('auth_token', { maxAge: 2 * 60 * 60 });

    async function handleLogin() {
        try {
            const response = await $fetch<LoginResponse>('/api/login', {
            method: 'POST',
            body: {
                username: username.value,
                password: password.value
            }
            });

            if (response.success && response.user && response.token) {
            isLoggedIn.value = true;
            user.value = response.user;
            token.value = response.token;
            showLogin.value = false;
            username.value = '';
            password.value = '';
            } else {
            throw new Error(response.error || 'Unknown error');
            }
        } catch (err) {
            alert('Connection error : ' + (err.message || 'Server error'));
        }
    }
</script>

<template>
    <div class="layout">
      <Navbar />
      <slot />
      <button v-if="!isLoggedIn" class="login-button" @click="showLogin = true">
        Login
      </button>
      <div v-if="isLoggedIn" class="user-info">
        Connected as {{ user.username }}
      </div>
      <div v-if="showLogin" class="login-modal">
        <form @submit.prevent="handleLogin">
          <input v-model="username" placeholder="Nom d'utilisateur" required />
          <input v-model="password" type="password" placeholder="Mot de passe" required />
          <button type="submit">Connect</button>
          <button type="button" @click="showLogin = false">Cancel</button>
        </form>
      </div>
    </div>
  </template>

  <style scoped>

  .layout {
    min-height: 100vh;
    position: relative;
  }

  .login-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: transparent;
    color: transparent;
    border: none;
  }

  .user-info {
    position: fixed;
    bottom: 20px;
    right: 20px;
    color: #2c3e50;
  }

  .login-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .login-modal form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .login-modal input {
    padding: 5px;
  }

  .login-modal button {
    padding: 5px 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
  }
  </style>