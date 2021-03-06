import { Component, Input, OnInit } from '@angular/core';
import { InfirmierInterface } from '../dataInterfaces/infirmier';


@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {
  @Input() infirmier: InfirmierInterface;

  constructor() {
  }

  ngOnInit() {
  }

}
