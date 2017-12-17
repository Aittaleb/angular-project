import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../custom-fields/field-type-parameters.service';


@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.css']
})
export class RichTextComponent implements OnInit {

  data : MyType = {};
  butdisabled : boolean = false;

  constructor(private parametersService : ParametersService) { }

  ngOnInit() {
  }



  set(event: any) {
    var key = event.target.name;

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

   this.parametersService.parameterEdited.emit(this.data);
   this.butdisabled = true;
  }



}


interface MyType {
  [key: string]: any
}
