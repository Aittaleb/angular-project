import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {ProcessService } from './process.service';
import {  ActivatedRoute, ParamMap ,Router} from '@angular/router';
@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css'],
  providers : [ProcessService]

})
export class ProcessComponent implements OnInit {
states = [
    {value: 'State-0', viewValue: 'State1'},
    {value: 'State-1', viewValue: 'State2'},
    {value: 'State-2', viewValue: 'State3'}
  ];

  rForm:FormGroup;
  _id ='';
  name='';
  state ='';
 Description = '';
 buildingData = '';
 buildingImage ='';
  constructor(private ProcessService : ProcessService , private FormBuilder : FormBuilder ,
      private route: ActivatedRoute, private router : Router
  )
  {
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null)
    {
      this._id=id;
      let self=this;
      this.ProcessService.read((function(data){
          self.setValues(data);
          self.ngOnInit();
      }),this.ProcessService.handleError,id)
    }
  }
  ngOnInit() {
    this.rForm=this.FormBuilder.group({
      name : [
          this.name, [
  Validators.required]
      ],
      state : [
        this.state, [
  Validators.required]
],
Description :[this.Description],
buildingImage :[this.buildingImage],
buildingData:[this.buildingData]
    });
  }
  private setValues(data:any)
  {
    this.name=data.name;
    this.state=data.state;
    this.Description=data.Description;
    this.buildingData=data.buildingData;
    this.buildingImage=data.buildingImage;
  }
addProcess(post)
{
  if(this._id=='')
  {
    this.ProcessService.create(() => {this.router.navigate(['processList'])},this.ProcessService.handleError,post);
  }
 else
 {
   post._id=this._id;
   this.ProcessService.update(() => {this.router.navigate(['processList'])},this.ProcessService.handleError,post);
}}

}
