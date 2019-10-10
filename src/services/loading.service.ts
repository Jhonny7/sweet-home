import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/**Clase Servicio que sirve para mostrar y ocultar un spinner
 * de carga en peticiones de servicios back o en donde se requiera
 */
@Injectable()
export class LoadingService {
  /**Variable que tiene la referencia del spinner */
  private loading: any;
  /**Constructor donde se hace la inyección del 
   * controlador de loading
   */
  constructor(private loadingController: LoadingController) { }

  /**Método que se encarga de mostrar el loader */
  async show(message: any = null) {
    let params: any = {

    };
    if (message) {
      params.message = message;
    }
    this.loading = await this.loadingController.create(params);
    await this.loading.present();
  }

  /**Método que se encarga de ocultar el loader */
  hide() {
    if (this.loading) {
      this.loading.dismiss();
    } else { 
    }
  }
}
