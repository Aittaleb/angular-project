import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { ManufactureLineService} from '../manufacture-line/manufacture-line.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-manufacture-line-list',
  templateUrl: './manufacture-line-list.component.html',
  styleUrls: ['./manufacture-line-list.component.css'],
  providers:[ManufactureLineService]
})
export class ManufactureLineListComponent implements OnInit {
  constructor(private ManufactureLineService:ManufactureLineService){}

displayedColumns = ['userId','effective','state', 'inputTerminalState', 'outputTerminalState', 'displayState' , 'processOrder','Action'];
    database = new DataBase(this.ManufactureLineService);
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
  delete(project:Object)
  {
    this.ManufactureLineService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.ManufactureLineService.handleError,project);
  }
  update(project:Object)
  {
  this.ManufactureLineService.update((
    function(data){
      console.log(data);
    }),
    this.ManufactureLineService.handleError,project);
  }



}

export interface ManufactureLineData {
  id:string;
  _id:string;
  effective : number ;
  state : string ;
  inputTerminalState : string ;
  outputTerminalState : string ;
  displayState : string ;
  processOrder : number ;
}

export class DataBase {

  dataChange: BehaviorSubject<ManufactureLineData []> = new BehaviorSubject<ManufactureLineData []>([]);
  get data(): ManufactureLineData [] { return this.dataChange.value; }
  a :any=[];
  constructor(private ManufactureLineService:ManufactureLineService) {
    let self=this;
    this.ManufactureLineService.list((function(data){
      self.a=data;
      for (let i = 0; i < self.a.length; i++) { self.addManufactureLine(i);}
    }),this.ManufactureLineService.handleError);
  }


  addManufactureLine(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewProject(i));
    this.dataChange.next(copiedData);
  }


  private createNewProject(i:number) {
    return {
         id: (this.data.length + 1).toString(),
      _id:this.a[i]._id,
      effective :this.a[i].effective ,
      state : this.a[i].state,
      inputTerminalState : this.a[i].inputTerminalState,
      outputTerminalState : this.a[i].outputTerminalState,
      displayState : this.a[i].displayState ,
      processOrder : this.a[i].processOrder

    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: ManufactureLineData[] = [];
    renderedData: ManufactureLineData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<ManufactureLineData[]> {
    //return this._dataBase.dataChange;
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._dataBase.data.slice().filter((item: ManufactureLineData) => {
        let searchStr = (item.effective + item.state).toLowerCase();
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

   sortData(data: ManufactureLineData[]): ManufactureLineData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'effective': [propertyA, propertyB] = [a.effective, b.effective]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'displayState': [propertyA, propertyB] = [a.displayState, b.displayState]; break;
        case 'processOrder': [propertyA, propertyB] = [a.processOrder, b.processOrder]; break;
        case 'inputTerminalState': [propertyA, propertyB] = [a.inputTerminalState, b.inputTerminalState]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
