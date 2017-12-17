import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import {RawMaterialService} from '../raw-material/raw-material.service';
import {Router , ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-raw-material-list',
  templateUrl: './raw-material-list.component.html',
  styleUrls: ['./raw-material-list.component.css'],
  providers : [RawMaterialService]
})
export class RawMaterialListComponent implements OnInit {

  constructor(private RawMaterialService : RawMaterialService , private router : Router  ){}


displayedColumns = ['userId','reference', 'name','description','Action'];
    database = new DataBase(this.RawMaterialService);
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

   delete(RawMaterial:Object)
   {
     this.RawMaterialService.delete((data) => {
       console.log(data);
     this.database.dataChange.next(this.database.data);
     window.location.reload();
     },this.RawMaterialService.handleError,RawMaterial);
   }
   update(RawMaterial:Object)
   {
   this.RawMaterialService.update((
     function(data){
       console.log(data);
     }),
     this.RawMaterialService.handleError,RawMaterial);
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

}




export interface RawMaterialData {

  _id: string ;
  reference : string ;
  name : string ;
  description : string ;

}

export class DataBase {

  dataChange: BehaviorSubject<RawMaterialData[]> = new BehaviorSubject<RawMaterialData[]>([]);
  get data(): RawMaterialData[] { return this.dataChange.value; }


  a:any =[]
  constructor(private RawMaterialService:RawMaterialService) {
    let self=this;
    this.RawMaterialService.list((function(data){
      self.a=data;
      console.log(self.a.length);
      for (let i = 0; i < self.a.length; i++) { self.addRawMaterial(i);}
    }),this.RawMaterialService.handleError);


  }

  /** Adds a new user to the database. */
  addRawMaterial(i : number) {

    const copiedData = this.data.slice();
    copiedData.push(this.createNewRawMaterial(i));
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewRawMaterial(i : number) {

    return {
      id: (this.data.length + 1).toString(),
      _id : this.a[i]._id,
      reference : this.a[i].reference ,
      name : this.a[i].name,
      description : this.a[i].description
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: RawMaterialData[] = [];
    renderedData: RawMaterialData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<RawMaterialData[]> {
    //return this._dataBase.dataChange;
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._dataBase.data.slice().filter((item: RawMaterialData) => {
        let searchStr = (item.reference + item.name).toLowerCase();
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

   sortData(data: RawMaterialData[]): RawMaterialData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'reference': [propertyA, propertyB] = [a.reference, b.reference]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
