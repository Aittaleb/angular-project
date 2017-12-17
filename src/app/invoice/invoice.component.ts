import { Component, OnInit } from '@angular/core';
import {InvoiceService} from './invoice.service';
import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {  ActivatedRoute, ParamMap,Router } from '@angular/router';

const DATE = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  providers : [InvoiceService]
})
export class InvoiceComponent implements OnInit {

  rForm:FormGroup;
  _id ='';
  totalPrice = '';
  netPrice = '';
  invoiceDate ='';


  constructor(private InvoiceService: InvoiceService ,
    private FormBuilder : FormBuilder ,private route: ActivatedRoute,private router :Router
    )
    {
      let id = this.route.snapshot.paramMap.get('id');
      if(id != null)
      {
        this._id=id;
        let self=this;
        this.InvoiceService.read((function(data){
            self.setValues(data);
            self.ngOnInit();
        }),this.InvoiceService.handleError,id)
      }
    }

  ngOnInit() {
    this.rForm= this.FormBuilder.group({

      totalPrice : [
          this.totalPrice, [
        Validators.required]
      ],

      netPrice : [
          this.netPrice, [
          Validators.required]
      ],
      invoiceDate :[
        this.invoiceDate,[
          Validators.required,
          Validators.pattern(DATE)
        ]
      ]
     });

  }

  private setValues(data:any)
  {
    this.netPrice=data.netPrice;
    this.invoiceDate=data.invoiceDate;
    this.totalPrice=data.totalPrice;
  }

addInvoice(post)
{
  if(this._id=='')
  {
    this.InvoiceService.create(() => {this.router.navigate(['invoiceList'])},this.InvoiceService.handleError,post);
  }
 else
 {
   post._id=this._id;
   this.InvoiceService.update(() => {this.router.navigate(['invoiceList'])},this.InvoiceService.handleError,post);
}}




}
