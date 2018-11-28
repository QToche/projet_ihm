import {Component, Input, OnInit} from '@angular/core';
import {InfirmierInterface} from '../dataInterfaces/infirmier';

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {
  @Input() data: InfirmierInterface;

  constructor() { }

  ngOnInit() {
  }

  getPrenom() {
    return this.data.prénom;
  }
}
