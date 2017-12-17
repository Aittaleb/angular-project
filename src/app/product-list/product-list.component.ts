import { Component, OnInit , ElementRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';

import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product/product.service';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers : [ProductService]
})
export class ProductListComponent implements OnInit {

constructor(private ProductService : ProductService , private router : Router ){}
displayedColumns = ['userId','styleReference','quantity', 'name','description','Action'];
    database = new DataBase(this.ProductService);
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
      this.dataSource.renderedData.forEach(data => this.selection.select(data.styleReference));
    } else {
      this.database.data.forEach(data => this.selection.select(data.styleReference));
    }
  }

  delete(Product:Object)
  {
    this.ProductService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.ProductService.handleError,Product);
  }
  update(Product:Object)
  {
  this.ProductService.update((
    function(data){
      console.log(data);
    }),
    this.ProductService.handleError,Product);
  }


}




export interface ProductData {
  id:string;
  _id : string;
  styleReference : string ;
  quantity : number ;
  name : string ;
  description : string ;

}

export class DataBase {

  dataChange: BehaviorSubject<ProductData[]> = new BehaviorSubject<ProductData[]>([]);
  get data(): ProductData[] { return this.dataChange.value; }

  a:any =[]
  constructor(private ProductService:ProductService) {
    let self=this;
    this.ProductService.list((function(data){
      self.a=data;
      console.log(self.a.length);
      for (let i = 0; i < self.a.length; i++) { self.addProduct(i);}
    }),this.ProductService.handleError);

  }

  /** Adds a new user to the database. */
  addProduct(i : number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewProduct(i));
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewProduct(i:number) {


    return {
         id: (this.data.length + 1).toString(),
      _id : this.a[i]._id ,
      styleReference : this.a[i].styleReference ,
      quantity : this.a[i].quantity,
      name : this.a[i].name,
      description : this.a[i].description
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

    filteredData: ProductData[] = [];
    renderedData: ProductData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
     private _sort: MdSort) {
    super();
  }

  connect(): Observable<ProductData[]> {
    //return this._dataBase.dataChange;
    const displayDataChanges = [
      this._dataBase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._dataBase.data.slice().filter((item: ProductData) => {
        let searchStr = (item.styleReference + item.quantity).toLowerCase();
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

   sortData(data: ProductData[]): ProductData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'styleReference': [propertyA, propertyB] = [a.styleReference, b.styleReference]; break;
        case 'quantity': [propertyA, propertyB] = [a.quantity, b.quantity]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'description': [propertyA, propertyB] = [a.description, b.description]; break;


      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
