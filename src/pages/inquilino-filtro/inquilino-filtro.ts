import { SuiteModel } from './../../models/suite';
import { HomePage } from './../home/home';
import { LoadingService } from './../../services/loading.service';
import { AlertaService } from './../../services/alerta.service';
import { CatalogoGenericoModel } from './../../models/catalogo-generico';
import { AppService } from './../../services/app-service';
import { PrimerPasoPage } from './../primer-paso/primer-paso';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import * as $ from "jquery";
import { TweenMax, Circ } from 'gsap'
import { catalogos } from '../../utils/catalogos';
import { paths } from '../../utils/paths';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-inquilino-filtro',
  templateUrl: 'inquilino-filtro.html',
})
export class InquilinoFiltroPage {
  //Referencia al select
  @ViewChild("seleccionPrecio") seleccionPrecio: Select;
  public

  public opcionesSelect: any = {
    cssClass: 'selector'
  };
  public opcionesSelectTwo: any = {
    cssClass: 'selector2'
  };
  public actionSheetClass: any = {
    cssClass: 'action-sheet-class'
  };

  public objBedRooms: any[] = [];
  public objParking: any[] = [];
  public objBathRooms: any[] = [];


  public active1: boolean = true;
  public active2: boolean = false;
  public rangeObject: any = { lower: 1, upper: 20 };

  public counter: any = 0;

  //Combos
  public catalogoTypes: CatalogoGenericoModel[] = [];
  public catalogoPropertyTypes: CatalogoGenericoModel[] = [];
  public precios: CatalogoGenericoModel[] = [];
  public terrenoSize: CatalogoGenericoModel[] = [];
  public estados: CatalogoGenericoModel[] = [];
  public cities: CatalogoGenericoModel[] = [];
  public settlements: CatalogoGenericoModel[] = [];

  //objeto de búsqueda
  public suites: SuiteModel[] = [];
  //Selecciones
  public selecciones: any = {
    idType: 0,
    idPropertyType: 0,
    seleccionPrecioLow: 0,
    seleccionPrecioHigh: 0,
    seleccionTerrenoLow: 0,
    seleccionTerrenoHigh: 0,
    idState: 0,
    idCity: 0,
    idSettlement: 0,
    bedRoomValue: null,
    bathRoomValue: null,
    parking: null,
    buttonEnabled: false,
    page: 1,
    opcionGenerica: {
      id: 0,
      label: "Everyone",
      name: "EVERYONE"
    },
    latitude: null,
    longitude: null,
    cercaDeMi: false,
  }
  private suscription: any;
  public buscando: boolean = false;

