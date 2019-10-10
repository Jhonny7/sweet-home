import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ControlMessagesComponent } from '../components/control-messages/control-messages.component';
import { ScrollHideDirective } from '../directives/scroll-hide.directive';
import { MiSuitesPage } from '../pages/crud-suite/mi-suites/mi-suites';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { catalogos } from '../utils/catalogos';
import { CreateSuitePage } from './../pages/crud-suite/create-suite/create-suite';
import { MyApp } from './app.component';
import { ProvidersModule } from './providers.module';
import { ViewModule } from './view.module';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ImagePicker } from '@ionic-native/image-picker';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",  
  allowNegative: false,
  decimal: ".",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ","
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MiSuitesPage,
    CreateSuitePage,
    ScrollHideDirective,
    ControlMessagesComponent,
    
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ProvidersModule,
    AngularFireModule.initializeApp(catalogos.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ViewModule,
    CurrencyMaskModule,
    IonicImageViewerModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MiSuitesPage,
    CreateSuitePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ],
})
export class AppModule { }
