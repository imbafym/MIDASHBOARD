import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { PeriodicElement } from 'app/product/product.component';
import { ProductService } from 'app/services/product.service';
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
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MonthlyReportComponent implements OnInit {
  displayedColumns: string[] = ['Month', 'Sales', 'Trans', 'Average'];
  dataSource: MatTableDataSource<PeriodicElement>;
  monthlyTrans: any[] = [];
  monthInYear: number;
  tempMonthlyTrans = new Map<string, any>();
  hasData: boolean = false;
  form: FormGroup;
  month = 'month';
  chartData = [];
  chartColor = [];
  constructor(private productService: ProductService,private fb: FormBuilder) { }

  ngOnInit() {
    this.initMonthlyTrans();
    this.fetchData();
    this.form = this.fb.group({
      date: [moment()]
    })
  }

  chosenYearHandler(normalizedYear: Moment,datepicker: MatDatepicker<Moment>) {
    let date = this.form.get('date')
    const ctrlValue = date.value;
    ctrlValue.year(normalizedYear.year());
    date.setValue(ctrlValue);
    datepicker.close();
  }


  async fetchData(): Promise<void> {

   
    var rawReport = await this.productService.getThisYearMonthlyTran();
    rawReport.subscribe(res => {
      this.populateData(res);
    });
  }


   populateData(res : any){
    res.forEach(r => {
      let month: MonthlyTran = {
        avg: '-',
        month: '-',
        total: '-',
        tran: '-'
      };
      month.month = r.month.toString();
      month.avg = r.avg;
      month.total = r.total;
      month.tran = r.tran;
      if (this.tempMonthlyTrans.has(r.month.toString())) {
        this.tempMonthlyTrans.set(r.month.toString(), month)
      }
    })
    this.tempMonthlyTrans.forEach((key, value) => {
      this.monthlyTrans.push(key);
    })
    console.log(this.monthlyTrans)

    this.dataSource = new MatTableDataSource<PeriodicElement>(this.monthlyTrans);

    if (this.dataSource.data.length > 0) {
      this.hasData = true
    }
    this.setChartData();
   }



   setChartData(): void{
    this.monthlyTrans.forEach(d=>{
      let temp = {
            "name": this.getMonthName(d.month),
            "value": Number(d.total)?Number(d.total):0
      }
      this.chartData.push(temp);
      this.chartColor.push('#95a5a6');
    })
   }


   onSubmit({ value, valid }, e: Event) {
    e.preventDefault();
    this.dataSource = null;
    this.hasData = false;
    this.monthlyTrans = [];
    this.chartColor =[];
    this.chartData = [];
    this.tempMonthlyTrans = new Map();
    this.searchMonthlyTranByYear({value,valid}, e);
  }
  searchMonthlyTranByYear({ value, valid }, e: Event): void{
    let date = this.form.get('date');
    var year = date.value.format('YYYY');
    this.initMonthlyTrans();
    var rawReport = this.productService.getMonthlyTranByYear(year);
    rawReport.subscribe(res => {
      this.populateData(res);
    });
  }



  initMonthlyTrans(): void {
    let date = new Date();
    this.monthInYear = 12;
    for (let i = 0; i < this.monthInYear; i++) {
      let month: MonthlyTran = {
        avg: '-',
        month: '-',
        total: '-',
        tran: '-'
      };
      month.month = (i+1).toString();
      this.tempMonthlyTrans.set(month.month.toString(), month);
    }
  }

  getTotal() {
    return this.monthlyTrans.filter(t => t.total !== '-').reduce((acc, value) => (acc * 1000 + value.total * 1000) / 1000, 0);
  }

  getTotalTran(): number {
    return this.monthlyTrans.filter(t => t.avg !== '-').reduce((acc, value) => (acc * 1000 + value.tran * 1000) / 1000, 0);
  }

  getMonthName(month: string):string{
    switch(month){
      case '1': return 'Jan';
      case '2': return 'Feb';
      case '3': return 'Mar';
      case '4': return 'Apr';
      case '5': return 'May';
      case '6': return 'Jun';
      case '7': return 'Jul';
      case '8': return 'Aug';
      case '9': return 'Sep';
      case '10': return 'Oct';
      case '11': return 'Nov';
      case '12': return 'Dec';
    }
 }
}






export interface MonthlyTran {
  avg: string,
  month: string,
  total: string,
  tran: string
}