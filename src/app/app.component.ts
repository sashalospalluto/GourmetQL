import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SplashService } from './services/splash';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashService: SplashService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    console.log('App iniciada');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.router.navigate(['/splash']);
      }, 1000);
    });
  }
}