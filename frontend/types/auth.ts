// types/auth.ts
export interface LoginResponse {
    success: boolean;
    user?: {
      id: string;
      username: string;
    };
    error?: string;
  }