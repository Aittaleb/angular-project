import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CustomerService} from './customer.service';
import { FormBuilder, FormGroup,FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  ActivatedRoute, ParamMap,Router } from '@angular/router';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const NAME_REGEX = /^[a-zA-Z]*$/;

const PHONE_REGEX = /^[5-6][0-9]+$/;



@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers : [CustomerService]
})
export class CustomerComponent implements OnInit {

  rForm : FormGroup ;
  _id='';
  fullname = '';
  company_Name = '';
  email = '';
  phone = '';
  address = '';

  constructor(private CustomerService: CustomerService
    , private FormBuilder : FormBuilder,
    private route: ActivatedRoute,private router :Router)
    {
      let id = this.route.snapshot.paramMap.get('id');
      if(id != null)
      {
        this._id=id;
        let self=this;
        this.CustomerService.read((function(data){
          self.setValues(data);
          self.ngOnInit();
        }),this.CustomerService.handleError,id)
      }}


      addCustomer(post)
      {
        if(this._id=='')
        {
          this.CustomerService.create(( () => {this.router.navigate(['customerList'])}),this.CustomerService.handleError,post);
        }
        else
        {
          post._id=this._id;
          this.CustomerService.update(( () => {this.router.navigate(['customerList'])}),this.CustomerService.handleError,post);
        }
      }

        ngOnInit()
        {
          this.rForm = this.FormBuilder.group({

            fullname : [
              'this.fullname', [
                Validators.required,
                Validators.pattern(NAME_REGEX)]
              ],

              company_Name : [
                'this.company_Name', [
                  Validators.required,
                  Validators.pattern(NAME_REGEX)]
                ],

                email : [
                  'this.email', [
                    Validators.required,
                    Validators.pattern(EMAIL_REGEX)]
                  ],

                  phone : [
                    'this.phone', [
                      Validators.required,
                      Validators.pattern(PHONE_REGEX)]
                    ],

                    address : [
                      'this.address', [
                        Validators.required,
                        Validators.pattern(PHONE_REGEX)]
                      ]

                    });

                  }

                  private setValues(data:any)
                  {
                    this.fullname=data.fullname;
                    this.address=data.address;
                    this.phone=data.phone;
                    this.company_Name=data.company_Name;
                    this.email=data.email;

                  }
                }
