import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InquilinoFiltroPage } from './inquilino-filtro';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    InquilinoFiltroPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(InquilinoFiltroPage),
  ],
})
export class InquilinoFiltroPageModule {}
