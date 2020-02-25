import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminPage } from './admin.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AngularFireModule } from '@angular/fire'
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forChild(routes)
  ],
  declarations: [AdminPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminPageModule {}
