import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-amount-with-currency',
  templateUrl: './amount-with-currency.component.html',
  styleUrls: ['./amount-with-currency.component.css']
})
export class AmountWithCurrencyComponent implements OnInit {

  constructor(private parametersService: ParametersService) { }

  currencies = [
    '$',
    'Euros',
    'Yen',
    'DH',
    '£'
  ];
  defaultValue: String;
  minValue: String;
  maxValue: String;
 

  selectedCurrency = '';


  flag: boolean = false;
  butdisabled : boolean = false ;

  data: MyType = {};

  ngOnInit() {
  }

  set(event: any) {

    this.flag = (this.data.defaultValue != undefined &&
      this.data.minValue != undefined &&
      this.data.maxValue != undefined && this.data.selectedCurrency != undefined) ? true : false;

     
  
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

    this.flag = (this.data.defaultValue != undefined &&
      this.data.minValue != undefined &&
      this.data.maxValue != undefined && this.data.selectedCurrency != undefined) ? true : false;

  }

  submit() {

    if(this.flag)
{
    console.log(this.data);
    console.log(this.data.defaultValue, this.data.minValue, this.data.maxValue, this.data.selectedCurrency, this.flag);}
  else
    console.log('mazal');
}

action()
{
  
  this.parametersService.parameterEdited.emit(this.data) ;
  this.butdisabled=true;
  }

  setSelect(event: any) {
    var key = "currency";
    var value = this.selectedCurrency;
    this.data.selectedCurrency = this.selectedCurrency;
    this.flag && this.submit();

  }

}

interface MyType {
  [key: string]: any
}

