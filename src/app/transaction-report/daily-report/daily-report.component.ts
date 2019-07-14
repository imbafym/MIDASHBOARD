import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { PeriodicElement } from 'app/product/product.component';
import { ProductService } from 'app/services/product.service';
import { changeDateFormate } from 'app/category/category.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};




@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DailyReportComponent implements OnInit {
  displayedColumns: string[] = ['Day', 'Sales', 'Trans', 'Average'];
  dataSource: MatTableDataSource<PeriodicElement>;
  dailyTrans: any[] = [];
  daysInMonth: number;
  tempDailyTrans = new Map<string, any>();
  hasData: boolean = false;
  form: FormGroup;

  constructor(private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit() {
    let date = new Date();
    this.daysInMonth = this.getDaysInOneMonth(date.getFullYear(), date.getMonth() + 1);
    this.initDailyTrans();
    this.fetchData();
    this.form = this.fb.group({
      date: [moment()]
    })
  }


  chosenYearHandler(normalizedYear: Moment) {
    let date = this.form.get('date')
    const ctrlValue = date.value;
    ctrlValue.year(normalizedYear.year());
    date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    let date = this.form.get('date')    
    const ctrlValue = date.value;
    ctrlValue.month(normalizedMonth.month());
    date.setValue(ctrlValue);
    datepicker.close();
  }


  async fetchData(): Promise<void> {
    var rawReport = await this.productService.getThisMonthDailyTran();
    rawReport.subscribe(res => {
     this.populateData(res);
    });
  }



  populateData(res: any){
    res.forEach(r => {
      let day: DailyTran = {
        avg: '-',
        day: '-',
        total: '-',
        tran: '-'
      };
      day.day = r.day;
      day.avg = r.avg;
      day.total = r.total;
      day.tran = r.tran;

      if (this.tempDailyTrans.has(r.day.toString())) {
        this.tempDailyTrans.set(r.day.toString(), day)
      }
    })
    this.tempDailyTrans.forEach((key, value) => {
      this.dailyTrans.push(key);
    })
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.dailyTrans);

    if (this.dataSource.data.length > 0) {
      this.hasData = true
    }
  }


  onSubmit({ value, valid }, e: Event) {
    e.preventDefault();
    this.dataSource = null;
    this.hasData = false;
    this.dailyTrans = [];
    this.tempDailyTrans = new Map();
    this.searchDailyTranByMonthYear({value,valid}, e);
  }

  searchDailyTranByMonthYear({ value, valid }, e: Event): void {
    
    
    let date = this.form.get('date');
    var month = date.value.format('MM');
    var year = date.value.format('YYYY');
    this.daysInMonth = this.getDaysInOneMonth(year, month);

    this.initDailyTrans();
    var rawReport = this.productService.getDailyTranByMonthYear(month,year);
    rawReport.subscribe(res => {
      this.populateData(res);
    });
  }

  initDailyTrans(): void {
    for (let i = 0; i < this.daysInMonth; i++) {
      let day: DailyTran = {
        avg: '-',
        day: '-',
        total: '-',
        tran: '-'
      };
      day.day = (i + 1).toString();
      this.tempDailyTrans.set(day.day, day);
    }
  }

  getTotal() {
    return this.dailyTrans.filter(t => t.total !== '-').reduce((acc, value) => (acc * 1000 + value.total * 1000) / 1000, 0);
  }

  getTotalTran(): number {
    return this.dailyTrans.filter(t => t.avg !== '-').reduce((acc, value) => (acc * 1000 + value.tran * 1000) / 1000, 0);
  }


  getDaysInOneMonth(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
  }

}


export interface DailyTran {
  avg: string,
  day: string,
  total: string,
  tran: string
}