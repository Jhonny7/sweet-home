import { Injectable, OnDestroy } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';

/**Clase provider que se utiliza para generar mensajes de error, alerta o éxito
 * Se hizo de forma genérica para evitar repetir esta clase de código
 */
@Injectable()
export class AlertaService implements OnDestroy {
  /**Declaración de variables*/
  //Variable a la que se asigna una Alerta sencilla
  private alert: any;

  /**Respectivamente, variables que determinan si cada una de las alertas estan 
   * activas
   */
  private basica: boolean = false;

  public mensajeAdvertencia:string = "Advertencia";
  public mensajeError:string = "Error";

  /**Constructor del servicio en el que se inyecta el controlador de alertas de ionic
   * y eventos de escucha para el momento de un cierre de sesión inesperado
   */
  constructor(
    public alertCtrl: AlertController,
    public events: Events
  ) {
    this.events.subscribe('closedAlerts', data => {
      try {
        if (this.basica) {
          this.alert.dismiss();
        }
      } catch (error) {
      }
    });
  }

  /**Método necesario para quitar la suscripción al evento */
  ngOnDestroy() {
    this.events.unsubscribe('closedAlerts');
  }

  /**Método utilizado como alerta de éxito o mensaje de éxito  */
  alertaBasica(titulo: string, subtitulo: string, accion: any) {
    if (!this.basica) {
      this.alert = this.alertCtrl.create({
        title: titulo,
        subTitle: subtitulo,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              if (accion != null) {
                accion();
              }
            }
          }
        ]
      });
      this.basica = true;
      this.alert.present();
      this.alert.onDidDismiss(() => {
        this.basica = false;
      })
    }
  }

  /**Método utilizado como alerta normal  */
  alertaNormal(mensaje: string) {
    if (!this.basica) {
      this.basica = true;
      this.alert = this.alertCtrl.create({
        title: `<div class='notificacionError'>
        <div><img class='headerImg' src='assets/imgs/alertas/success.png'/></div>
        <div class='textoTitle'>${mensaje}</div>
        <div>`,
        message: null,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {

            }
          }
        ]
      });
      this.alert.present();
      this.alert.onDidDismiss(res => {
        this.basica = false;
      });
    }
  }

  /**Método utilizado como alerta de validación o cuidado*/
  warnAlert(titulo: string, subtitulo: string, accion: any) {
    if (!this.basica) {
      this.alert = this.alertCtrl.create({
        title: `<div class='notificacionError'>
        <div><img class='headerImg' src='assets/imgs/alertas/warning.png'/></div>
        
        <div>`,
        subTitle: subtitulo,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              if (accion != null) {
                accion();
              }
            }
          }
        ]
      });
      this.basica = true;
      this.alert.present();
      this.alert.onDidDismiss(() => {
        this.basica = false;
      });
    }
  }

  /**Método utilizado como alerta de error*/
  //<div><img class='headerImgSub' src='/assets/icon/icn-regalo.svg'/></div>
  errorAlert(titulo: string, subtitulo: string, accion: any) {
    if (!this.basica) {
      this.alert = this.alertCtrl.create({
        title: titulo == null ?
          `<div class='notificacionError'>
        <div><img class='headerImg' src='assets/imgs/alertas/error.png'/></div>
        
        <div>` : titulo,
        subTitle: subtitulo,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              if (accion != null) {
                accion();
              }
            }
          }
        ]
      });
      this.basica = true;
      this.alert.present();
      this.alert.onDidDismiss(() => {
        this.basica = false;
      });
    }
  }

  /**Alerta genérica de error */
  errorAlertGeneric(error:any) {
    if (!this.basica) {
      this.alert = this.alertCtrl.create({
        title: `<div class='notificacionError'>
        <div><img class='headerImg' src='assets/imgs/alertas/error.png'/></div>
        <div class='textoTitle'>${error}</div>
        <div>`,
        message: null,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
            }
          }
        ]
      });
      this.basica = true;
      this.alert.present();
      this.alert.onDidDismiss(() => {
        this.basica = false;
      });
    }

  }

  public getBasicaAlert(): boolean {
    return this.basica;
  }

  /**Setter's de propiedades de alerta */

  public setBasicaAlert(valor: boolean) {
    this.basica = valor;
  }
}
