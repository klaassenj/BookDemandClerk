import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExpandableComponent } from '../components/expandable/expandable.component';

import { HomePage } from './home.page';
//import { ComponentsModule } from '../components/components.module';
//import { ComponentsModule } from '../components/components.module';
//import { ExpandableComponent } from '../components/expandable/expandable.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  //entryComponents: [ExpandableComponent],
  declarations: [HomePage, ExpandableComponent]
})
export class HomePageModule {}
