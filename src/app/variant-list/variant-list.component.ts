import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import {VariantService} from '../variant/variant.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-variant-list',
  templateUrl: './variant-list.component.html',
  styleUrls: ['./variant-list.component.css'],
  providers :[VariantService]
})
export class VariantListComponent implements OnInit {

 constructor(private VariantService : VariantService , private router : Router ){}
displayedColumns = ['userId','colorValue', 'size','lettersize','quantity','Action'];
    database = new DataBase(this.VariantService);
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

    masterToggle() {
    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else if (this.filter.nativeElement.value) {
      this.dataSource.renderedData.forEach(data => this.selection.select(data.colorValue));
    } else {
      this.database.data.forEach(data => this.selection.select(data.colorValue));
    }
  }
  delete(stock:Object)
  {
    this.VariantService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.VariantService.handleError,stock);
  }
}


export interface VariantData {
  id:string;
  _id:string;
  colorValue : string ;
  size : number ;
  lettersize : number ;
  quantity : number ;

}

export class DataBase {

  dataChange: BehaviorSubject<VariantData[]> = new BehaviorSubject<VariantData[]>([]);
  get data(): VariantData[] { return this.dataChange.value; }

  a:any =[]
  constructor(private VariantService:VariantService) {
    let self=this;
    this.VariantService.list((function(data){
      self.a=data;
      console.log(self.a.length);
      for (let i = 0; i < self.a.length; i++) { self.addVariant(i);}
    }),this.VariantService.handleError);
}

  addVariant(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewRawMaterial(i));
    this.dataChange.next(copiedData);
  }

  private createNewRawMaterial(i:number) {

    return {
       id: (this.data.length + 1).toString(),
      _id:this.a[i]._id,
      colorValue : this.a[i].colorValue,
      size :  this.a[i].size,
      quantity :  this.a[i].quantity,
      lettersize :  this.a[i].letterSize
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: VariantData[] = [];
    renderedData: VariantData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<VariantData[]> {
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._dataBase.data.slice().filter((item: VariantData) => {
        let searchStr = (item.colorValue + item.size).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

      const sortedData = this.sortData(this.filteredData.slice());

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });


  }

  disconnect() {}

   sortData(data: VariantData[]): VariantData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'colorValue': [propertyA, propertyB] = [a.colorValue, b.colorValue]; break;
        case 'size': [propertyA, propertyB] = [a.size, b.size]; break;
        case 'quantity': [propertyA, propertyB] = [a.quantity, b.quantity]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
