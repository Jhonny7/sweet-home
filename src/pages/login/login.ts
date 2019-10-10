import { AlertaService } from './../../services/alerta.service';
import { catalogos } from './../../utils/catalogos';
import { GooglePlus } from '@ionic-native/google-plus';
import { LoginService } from './../../services/login-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Device } from '@ionic-native/device';
import { Facebook } from '@ionic-native/facebook';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public mivalor: any;

  public userLogout: any = {
    nombre: "",
    email: "",
    telefono: "",
    contrasenia: "",
    confirmarContrasenia: "",
    img: ""
  };

  public user: any = {
    email: "",
    contrasenia: ""
  };

  public options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginService: LoginService,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private alertaService: AlertaService,
    private translatePipe: TranslateService,
    private camera: Camera,
    private actionSheet: ActionSheet,
    private device: Device,
    private facebook: Facebook
  ) {
  }

  loginClick() {
    let loginBtn = document.getElementById('aplica-login');
    let signupBtn = document.getElementById('aplica-signup');
    console.log(loginBtn);
    console.log(signupBtn);
    loginBtn.classList.remove('slide-up');
    signupBtn.classList.add('slide-up');
  }

  singUpClick() {
    let loginBtn = document.getElementById('aplica-login');
    let signupBtn = document.getElementById('aplica-signup');
    console.log(loginBtn);
    console.log(signupBtn);
    signupBtn.classList.remove('slide-up');
    loginBtn.classList.add('slide-up');
  }

  ionViewDidLoad() {
    document.getElementById('phone').addEventListener('input', function (e: any) {
      var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  googlePlusLogin() {
    let client: string = null;
    let params: any;
    if (this.platform.is("ios")) {
      console.log("es ios");
      client = catalogos.googleWebClientIdIos;
      params = {
        'scopes': 'profile', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      }
    } else {
      console.log("es android");
      client = catalogos.googleWebClientIdAndroid;
      params = {
        'scopes': 'profile', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': "568374647653-1qhn69trc80fhi7ejg29tcd6br9t4qu9.apps.googleusercontent.com", // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      }
    }


    this.googlePlus.login(params).then((res) => {
      let a: string = JSON.stringify(res);
      this.mivalor = a;
      console.log(res);
      /**Datos que se ocupan */
      /**
       * res.email
       * res.imageUrl
       * res.displayName
       * res.userId
       */

      let body: any = {
        name: res.displayName,
        email: res.email,
        is_google: 1,
        photo_url: res.imageUrl,
        uid: res.userId
      };
      this.login(body, true);

      /**
       * this.displayName = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.userId = res.userId;
        this.imageUrl = res.imageUrl;

       */

    }, (err) => {
      console.log("Errorzaso");
      this.mivalor = err;
      console.log(err);

    });
  }

  facebookLogin() {
    let scopes: any[] = ['public_profile', 'user_friends', 'email'];
    this.facebook.login(scopes)
      .then(response => {
        if (response.status === "connected") {
          this.getUserDetail(response.authResponse.userID);
        } else {
          this.alertaService.errorAlertGeneric(this.translatePipe.instant("VERIFY-DATA"));
        }
      })
      .catch((error) => {
        this.alertaService.errorAlertGeneric(this.translatePipe.instant("VERIFY-CONNECTION"));
      });

  }

  getUserDetail(userId) {
    this.facebook.api("/" + userId + "/?fields=id,email,name,picture,gender", ["public_profile"])
      .then((detail) => {
        let photo: any = null;
        if (detail.picture) {
          if (detail.picture.data) {
            photo = detail.picture.data.url;
          }
        }
        let body: any = {
          name: detail.name,
          email: detail.email,
          is_google: 0,
          photo_url: photo,
          uid: detail.id
        }

        this.login(body, true);
      })
      .catch((error) => {
        this.alertaService.errorAlertGeneric(this.translatePipe.instant("VERIFY-CONNECTION"));
      });
  }

  createUser() {
    let fields: string = this.translatePipe.instant("FIELDS");
    let errors: number = 0;
    if (this.userLogout.nombre.length == 0) {
      fields += `${this.translatePipe.instant("NAME")},`;
      errors++;
    }
    if (this.userLogout.email.length == 0) {
      fields += `${this.translatePipe.instant("EMAIL")},`;
      errors++;
    }
    if (this.userLogout.contrasenia.length == 0) {
      fields += `${this.translatePipe.instant("PASSWORD")},`;
      errors++;
    }

    let pattern: any = new RegExp("(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$");
    let evaluaContrasenia: boolean = pattern.test(this.userLogout.contrasenia);

    console.log(evaluaContrasenia);
    let patternEmail: any = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
    let evaluaEmail: boolean = patternEmail.test(this.userLogout.email);
    if (errors > 0) {
      this.alertaService.warnAlert(this.alertaService.mensajeAdvertencia, `${fields.slice(0, fields.length - 1)}]`, null);
    } else if (this.userLogout.contrasenia !== this.userLogout.confirmarContrasenia) {
      this.alertaService.warnAlert(this.alertaService.mensajeAdvertencia, this.translatePipe.instant("PASSWORD-NO"), null);
    } else if (!evaluaContrasenia) {
      this.alertaService.warnAlert(this.alertaService.mensajeAdvertencia, this.translatePipe.instant("PATTERN"), null);
    } else if (!evaluaEmail) {
      this.alertaService.warnAlert(this.alertaService.mensajeAdvertencia, this.translatePipe.instant("PATTERN-EMAIL"), null);
    } else {
      let body: any = {
        name: this.userLogout.nombre.length === 0 ? null : this.userLogout.nombre,
        email: this.userLogout.email.length === 0 ? null : this.userLogout.email,
        phone: this.userLogout.telefono.length === 0 ? null : this.userLogout.telefono,
        password: this.userLogout.contrasenia.length === 0 ? null : this.userLogout.contrasenia,
        is_google: 2,
        photo_url: this.userLogout.img.length === 0 ? null : this.userLogout.img,
        uid: this.device.uuid
      }
      this.login(body, false);
    }
  }

  login(body: any, apiGoogleOrFacebook: boolean) {
    this.loginService.createUser(body).subscribe((res) => {
      if (res.status) {
        if (!apiGoogleOrFacebook) {
          this.alertaService.alertaNormal(this.translatePipe.instant("SAVE-SUCCESS"));
        }
        //navegación a home debe ser tipo setroot
      } else {
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      this.alertaService.errorAlertGeneric(err.error.description);
    });
  }

  loginNormal() {
    let params = new HttpParams()
      .set('email', this.user.email)
      .set('password', this.user.contrasenia);
    this.loginService.getUser(params).subscribe((res) => {
      if (res.status) {
        console.log(res);
        
        //navegación a home debe ser tipo setroot
      } else {
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      this.alertaService.errorAlertGeneric(err.error.description);
    });
  }

  opcionesDeImagen() {
    let buttonLabels = [this.translatePipe.instant("CAPTURE"), this.translatePipe.instant("SELECT")];
    const options: ActionSheetOptions = {
      title: '',
      subtitle: '',
      buttonLabels: buttonLabels,
      addCancelButtonWithLabel: this.translatePipe.instant("CANCEL"),
      addDestructiveButtonWithLabel: this.translatePipe.instant("DELETE"),
      androidTheme: 1,
      destructiveButtonLast: true
    };
    this.actionSheet.show(options).then((buttonIndex: number) => {
      switch (buttonIndex) {
        case 1:
          this.takeFoto();
          break;
        case 2:
          this.seleccionaImagen();
          break;
        case 3:
          this.userLogout.img = "";
          break;
      }
    });
  }

  takeFoto() {
    this.options.sourceType = this.camera.PictureSourceType.CAMERA;
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.userLogout.img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  seleccionaImagen() {
    this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.userLogout.img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }


}
