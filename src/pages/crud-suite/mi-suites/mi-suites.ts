import { CreateSuitePage } from './../create-suite/create-suite';
import { LoadingService } from './../../../services/loading.service';
import { AppService } from './../../../services/app-service';
import { AlertaService } from './../../../services/alerta.service';
import { SuiteModel } from './../../../models/suite';
import { Component, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController, ModalController } from 'ionic-angular';
import { ScrollHideConfig } from '../../../directives/scroll-hide.directive';
import * as $ from "jquery";
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { paths } from '../../../utils/paths';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-mi-suites',
  templateUrl: 'mi-suites.html',
})
export class MiSuitesPage {
  @ViewChildren(Content) pageContent: Content;
  public footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined, property: "temporal" };
  public headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 56, property: "temporal" };
  private user: any;

  //objeto de búsqueda
  public suites: SuiteModel[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertaService: AlertaService,
    private appService: AppService,
    private loadingService: LoadingService,
    private alertCtrl: AlertController,
    private translatePipe: TranslateService,
    private modalCtrl: ModalController) {
    this.user = JSON.parse(localStorage.getItem("uuid"));
  }

  ionViewDidLoad() {
    this.cargarMisSuites();
    let nav: any = $("#nav-bar-id");
    let valorScrolling: number = nav[0].clientHeight;
    this.headerScrollConfig.maxValue = valorScrolling;
  }

  cargarMisSuites() {
    let params = new HttpParams()
      .set('uid_device', this.user.uid_device)
    this.appService.getPetition(paths.searchSuitesByUser, params).subscribe((res) => {
      if (res.status) {
        let parametros: any = res.parameters;
        console.log(res.parameters);
        parametros.registers.forEach(suite => {
          this.suites.push(new SuiteModel(
            suite.bathrooms,
            suite.bedrooms,
            suite.date_at,
            suite.description,
            suite.garages,
            suite.is_premium,
            suite.photos,
            suite.premium_at,
            suite.price,
            suite.size,
            suite.title,
            suite.favorite === 1 ? true : false,
            suite.id_suite
          ));
        });
        console.log(this.suites);

      } else {
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.suites = null;
    });
  }

  confirmDelete(suite: SuiteModel) {
    let alert = this.alertCtrl.create({
      title: this.translatePipe.instant("CONFIRM"),
      message: this.translatePipe.instant("CONFIRM-DELETE-SUITE"),
      buttons: [
        {
          text: this.translatePipe.instant("CANCEL"),
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.deleteSuite(suite);
          }
        }
      ]
    });
    alert.present();
  }

  deleteSuite(suite: SuiteModel) {
    this.loadingService.show().then(() => {
      let body: any = {
        id_suite: suite.id_suite
      };
      this.appService.deletePetition(paths.deleteSuite, body).subscribe((res) => {
        if (res.status) {
          const position = this.suites.findIndex(
            (suiteTemp: SuiteModel) => {
              return suite.id_suite == suiteTemp.id_suite;
            }
          );
          this.suites = [
            ...this.suites.slice(0, position),
            ...this.suites.slice(position + 1)
          ];

        } else {
          this.alertaService.errorAlertGeneric(res.parameters);
        }
        this.loadingService.hide();
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.loadingService.hide();
      });
    });
  }

  viewSuite(suite: SuiteModel = null) {

    let params: any = {};
    if(suite){
      params = {suite:suite}
    }
    let profileModal = this.modalCtrl.create(CreateSuitePage, params);

    profileModal.onDidDismiss(data => {
      console.log(data);
    });

    profileModal.present();

    //this.navCtrl.push(CreateSuitePage, { suite });
  }
}
