import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, DateAdapter, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ProductService } from 'app/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseInfoService, User } from 'app/services/database-info.service';
import { getToday, getYesterday, getThisMonth, getLastMonth } from 'app/utils/date-format';
import moment from 'moment';

@Component({
  selector: 'app-user-sales',
  templateUrl: './user-sales.component.html',
  styleUrls: ['./user-sales.component.scss']
})
export class UserSalesComponent implements OnInit {
  selected: string;
  form: FormGroup;
  userSales: UserSale[] = [];
  totalQty: number;
  totalPrice: number;
  showTotal = false;
  showProgress = false;
  hasData: boolean = false;
  dataSourceNoPirce: any;
  users: User[] = [];


  forkService: any
  selectedUser: User;
  time: OptionType[] = [];

  displayedColumns: string[] = ['userName', 'sale'];
  dataSource = new MatTableDataSource<UserSale>(this.userSales);
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
      this.selected = 'All Categories';
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
      this.getUsers();
      setTimeout(() => {
          this.initData(0)
      }, 500);
  }

  ngOnDestroy() {
      // this.forkService.unsubscribe();
  }

 

  getUsers() {
      var rawUser = this.dbInfoService.getUsers();
      rawUser.subscribe(res => {
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


  async getFilteredUserSearch(dateFrom: string, dateTo: string): Promise<UserSale[]> {
      let res = null;
      if (this.selectedUser.userId === "-999") {
          res = await this.productService.getUserSale(dateFrom, dateTo).toPromise();
      } else {
          res = await this.productService.getUserSale(dateFrom, dateTo).toPromise();
      }
      return res;
  }



  async initData(option: OptionType, value = null, valid = null): Promise<void> {
      this.spinner.show();
      let dateFrom: string, dateTo: string = null;
      let rawData: UserSale[] = null;
      switch (option) {
          case OptionType.Today: dateFrom = dateTo = getToday(); break;
          case OptionType.Yesterday: dateFrom = dateTo = getYesterday(); break;
          case OptionType.ThisMonth: [dateFrom, dateTo] = getThisMonth(); break;
          case OptionType.LastMonth: [dateFrom, dateTo] = getLastMonth(); break;
          case OptionType.ByDate:
              dateFrom = this.changeDateFormate(value['dateFrom']);
              dateTo = this.changeDateFormate(value['dateTo']);
              break;
      }
      rawData = await this.getFilteredUserSearch(dateFrom, dateTo);

      this.userSales = rawData;
      
      if (this.selectedUser.userId !== "-999") {
          this.userSales = this.userSales.filter(p => p.id === this.selectedUser.userId)
      }

      this.dataSource = new MatTableDataSource<UserSale>(this.userSales);
      if (this.dataSource.data.length > 0) {
          this.hasData = true;
      }
      setInterval(e => {
          this.showProgress = false
      }, 1500)
      this.spinner.hide();

  }


  nav(link) {
      this.router.navigateByUrl(link);
  }


  changeDateFormate(date): string {
      // var date = "2018-05-29T02:51:39.692104";
      var stillUtc = moment.utc(date).toDate(); //change utc time
      var local = moment(stillUtc).local().format('YYYY-MM-DD'); //change local timezone
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
    //   e.preventDefault();
      this.showProgress = true;
      // this.spinner.show();
      let option: OptionType = null;

      if (value['radioOptions'] == '2') {
          option = OptionType.ByDate;
      } else if (value['radioOptions'] == '1') {
          option = Number(value['timeOption']);
      } else {
          console.log('radio option no value', value['radioOptions'])
      }
      setTimeout(() => {
          this.initData(option, value, valid)
      }, 500);
  }

  sortData(data) {
      data.sort(function (a, b) {
          var textA = a.productName.toUpperCase();
          var textB = b.productName.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
  }

  getTimeOptions(): OptionType[] {
      return [
          OptionType.Today,
          OptionType.Yesterday,
          OptionType.ThisMonth,
          OptionType.LastMonth
      ]
  }
  getTimeOptionName(option: OptionType): string {
      switch (option) {
          case OptionType.Today: return "Today";
          case OptionType.Yesterday: return "Yesterday";
          case OptionType.ThisMonth: return "ThisMonth";
          case OptionType.LastMonth: return "LastMonth";
      }
  }

  getTotal(): number {
      // return this.productsInTable.map(t => t.prices * t.qtys).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);
      return this.userSales.map(t => t.sale).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);

  }



}



export enum OptionType{
  Today,
  Yesterday,
  ThisMonth,
  LastMonth,
  ByDate
}



export interface UserSale {
  userName:string;
  sale: number;
  id: string;
}
