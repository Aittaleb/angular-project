import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RawMaterialService } from './raw-material.service';
import {  ActivatedRoute, ParamMap ,Router } from '@angular/router';

const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.css'],
  providers: [RawMaterialService]
})
export class RawMaterialComponent implements OnInit {

  rForm: FormGroup;
  _id ='';
  name = '';
  reference = '';
  description = '';

  constructor(private RawMaterialService: RawMaterialService,
    private FormBuilder: FormBuilder,private route: ActivatedRoute,private router : Router
  ){
      let id = this.route.snapshot.paramMap.get('id');
      if(id != null)
      {
        this._id=id;
        let self=this;
        this. RawMaterialService.read((function(data){
            self.setValues(data);
            self.ngOnInit();
        }),this. RawMaterialService.handleError,id)
      }
  }


    private setValues(data:any)
    {
    this.reference=data.reference;
    this.name=data.name;
    this.description=data.description;
    }

  ngOnInit() {
    this.rForm = this.FormBuilder.group({
      reference: [
        this.reference, [
          Validators.required]
      ],
      name: [
        this.name, [
          Validators.required,
          Validators.pattern(NAME_REGEX)]
      ],
      description: [this.description]
    });
  }

  addRawMaterial(post) {
    if (this._id == '') {
      this.RawMaterialService.create(() => { this.router.navigate(['rawMaterialList']) }, this.RawMaterialService.handleError, post);
    }
    else {
      post._id = this._id;
      this.RawMaterialService.update(() => { this.router.navigate(['rawMaterialList']) }, this.RawMaterialService.handleError, post);
    }

  }

}
