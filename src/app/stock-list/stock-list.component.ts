import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { StockService} from '../stock/stock.service';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css'],
  providers : [StockService]
})
export class StockListComponent implements OnInit {

constructor(private StockService : StockService , private router : Router ){}
displayedColumns = ['userId','quantity', 'importDate','Action'];
database = new DataBase(this.StockService);
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

delete(stock:Object)
{
  this.StockService.delete((data) => {
    console.log(data);
  this.database.dataChange.next(this.database.data);
  window.location.reload();
  },this.StockService.handleError,stock);
}
}


export interface StockData {
  id:string;
  _id : string ;
quantity : number ;
importDate : string ;

}

export class DataBase {

dataChange: BehaviorSubject<StockData[]> = new BehaviorSubject<StockData[]>([]);
get data(): StockData[] { return this.dataChange.value; }

a:any =[]
constructor(private StockService:StockService) {
  let self=this;
  this.StockService.list((function(data){
    self.a=data;
    console.log(self.a.length);
    for (let i = 0; i < self.a.length; i++) { self.addStock(i);}
  }),this.StockService.handleError);
}

/** Adds a new user to the database. */
addStock(i : number) {
const copiedData = this.data.slice();
copiedData.push(this.createNewStock(i));
this.dataChange.next(copiedData);
}

/** Builds and returns a new User. */
private createNewStock(i : number ) {
return {
   id: (this.data.length + 1).toString(),
  _id : this.a[i]._id,
  quantity : this.a[i].quantity ,
  importDate : this.a[i].importDate
};
}
}

export class MyDataSource extends DataSource<any> {

_filterChange = new BehaviorSubject('');
get filter(): string { return this._filterChange.value; }
set filter(filter: string) { this._filterChange.next(filter); }

filteredData: StockData[] = [];
renderedData: StockData[] = [];

constructor(private _dataBase: DataBase,
private _paginator: MdPaginator,
 private _sort: MdSort) {
super();
}

connect(): Observable<StockData[]> {
const displayDataChanges = [
  this._dataBase.dataChange,
  this._sort.mdSortChange,
  this._filterChange,
  this._paginator.page,
];


return Observable.merge(...displayDataChanges).map(() => {
  this.filteredData = this._dataBase.data.slice().filter((item: StockData) => {
    let searchStr = (item.quantity + item.importDate).toLowerCase();
    return searchStr.indexOf(this.filter.toLowerCase()) != -1;
  });

  // Sort filtered data
  const sortedData = this.sortData(this.filteredData.slice());

  // Grab the page's slice of the filtered sorted data.
  const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
  this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
  return this.renderedData;
});


}

disconnect() {}

sortData(data: StockData[]): StockData[] {
if (!this._sort.active || this._sort.direction == '') { return data; }

return data.sort((a, b) => {
  let propertyA: number|string = '';
  let propertyB: number|string = '';

  switch (this._sort.active) {
    case 'quantity': [propertyA, propertyB] = [a.quantity, b.quantity]; break;
    case 'importDate': [propertyA, propertyB] = [a.importDate, b.importDate]; break;


  }

  let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
  let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

  return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
});
}
}
