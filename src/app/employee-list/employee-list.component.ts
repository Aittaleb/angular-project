import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MdPaginator, MdSort, SelectionModel } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee/employee.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  providers: [EmployeeService],
})
export class EmployeeListComponent implements OnInit {
  constructor(private EmployeeService: EmployeeService, private router: Router) { }
  displayedColumns = ['userId', 'identifier', 'fullName', 'email', 'phone', 'hiringDate', 'state', 'terminationDate', 'job', 'address', 'Action'];
  database = new DataBase(this.EmployeeService);
  selection = new SelectionModel<string>(true, []);
  dataSource: MyDataSource | null;

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
      this.dataSource.renderedData.forEach(data => this.selection.select(data.identifier));
    } else {
      this.database.data.forEach(data => this.selection.select(data.identifier));
    }
  }
  delete(Employee: Object) {
    this.EmployeeService.delete((data) => {
      console.log(data);
      this.database.dataChange.next(this.database.data);
      window.location.reload();
    }, this.EmployeeService.handleError, Employee);
  }
  update(Employee: Object) {
    this.EmployeeService.update((
      function (data) {
        console.log(data);
      }),
      this.EmployeeService.handleError, Employee);
  }

}



export interface EmployeeData {
  id: string;
  _id: string;
  identifier: string;
  fullName: string;
  email: string;
  phone: string;
  hiringDate: string;
  terminationDate: string;
  job: string;
  state: string;
  address: string;

}

export class DataBase {

  dataChange: BehaviorSubject<EmployeeData[]> = new BehaviorSubject<EmployeeData[]>([]);
  get data(): EmployeeData[] { return this.dataChange.value; }
  a: any = [];
  constructor(private EmployeeService: EmployeeService) {
    let self = this;
    this.EmployeeService.list((function (data) {
      self.a = data;
      for (let i = 0; i < self.a.length; i++) { self.addEmployee(i); }
    }), this.EmployeeService.handleError);
  }
  addEmployee(i: number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewEmployee(i));
    this.dataChange.next(copiedData);
  }
  private createNewEmployee(i: number) {

    return {
      id: (this.data.length + 1).toString(),
      _id: this.a[i]._id,
      identifier: this.a[i].identifier,
      fullName: this.a[i].fullname,
      email: this.a[i].email,
      phone: this.a[i].phone,
      hiringDate: this.a[i].hiringDate,
      terminationDate: this.a[i].terminationDate,
      job: this.a[i].job,
      state: this.a[i].state,
      address: this.a[i].address
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: EmployeeData[] = [];
  renderedData: EmployeeData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
    private _sort: MdSort) {
    super();
  }

  connect(): Observable<EmployeeData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._dataBase.data.slice().filter((item: EmployeeData) => {
        let searchStr = (item.identifier + item.fullName).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() { }

  sortData(data: EmployeeData[]): EmployeeData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'identifier': [propertyA, propertyB] = [a.identifier, b.identifier]; break;
        case 'fullName': [propertyA, propertyB] = [a.fullName, b.fullName]; break;
        case 'hiringDate': [propertyA, propertyB] = [a.hiringDate, b.hiringDate]; break;
        case 'terminationDate': [propertyA, propertyB] = [a.terminationDate, b.terminationDate]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