  private user: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private alertaService: AlertaService,
    private loadingService: LoadingService,
    private geolocation: Geolocation) {
    //this.loadingService.show();
    this.user = JSON.parse(localStorage.getItem("uuid"));
  }

  ionViewDidLoad() {
    this.llenarCombos();
  }

  llenarCombos() {
    this.llenarTypes();
    this.llenarPropertyTypes();
    this.llenarComboPrecios();
    this.generarStepsRooms();
    this.llenarComboTerreno();
    this.llenarComboEstados();
  }

  llenarComboEstados() {
    this.appService.getPetition(`${paths.states}9`).subscribe((res) => {
      if (res.status) {
        this.estados = res.parameters;
      } else {
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      this.estados = catalogos.states;
    });
  }

  llenarComboTerreno() {
    this.terrenoSize.push(new CatalogoGenericoModel(this.selecciones.opcionGenerica.id, this.selecciones.opcionGenerica.name, this.selecciones.opcionGenerica.label));
    for (let index = 50; index < 550; index += 50) {
      this.terrenoSize.push(new CatalogoGenericoModel(index, String(index), String(index)));
    }
    console.log(this.terrenoSize);

  }

  generarStepsRooms() {
    //this.objBedRooms.push(this.selecciones.opcionGenerica);
    //this.objBathRooms.push(this.selecciones.opcionGenerica);
    //this.objParking.push(this.selecciones.opcionGenerica);

    for (let index = 1; index < 6; index++) {
      let seleccionado = false;
      if (index === 1) {
        seleccionado = true;
        this.selecciones.bedRoomValue = index;
        this.selecciones.bathRoomValue = index;
        this.selecciones.parking = index;
      }
      this.objBedRooms.push({ value: index, description: `${index}+`, selected: seleccionado });
      this.objBathRooms.push({ value: index, description: `${index}+`, selected: seleccionado });
      this.objParking.push({ value: index, description: `${index}+`, selected: seleccionado });
    }
  }

  llenarComboPrecios() {
    this.precios.push(new CatalogoGenericoModel(this.selecciones.opcionGenerica.id, this.selecciones.opcionGenerica.name, this.selecciones.opcionGenerica.label));
    for (let i: number = 1000; i < 51000; i += 1000) {
      this.precios.push(new CatalogoGenericoModel(i, String(i), String(i)));
    }
  }

  llenarTypes() {
    this.appService.getPetition(paths.types).subscribe((res) => {
      if (res.status) {
        this.catalogoTypes = res.parameters;
      } else {
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      this.catalogoTypes = catalogos.suiteTypes;
    });
  }

  llenarPropertyTypes() {
    this.appService.getPetition(paths.propertyTypes).subscribe((res) => {
      if (res.status) {
        this.catalogoPropertyTypes = res.parameters;
      } else {
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      this.catalogoPropertyTypes = catalogos.propertyTypes;
    });
  }

  search(withClick: any = 0) {
    let params = new HttpParams()
      .set('page', String(1))
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


    if (withClick === 1) {
      this.loadingService.show().then(() => {
        this.petitionSearch(params);
      });
    } else {
      this.petitionSearch(params);
    }
  }

  petitionSearch(params: any) {
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
    this.suites = [];
    this.buscando = true;
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
        this.selecciones.buttonEnabled = true;
        this.changeValueCounter(parametros.registers_total);
      } else {
        this.selecciones.buttonEnabled = true;
        this.changeValueCounter(0);
        this.alertaService.errorAlertGeneric(res.parameters);
      }
      this.buscando = false;
      this.loadingService.hide();
    }, (err: HttpErrorResponse) => {
      this.selecciones.buttonEnabled = true;
      this.buscando = false;
      this.changeValueCounter(0);
      this.loadingService.hide();
    });
  }

  activar1() {
    this.active1 = true;
    this.active2 = false;
  }

  activar2() {
    this.active2 = true;
    this.active1 = false;
  }

  onChangeGeneric(evt: any) {
    this.search(0);
  }

  onChangePrice(evt: any) {
    if (evt == 0) {
      this.selecciones.seleccionPrecioLow = 0;
      this.selecciones.seleccionPrecioHigh = 0;
    }
    this.search(0);
  }

  onChangeTerrain(evt: any) {
    if (evt == 0) {
      this.selecciones.seleccionTerrenoLow = 0;
      this.selecciones.seleccionTerrenoHigh = 0;
    }
    this.search(0);
  }

  onChangeState(idState: any) {
    console.log(idState);
    this.selecciones.idCity = 0;
    this.cities = [];
    this.appService.getPetition(`${paths.cities}${idState}`).subscribe((res) => {
      if (res.status) {
        this.cities = res.parameters;
        console.log(this.selecciones);

      } else {
        this.alertaService.errorAlertGeneric(res.parameters);
      }
      this.search(0);
    }, (err: HttpErrorResponse) => {

    });
  }

  setParking(value: any) {
    this.objParking.forEach(e => {
      e.selected = false;
    });
    value.selected = true;

    this.selecciones.parking = value.value;
    this.search(0);
  }

  setBedRoom(value: any) {
    this.objBedRooms.forEach(e => {
      e.selected = false;
    });
    value.selected = true;

    this.selecciones.bedRoomValue = value.value;
    console.log(this.selecciones.bedRoomValue);
    this.search(0);
  }

  setBathRoom(value: any) {
    this.objBathRooms.forEach(e => {
      e.selected = false;
    });
    value.selected = true;

    this.selecciones.bathRoomValue = value.value;

    this.search(0);
  }

  changeValueCounter(maximoValor: number): any {
    var counter = { var: 0 };
    TweenMax.to(counter, 3, {
      var: maximoValor,//maximo valor
      onUpdate: function () {
        var number = Math.ceil(counter.var);
        if (number < 10) {
          $('.counter').html(` 0${number} `);
        } else {
          $('.counter').html(` ${number} `);
        }

        if (number === counter.var) {
          try {
            this.changeValueCounter.kill();
          } catch (error) {
            console.log(error);

          }
        }
      },
      onComplete: function () {
        //this.changeValueCounter();
      },
      ease: Circ.easeOut
    });
  }

  onChangeToggle(evt: any) {
    this.selecciones.cercaDeMi = evt.value;
    if (this.selecciones.cercaDeMi) {
      this.geolocalizar();
    }
  }

  geolocalizar() {
    this.loadingService.show().then(() => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.selecciones.latitude = resp.coords.latitude;
        this.selecciones.longitude = resp.coords.longitude;
        this.search(0);
      }).catch((error) => {
        this.search(0);
      });
    });
  }

  verSuites() {
    this.suscription.unsubscribe();
    this.navCtrl.push(HomePage, { suites: this.suites, selecciones: this.selecciones });
  }
}
