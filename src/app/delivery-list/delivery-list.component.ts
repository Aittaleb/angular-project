import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DeliveryService} from '../delivery/delivery.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
    providers: [DeliveryService]
})
export class DeliveryListComponent implements OnInit {
  constructor(private DeliveryService:DeliveryService,private router:Router){}
  displayedColumns = ['userId','reference','quantity','plannedAt','deliveredAt' ,'note','state','Action'];
    database = new DataBase(this.DeliveryService);
    selection = new SelectionModel<string>(true, []);
    dataSource : MyDataSource | null ;

@ViewChild('filter') filter: ElementRef;
 @ViewChild(MdSort) sort: MdSort;
   @ViewChild(MdPaginator) paginator: MdPaginator;


  ngOnInit() {
    this.dataSource = new MyDataSource(this.database, this.paginator, this.sort) ;
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

    masterToggle() {
    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else if (this.filter.nativeElement.value) {
      this.dataSource.renderedData.forEach(data => this.selection.select(data.reference));
    } else {
      this.database.data.forEach(data => this.selection.select(data.reference));
    }
  }
  delete(Delivery:Object)
  {
    this.DeliveryService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.DeliveryService.handleError,Delivery);
  }

}



export interface DeliveryData {
  id:string;
    _id:string;
  reference : string ;
  quantity : number ;
  plannedAt : string ;
  deliveredAt : string ;
  state : string ;
  note:string;

}

export class DataBase {

  dataChange: BehaviorSubject<DeliveryData[]> = new BehaviorSubject<DeliveryData[]>([]);
  get data(): DeliveryData[] { return this.dataChange.value; }
  a:any =[];
  constructor(private DeliveryService:DeliveryService){
    let self=this;
    this.DeliveryService.list((function(data){
      self.a=data;
      for (let i = 0; i < self.a.length; i++) { self.addDelivery(i);}
    }),this.DeliveryService.handleError);
  }
  addDelivery(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewDelivery(i));
    this.dataChange.next(copiedData);
  }

  private createNewDelivery(i:number) {

    return {
      id: (this.data.length + 1).toString(),
      _id: this.a[i]._id,
      reference :this.a[i].reference,
      quantity : this.a[i].quantity,
      plannedAt : this.a[i].plannedAt,
      deliveredAt : this.a[i].deliveredAt,
      state : this.a[i].state,
      note: this.a[i].note
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: DeliveryData[] = [];
    renderedData: DeliveryData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<DeliveryData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this._dataBase.data.slice().filter((item: DeliveryData) => {
        let searchStr = (item.reference + item.quantity).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() {}

   sortData(data: DeliveryData[]): DeliveryData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'reference': [propertyA, propertyB] = [a.reference, b.reference]; break;
        case 'quantity': [propertyA, propertyB] = [a.quantity, b.quantity]; break;
        case 'plannedAt': [propertyA, propertyB] = [a.plannedAt, b.plannedAt]; break;
        case 'deliveredAt': [propertyA, propertyB] = [a.deliveredAt, b.deliveredAt]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
