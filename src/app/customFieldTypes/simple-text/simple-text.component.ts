import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-simple-text',
  templateUrl: './simple-text.component.html',
  styleUrls: ['./simple-text.component.css'],

})
export class SimpleTextComponent implements OnInit {

  rForm: FormGroup;
  _id = '';
  defaultValue = '';
  minCharacters = '';
  maxCharacters = '';
  data: MyType = {};

  butdisabled : boolean = false;

  constructor(private FormBuilder: FormBuilder, private parametersService: ParametersService) {

  }


  ngOnInit() {

  }

  set(event: any) {
    var key = event.target.name;
    var value = event.target.value;


    switch (key) {

      case 'defaultValue':
        this.data.defaultValue = event.target.value;
        break;

      case 'minCharacters':
        this.data.minCharacters = event.target.value;
        break;


      case 'maxCharacters':
        this.data.maxCharacters = event.target.value;
        break;
    }

    
  }


  action() {
    this.butdisabled = true;
  this.parametersService.parameterEdited.emit(this.data);

  }

}

interface MyType {
  [key: string]: any
}

