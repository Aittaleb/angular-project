import { Component, OnInit } from '@angular/core';

 import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';

import {ProductService} from './product.service';
import {  ActivatedRoute, ParamMap ,Router} from '@angular/router';


const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers : [ProductService]
})
export class ProductComponent implements OnInit {

  rForm:FormGroup;
  _id ='';
  name='';

  styleReference  = '';

  quantity = '';

  description  = '';

  constructor(private ProductService : ProductService ,
    private  FormBuilder : FormBuilder ,
    private route: ActivatedRoute,
    private router : Router
  )
  {
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null)
    {
      this._id=id;
      let self=this;
      this.ProductService.read((function(data){
          self.setValues(data);
          self.ngOnInit();
      }),this.ProductService.handleError,id)
    }
  }

  ngOnInit() {
    this.rForm=this.FormBuilder.group({
      name : [
        this.name, [
    Validators.required,
    Validators.pattern(NAME_REGEX)]
      ],
     description :[this.description],
      styleReference : [
        this.styleReference, [
    Validators.required]
      ],

      quantity : [
        this.quantity, [
    Validators.required]
      ]

    });
  }
   private setValues(data:any)
   {
     this.name=data.name;
     this.quantity=data.quantity;
     this.styleReference=data.styleReference;
     this.description=data.description;
   }
addProduct(post)
{
  if(this._id=='')
  {
    this.ProductService.create(() => {this.router.navigate(['productList'])},this.ProductService.handleError,post);
  }
 else
 {
   post._id=this._id;
   this.ProductService.update(() => {this.router.navigate(['productList'])},this.ProductService.handleError,post);
}}

}
