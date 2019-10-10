import { CreateSuitePage } from './../pages/crud-suite/create-suite/create-suite';
import { LoadingService } from './../services/loading.service';
import { LoginService } from './../services/login-service';
import { AppService } from './../services/app-service';
import { LoginPage } from './../pages/login/login';
import { InquilinoFiltroPage } from './../pages/inquilino-filtro/inquilino-filtro';
import { PrimerPasoPage } from './../pages/primer-paso/primer-paso';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@ionic-native/device';
import { HttpErrorResponse } from '@angular/common/http';
import { MiSuitesPage } from '../pages/crud-suite/mi-suites/mi-suites';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private translateService: TranslateService,
    private loginService: LoginService,
    private device: Device,
    private loadingService: LoadingService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializeLanguage();
      //crear usuario en los registros para poder consultar y manipular favoritos e información de su cuenta
      this.crearUsuarioTemporal();
    });
  }

  crearUsuarioTemporal() {
    if (localStorage.getItem("uuid") == null) {
      let uuid: string;
      if (this.device.cordova) {
        console.log("plataforma valida");
        
        uuid = this.device.uuid;
      } else {
        console.log("browser");
        
        uuid = Math.round(new Date().getTime() / 1000).toString();
      }
      let body: any = {
        uid_device: uuid
      };
      this.loadingService.show().then(() => {
        this.loginService.createUserTemporal(body).subscribe((res) => {
          //todo localstorage cambiará a lo encriptado
          localStorage.setItem("uuid", JSON.stringify(body));
          this.rootPage = CreateSuitePage;
          this.loadingService.hide();
        }, (err: HttpErrorResponse) => {
          this.rootPage = CreateSuitePage;
          this.loadingService.hide();
        });
      });
    }else{
      this.rootPage = CreateSuitePage;
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initializeLanguage() {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
