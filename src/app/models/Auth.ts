// auth-response.interface.ts
export interface AuthResponse {
    success: boolean;
    usuario: {
      idUsuario: number;
      username: string;
      password: string;
      cargo: string;
      estado: boolean;
      idPersona: number;
    };
    token: string;
    refreshToken: string;
    message: string;
  }
  