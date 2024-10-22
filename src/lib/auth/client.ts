'use client';

import { apiService } from '@/axios/axios-interceptor';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import type { User } from '@/types/user';

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  // async signUp(_: SignUpParams): Promise<{ error?: string }> {
  //   // Make API request

  //   // We do not handle the API, so we'll just generate a token and store it in localStorage.
  //   const token = generateToken();
  //   localStorage.setItem('accessToken', token);

  //   return {};
  // }

  // async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
  //   return { error: 'Social authentication not implemented' };
  // }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: boolean }> {
    const { email, password } = params;
    // const userId = { email: 'admin99@example.com', password: 'Sa4qZ_399Y5m' };

    try {
      // production 
      // const result = await apiService.post('auth/signin/admin', {email,password});
      //dev
      const result = await apiService.post('auth/signin/admin', {email,password});
      console.log(result)
      const token = result.data.token.access_token;

      localStorage?.setItem('accessToken', token);
      localStorage?.setItem('workSpace', 'B2B');
      const userDataFromToken = jwtDecode(token);
    
    } catch (err) {
      console.log(err);
      return { error: true };
    }

    return { error: false };
  }

  // async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: 'Password reset not implemented' };
  // }

  // async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: 'Update reset not implemented' };
  // }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('accessToken');

    return {};
  }
}

export const authClient = new AuthClient();
