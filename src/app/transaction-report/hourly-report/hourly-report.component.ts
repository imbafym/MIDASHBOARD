import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { PeriodicElement } from 'app/product/product.component';
import { ProductService } from 'app/services/product.service';
import { DailyTran } from '../daily-report/daily-report.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { changeDateFormate } from 'app/category/category.component';
import { getTodayDate } from 'app/dashboard/dashboard.component';

@Component({
  selector: 'app-hourly-report',
  templateUrl: './hourly-report.component.html',
  styleUrls: ['./hourly-report.component.scss']
})
export class HourlyReportComponent implements OnInit {
  displayedColumns: string[] = ['Hour', 'Sales', 'Trans', 'Average'];
  dataSource: MatTableDataSource<PeriodicElement>;
  hourlyTrans: any[] = [];
  hoursInDay: number;
  tempHourlyTrans = new Map<string, any>();
  hasData: boolean = false;
  todayDate:string;
  form: FormGroup;
  hour = 'hour';
  chartData = [];
  chartColor = [];

  constructor(private productService: ProductService, private fb: FormBuilder) { }


  ngOnInit() {
    this.initDailyTrans();
    this.fetchData();
    this.form = this.fb.group({
      date: [null]
    })
  }


  onSubmit({ value, valid }, e: Event) {
    e.preventDefault();

    this.dataSource = null;
    this.hasData = false;
    this.hourlyTrans = [];
    this.initDailyTrans();
    this.chartColor =[];
    this.chartData = [];
    this.searchHourlyTranByDate({ value, valid }, e);

  }






  async fetchData(): Promise<void> {


    var rawReport = await this.productService.getTodayHourlyTran();
    rawReport.subscribe(res => {
      this.populateData(res);
    });
  }

  populateData(res: any) {
    res.forEach(r => {
      let hour: HourlyTran = {
        avg: '-',
        hour: '-',
        total: '-',
        tran: '-'
      };
      hour.hour = r.hour;
      hour.avg = r.avg;
      hour.total = r.total;
      hour.tran = r.tran;
      if (this.tempHourlyTrans.has(r.hour.toString())) {
        this.tempHourlyTrans.set(r.hour.toString(), hour)
      }
    })
    this.tempHourlyTrans.forEach((key, value) => {
      this.hourlyTrans.push(key);
    })
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.hourlyTrans);

    if (this.dataSource.data.length > 0) {
      this.hasData = true
    }
    this.setChartData();

  }

  setChartData(): void{
    this.hourlyTrans.forEach(d=>{
      let temp = {
            "name": Number(d.hour),
            "value": Number(d.total)?Number(d.total):0
      }
      this.chartData.push(temp);
      this.chartColor.push('#95a5a6');
    })
   }

  searchHourlyTranByDate({ value, valid }, e: Event): void {
    var date = changeDateFormate(value['date'])
    console.log(date,'date in search')
    if(date === "Invalid date"){
      date = this.todayDate
    }
    var rawReport = this.productService.getHourlyTranByDate(date);
    rawReport.subscribe(res => {
      this.populateData(res);
    });
  }




  initDailyTrans(): void {
    let date = new Date();
    this.todayDate = changeDateFormate(getTodayDate());
    console.log('today',this.todayDate)
    this.hoursInDay = 24;
    for (let i = 0; i < this.hoursInDay; i++) {
      let hour: HourlyTran = {
        avg: '-',
        hour: '-',
        total: '-',
        tran: '-'
      };
      hour.hour = (i).toString();
      this.tempHourlyTrans.set(hour.hour, hour);
    }
  }

  getTotal() {
    return this.hourlyTrans.filter(t => t.total !== '-').reduce((acc, value) => (acc * 1000 + value.total * 1000) / 1000, 0);
  }

  getTotalTran(): number {
    return this.hourlyTrans.filter(t => t.avg !== '-').reduce((acc, value) => (acc * 1000 + value.tran * 1000) / 1000, 0);
  }

  getHourName(hour: string): string {
    if (Number(hour) < 10) {
      hour = '0' + hour;
    }
    return `${hour}:00 - ${hour}:59`;
  }
}






export interface HourlyTran {
  avg: string,
  hour: string,
  total: string,
  tran: string
}