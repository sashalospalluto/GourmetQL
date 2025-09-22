import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  perfil: 'dueño' | 'supervisor' | 'cocinero' | 'bartender' | 'mozo' | 'maitre';
  foto_url: string;
  estado: 'habilitado' | 'deshabilitado';
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private usuarioActual: Usuario | null = null;

  constructor(private router: Router) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async iniciarSesion(email: string, contrasenia: string): Promise<{ success: boolean; message: string; usuario?: Usuario }> {
    try {
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('contrasenia', contrasenia)
        .eq('estado', 'habilitado')
        .single();

      if (error || !data) {
        return { success: false, message: 'Credenciales incorrectas o usuario deshabilitado' };
      }

      this.usuarioActual = data;
      localStorage.setItem('usuario_actual', JSON.stringify(data));
      
      return { success: true, message: 'Inicio de sesión exitoso', usuario: data };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, message: 'Error al conectar con el servidor' };
    }
  }

  cerrarSesion(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario_actual');
    this.router.navigate(['/login']);
  }

  obtenerUsuarioActual(): Usuario | null {
    if (!this.usuarioActual) {
      const usuarioGuardado = localStorage.getItem('usuario_actual');
      if (usuarioGuardado) {
        this.usuarioActual = JSON.parse(usuarioGuardado);
      }
    }
    return this.usuarioActual;
  }

  estaLogueado(): boolean {
    return this.obtenerUsuarioActual() !== null;
  }

  async obtenerTodosLosUsuarios(): Promise<Usuario[]> {
    try {
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('*')
        .eq('estado', 'habilitado');

      if (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
      return [];
    }
  }

  async crearUsuario(usuario: Omit<Usuario, 'id'>): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await this.supabase
        .from('usuarios')
        .insert([usuario]);

      if (error) {
        return { success: false, message: 'Error al crear usuario: ' + error.message };
      }

      return { success: true, message: 'Usuario creado exitosamente' };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return { success: false, message: 'Error al conectar con el servidor' };
    }
  }
}