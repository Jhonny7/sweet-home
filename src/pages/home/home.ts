import { AlertaService } from './../../services/alerta.service';
import { LoadingService } from './../../services/loading.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { SuiteModel } from '../../models/suite';
import { AppService } from '../../services/app-service';
import { paths } from '../../utils/paths';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //objeto de búsqueda
  public suites: SuiteModel[] = [];

  //filtros aplicados
  public selecciones: any;

  public suscription: any;

  public enabledScroll:boolean = true;

  private user: any;
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private appService: AppService,
    private loadingService: LoadingService,
    private favoriteService: FavoriteService,
    private alertaService: AlertaService,
    private events: Events) {
    console.log(navParams.get("suites"));
    this.suites = navParams.get("suites");
    this.selecciones = navParams.get("selecciones");

    this.user = JSON.parse(localStorage.getItem("uuid"));
  }

  doInfinite(infiniteScroll) {
    if(this.enabledScroll){
      setTimeout(() => {
        this.search();
        infiniteScroll.complete();
      }, 1000);
    }else{
      infiniteScroll.complete();
    }
    
  }

  search(withClick: any = 0) {
    this.selecciones.page += 1;
    let params = new HttpParams()
      .set('page', String(this.selecciones.page))
      .set('paginated', String(10))

      .set('suite_type', this.selecciones.idType === 0 ? null : String(this.selecciones.idType))
      .set('property_type', this.selecciones.idPropertyType === 0 ? null : String(this.selecciones.idPropertyType))

      .set('lower_price', this.selecciones.seleccionPrecioLow === 0 ? null : String(this.selecciones.seleccionPrecioLow))
      .set('higher_price', this.selecciones.seleccionPrecioHigh === 0 ? null : String(this.selecciones.seleccionPrecioHigh))

      .set('bedrooms', String(this.selecciones.bedRoomValue))
      .set('bathrooms', String(this.selecciones.bathRoomValue))

      .set('lower_size', this.selecciones.seleccionTerrenoLow === 0 ? null : String(this.selecciones.seleccionTerrenoLow))
      .set('higher_size', this.selecciones.seleccionTerrenoHigh === 0 ? null : String(this.selecciones.seleccionTerrenoHigh))

      //minimo garage
      .set('lower_garage', String(this.selecciones.parking))

      //Datos con geolocalización
      .set('latitude', String(this.selecciones.latitude))
      .set('longitude', String(this.selecciones.longitude))
      .set('kms', String(10))

      .set('id_state', this.selecciones.idState === 0 ? null : String(this.selecciones.idState))
      .set('id_city', this.selecciones.idCity === 0 ? null : String(this.selecciones.idCity))
      .set('uid_device', this.user.uid_device)

    this.loadingService.show().then(() => {
      this.petitionSearch(params);
    });
  }

  petitionSearch(params: any) {
    if (this.suscription != null) {
      this.loadingService.hide();
      this.suscription.unsubscribe();
    }
    //this.suites = [];
    console.log(this.suites);
    
    this.suscription = this.appService.getPetition(paths.searchSuites, params).subscribe((res) => {
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
      } else {
      }
      this.loadingService.hide();
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
      this.selecciones.page--;
      this.enabledScroll = false;
    });
  }

  addFavorite(suite:SuiteModel){
    let body:any = {
      uid_device: this.user.uid_device,
      id_suite: suite.id_suite
    };
    console.log(body);
    
    this.favoriteService.addFavorite(body).subscribe((res)=>{
      console.log(res);
      if(res.status){
        suite.favorite = true;
      }
    }, (err: HttpErrorResponse) => {
      this.alertaService.errorAlertGeneric(err.error.description);
    });
  }

  deleteFavorite(suite:SuiteModel){
    let body:any = {
      uid_device: this.user.uid_device,
      id_suite: suite.id_suite
    };
    console.log(body);
    
    this.favoriteService.deleteFavorite(body).subscribe((res)=>{
      console.log(res);
      if(res.status){
        suite.favorite = false;
      }
    }, (err: HttpErrorResponse) => {
      this.alertaService.errorAlertGeneric(err.error.description);
    });
  }
}
