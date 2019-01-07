import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CabinetMedicalService } from '../cabinet-medical.service';
import { InfirmierInterface } from '../dataInterfaces/infirmier';
import { PatientInterface } from '../dataInterfaces/patient';
import { CabinetInterface } from '../dataInterfaces/cabinet';

@Component({
  selector: 'app-infirmier-detail',
  templateUrl: './infirmier-detail.component.html',
  styleUrls: ['./infirmier-detail.component.css']
})
export class InfirmierDetailComponent implements OnInit {

  private _cms: CabinetInterface;
  public get cms(): CabinetInterface { return this._cms; }

  private _infirmier: InfirmierInterface;
  private patientClick: PatientInterface;

  private afficherInfirmier: boolean = false;
  private afficherPatient: boolean = false;

  private numSecuInfo;
  
  private infirmiers;

  constructor(private route: ActivatedRoute,
    private cabinetMedicalService: CabinetMedicalService,
    private location: Location) {
      this.initCabinet(cabinetMedicalService);
  }

  ngOnInit() {
  }

  async initCabinet(cabinetMedicalService) {
    this._cms = await cabinetMedicalService.getData('/data/cabinetInfirmier.xml');
    console.log( this.cms );
    this._infirmier = this._cms.infirmiers[+this.route.snapshot.paramMap.get('id') - 1];
    this.infirmiers = this._cms.infirmiers;
    this.afficherInfirmier = true;
    if(this._infirmier.patients.length > 0) {
      this.afficherPatient = true;
    }
  }

  private assignerPatient(patient: PatientInterface) {
    this.patientClick = patient;
  }

  private desaffecterPatient(patient: PatientInterface) {
    if(this.cabinetMedicalService.desaffecterPatient(patient.numeroSecuriteSociale))
      window.location.reload();
  }

  private affecterPatient(patient: PatientInterface, value) {
    if(value !== undefined) {
      this.cabinetMedicalService.affecterPatient(value,patient);
    }
  }

}
