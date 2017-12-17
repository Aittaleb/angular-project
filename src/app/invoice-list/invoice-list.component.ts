import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService} from '../invoice/invoice.service';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
  providers : [InvoiceService]
})
export class InvoiceListComponent implements OnInit {

  constructor(private InvoiceService:InvoiceService,private router:Router){}

  displayedColumns = ['userId','totalPrice','netPrice', 'invoiceDate', 'Action' ];
    database = new DataBase(this.InvoiceService);
    selection = new SelectionModel<string>(true, []);
    dataSource : MyDataSource | null ;

@ViewChild('filter') filter: ElementRef;
 @ViewChild(MdSort) sort: MdSort;
   @ViewChild(MdPaginator) paginator: MdPaginator;


  ngOnInit() {
    this.dataSource = new MyDataSource(this.database, this.paginator, this.sort) ;
    // filter related bs
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
   }

     isAllSelected(): boolean {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    if (this.filter.nativeElement.value) {
      return this.selection.selected.length == this.dataSource.renderedData.length;
    } else {
      return this.selection.selected.length == this.database.data.length;
    }
  }

  delete(invoice:Object)
  {
    this.InvoiceService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.InvoiceService.handleError,invoice);
  }
  update(invoice:Object)
  {
  this.InvoiceService.update((
    function(data){
      console.log(data);
    }),
    this.InvoiceService.handleError,invoice);
  }


}


export interface InvoiceData {
  id :string;
  _id : string ;
  totalPrice :number ;
  netPrice : number;
  invoiceDate : string ;
}

export class DataBase {

  dataChange: BehaviorSubject<InvoiceData[]> = new BehaviorSubject<InvoiceData[]>([]);
  get data(): InvoiceData[] { return this.dataChange.value; }

  a:any =[]
  constructor(private InvoiceService:InvoiceService) {
    let self=this;
    this.InvoiceService.list((function(data){
      self.a=data;
      for (let i = 0; i < self.a.length; i++) { self.addInvoice(i);}
    }),this.InvoiceService.handleError);


  }

  addInvoice( i: number ) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewInvoice(i));
    this.dataChange.next(copiedData);
  }

  private createNewInvoice(i : number) {


    return {
       id: (this.data.length + 1).toString(),
      _id : this.a[i]._id,
      totalPrice : this.a[i].totalPrice ,
      netPrice : this.a[i].netPrice,
      invoiceDate : this.a[i].invoiceDate ,

    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: InvoiceData[] = [];
    renderedData: InvoiceData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<InvoiceData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this._dataBase.data.slice().filter((item: InvoiceData) => {
        let searchStr = (item.totalPrice.toString()+ item.netPrice.toString()).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() {}

   sortData(data: InvoiceData[]): InvoiceData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'totalPrice': [propertyA, propertyB] = [a.totalPrice, b.totalPrice]; break;
        case 'netPrice': [propertyA, propertyB] = [a.netPrice, b.netPrice]; break;
        case 'invoiceDate': [propertyA, propertyB] = [a.invoiceDate, b.invoiceDate]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
