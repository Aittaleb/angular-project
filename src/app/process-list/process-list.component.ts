import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcessService} from '../process/process.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.css'],
  providers :[ProcessService]
})
export class ProcessListComponent implements OnInit {
  constructor(private ProcessService:ProcessService,private router:Router){}
 displayedColumns = ['userId','name','state', 'description', 'buildingData', 'buildingImage','Action'];
    database = new DataBase(this.ProcessService);
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
  delete(process:Object)
  {
    this.ProcessService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.ProcessService.handleError,process);
  }
  update(process:Object)
  {
  this.ProcessService.update((
    function(data){
      console.log(data);
    }),
    this.ProcessService.handleError,process);
  }
}

export interface ProcessData {
  id:string;
    _id:string;
  name : string ;
  state : string ;
  description : string ;
  buildingData : string ;
  buildingImage : string ;


}

export class DataBase {

  dataChange: BehaviorSubject<ProcessData[]> = new BehaviorSubject<ProcessData[]>([]);
  get data(): ProcessData[] { return this.dataChange.value; }
  a:any =[];
  constructor(private ProcessService:ProcessService){
    let self=this;
    this.ProcessService.list((function(data){
      self.a=data;
      for (let i = 0; i < self.a.length; i++) { self.addprocess(i);}
    }),this.ProcessService.handleError);
  }

  addprocess(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewprocess(i));
    this.dataChange.next(copiedData);
  }


  private createNewprocess(i:number) {

    return {
       id: (this.data.length + 1).toString(),
      _id:this.a[i]._id,
      name : this.a[i].name ,
      state :  this.a[i].state,
      description :  this.a[i].Description,
      buildingData  : this.a[i].buildingData,
      buildingImage :  this.a[i].buildingImage,
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: ProcessData[] = [];
    renderedData: ProcessData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<ProcessData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this._dataBase.data.slice().filter((item: ProcessData) => {
        let searchStr = (item.name + item.state + item.description).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() {}

   sortData(data: ProcessData[]): ProcessData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
        case 'buildingData': [propertyA, propertyB] = [a.buildingData, b.buildingData]; break;
        case 'buildingImage': [propertyA, propertyB] = [a.buildingImage, b.buildingImage]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
