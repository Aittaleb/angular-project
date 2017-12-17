import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ManufactureLineTypeService} from '../manufacture-line-type/manufacture-line-type.service';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-manufacturing-line-type-list',
  templateUrl: './manufacturing-line-type-list.component.html',
  styleUrls: ['./manufacturing-line-type-list.component.css'],
  providers : [ManufactureLineTypeService]
})
export class ManufacturingLineTypeListComponent implements OnInit {

  constructor(private ManufactureLineTypeService : ManufactureLineTypeService , private router : Router  ){}

  displayedColumns = ['userId','name','description', 'minEffective','maxEffective','Action'];
  database = new DataBase(this.ManufactureLineTypeService);
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

  delete(ManufactureLineType:Object)
  {
    this.ManufactureLineTypeService.delete((data) => {
      console.log(data);
      this.database.dataChange.next(this.database.data);
      window.location.reload();
    },this.ManufactureLineTypeService.handleError,ManufactureLineType);
  }
  update(ManufactureLineType:Object)
  {
    this.ManufactureLineTypeService.update((
      function(data){
        console.log(data);
      }),
      this.ManufactureLineTypeService.handleError,ManufactureLineType);
    }
}


  export interface ManufacturingLineTypeData {
    id:string;
    _id : string ;
    name : string ;
    description : string ;
    minEffective : number ;
    maxEffective : number;

  }

  export class DataBase {

    dataChange: BehaviorSubject<ManufacturingLineTypeData[]> = new BehaviorSubject<ManufacturingLineTypeData[]>([]);
    get data(): ManufacturingLineTypeData[] { return this.dataChange.value; }

    a:any =[]
    constructor(private ManufactureLineTypeService:ManufactureLineTypeService) {
      let self=this;
      this.ManufactureLineTypeService.list((function(data){
        self.a=data;
        console.log(self.a.length);
        for (let i = 0; i < self.a.length; i++) { self.addManufactureLineType(i);}
      }),this.ManufactureLineTypeService.handleError);

    }

    addManufactureLineType(i : number ) {
      const copiedData = this.data.slice();
      copiedData.push(this.createNewManufactureLineType(i));
      this.dataChange.next(copiedData);
    }

    private createNewManufactureLineType(i : number ) {
      return {
        id: (this.data.length + 1).toString(),
        _id : this.a[i]._id,
        name : this.a[i].name ,
        description : this.a[i].description,
        minEffective : this.a[i].minEffective,
        maxEffective : this.a[i].maxEffective

      };
    }
  }

  export class MyDataSource extends DataSource<any> {

    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: ManufacturingLineTypeData[] = [];
    renderedData: ManufacturingLineTypeData[] = [];

    constructor(private _dataBase: DataBase,
      private _paginator: MdPaginator,
      private _sort: MdSort) {
        super();
      }

      connect(): Observable<ManufacturingLineTypeData[]> {
        const displayDataChanges = [
          this._dataBase.dataChange,
          this._sort.mdSortChange,
          this._filterChange,
          this._paginator.page,
        ];


        return Observable.merge(...displayDataChanges).map(() => {
          // Filter data
          this.filteredData = this._dataBase.data.slice().filter((item: ManufacturingLineTypeData) => {
            let searchStr = (item.name + item.description).toLowerCase();
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

      sortData(data: ManufacturingLineTypeData[]): ManufacturingLineTypeData[] {
        if (!this._sort.active || this._sort.direction == '') { return data; }

        return data.sort((a, b) => {
          let propertyA: number|string = '';
          let propertyB: number|string = '';

          switch (this._sort.active) {
            case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
            case 'minEffective': [propertyA, propertyB] = [a.minEffective, b.minEffective]; break;
            case 'maxEffective': [propertyA, propertyB] = [a.maxEffective, b.maxEffective]; break;


          }

          let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
        });
      }
    }
