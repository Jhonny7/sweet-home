import { AppService } from './app-service';
import { Injectable } from "@angular/core";
import { paths } from '../utils/paths';

@Injectable()
export class FavoriteService {
    
    constructor(
        private appService:AppService
        ) {
    }

    addFavorite(body:any){
        return this.appService.postPetition(paths.addFavorite,body);
    }

    deleteFavorite(body:any){
        return this.appService.deletePetition(paths.deleteFavorite,body);
    }
}