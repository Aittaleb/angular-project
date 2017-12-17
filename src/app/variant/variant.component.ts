import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VariantService } from './variant.service';
import {  ActivatedRoute, ParamMap ,Router } from '@angular/router';
@Component({
  selector: 'app-variant',
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.css'],
  providers: [VariantService]

})
export class VariantComponent implements OnInit {
  _id ='';
  colorValue= '';
  rForm: FormGroup;
  size = '';
  letterSize = '';
  quantity = '';


  constructor(private VariantService: VariantService, private FormBuilder: FormBuilder,private route: ActivatedRoute,private router : Router
){
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null)
    {
      this._id=id;
      let self=this;
      this.VariantService.read((function(data){
          self.setValues(data);
          self.ngOnInit();
      }),this.VariantService.handleError,id)
    }
  }

  ngOnInit() {
    this.rForm = this.FormBuilder.group({
      colorValue:[
           this.colorValue
      ],
      size: [
        this.size, [
          Validators.required
        ]],
      letterSize: [
      this.letterSize, [
          Validators.required
        ]],
      quantity: [this.quantity, [
        Validators.required
      ]]
    })
  }
  private setValues(data:any)
  {
  this.size=data.size;
  this.letterSize=data.letterSize;
  this.colorValue=data.colorValue;
  this.quantity=data.quantity;
  }
  setColor(value) {
    this.colorValue = value;
    this.ngOnInit();
  }

  addVariant(post)
  {
    if(this._id=='')
    {
      this.VariantService.create(() => {this.router.navigate(['variantList'])},this.VariantService.handleError,post);
    }
   else
   {
     post._id=this._id;
     this.VariantService.update((data) => {this.router.navigate(['variantList']),console.log(data)},this.VariantService.handleError,post);
  }  }

}
