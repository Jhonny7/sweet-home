import { paths } from './../utils/paths';
import { AppService } from './app-service';
import { Platform } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { catalogos } from '../utils/catalogos';

@Injectable()
export class LoginService {

  constructor(
    public http: HttpClient,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private appService: AppService) {
    console.log('Hello LoginServiceProvider Provider');
  }

  public googleLogin(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this.googlePlus.login({
        'scopes': '',
        'webClientId': this.platform.is("ios") ? catalogos.googleWebClientIdIos : catalogos.googleWebClientIdAndroid,
        'offline': true
      }).then(res => {
        // call your backend api here
        console.log("bien cbrn bn");
        
        console.log(res);

        resolve(res);
      }, err => {
        console.log("mal cbrn mal 1");
        console.log(err);
        //this.helper.showError(err);  
        reject(err);
      });
    }).catch(err => {
      console.log("mal cbrn mal 2");
      console.log(err);

    });
  }

  public createUser(userParams:any){
     return this.appService.postPetition(paths.createUser,userParams);
  }

  public getUser(params:HttpParams){
    return this.appService.getPetition(paths.getUser,params);
  }

  public createUserTemporal(userParams:any){
    return this.appService.postPetition(paths.createUserTemporal,userParams);
 }
}
