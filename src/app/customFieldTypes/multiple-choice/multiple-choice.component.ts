import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.css']
})
export class MultipleChoiceComponent implements OnInit {

  defaultChoices = [];
  minchecked: number;
  maxChecked: number;

  data: MyType = {};

  butdisabled: boolean = false;


  ngOnInit() {

  }

  choices = [];

  constructor(private parametersService: ParametersService) { }



  addChoice(name: string): void {

    if (!name) { return; }
    name = name.trim();
    this.choices.push(name);

  }

  deleteChoice(name: string): void {
    name = name.trim();
    if (!name) { return; }
    else {
      let index: number = this.choices.indexOf(name);
      if (index !== -1) {
        this.choices.splice(index, 1);
      }
    }

  }

  setChoices() {
  this.data.choices = this.choices;
  }

  set(event: any) {
    var key = event.target.name;

    switch (key) {

      case 'minChecked':
        this.data.minChecked = event.target.value;
        break;

      case 'maxcheched':
        this.data.maxchecked = event.target.value;
        break;
    }



  }

  action() {
    this.setChoices();
   this.parametersService.parameterEdited.emit(this.data);
   this.butdisabled = true;
  }



}


interface MyType {
  [key: string]: any
}
