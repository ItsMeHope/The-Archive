// server/api/login.ts
import { defineEventHandler, readBody } from 'h3';

interface LoginSuccessResponse {
  message: string;
  user: { id: string; username: string };
  token: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface NuxtLoginResponse {
  success: boolean;
  user?: LoginSuccessResponse['user'];
  token?: string;
  error?: string;
}

interface FetchErrorData {
  error?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event);
  const { username, password } = body;

  try {
    const response = await $fetch<LoginSuccessResponse>('http://localhost:3001/login', {
      method: 'POST',
      body: { username, password }
    });

    return {
      success: true,
      user: response.user,
      token: response.token
    } as NuxtLoginResponse;
  } catch (error: unknown) {
    const fetchError = error as { data?: FetchErrorData };
    return {
      success: false,
      error: fetchError.data?.error || 'Erreur serveur'
    } as NuxtLoginResponse;
  }
});