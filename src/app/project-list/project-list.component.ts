import { Component, OnInit , ElementRef, ViewChild ,Inject} from '@angular/core';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort, SelectionModel} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService} from '../project/project.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  providers: [ProjectService],
})
export class ProjectListComponent implements OnInit {
  constructor(private ProjectService:ProjectService,private router:Router){}
  displayedColumns = ['userId','commandReference', 'name', 'plannedAt', 'deliveredAt' , 'clientPlannedAt','clientDeliveredAt','state','budget','Action'];
  database = new DataBase(this.ProjectService);
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
      this.dataSource.renderedData.forEach(data => this.selection.select(data.commandReference));
    } else {
      this.database.data.forEach(data => this.selection.select(data.commandReference));
    }
  }
  delete(project:Object)
  {
    this.ProjectService.delete((data) => {
      console.log(data);
    this.database.dataChange.next(this.database.data);
    window.location.reload();
    },this.ProjectService.handleError,project);
  }
  update(project:Object)
  {
  this.ProjectService.update((
    function(data){
      console.log(data);
    }),
    this.ProjectService.handleError,project);
  }
}


export interface ProjectData {
  id : string;
  _id:string;
  commandReference : string ;
  name : string ;
  plannedAt : string ;
  deliveredAt : string ;
  clientPlannedAt : string ;
  clientDeliveredAt : string;
  state : string ;
  budget : number ;
}

export class DataBase {

  dataChange: BehaviorSubject<ProjectData[]> = new BehaviorSubject<ProjectData[]>([]);
  get data(): ProjectData[] { return this.dataChange.value; }
  a :any=[];
  constructor(private ProjectService:ProjectService){
    let self=this;
    this.ProjectService.list((function(data){
      self.a=data;
      for (let i = 0; i < self.a.length; i++) { self.addProject(i);}
    }),this.ProjectService.handleError);
  }
  addProject(i:number) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewProject(i));
    this.dataChange.next(copiedData);
  }
  private createNewProject(i:number) {
    return {
      id :  (this.data.length + 1).toString(),
      _id:this.a[i]._id,
      commandReference : this.a[i].commandReference ,
      name : this.a[i].name,
      plannedAt : this.a[i].plannedAt ,
      deliveredAt : this.a[i].deliveredAt,
      clientPlannedAt : this.a[i].clientPlannedAt,
      clientDeliveredAt : this.a[i].clientDeliveredAt ,
      state : this.a[i].state,
      budget :this.a[i].budget
    };
  }
}

export class MyDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: ProjectData[] = [];
  renderedData: ProjectData[] = [];

  constructor(private _dataBase: DataBase,
    private _paginator: MdPaginator,
    private _sort: MdSort) {
      super();
    }
    connect(): Observable<ProjectData[]> {
      const displayDataChanges = [
        this._dataBase.dataChange,
        this._sort.mdSortChange,
        this._filterChange,
        this._paginator.page,
      ];


      return Observable.merge(...displayDataChanges).map(() => {
        // Filter data

        this.filteredData = this._dataBase.data.slice().filter((item: ProjectData) => {
          let searchStr = (item.commandReference + item.name).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        });


        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      });
    }

    disconnect() {}

    sortData(data: ProjectData[]): ProjectData[] {
      if (!this._sort.active || this._sort.direction == '') { return data; }

      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';

        switch (this._sort.active) {
          case 'commandReference': [propertyA, propertyB] = [a.commandReference, b.commandReference]; break;
          case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
          case 'plannedAt': [propertyA, propertyB] = [a.plannedAt, b.plannedAt]; break;
          case 'deliveredAt': [propertyA, propertyB] = [a.deliveredAt, b.deliveredAt]; break;
          case 'budget': [propertyA, propertyB] = [a.budget, b.budget]; break;

        }

        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }
  }
