import { Component, OnInit } from '@angular/core';
import {MdProgressSpinnerModule} from '@angular/material';
import {EmployeeService} from '../employee/employee.service';
@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.css'],
    providers : [EmployeeService]
})
export class CircularProgressComponent implements OnInit {
  public doughnutChartLabels:string[] =[];
 public doughnutChartData:number[] = [];
  public doughnutChartType:string = 'doughnut';
  public isDataAvailable:boolean =false;
  public m=new Map<string,number>();
  constructor(private EmployeeService:EmployeeService){
  }
  ManufacturingLines =  [
    {name : 'Rasage' , state : 'finished' ,order : 1},
    {name : 'Raffinage' , state : 'waiting' , order : 4},
    {name : 'Netoyage' , state : 'working' , order : 3},
    {name : 'Embalage' , state : 'finished' , order : 2},
    {name : 'Test produit' , state : 'waiting' , order : 5}];

  color = 'primary';
  mode = 'determinate';
  value = 50;

  ngOnInit() {
     let self=this;
        this.EmployeeService.list((data) => {
    for(let i=0;i<data.length;i++)
       {
          self.m.set(data[i].state,0);
        }
        for(var i=0;i<data.length;i++)        {
        if(self.m.get(data[i].state)==0)
                 self.doughnutChartLabels.push(data[i].state);
          self.m.set(data[i].state,self.m.get(data[i].state)+1);
        }
        self.m.forEach((value: number, key: string) => {
          self.doughnutChartData.push(value);
        });
        self.isDataAvailable=true;
      },this.EmployeeService.handleError);
    }

    public barChartOptions:any = {
         scaleShowVerticalLines: false,
          responsive: true
        };
        public barChartLabels:string[] = ['2006', '2007', '2008', '2009'];
        public barChartType:string = 'bar';
        public barChartLegend:boolean = true;

    public barChartData:any[] = [
       {data: [65, 59, 80, 81], label: 'Series A'},
        {data: [28, 48, 40, 19], label: 'Series B'}
      ];
    // Pie
      public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
      public pieChartData:number[] = [300, 500, 100];
    public pieChartType:string = 'pie';
public radarChartLabels:string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  public chartHovered(e:any):void {
        console.log(e);
      }

    public randomize():void {
        // Only Change 3 values
      let data = [
          Math.round(Math.random() * 100),
          59,
          80,
          (Math.random() * 100),
          56,
          (Math.random() * 100),
          40];
          let clone = JSON.parse(JSON.stringify(this.barChartData));
          clone[0].data = data;
          this.barChartData = clone;

       }

  public radarChartData:any = [
        {data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'},
        {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
      ];
  public radarChartType:string = 'radar';
}
