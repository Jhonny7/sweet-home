import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateSuitePage } from './create-suite';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollHideDirective } from '../../../directives/scroll-hide.directive';


@NgModule({
  declarations: [
    CreateSuitePage
  ],
  imports: [
    TranslateModule,
    ,
    IonicPageModule.forChild(CreateSuitePage),
  ],
})
export class CreateSuitePageModule {}
