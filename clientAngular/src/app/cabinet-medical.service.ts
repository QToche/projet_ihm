import { Injectable } from '@angular/core';
import { CabinetInterface } from './dataInterfaces/cabinet';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Adresse } from './dataInterfaces/adresse';
import { InfirmierInterface } from "./dataInterfaces/infirmier";
import { PatientInterface } from "./dataInterfaces/patient";
import { sexeEnum } from "./dataInterfaces/sexe";

@Injectable({
  providedIn: 'root'
})
export class CabinetMedicalService {


  constructor(private http: HttpClient) {
  }

  async getData(url: string): Promise<CabinetInterface> {
    // get HTTP response as text
    const response = await this.http.get(url, { responseType: 'text' }).toPromise();

    // parse the response with DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, 'application/xml');

    // if no doc, exit
    if (!doc) {
      return null;
    }

    // default cabinet
    const cabinet: CabinetInterface = {
      infirmiers: [],
      patientsNonAffectes: [],
      adresse: this.getAdressFrom(doc.querySelector('cabinet'))
    };

    // 1 - tableau des infirmiers
    const infirmiersXML = Array.from(doc.querySelectorAll('infirmiers > infirmier')); // transformer la NodeList en tableau pour le map

    cabinet.infirmiers = infirmiersXML.map(I => ({
      id: I.getAttribute('id'),
      prenom: I.querySelector('prenom').textContent,
      nom: I.querySelector('nom').textContent,
      photo: I.querySelector('photo').textContent,
      adresse: this.getAdressFrom(I),
      patients: []
    }));

    // 2 tableau des patients
    const patientsXML = Array.from(doc.querySelectorAll('patients > patient'));
    const patients: PatientInterface[] = patientsXML.map(P => ({
      prenom: P.querySelector('prenom').textContent,
      nom: P.querySelector('nom').textContent,
      sexe: P.querySelector('sexe').textContent === 'M' ? sexeEnum.M : sexeEnum.F,
      numeroSecuriteSociale: P.querySelector('numero').textContent,
      adresse: this.getAdressFrom(P)
    }));

    // 3 Tableau des affectations à faire.
    const affectations = patientsXML.map((P, i) => {
      const visiteXML = P.querySelector('visite[intervenant]');
      let infirmier: InfirmierInterface = null;
      if (visiteXML !== null && visiteXML.getAttribute('intervenant') !== "") {
        infirmier = cabinet.infirmiers.find(I => I.id === visiteXML.getAttribute('intervenant'));
      }
      return { patient: patients[i], infirmier: infirmier };
    });

    // 4 Realiser les affectations
    affectations.forEach(({ patient: P, infirmier: I }) => {
      if (I !== null) {
        I.patients.push(P);
      } else {
        cabinet.patientsNonAffectes.push(P);
      }
    });

    // Return the cabinet
    return cabinet;
  }

  private getAdressFrom(root: Element): Adresse {
    let node: Element;
    return {
      ville: (node = root.querySelector('adresse > ville')) ? node.textContent : '',
      codePostal: (node = root.querySelector('adresse > codePostal')) ? +node.textContent : 0,
      rue: (node = root.querySelector('adresse > rue')) ? node.textContent : '',
      numero: (node = root.querySelector('adresse > numero')) ? node.textContent : '',
      etage: (node = root.querySelector('adresse > etage')) ? node.textContent : '',
    };
  }


  public async addPatient(patient: PatientInterface): Promise<PatientInterface> {
    const res = await this.http.post('/addPatient', {
      patientName: patient.nom,
      patientForname: patient.prenom,
      patientNumber: patient.numeroSecuriteSociale,
      patientSex: patient.sexe === sexeEnum.M ? 'M' : 'F',
      patientBirthday: 'AAAA-MM-JJ',
      patientFloor: patient.adresse.etage,
      patientStreetNumber: patient.adresse.numero,
      patientStreet: patient.adresse.rue,
      patientPostalCode: patient.adresse.codePostal,
      patientCity: patient.adresse.ville
    }, { observe: 'response' }).toPromise<HttpResponse<any>>();

    console.log('Add patient renvoie', res);
    // if (res.status === 200) {
    //     // OK on peut ajouter en local
    //     this.cabinet.patientsNonAffectes.push( patient );
    // }
    return null;
  }
  

  async affecterPatient(infirmierId, patient : PatientInterface) {
    const res = await this.http.post( "/affectation", {
        infirmier: infirmierId,
        patient: patient.numeroSecuriteSociale
    }, {observe: 'response'}).toPromise<HttpResponse<any>>();

    console.log("affecter patient renvoie", res);
  }

  async desaffecterPatient(numSecu) {
    const res = await this.http.post( "/affectation", {
        infirmier: "none",
        patient: numSecu
    }, {observe: 'response'}).toPromise<HttpResponse<any>>();
    console.log("desaffecter patient renvoie", res);
  }
}