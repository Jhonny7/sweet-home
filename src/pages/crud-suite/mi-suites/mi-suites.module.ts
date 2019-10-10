import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MiSuitesPage } from './mi-suites';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MiSuitesPage,
    
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(MiSuitesPage),
  ],
})
export class MiSuitesPageModule {}
