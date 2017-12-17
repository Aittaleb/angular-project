import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MdPaginator, MdSort, SelectionModel } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ManufacturingService } from '../manufacturing/manufacturing.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-manufacturing-list',
  templateUrl: './manufacturing-list.component.html',
  styleUrls: ['./manufacturing-list.component.css'],
  providers: [ManufacturingService],
})
export class ManufacturingListComponent implements OnInit {
  constructor(private ManufacturingService: ManufacturingService, private router: Router) { }
  displayedColumns = ['userId', 'input', 'output', 'savedAt', 'releasedAt', 'state', 'note', 'Action'];
  database = new DataBase(this.ManufacturingService);
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
  delete(Manufacturing: Object) {
    this.ManufacturingService.delete((data) => {
      console.log(data);
      this.database.dataChange.next(this.database.data);
      window.location.reload();
    }, this.ManufacturingService.handleError, Manufacturing);
  }
  update(Manufacturing: Object) {
    this.ManufacturingService.update((
      function (data) {
        console.log(data);
      }),
      this.ManufacturingService.handleError, Manufacturing);
  }


}


export interface ManufacturingData {
  id: string;
  _id: string;
  input: number;
  output: number;
  savedAt: string;
  releasedAt: string;
  state: string;
  note: string;

}

export class DataBase {

  dataChange: BehaviorSubject<ManufacturingData[]> = new BehaviorSubject<ManufacturingData[]>([]);
  get data(): ManufacturingData[] { return this.dataChange.value; }
  a: any = [];
  constructor(private ManufacturingService: ManufacturingService) {
    let self = this;
    this.ManufacturingService.list((function (data) {
      self.a = data;
      for (let i = 0; i < self.a.length; i++) { self.addManufacturing(i); }
    }), this.ManufacturingService.handleError);
  }

  /** Adds a new user to the database. */
  addManufacturing(i: number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewManufacturing(i));
    this.dataChange.next(copiedData);
  }
  private createNewManufacturing(i:number) {


    return {
      id: (this.data.length + 1).toString(),
      _id: this.a[i]._id,
      input: this.a[i].input,
      output: this.a[i].output,
      savedAt: this.a[i].savedAt,
      releasedAt: this.a[i].releasedAt,
      state: this.a[i].state,
      note: this.a[i].note
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: ManufacturingData[] = [];
  renderedData: ManufacturingData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
    private _sort: MdSort) {
    super();
  }

  connect(): Observable<ManufacturingData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this._dataBase.data.slice().filter((item: ManufacturingData) => {
        let searchStr = (item.state + item.note + item.input.toString + item.output.toString).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });


      const sortedData = this.sortData(this.filteredData.slice());
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() { }

  sortData(data: ManufacturingData[]): ManufacturingData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'input': [propertyA, propertyB] = [a.input, b.input]; break;
        case 'output': [propertyA, propertyB] = [a.output, b.output]; break;
        case 'savedAt': [propertyA, propertyB] = [a.savedAt, b.savedAt]; break;
        case 'releasedAt': [propertyA, propertyB] = [a.releasedAt, b.releasedAt]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'note': [propertyA, propertyB] = [a.note, b.note]; break;

      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
