import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomFieldService } from '../custom-fields/custom-fields.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-custom-field-list',
  templateUrl: './custom-field-list.component.html',
  styleUrls: ['./custom-field-list.component.css'],
  providers: [CustomFieldService],
})
export class CustomFieldListComponent implements OnInit {

  constructor(private customFieldService:CustomFieldService,
    private router:Router) { }

    displayedColumns = ['fieldType','fieldName','fieldCode', 'description', 'required','Action'];

    database = new DataBase(this.customFieldService);
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

  delete(customField:Object)
  {
    this.customFieldService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.customFieldService.handleError,customField);
  }
  update(customField:Object)
  {
  this.customFieldService.update((
    function(data){
      console.log(data);
    }),
    this.customFieldService.handleError,customField);
  }

}

export interface customFieldData {
  id:string;
  _id:string;
  fieldType : string ;
  fieldName : string ;
  fieldCode : string ;
  description : string ;
  required : string;

}

export class DataBase {

  dataChange: BehaviorSubject<customFieldData[]> = new BehaviorSubject<customFieldData[]>([]);
  get data(): customFieldData[] { return this.dataChange.value; }
  a:any =[];
  constructor(private customFieldService:CustomFieldService){
    let self=this;
    this.customFieldService.list((function(data){
      self.a=data;
      for (let i = 0; i < self.a.length; i++) { self.addcustomField(i);}
    }),this.customFieldService.handleError);
  }
  addcustomField(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewcustomField(i));
    this.dataChange.next(copiedData);
  }
  /** Builds and returns a new User. */
  private createNewcustomField(i:number) {

    return {
         id: (this.data.length + 1).toString(),
      _id:this.a[i]._id,
      fieldType : this.a[i].fieldType,
      fieldName : this.a[i].fieldName,
      fieldCode : this.a[i].fieldCode,
      description : this.a[i].description,
      required :this.a[i].required
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: customFieldData[] = [];
    renderedData: customFieldData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<customFieldData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._dataBase.data.slice().filter((item: customFieldData) => {
        let searchStr = (item.fieldName + item.fieldType + item.fieldCode).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() {}

   sortData(data: customFieldData[]): customFieldData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'fieldType': [propertyA, propertyB] = [a.fieldType, b.fieldType]; break;
        case 'fieldName': [propertyA, propertyB] = [a.fieldName, b.fieldName]; break;
        case 'fieldCode': [propertyA, propertyB] = [a.fieldCode, b.fieldCode]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;
        case 'required': [propertyA, propertyB] = [a.required, b.required]; break;

      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
