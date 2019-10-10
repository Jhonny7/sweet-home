import { Injectable } from "@angular/core";
import { AppService } from "./app-service";
import { paths } from "../utils/paths";

@Injectable()
export class SuiteService {

    constructor(
        private appService: AppService
    ) {
    }

    public createSuite(userParams:any){
        return this.appService.postPetition(paths.createSuite,userParams);
     }
}