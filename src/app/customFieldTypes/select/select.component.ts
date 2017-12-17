import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  defaultSelect: string;
  data: MyType = {};
  ngOnInit() {

  }

  selects = [];

  constructor(private parametersService: ParametersService) { }


  addSelect(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.selects.push(name);

  }

  deleteSelect(name: string): void {
    name = name.trim();
    if (!name) { return; }
    else {
      this.defaultSelect = (name === this.defaultSelect) ? '' : this.defaultSelect;
      let index: number = this.selects.indexOf(name);
      if (index !== -1) {
        this.selects.splice(index, 1);
      }
    }

  }

  setSelects() {

    var key = 'radios';
    var value = this.selects;
    this.data.selects = this.selects;
    this.parametersService.parameterEdited.emit(this.data);

  }


}

interface MyType {
  [key: string]: any
}

