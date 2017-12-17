import { Component, OnInit, Input} from '@angular/core';
import {FormControl , FormBuilder, FormGroup,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Validators} from '@angular/forms';
import { ParametersService } from './field-type-parameters.service';

import {  ActivatedRoute, ParamMap ,Router} from '@angular/router';
import {CustomFieldService} from './custom-fields.service';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css'],
  providers: [CustomFieldService]

})



export class CustomFieldsComponent implements OnInit {

   FieldTypeParameters : Object ;
  rForm:FormGroup;
  _id = '';
  fieldType='';
  fieldName = '';
  fieldCode='';
  description='';
  required='false';
  selectedType = '';
  buDisabled : boolean = false;



  constructor(private FormBuilder : FormBuilder ,
     private parametersService : ParametersService,
     private customFieldService: CustomFieldService
     , private route: ActivatedRoute,
      private router: Router) {
        let id = this.route.snapshot.paramMap.get('id');
        if (id != null) {
          this._id = id;
          let self = this;
          this.customFieldService.read((function (data) {
            self.setValues(data);
            self.ngOnInit();
          }), this.customFieldService.handleError, id)
        }

       }

      private setValues(data: any) {

        this.fieldType=data.fieldType;
        this.fieldName = data.fieldName;
        this.fieldCode=data.fieldCode;
        this.description=data.description;
        this.required=data.required;
        this.selectedType = data.selectedType;

      }



  types = [
     'simpleText',
     'radioButton',
     'multipleChoice',
     'richText',
    'numericValue',
    'select',
    'amount with currency',
    'numeric field with unit',
    'date'
    ,'Yes/No'
  ];


  ngOnInit() {
    this.rForm=this.FormBuilder.group({
      fieldType: [
        this.fieldType, [
          Validators.required]
      ],
      fieldName: [
        this.fieldName, [
          Validators.required]
      ],
      fieldCode : [
        this.fieldCode , [
          Validators.required
        ]
      ],
      description : [
        this.description , [
          Validators.required
        ]
      ],
      required : [
        'this.required' , [
          Validators.required
        ]
      ]
    });

    this.parametersService.parameterEdited.subscribe(
      (data) => {
        this.parametersService.setParameters(data);
        this.buDisabled=true;
      }
    );


  }

  addCustomField(post){
   console.log("hhhhh");
    this.FieldTypeParameters = this.parametersService.getParameters();

   var data = {
    _id:post._id,
    description : post.description,
    fieldCode : post.fieldCode,
    fieldName : post.fieldName,
    fieldType : post.fieldType,
    required : post.required,
     fieldTypeParameter : this.FieldTypeParameters
   }
   console.log(data)

     if (this._id == '') {
      this.customFieldService.create(() => { this.router.navigate(['customFieldList']) }, this.customFieldService.handleError, data);
    }
    else {
      console.log(post._id);
      console.log(data._id);
      data._id = this._id;
      this.customFieldService.update(() => { this.router.navigate(['customFieldList']) }, this.customFieldService.handleError, data);
    }



  }

}
