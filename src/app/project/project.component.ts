import { Component, OnInit ,Inject} from '@angular/core';
import { ProjectService} from './project.service';

import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {  ActivatedRoute, ParamMap ,Router} from '@angular/router';

import 'rxjs/add/operator/switchMap';
const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;

@Component({
selector: 'app-project',
templateUrl: './project.component.html',
styleUrls: ['./project.component.css'],
providers: [ProjectService],
})
export class ProjectComponent implements OnInit {

states = [
{value: 'state-0', viewValue: 'State1'},
{value: 'state-1', viewValue: 'State2'},
{value: 'state-2', viewValue: 'State3'}
];

rForm:FormGroup;
_id='';
name='';

commandReference='';

plannedAt ='';

deliveredAt ='';

clientPlannedAt='';

clientDeliveredAt ='';

state ='';

estimeBudget ='';
note ='';
clientBudget ='';

budget ='';
constructor(private projectService:ProjectService,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,private router:Router
)
{
  let id = this.route.snapshot.paramMap.get('id');
  if(id != null)
  {
    this._id=id;
    let self=this;
    this.projectService.read((function(data){
        self.setValues(data);
        self.ngOnInit();
    }),this.projectService.handleError,id)
  }
}
ngOnInit() {
  this.rForm=this.formBuilder.group({
  name: [this.name, [
  Validators.required,
  Validators.pattern(NAME_REGEX)]],
  commandReference: ['', [
  Validators.required]],

  plannedAt : [this.plannedAt, [
  Validators.required]],

  deliveredAt :[this.deliveredAt, [
  Validators.required]],

  clientPlannedAt:[this.clientPlannedAt, [
  Validators.required]],

  clientDeliveredAt :[this.clientDeliveredAt, [
  Validators.required]],

  state:[this.state, [
  Validators.required]],

  estimeBudget:[this.estimeBudget, [
  Validators.required]],

  note: [this.note],
  clientBudget :[this.clientBudget, [
  Validators.required]],

  budget : [this.budget, [
  Validators.required]]
  });
}

private setValues(data:any)
{
  this.name=data.name;
  this.note=data.note;
  this.deliveredAt=data.deliveredAt;
  this.plannedAt=data.plannedAt;
  this.commandReference=data.commandReference;
  this.clientBudget=data.clientBudget;
  this.clientPlannedAt=data.clientPlannedAt;
  this.clientDeliveredAt=data.clientDeliveredAt;
  this.estimeBudget=data.estimeBudget;
  this.state=data.state;
  this.budget=data.budget;
}
submitProject(post)
{
  if(this._id=='')
  {
    this.projectService.create(() => {this.router.navigate(['projectList'])},this.projectService.handleError,post);
  }
 else
 {
   post._id=this._id;
   this.projectService.update(() => {this.router.navigate(['projectList'])},this.projectService.handleError,post);
}
}
}
