import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService} from '../customer/customer.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [CustomerService]
})
export class CustomerListComponent implements OnInit {
      constructor(private CustomerService:CustomerService,private router:Router){}
    displayedColumns = ['userId','fullName', 'companyName', 'email', 'phone' , 'adress','Action'];
    database = new DataBase(this.CustomerService);
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

  /*  masterToggle() {
    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else if (this.filter.nativeElement.value) {
      this.dataSource.renderedData.forEach(data => this.selection.select(data.fullName));
    } else {
      this.database.data.forEach(data => this.selection.select(data.fullName));
    }
  }*/
  delete(customer:Object)
  {
    this.CustomerService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.CustomerService.handleError,customer);
  }
  update(customer:Object)
  {
  this.CustomerService.update((
    function(data){
      console.log(data);
    }),
    this.CustomerService.handleError,customer);
  }

}

export interface CustomerData {
  id: string;
  _id:string;
  fullName : string ;
  companyName : string ;
  email : string ;
  phone : string ;
  address : string ;
}

export class DataBase {

  dataChange: BehaviorSubject<CustomerData[]> = new BehaviorSubject<CustomerData[]>([]);
  get data(): CustomerData[] { return this.dataChange.value; }
 a:any =[]
  constructor(private CustomerService:CustomerService) {
    let self=this;
    this.CustomerService.list((function(data){
      self.a=data;
      console.log(self.a.length);
      for (let i = 0; i < self.a.length; i++) { self.addCustomer(i);}
    }),this.CustomerService.handleError);

  }

  /** Adds a new user to the database. */
  addCustomer(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewCustomer(i));
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewCustomer(i:number) {

    return {
         id: (this.data.length + 1).toString(),
      _id: this.a[i]._id,
      fullName : this.a[i].fullname ,
      companyName : this.a[i].company_Name,
      email : this.a[i].email ,
      phone : this.a[i].phone ,
      address : this.a[i].address
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: CustomerData[] = [];
    renderedData: CustomerData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<CustomerData[]> {
    //return this._dataBase.dataChange;
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
     this.filteredData = this._dataBase.data.slice().filter((item: CustomerData) => {
        let searchStr = (item.fullName + item.email).toLowerCase();
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

   sortData(data: CustomerData[]): CustomerData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'fullName': [propertyA, propertyB] = [a.fullName, b.fullName]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'companyName': [propertyA, propertyB] = [a.companyName, b.companyName]; break;
        case 'address': [propertyA, propertyB] = [a.address, b.address]; break;
        case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;

      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
