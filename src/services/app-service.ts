import { AlertaService } from './alerta.service';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, timeout } from 'rxjs/operators';

export const TIME_OUT = 1000 * 60 * 1;
@Injectable()
export class AppService {
    constructor(
        private readonly http: HttpClient,
        private alertaService: AlertaService
        ) {

    }

    getPetition(url: string,params:any=null):any {
        let options:any={
            params:params
        };
        return this.http.get(url,options);
    }

    postPetition(url: string, body: any):any {
        let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
        return this.http.post(url, body,{headers});
    }

    putPetition(url: string, params: any):any {
        return this.http.put(url, params);
    }

    deletePetition(url: string, params: any):any {
        let options:any={
            params:params
        };
        return this.http.delete(url, options);
    }
}