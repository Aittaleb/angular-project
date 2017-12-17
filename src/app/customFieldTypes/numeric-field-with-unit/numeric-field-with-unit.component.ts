import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-numeric-field-with-unit',
  templateUrl: './numeric-field-with-unit.component.html',
  styleUrls: ['./numeric-field-with-unit.component.css']
})
export class NumericFieldWithUnitComponent implements OnInit {
  constructor(private parametersService : ParametersService) { }
  
    units = [
      'Kg',
      'm',
      'm2',
      'tons',
      'miles',
      'days'
    ];

    butdisabled : boolean = false;
    data : MyType = {};

    ngOnInit() {
    }

    set(event : any){
      var key = event.target.name;

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
          
          onChange(val) {
            this.data.unit = val;  
          }
          
          action(){
            this.butdisabled=true;
            this.parametersService.parameterEdited.emit(this.data);
  }
  
  }

  interface MyType {
    [key: string]: any
  }
  
