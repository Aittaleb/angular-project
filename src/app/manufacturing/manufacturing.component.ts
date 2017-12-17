import { Component, OnInit } from '@angular/core';
import {ManufacturingService} from './manufacturing.service';
import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {  ActivatedRoute, ParamMap ,Router} from '@angular/router';

@Component({
selector: 'app-manufacturing',
templateUrl: './manufacturing.component.html',
styleUrls: ['./manufacturing.component.css'],
providers : [ManufacturingService]
})
export class ManufacturingComponent implements OnInit {
    rForm:FormGroup;
    _id ='';
    input = '';
    output = '';
    savedAt = '';
    releasedAt = '';
    state = '';
    note = '';

constructor(private ManufacturingService : ManufacturingService ,
  private FormBuilder : FormBuilder, private route: ActivatedRoute,private router :Router
)
{
  let id = this.route.snapshot.paramMap.get('id');
  if(id != null)
  {
    this._id=id;
    let self=this;
    this.ManufacturingService.read((function(data){
        self.setValues(data);
        self.ngOnInit();
    }),this.ManufacturingService.handleError,id)
  }
}

ngOnInit() {
  this.rForm=this.FormBuilder.group({
      input : [
          this.input, [
          Validators.required]
      ],
      output : [
              this.output, [
          Validators.required]
      ],
      savedAt : [
          this.savedAt, [
              Validators.required]
      ],
      releasedAt : [
          this.releasedAt, [
          Validators.required]
      ],
      state : [
          this.state, [
          Validators.required]
      ],
      note :[this.note]

  });
}
private setValues(data:any)
{

  this.savedAt=data.savedAt;
  this.releasedAt=data.releasedAt;
  this.state=data.state;
  this.note=data.note;
  this.input=data.input;
  this.output=data.output;
  this.note=data.note;
}

addManufacturing(post)
{
  if(this._id=='')
  {
    this.ManufacturingService.create(() =>{this.router.navigate(['manufacturinglist'])},this.ManufacturingService.handleError,post);
  }
 else
 {
   post._id=this._id;
   this.ManufacturingService.update(() =>{this.router.navigate(['manufacturinglist'])},this.ManufacturingService.handleError,post);
}}

}
