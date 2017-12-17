import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import {StockService} from './stock.service';
import {  ActivatedRoute, ParamMap ,Router } from '@angular/router';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  providers : [StockService]
})
export class StockComponent implements OnInit {

  rForm : FormGroup ;
  _id ='';
  quantity = '';
  importDate = '';


  constructor(private StockService : StockService ,
    private FormBuilder : FormBuilder  ,private route: ActivatedRoute,private router : Router
  ){
    let id = this.route.snapshot.paramMap.get('id');
    if(id != null)
    {
      this._id=id;
      let self=this;
      this.StockService.read((function(data){
        self.setValues(data);
        self.ngOnInit();
      }),this.StockService.handleError,id)
    }
  }


  private setValues(data:any)
  {
    this.importDate=data.importDate;
    this.quantity=data.quantity;
  }
  ngOnInit() {

    this.rForm=this.FormBuilder.group({
      quantity : [
        this.quantity, [
          Validators.required]
        ],
        importDate : [
          this.importDate, [
            Validators.required]
          ]
        });
      }

      addStock(post)
      {
        if(this._id=='')
        {
          this.StockService.create(() => {this.router.navigate(['stockList'])},this.StockService.handleError,post);
        }
        else
        {
          post._id=this._id;
          this.StockService.update(() => {this.router.navigate(['stockList'])},this.StockService.handleError,post);
        }
      }

    }
