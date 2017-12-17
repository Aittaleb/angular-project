import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { TerminalCategoryService } from '../terminal-category/terminal-category.service';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-terminal-category-list',
  templateUrl: './terminal-category-list.component.html',
  styleUrls: ['./terminal-category-list.component.css'],
  providers : [TerminalCategoryService]
})
export class TerminalCategoryListComponent implements OnInit {

    constructor(private TerminalCategoryService : TerminalCategoryService , private router : Router){}
displayedColumns = ['userId','type','name','description','Action'];
    database = new DataBase(this.TerminalCategoryService);
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

   delete(TerminalCategory:Object)
   {
     this.TerminalCategoryService.delete((data) => {
       console.log(data);
     this.database.dataChange.next(this.database.data);
     window.location.reload();
     },this.TerminalCategoryService.handleError,TerminalCategory);
   }
   update(TerminalCategory:Object)
   {
   this.TerminalCategoryService.update((
     function(data){
       console.log(data);
     }),
     this.TerminalCategoryService.handleError,TerminalCategory);
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
      this.dataSource.renderedData.forEach(data => this.selection.select(data.type));
    } else {
      this.database.data.forEach(data => this.selection.select(data.type));
    }
  }

}



export interface TerminalCategoryData {
  id:string;
  _id : string;
  type : string ;
  name : string ;
  description : string ;

}

export class DataBase {

  dataChange: BehaviorSubject<TerminalCategoryData[]> = new BehaviorSubject<TerminalCategoryData[]>([]);
  get data(): TerminalCategoryData[] { return this.dataChange.value; }

  a:any =[]
  constructor(private TerminalCategoryService:TerminalCategoryService) {
    let self=this;
    this.TerminalCategoryService.list((function(data){
      self.a=data;
      console.log(self.a.length);
      for (let i = 0; i < self.a.length; i++) { self.addTerminalCategory(i);}
    }),this.TerminalCategoryService.handleError);
  }

  addTerminalCategory(i : number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewTerminalCategory(i));
    this.dataChange.next(copiedData);
  }

  private createNewTerminalCategory(i: number) {


    return {
         id: (this.data.length + 1).toString(),
      _id : this.a[i]._id,
      type : this.a[i].type ,
      name : this.a[i].name,
      description : this.a[i].Description
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: TerminalCategoryData[] = [];
    renderedData: TerminalCategoryData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<TerminalCategoryData[]> {
    //return this._dataBase.dataChange;
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._dataBase.data.slice().filter((item: TerminalCategoryData) => {
        let searchStr = (item.description + item.name).toLowerCase();
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

   sortData(data: TerminalCategoryData[]): TerminalCategoryData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'type': [propertyA, propertyB] = [a.type, b.type]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
