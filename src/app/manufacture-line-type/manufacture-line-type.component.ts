import { Component, OnInit } from '@angular/core';
import {ManufactureLineTypeService} from './manufacture-line-type.service'
import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {  ActivatedRoute, ParamMap , Router} from '@angular/router';

const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;


@Component({
  selector: 'app-manufacture-line-type',
  templateUrl: './manufacture-line-type.component.html',
  styleUrls: ['./manufacture-line-type.component.css'],
  providers : [ManufactureLineTypeService]
})
export class ManufactureLineTypeComponent implements OnInit {


  rForm:FormGroup;
  _id ='';
  name='';
  description = '';
  minEffective = '';
  maxEffective = '';


  constructor(private ManufactureLineTypeService : ManufactureLineTypeService , private FormBuilder : FormBuilder ,
    private route: ActivatedRoute,private router : Router 
    )
    {
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null)
    {
      this._id=id;
      let self=this;
      this.ManufactureLineTypeService.read((function(data){
          self.setValues(data);
          self.ngOnInit();
      }),this.ManufactureLineTypeService.handleError,id)
    }
    }

  ngOnInit() {
    this.rForm=this.FormBuilder.group({
      name : [
        this.name, [
    Validators.required,
    Validators.pattern(NAME_REGEX)]
      ],
    minEffective : [
      this.minEffective, [
    Validators.required]
    ],
    description :[this.description],
  maxEffective : [
    this.maxEffective, [
    Validators.required]
  ]
    });
  }
  private setValues(data:any)
  {
    this.name=data.name;
    this.minEffective=data.minEffective;
    this.maxEffective=data.maxEffective;
    this.description=data.description;

  }
addManufactureLineType(post)
{

if (this._id == '') {
  this.ManufactureLineTypeService.create(() => {this.router.navigate(['manufactureLineTypeList'])}, this.ManufactureLineTypeService.handleError, post);
}
else {
  post._id = this._id;
  this.ManufactureLineTypeService.update(() => {this.router.navigate(['manufactureLineTypeList'])}, this.ManufactureLineTypeService.handleError, post);
}


}

}
