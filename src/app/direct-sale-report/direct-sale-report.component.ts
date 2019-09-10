import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Tax } from 'app/model/tax/tax';
import { MatTableDataSource, DateAdapter, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ProductService } from 'app/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'app/services/category.service';
import moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { DatabaseInfoService, User } from 'app/services/database-info.service';

@Component({
  selector: 'direct-sale-report',
  templateUrl: './direct-sale-report.component.html',
  styleUrls: ['./direct-sale-report.component.scss']
})
export class DirectSaleReportComponent implements OnInit {
  selectedUser: User;
  categoryName: Array<any>;
  categories = [];
  form: FormGroup;
  productsInTable:DirectSale[] = [];
  totalQty: number;
  totalPrice: number;
  // totalTotal: number;
  showTotal = false;
  showProgress = false;
  hasData: boolean = false;
  dataSourceNoPirce: any;

  time: OptionType[] = [];
  //    displayedColumns: string[] = ['productName', 'qtys', 'prices', 'sum', 'catName'];
  forkService: any
  taxes: Tax[] = [];
  users: User[] = [];
  displayedColumns: string[] = ['date','ticketId', 'userName','paytype','sales'];
  dataSource = new MatTableDataSource<DirectSale>(this.productsInTable);
  constructor(private router: Router, private dateAdapter: DateAdapter<Date>,
    public productService: ProductService, private fb: FormBuilder, private spinner: NgxSpinnerService,
    private dbInfoService: DatabaseInfoService) {
    dateAdapter.setLocale('nl');
  }


  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.spinner.show();
    this.categoryName = [];
    this.selectedUser = {
      userId: "-999",
      userName: "All Users",
    };
    this.form = this.fb.group({
      dateFrom: [null],
      dateTo: [null],
      radioOptions: ['1', Validators.required],
      timeOption: [OptionType.Today]
    },

    );
    this.time = this.getTimeOptions();
    this.getTax();
   

    this.getUsers();
    setTimeout(() => {
      this.initShowToday()
    }, 500);
  }


  getTimeOptions():OptionType[]{
    return [
      OptionType.Today,
      OptionType.Yesterday,
      OptionType.ThisMonth,
      OptionType.LastMonth
    ]
  }
  getTimeOptionName(option: OptionType):string{
    switch(option){
      case OptionType.Today: return "Today";
      case OptionType.Yesterday: return "Yesterday";
      case OptionType.ThisMonth: return "ThisMonth";
      case OptionType.LastMonth: return "LastMonth";
    }
  }



  ngOnDestroy() {
    // this.forkService.unsubscribe();
  }

  getTax() {
    var rawTax = this.productService.getTaxes();
    rawTax.subscribe(res => {
      this.taxes = res;
    })
  }

  getUsers() {
    var rawCustomer = this.dbInfoService.getUsers();
    rawCustomer.subscribe(res => {
      this.users = res;
      this.users.push(this.selectedUser);
      this.users.sort((a, b) => {
        var nameA = a.userName.toLowerCase(), nameB = b.userName.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
    })
    console.log(this.users)
  })
  }





  initShowToday() {
    var rawProductToday = this.productService.getDirectSaleProductToday();
    forkJoin(rawProductToday).subscribe(results => {
      this.productsInTable = results[0];
      this.dealData(this.productsInTable);
      this.dataSource = new MatTableDataSource<DirectSale>(this.productsInTable);
      if (this.dataSource.data.length > 0) {
          this.hasData = true;
      }
      setInterval(e => {
        this.showProgress = false
      }, 1500)
      this.spinner.hide();
    })
  }

  initShowYesterday() {
    var rawProductToday = this.productService.getDirectSaleProductYesterday();
    forkJoin(rawProductToday).subscribe(results => {
      this.productsInTable = results[0];
      this.dealData(this.productsInTable);

      this.dataSource = new MatTableDataSource<DirectSale>(this.productsInTable);
      if (this.dataSource.data.length > 0) {
          this.hasData = true;
      }
      setInterval(e => {
        this.showProgress = false
      }, 1500)
      this.spinner.hide();
    })
  }


  initData(option: OptionType,{ value, valid }): void{
    let rawData: Observable<DirectSale[]> = null;
    switch(option){
      case OptionType.Today: rawData = this.productService.getDirectSaleProductToday(); break;
      case OptionType.Yesterday: rawData = this.productService.getDirectSaleProductYesterday();break;
      case OptionType.ThisMonth: rawData = this.productService.getDirectSaleProductThisMonth();break;
      case OptionType.LastMonth: rawData = this.productService.getDirectSaleProductLastMonth();break;
      case OptionType.ByDate:   
      var dateFrom = this.changeDateFormate(value['dateFrom'])
      var dateTo = this.changeDateFormate(value['dateTo'])
      rawData = this.productService.getDirectSaleCategoryProductSalesByDate(dateFrom,dateTo);
    }

    forkJoin(rawData).subscribe(results => {
      this.productsInTable = results[0];
      console.log(this.selectedUser)
      if(this.selectedUser && this.selectedUser.userId !== '-999'){
        this.productsInTable = this.productsInTable.filter(p=>p.userId === this.selectedUser.userId)
      }

      this.dealData(this.productsInTable);

      this.dataSource = new MatTableDataSource<DirectSale>(this.productsInTable);
      if (this.dataSource.data.length > 0) {
          this.hasData = true;
      }
      setInterval(e => {
        this.showProgress = false
      }, 1500)
      this.spinner.hide();
    })
  }


  dealData(productsInTable: DirectSale[]){
    for(let product of productsInTable){
        product.date = this.changeDateFormate(product.date);
        // const tax = this.taxes.filter(r => r.taxCategory === product.taxRate);
        // product.sales = parseFloat((product.sales * 1000 * (1 + tax[0].rate) / 1000).toFixed(2));
    }
  }

  changeDateFormate(date): string {
    // var date = "2018-05-29T02:51:39.692104";
    var stillUtc = moment.utc(date).toDate(); //change utc time
    var local = moment(stillUtc).local().format('YYYY-MM-DD HH:MM'); //change local timezone
    return local;
  }

  changeStringNumberTo2Float(value: string) {
    var result = Number(value)
    return parseFloat(result.toFixed(2))
  }


  onSelectChanged({ value, valid }, e: Event){
    this.onSubmit({ value, valid }, e);
}

  onSubmit({ value, valid }, e: Event) {
    // e.preventDefault();
    this.showProgress = true;
    this.spinner.show();
    let option:OptionType = null;
    if (value['radioOptions'] == '2') {
      option = OptionType.ByDate;
    } else if (value['radioOptions'] == '1') {
      option = Number(value['timeOption']);
    } else {
      console.log('radio option no value', value['radioOptions'])
      return;
    }
    setTimeout(() => {
      this.initData(option,{ value, valid })
    }, 500);
  }

  sortData(data) {
    data.sort(function (a, b) {
      var textA = a.productName.toUpperCase();
      var textB = b.productName.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }

  getTotal() {
     return this.productsInTable.map(p => p.sales).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);
  }
}

export interface Customer{
  name: string;
  id: string;
}

export enum OptionType{
  Today,
  Yesterday,
  ThisMonth,
  LastMonth,
  ByDate
}



export interface DirectSale {
  user: string,
  date: string,
  paytype: string,
  sales: number,
  ticketId: string,
  userId: string
}




export interface PeriodicElement {
  productName: string;
  catName: string;
  qtys: number;
  prices: number;
  totals: number;
  total: number;
  sum: number;
}



