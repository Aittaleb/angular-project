import { Component, OnInit } from '@angular/core';
import {ParametersService} from '../../custom-fields/field-type-parameters.service';

@Component({
  selector: 'app-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.css']
})
export class YesNoComponent implements OnInit {

  default = '';

  constructor(private parametersService : ParametersService ) { }

  ngOnInit() {
  }

  set()
  {
    var key='default';
    var value=this.default;
    this.parametersService.parameterEdited.emit({key,value});
  }
  
  

}
