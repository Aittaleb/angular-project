import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {TerminalService} from './terminal.service';
import {  ActivatedRoute, ParamMap ,Router} from '@angular/router';

const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const MAC_REGEX = /^[0-9a-fA-F]{1,2}([\.:-])(?:[0-9a-fA-F]{1,2}\1){4}[0-9a-fA-F]{1,2}$/;

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  providers : [TerminalService]

})
export class TerminalComponent implements OnInit {

  states = [
    {value: 'state-0', viewValue: 'State1'},
    {value: 'state-1', viewValue: 'State2'},
    {value: 'state-2', viewValue: 'State3'}

  ];

  authorizations = [
    {value: 'authorization-0', viewValue: 'Authorization1'},
    {value: 'authorization-1', viewValue: 'Authorization2'},
    {value: 'authorization-2', viewValue: 'Authorization3'}

  ];

  rForm:FormGroup;
  _id='';
  macAddress = '';
  ipAddress = '';
  state = '';
  authorization = '';


  constructor(private TerminalService : TerminalService ,
    private FormBuilder : FormBuilder,  private route: ActivatedRoute,private router :Router
  )
  {
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null)
    {
      this._id=id;
      let self=this;
      this.TerminalService.read((function(data){
        self.setValues(data);
        self.ngOnInit();
      }),this.TerminalService.handleError,id)
    }
  }
  ngOnInit() {
    this.rForm=this.FormBuilder.group({
      macAddress : [
        this.macAddress, [
          Validators.required,
          Validators.pattern(MAC_REGEX)]
        ],
        ipAddress : [
          this.ipAddress, [
            Validators.required,
            Validators.pattern(IP_REGEX)]
          ],
          state : [
            this.state, [
              Validators.required]
            ],
            authorization :[
              this.authorization, [
                Validators.required]
              ]
            });
          }

          private setValues(data:any)
          {
            this.state=data.state;
            this.authorization=data.authorization;
            this.ipAddress=data.ipAddress;
            this.macAddress=data.macAddress;
          }


          addTerminal(post)
          {
            if(this._id=='')
            {
              this.TerminalService.create((() => {this.router.navigate(['terminalList']);}),this.TerminalService.handleError,post);
            }
            else
            {
              post._id=this._id;
              this.TerminalService.update((() => {this.router.navigate(['terminalList']);}),this.TerminalService.handleError,post);
            }
          }
        }
