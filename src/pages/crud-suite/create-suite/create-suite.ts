import { AlertaService } from './../../../services/alerta.service';
import { AppService } from './../../../services/app-service';
import { SuiteService } from './../../../services/suite.service';
import { LoadingService } from './../../../services/loading.service';
import { SuiteModel } from './../../../models/suite';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../services/validation.service';
import * as $ from "jquery";
import { CurrencyPipe } from '@angular/common';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { ImageModel } from '../../../models/image';
import { ImageViewerController } from 'ionic-img-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { CatalogoGenericoModel } from '../../../models/catalogo-generico';
import { HttpErrorResponse } from '@angular/common/http';
import { paths } from '../../../utils/paths';
import { catalogos } from '../../../utils/catalogos';
/**
 * Generated class for the CreateSuitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-suite',
  templateUrl: 'create-suite.html',
})
export class CreateSuitePage {

  public actionSheetClass: any = {
    cssClass: 'action-sheet-class'
  };

  public suscriptionState: any = null;
  public suscriptionCity: any = null;
  public suscriptionZip: any = null;

  public suite: SuiteModel;

  public formGroup: FormGroup;

  public dataParams: any = {
    descriptionCount: "",
    title: this.translatePipe.instant("NEW-SUITE"),
    bedRoomValue: null,
    bathRoomValue: null,
    parking: null,
    currency: 0,
    size: 0,

    idState: 0,
    idCity: 0,
    idSettlement: 0,

    idType: 0,
    idPropertyType: 0,
  };

  public objBedRooms: any[] = [];
  public objParking: any[] = [];
  public objBathRooms: any[] = [];

  public images: ImageModel[] = [];

  public imagesTemp: any[] = [];

  @ViewChild(Content) content: Content;

  public src: string = "";
  public modal: any;
  public selected: number;

  /**Address */

  public estados: CatalogoGenericoModel[] = [];
  public cities: CatalogoGenericoModel[] = [];
  public settlements: CatalogoGenericoModel[] = [];

  public catalogoTypes: CatalogoGenericoModel[] = [];
  public catalogoPropertyTypes: CatalogoGenericoModel[] = [];

  public activoZip: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translatePipe: TranslateService,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private photoLibrary: PhotoLibrary,
    private loadingService: LoadingService,
    private imageViewerCtrl: ImageViewerController,
    private photoViewer: PhotoViewer,
    private imagePicker: ImagePicker,
    private suiteService: SuiteService,
    private appService: AppService,
    private alertaService: AlertaService) {
    this.suite = navParams.get("suite");
    if (this.suite) {
      console.log("si existe");
      console.log(this.suite);

      this.dataParams.title = this.suite.title;
    } else {
      this.suite = new SuiteModel(null, null, null, null, null, null, null, null, null, null, null, null, null);
    }
    this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      size: [0, Validators.compose([Validators.required])],
      saldo: [0, Validators.compose([Validators.required])],
      state: [0, Validators.required],
      city: [0, Validators.required],
      zip: [""],
      settlement_other: [""],
      settlement: [0, Validators.required],

      external_number: ["", Validators.required],
      internal_number: [""],
      street: ["", Validators.required],

      catalogType: [""],
      type: [""]
    });

  }

  ionViewDidLoad() {
    //$(".numeric").numeric({ decimal : ".",  negative : false, scale: 3 });
    this.generarStepsRooms();
    this.llenarComboEstados();
    this.llenarTypes();
    this.llenarPropertyTypes();
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

  onBlurMethod(evt: any) {
    console.log(evt);
    if (this.suscriptionZip) {
      this.suscriptionZip.unsubscribe();
    }
    this.activoZip = true;
    this.settlements = [];
    this.suscriptionZip = this.appService.getPetition(`${paths.zipCode}${evt}`).subscribe((res) => {
      if (res.status) {
        let result = res.parameters;
        this.dataParams.idState = result.state_id;

        result.settlements.forEach(settlement => {
          this.settlements.push(new CatalogoGenericoModel(settlement.id, settlement.settlement, settlement.settlement));
        });

        this.llenarComboEstados(true, result.state_id, result)
      } else {
        this.activoZip = false;
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      this.activoZip = false;
      this.estados = catalogos.states;
    });
  }

  llenarComboEstados(execute: boolean = false, idState: number = 0, r: any = null) {
    if (this.suscriptionState) {
      this.suscriptionState.unsubscribe();
    }
    this.suscriptionState = this.appService.getPetition(`${paths.states}9`).subscribe((res) => {
      if (res.status) {
        this.estados = res.parameters;
        if (execute) {
          this.onChangeState(idState, r);
        }
      } else {
        this.activoZip = false;
        this.alertaService.errorAlertGeneric(res.parameters);
      }
    }, (err: HttpErrorResponse) => {
      this.estados = catalogos.states;
      this.activoZip = false;
    });
  }

  onChangeState(idState: any, r: any = null) {
    console.log(idState);
    //this.formGroup.controls.state = 0;
    //this.formGroup.value.state = 0;
    this.cities = [];

    if (this.suscriptionCity) {
      this.suscriptionCity.unsubscribe();
    }
    this.suscriptionCity = this.appService.getPetition(`${paths.cities}${idState}`).subscribe((res) => {
      if (res.status) {
        this.cities = res.parameters;
        //console.log(this.selecciones);
        if (r !== null) {
          this.dataParams.idCity = r.city_id;
        }
        this.activoZip = false;
      } else {
        this.activoZip = false;
        this.alertaService.errorAlertGeneric(res.parameters);
      }
      //this.search(0);
    }, (err: HttpErrorResponse) => {
      this.activoZip = false;
    });
  }


  currencyInputChanged(value) {
    var num = value.replace(/[$,]/g, "");
    return Number(num);
  }

  generarStepsRooms() {
    //this.objBedRooms.push(this.selecciones.opcionGenerica);
    //this.objBathRooms.push(this.selecciones.opcionGenerica);
    //this.objParking.push(this.selecciones.opcionGenerica);

    for (let index = 1; index < 6; index++) {
      let seleccionado = false;
      if (index === 1) {
        seleccionado = true;
        this.dataParams.bedRoomValue = index;
        this.dataParams.bathRoomValue = index;
        this.dataParams.parking = index;
      }
      this.objBedRooms.push({ value: index, description: `${index}+`, selected: seleccionado });
      this.objBathRooms.push({ value: index, description: `${index}+`, selected: seleccionado });
      this.objParking.push({ value: index, description: `${index}+`, selected: seleccionado });
    }
  }

  setParking(value: any) {
    this.objParking.forEach(e => {
      e.selected = false;
    });
    value.selected = true;

    this.dataParams.parking = value.value;
  }

  setBedRoom(value: any) {
    this.objBedRooms.forEach(e => {
      e.selected = false;
    });
    value.selected = true;

    this.dataParams.bedRoomValue = value.value;
  }

  setBathRoom(value: any) {
    this.objBathRooms.forEach(e => {
      e.selected = false;
    });
    value.selected = true;

    this.dataParams.bathRoomValue = value.value;
  }

  dismiss() {
    let data = { suite: this.suite, };
    this.viewCtrl.dismiss(data);
  }



  scrollTo(index) {
    let yOffset = document.getElementById('yourInputId' + index).offsetTop;
    this.content.scrollTo(0, yOffset + 20);
  }

  openGallery2() {
    let total: number = 10;

    total = 10 - this.imagesTemp.length;
    if (total < 10) {
      let options: ImagePickerOptions = {
        cancelButton: "Cancelar1",
        okButton: "ok1",
        messageMaximum: "you can only ",
        messageMaximumLow: "maximum",
        maximumImagesCount: total,
        outputType: 1,
        processing: "Procesando",
        time: "Esto puede tardar algo"
      };
      this.imagePicker.getPictures(options).then((results) => {
        let i: number = 1;
        results.forEach(imagen => {
          let imageBase64 = `data:image/png;base64,${imagen}`;
          this.imagesTemp.push({ img: imageBase64, id: i, show: false });
          i++;
        });
      }, (err) => {
        this.alertaService.errorAlert(this.alertaService.mensajeError, this.translatePipe.instant("VERIFY-ERROR"), null);
      });
    } else {
      //Mensaje de ya no se pueden agregar imagenes
    }

  }

  openGallery() {
    this.photoLibrary.requestAuthorization().then(() => {
      this.loadingService.show().then(() => {
        this.photoLibrary.getLibrary().subscribe({
          next: library => {
            library.forEach(img => {
              console.log(img);
            });
          },
          error: err => {
            this.loadingService.hide();
            console.log('could not get photos');
          },
          complete: () => {
            this.loadingService.hide();
            console.log('done getting photos');
          }
        });
      });
    }).catch(err => {
      this.loadingService.hide();
      console.log('permissions weren\'t granted')
    }
    );
  }

  showPhoto(img: any, index: any) {
    this.src = `${this.imagesTemp[index].img}`;
    this.selected = index;
    this.modal = document.getElementById("myModal");
    let modalImg: any = document.getElementById("img01");
    //let captionText: any = document.getElementById("caption");

    this.imagesTemp[index].show = true;

    this.modal.style.display = "flex";
    modalImg.src = this.src;
    //captionText.innerHTML = "";
    /* this.src = `${this.imagesTemp[index].img}`;
     console.log(this.src);
    
    const imageViewer = this.imageViewerCtrl.create(img);
    imageViewer.present();
 
    //setTimeout(() => imageViewer.dismiss(), 1000);
    imageViewer.onDidDismiss(() => {
      console.log("hfdjskl");
      
      this.src = "";
    }); 

    this.photoViewer.show(this.src, 'My image title', {share: false}); */



    /* let clase: any = document.getElementsByClassName("scrolling-wrapper");
    console.log(clase[0].childNodes);
    for (let i = 0; i < clase[0].childNodes.length; i++) {
      const element = clase[0].childNodes[i];
      console.log(element);
      if (element.classList) {
        element.classList.remove("card-full");
      }

    }
    this.imagesTemp.forEach(element => {
      element.show = false;
    });

    let id: string = `card-${index}`;
    let elemento: any = document.getElementById(id);
    elemento.classList.add("card-full");
    this.imagesTemp[index].show = true; */

  }

  deletePhoto(img: any, index: any = 0) {
    if (this.selected !== null) {
      //eliminar la clase 

      this.imagesTemp[this.selected].show = false;
      this.selected = null;
      //let span: any = document.getElementsByClassName("close")[0];
      this.modal.style.display = "none";
    } else {
      //borrar completamente del array
      const position = this.imagesTemp.findIndex(
        (favoritoEliminar: any) => {
          return favoritoEliminar.id == img.id;
        }
      );
      this.imagesTemp.splice(position, 1);
    }
  }

  createSuite() {

    /**
     this.formGroup = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      size: [0, Validators.compose([Validators.required])],
      saldo: [0, Validators.compose([Validators.required])],
      state: [0, Validators.required],
      city: [0, Validators.required],
      zip: [""],
      other_settlement: [""],
      settlement: [0, Validators.required],

      extNumber: ["", Validators.required],
      intNumber: [""],
      street: ["", Validators.required],
    }); 
     
     */

    const invalid = [];
    const controls = this.formGroup.controls;

    let fields: string = this.translatePipe.instant("FIELDS");
    for (const name in controls) {
      let n: any = controls[name];
      if ((n.value === 0 || n.value.length === 0) && n.invalid) {
        invalid.push(this.translatePipe.instant(String(name).toUpperCase()));
        fields += `${this.translatePipe.instant(String(name).toUpperCase())},`;
      }
    }
    console.log(invalid);

    if (invalid.length > 0) {
      this.alertaService.warnAlert(this.alertaService.mensajeAdvertencia, `${fields.slice(0, fields.length - 1)}]`, null);
    } else {
      this.loadingService.show().then(() => {
        this.imagesTemp.push({ img: `data:image/png;base64,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`, id: 1, show: false });

        let params: any = {
          photos: this.imagesTemp,
          /* settlement_other:
          id_settlement,
          internal_number,
          external_number,
          zip_code,
          street,
          latitude,
          longitude, */
        }

        this.suiteService.createSuite(params).subscribe((res) => {
          
          
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
          this.alertaService.errorAlertGeneric(err.error.description);
        });
      });
    }
  }
}
