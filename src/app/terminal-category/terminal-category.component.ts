import { Component, OnInit } from '@angular/core';

import {TerminalCategoryService} from './terminal-category.service';

import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {  ActivatedRoute, ParamMap , Router } from '@angular/router';
@Component({
  selector: 'app-terminal-category',
  templateUrl: './terminal-category.component.html',
  styleUrls: ['./terminal-category.component.css'],
  providers : [TerminalCategoryService]
})
export class TerminalCategoryComponent implements OnInit {
types = [
{value: 'type-0', viewValue: 'type1'},
{value: 'type-1', viewValue: 'type2'},
{value: 'type-2', viewValue: 'type3'}

];

  rForm:FormGroup;
  _id='';
  name='';
  Description = '';
  type = '';


  constructor(private TerminalCategoryService : TerminalCategoryService ,
    private FormBuilder : FormBuilder,private route: ActivatedRoute,
    private router : Router 
)
{
  let id = this.route.snapshot.paramMap.get('id');
  if(id != null)
  {
    this._id=id;
    let self=this;
    this.TerminalCategoryService.read((function(data){
        self.setValues(data);
        self.ngOnInit();
    }),this.TerminalCategoryService.handleError,id)
  }
}

  ngOnInit() {
    this.rForm=this.FormBuilder.group({
      name : [
        this.name, [
         Validators.required]
      ],
      Description :[this.Description],
        type : [
            this.type, [
          Validators.required]
        ]
    });
  }
  private setValues(data:any)
  {
    this.name=data.name;
    this.Description=data.Description;
    this.type=data.type;
  }

  addTerminalCategory(post)
      {
        if(this._id=='')
        {
          this.TerminalCategoryService.create(() => {this.router.navigate(['terminalCategoryList'])},this.TerminalCategoryService.handleError,post);
        }
       else
       {
         post._id=this._id;
         this.TerminalCategoryService.update(() => {this.router.navigate(['terminalCategoryList'])},this.TerminalCategoryService.handleError,post);
      }  }

}
