import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController} from '@ionic/angular';
import { SupabaseService, Usuario } from '../../services/supabase';
import { IonContent, IonCardContent,IonInput, IonButton, IonItem, IonIcon, IonCard, IonLabel, IonCardHeader, IonCardTitle} from '@ionic/angular/standalone';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonIcon, IonContent, IonInput, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonCardHeader, IonCardTitle ]
})
export class LoginComponent implements OnInit {
  email: string = '';
  contrasenia: string = '';
  mostrarContrasenia: boolean = false;

  usuariosRapidos=[
    { email: 'dueno@gmail.com', contrasenia: '123456', nombre: 'dueño', perfil: 'dueño' },
  ];

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private loadingController: LoadingController,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    if (this.supabaseService.estaLogueado()) {
      this.router.navigate(['/home']);
    }
  }

  async iniciarSesion() {
      if (!this.email || !this.contrasenia) {
        this.toastService.mostrarToastError('Por favor, complete todos los campos');
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const resultado = await this.supabaseService.iniciarSesion(this.email, this.contrasenia);
        
        await loading.dismiss();

        if (resultado.success) {
          this.toastService.mostrarToastExito(`¡Bienvenido/a ${resultado.usuario?.nombre}!`);
          this.router.navigate(['/home']);
        } else {
          this.toastService.mostrarToastError(resultado.message);
        }
      } catch (error) {
        await loading.dismiss();
        this.toastService.mostrarToastError('Error inesperado. Intente nuevamente.');
      }
    }

    async loginRapido(usuario: any) {
      const loading = await this.loadingController.create({
        message: `Ingresando como ${usuario.perfil}...`,
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const resultado = await this.supabaseService.iniciarSesion(usuario.email, usuario.contrasenia);
        
        await loading.dismiss();

        if (resultado.success) {
          this.toastService.mostrarToastExito(`¡Bienvenido/a ${usuario.nombre}!`);
          this.router.navigate(['/home']);
        } else {
          this.toastService.mostrarToastError('Usuario de prueba no encontrado. Verifique la base de datos.');
        }
      } catch (error) {
        await loading.dismiss();
        this.toastService.mostrarToastError('Error al intentar login rápido.');
      }
    }
  }