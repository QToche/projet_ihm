import { Component, OnInit } from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})
export class SecretaryComponent implements OnInit {

  private _cms: CabinetInterface;
  public get cms(): CabinetInterface { return this._cms; }
  private afficherInfirmier : Boolean = false;
  private afficherPatient : Boolean = false;
  constructor(cabinetMedicalService: CabinetMedicalService ) {
    this.initCabinet(cabinetMedicalService)
  }

  ngOnInit() {
  }

  async initCabinet(cabinetMedicalService) {
    this._cms = await cabinetMedicalService.getData('/data/cabinetInfirmier.xml');
    this.afficherInfirmier = true;
    if(this._cms.patientsNonAffectes.length > 0) {
      this.afficherPatient = true;
    }
  }

}

