import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecretaryComponent } from './secretary/secretary.component';
import { AjoutPatientComponent } from './ajout-patient/ajout-patient.component';
import { InfirmierDetailComponent } from './infirmier-detail/infirmier-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/secretary', pathMatch: 'full' }, //route par défaut
  { path: 'secretary', component: SecretaryComponent },
  { path: 'ajout-patient', component: AjoutPatientComponent },
  { path: 'detail/:id', component: InfirmierDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
