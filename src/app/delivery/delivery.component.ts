import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeliveryService } from './delivery.service';

import {  ActivatedRoute, ParamMap ,Router} from '@angular/router';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
  providers: [DeliveryService]
})
export class DeliveryComponent implements OnInit {

  states = [
    { value: 'State-0', viewValue: 'State1' },
    { value: 'State-1', viewValue: 'State2' },
    { value: 'State-2', viewValue: 'State3' }
  ];

  rForm: FormGroup;
  _id='';
  reference = '';

  quantity = '';

  plannedAt = '';

  deliveredAt = '';

  state = '';
note ='';

  constructor(private DeliveryService: DeliveryService, private FormBuilder: FormBuilder,
    private route: ActivatedRoute,private router :Router) {
      let id = this.route.snapshot.paramMap.get('id');
      if(id != null)
      {
        this._id=id;
        let self=this;
        this.DeliveryService.read((function(data){
            self.setValues(data);
            self.ngOnInit();
        }),this.DeliveryService.handleError,id)
      }

    }


  ngOnInit() {
    this.rForm = this.FormBuilder.group({

      reference: ['this.reference', [
        Validators.required]],

      quantity: [this.quantity, [
        Validators.required]],

      plannedAt: ['this.plannedAt', [
        Validators.required]],

      deliveredAt: ['this.deliveredAt', [
        Validators.required]],

      state: ['this.state', [
        Validators.required]],
        note :['this.note']
    });

  }
  private setValues(data:any)
  {
    this.reference=data.reference;
    this.quantity=data.quantity;
    this.plannedAt=data.plannedAt;
    this.deliveredAt=data.deliveredAt;
    this.note=data.note;
    this.state=data.state;
  }

  addDelivery(post) {
    if(this._id=='')
    {
      this.DeliveryService.create(() => {this.router.navigate(['deliveryList'])},this.DeliveryService.handleError,post);
    }
   else
   {
     post._id=this._id;
     this.DeliveryService.update(() => {this.router.navigate(['deliveryList'])},this.DeliveryService.handleError,post);
  }
}
}
