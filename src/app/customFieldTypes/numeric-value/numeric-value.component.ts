import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-numeric-value',
  templateUrl: './numeric-value.component.html',
  styleUrls: ['./numeric-value.component.css']
})
export class NumericValueComponent implements OnInit {

  constructor(private parametersService : ParametersService) { }
  data : MyType = {};
  ngOnInit() {
  }

  set(event : any)
  {
    var key= event.target.name;
    switch (key) {
      
            case 'defaultValue':
              this.data.defaultValue = event.target.value;
              break;
      
            case 'minValue':
              this.data.minValue = event.target.value;
              break;
      
            case 'maxValue':
              this.data.maxValue = event.target.value;
              break;
          }
      
  
  }

  butdisabled : boolean = false;

  
    action() {
  
     this.parametersService.parameterEdited.emit(this.data);
     this.butdisabled = true;
    }
  
  
  
  }
  
  
  interface MyType {
    [key: string]: any
  }
  