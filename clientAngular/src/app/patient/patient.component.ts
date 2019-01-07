import {Component, Input, OnInit} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {PatientInterface} from '../dataInterfaces/patient';
import {InfirmierInterface} from "../dataInterfaces/infirmier";
import { sexeEnum } from '../dataInterfaces/sexe';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  @Input() patient: PatientInterface;
  @Input() infirmiers;

  private infirmierId = '000';

  constructor(private cabinet : CabinetMedicalService) { 
  }

  ngOnInit(): void {
    console.log(this.infirmiers);
  }

  changeInf(event){
    this.infirmierId = event.value;
    console.log(this.infirmierId); 
  }

  affecterPatient(lePatient : PatientInterface) {
    if (this.infirmierId !== '000'){
      this.cabinet.affecterPatient(this.infirmierId,lePatient)
      window.location.reload();
    }
  }



}
