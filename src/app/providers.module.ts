import { ValidationService } from './../services/validation.service';
import { LoginService } from './../services/login-service';
import { LoadingService } from './../services/loading.service';
import { AppService } from './../services/app-service';
import { AlertaService } from './../services/alerta.service';
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicErrorHandler } from "ionic-angular";
import { Geolocation } from '@ionic-native/geolocation';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { ActionSheet } from '@ionic-native/action-sheet';
import { Device } from '@ionic-native/device';
import { Facebook } from "@ionic-native/facebook"; 
import { FavoriteService } from '../services/favorite.service';
import { CustomCurrencyMaskConfig } from './app.module';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ImagePicker } from '@ionic-native/image-picker';
import { SuiteService } from '../services/suite.service';

@NgModule({
    providers: [
        AlertaService,
        AppService,
        LoadingService,
        Geolocation,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        GooglePlus,
        LoginService,
        Camera,
        ActionSheet,
        Device,
        Facebook,
        FavoriteService,
        ValidationService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
        PhotoLibrary,
        PhotoViewer,
        ImagePicker,
        SuiteService
    ],
})
export class ProvidersModule { }