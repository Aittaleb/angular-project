import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import { EmployeeService } from './employee.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';




import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const NAME_REGEX = /^[a-zA-Z]*$/;

const PHONE_REGEX = /^[5-6][0-9]+$/;

const DATE_REGEX = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService]
})
export class EmployeeComponent implements OnInit {

  stateCtrl: FormControl;
  filteredStates: any;

  states = [
    { value: 'state-0', viewValue: 'State1' },
    { value: 'state-1', viewValue: 'State2' },
    { value: 'state-2', viewValue: 'State3' }

  ];

  jobs = [
    { value: 'job-0', viewValue: 'Job1' },
    { value: 'job-1', viewValue: 'Job2' },
    { value: 'job-2', viewValue: 'Job3' }
  ];

  rForm: FormGroup;
  _id = '';
  fullname = '';
  email = '';
  phone = '';
  hiringDate = '';
  terminationDate = '';
  job = '';
  identifier = '';
  state = '';
  address = '';


  constructor(private EmployeeService: EmployeeService,
    private FormBuilder: FormBuilder, private route: ActivatedRoute, private router: Router
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this._id = id;
      let self = this;
      this.EmployeeService.read((function (data) {
        self.setValues(data);
        self.ngOnInit();
      }), this.EmployeeService.handleError, id)
    }
  }

  filterStates(val: string) {
    return val ? this.jobs.filter(s => s.viewValue.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.jobs;
  }

  ngOnInit() {

    this.rForm = this.FormBuilder.group({
      email: [
        this.email, [
          Validators.required,
          Validators.pattern(EMAIL_REGEX)]
      ],

      terminationDate: [
        this.terminationDate, [
          Validators.required,
          Validators.pattern(DATE_REGEX)]
      ],

      fullname: [
        this.fullname, [
          Validators.required,
          Validators.pattern(NAME_REGEX)]
      ],

      identifier: [
        this.identifier, [
          Validators.required,
          Validators.pattern(NAME_REGEX)]
      ],

      phone: [
        this.phone, [
          Validators.required,
          Validators.pattern(PHONE_REGEX)]
      ],

      hiringDate: [
        this.hiringDate, [
          Validators.required]
      ],

      job: [
        this.job, [
          Validators.required]
      ],

      state: [
        this.state, [
          Validators.required]
      ],

      address: [
        this.address, [
          Validators.required]
      ]

    });

  }

  private setValues(data: any) {
    this.email = data.email;
    this.fullname = data.fullname;
    this.address = data.address;
    this.state = data.state;
    this.job = data.job;
    this.hiringDate = data.hiringDate;
    this.terminationDate = data.terminationDate;
    this.phone = data.phone;
    this.identifier = data.identifier;

  }
  addEmployee(post) {
    if (this._id == '') {
      this.EmployeeService.create(() => { this.router.navigate(['employeelist']) }, this.EmployeeService.handleError, post);
    }
    else {
      post._id = this._id;
      this.EmployeeService.update(() => { this.router.navigate(['employeelist']) }, this.EmployeeService.handleError, post);
    }
  }

}
