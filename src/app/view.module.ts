import { NgModule } from "@angular/core";
import { CreateSuitePageModule } from "../pages/crud-suite/create-suite/create-suite.module";
import { MiSuitesPageModule } from "../pages/crud-suite/mi-suites/mi-suites.module";
import { InquilinoFiltroPageModule } from "../pages/inquilino-filtro/inquilino-filtro.module";
import { LoginPageModule } from "../pages/login/login.module";
import { PresentacionPageModule } from "../pages/presentacion/presentacion.module";
import { PrimerPasoPageModule } from "../pages/primer-paso/primer-paso.module";
import { ScrollHideDirective } from "../directives/scroll-hide.directive";

@NgModule({
    
    imports: [
        PrimerPasoPageModule,
        PresentacionPageModule,
        InquilinoFiltroPageModule,
        LoginPageModule,
        //MiSuitesPageModule,
        //CreateSuitePageModule
    ],
    declarations:[]
})
export class ViewModule { }