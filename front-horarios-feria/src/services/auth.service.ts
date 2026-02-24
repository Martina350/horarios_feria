import { api } from './api';
import type { LoginDto, LoginResponse } from '../types/api';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Inicia sesión y retorna el token
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', dto);
    return response.data;
  },

  /**
   * Guarda el token en localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Obtiene el token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  /**
   * Elimina el token del localStorage
   */
  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  /**
   * Verifica si hay un token guardado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
