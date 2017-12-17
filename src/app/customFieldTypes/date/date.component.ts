import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {

  minD='';
  maxD='';

  butdisabled : boolean = false;

  data : MyType = {};

  constructor(private parametersService : ParametersService) { }

  ngOnInit() {
  }

  

  setMinDate()
  {
    console.log("sdf");
  }

  setMaxDate()
  {
    console.log(this.maxD);
  }

  

}

interface MyType {
  [key: string]: any
}
