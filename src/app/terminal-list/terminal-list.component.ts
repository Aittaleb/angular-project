import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';

import { Router, ActivatedRoute } from '@angular/router';
import { TerminalService} from '../terminal/terminal.service';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-terminal-list',
  templateUrl: './terminal-list.component.html',
  styleUrls: ['./terminal-list.component.css'],
  providers : [TerminalService ]

})
export class TerminalListComponent implements OnInit {

  constructor(private TerminalService:TerminalService,private router:Router){}

  displayedColumns = ['userId','macAddress','ipAddress', 'state', 'authorization','Action'];
    database = new DataBase(this.TerminalService);
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



  delete(Terminal:Object)
  {
    this.TerminalService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.TerminalService.handleError,Terminal);
  }
  update(Terminal:Object)
  {
  this.TerminalService.update((
    function(data){
      console.log(data);
    }),
    this.TerminalService.handleError,Terminal);
  }

}



export interface TerminalData {
  id : string ,
  _id : string;
  macAddress : string ;
  ipAddress : string ;
  state : string ;
  authorization : string ;

}

export class DataBase {

  dataChange: BehaviorSubject<TerminalData[]> = new BehaviorSubject<TerminalData[]>([]);
  get data(): TerminalData[] { return this.dataChange.value; }

  a:any =[]
  constructor(private TerminalService:TerminalService) {
    let self=this;
    this.TerminalService.list((function(data){
      self.a=data;
      for (let i = 0; i < self.a.length; i++) { self.addTerminal(i);}
    }),this.TerminalService.handleError);

  }

  addTerminal(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewTerminal(i));
    this.dataChange.next(copiedData);
  }

  private createNewTerminal(i:number) {

    return {
      id: (this.data.length + 1).toString(),
      _id : this.a[i]._id,
      macAddress : this.a[i].macAddress ,
      ipAddress : this.a[i].ipAddress,
      state : this.a[i].state,
      authorization : this.a[i].authorization
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: TerminalData[] = [];
    renderedData: TerminalData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<TerminalData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this._dataBase.data.slice().filter((item: TerminalData) => {
        let searchStr = (item.macAddress + item.ipAddress).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() {}

   sortData(data: TerminalData[]): TerminalData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'macAddress': [propertyA, propertyB] = [a.macAddress, b.macAddress]; break;
        case 'ipAddress': [propertyA, propertyB] = [a.ipAddress, b.ipAddress]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'authorization': [propertyA, propertyB] = [a.authorization, b.authorization]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
