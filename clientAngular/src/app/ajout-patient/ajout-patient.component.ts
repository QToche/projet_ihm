import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../dataInterfaces/patient';
import { CabinetMedicalService } from '../cabinet-medical.service';
import { NgForm } from '@angular/forms';
import { sexeEnum } from '../dataInterfaces/sexe';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { CabinetInterface } from '../dataInterfaces/cabinet';

@Component({
  selector: 'app-ajout-patient',
  templateUrl: './ajout-patient.component.html',
  styleUrls: ['./ajout-patient.component.css']
})
export class AjoutPatientComponent implements OnInit {

  
  private _cms: CabinetInterface;
  public get cms(): CabinetInterface { return this._cms; }
  
  // j'initialise un patient "vide"
  private patient : PatientInterface = {
    prenom: '',
    nom: '',
    sexe: sexeEnum.M,
    numeroSecuriteSociale: '',
    adresse: {
      ville: '',
      codePostal: 0,
      rue: '',
      numero: '',
      etage: ''
    }
  }
  constructor(private cabinet : CabinetMedicalService, private http: HttpClient) {
    this.initCabinet(cabinet);

  }

  ngOnInit() {
  }

  
  async initCabinet(cabinetMedicalService) {
    this._cms = await cabinetMedicalService.getData('/data/cabinetInfirmier.xml');
  }

  public async addPatient(patient: PatientInterface): Promise<PatientInterface> {
    const res = await this.http.post('/addPatient', {
      patientName: patient.nom,
      patientForname: patient.prenom,
      patientSex: patient.sexe === sexeEnum.M ? 'M' : 'F',
      patientBirthday: 'AAAA-MM-JJ',
      patientNumber: patient.numeroSecuriteSociale,
      patientFloor: patient.adresse.etage,
      patientStreetNumber: patient.adresse.numero,
      patientStreet: patient.adresse.rue,
      patientCity: patient.adresse.ville,
      patientPostalCode: patient.adresse.codePostal
    }, { observe: 'response' }).toPromise<HttpResponse<any>>();

    console.log('Add patient renvoie', res);
    if (res.status === 200) {
        // OK on peut ajouter en local
        this._cms.patientsNonAffectes.push( patient );
    }
    return null;
  }

  onSubmit(form: NgForm) {
    this.patient.prenom = form.value['newPrenomPatient'];
    this.patient.nom = form.value['newNomPatient'];
    this.patient.numeroSecuriteSociale = form.value['newNumSecuPatient'];
    this.patient.adresse.codePostal = form.value['newCodePostalPatient'];
    this.patient.adresse.numero = form.value['newNumRuePatient'];
    this.patient.adresse.rue = form.value['newRuePatient'];
    this.patient.adresse.ville = form.value['newVillePatient'];
    this.patient.adresse.etage = form.value['newEtagePatient'];
    console.log(this.patient);
    this.addPatient(this.patient);
    form.reset();
  }
}
