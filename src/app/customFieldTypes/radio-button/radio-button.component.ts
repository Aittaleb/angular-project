import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent implements OnInit {
  defaultRadio: string;
  ngOnInit() {

  }

  data: MyType = {};
  butdisabled: boolean = false;


  radios = [];

  constructor(private parametersService: ParametersService) { }

  ngOnIniradiost() {
  }

  addRadio(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.radios.push(name);

  }

  deleteRadio(name: string): void {
    name = name.trim();
    if (!name) { return; }
    else {
      this.defaultRadio = (name === this.defaultRadio) ? '' : this.defaultRadio;
      let index: number = this.radios.indexOf(name);
      if (index !== -1) {
        this.radios.splice(index, 1);
      }
    }

  }

  setRadios() {
    var value = this.radios;
    this.data.radios = this.radios;
    this.parametersService.parameterEdited.emit(this.data);
    this.butdisabled = true;

  }





}


interface MyType {
  [key: string]: any
}
