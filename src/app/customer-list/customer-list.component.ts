import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, DateAdapter, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ProductService } from 'app/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseInfoService } from 'app/services/database-info.service';
import moment from 'moment';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  selected: string;
  form: FormGroup;
  customerInfos: CustomerInfo[] = [];
  totalQty: number;
  totalPrice: number;
  showTotal = false;
  showProgress = false;
  hasData: boolean = false;
  dataSourceNoPirce: any;
  forkService: any
  displayedColumns: string[] = [ 'Name', 'Mobile', 'Email','Address', 'City', 'Postcode','Group','Points','Debt','Note'];
  dataSource = new MatTableDataSource<CustomerInfo>(this.customerInfos);
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
      setTimeout(() => {
          this.initData(0)
      }, 500);
  }

  async initData(option: OptionType, value = null, valid = null): Promise<void> {
      this.spinner.show();
      let rawData: CustomerInfo[] = null;
     
      rawData = await this.dbInfoService.getCustomerInfo().toPromise();
      this.customerInfos = rawData;
      this.dataSource = new MatTableDataSource<CustomerInfo>(this.customerInfos);
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


  onSubmit({ value, valid }, e: Event) {
      e.preventDefault();
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

 



}

export enum OptionType{
  Today,
  Yesterday,
  ThisMonth,
  LastMonth,
  ByDate
}

export interface CustomerInfo {
  id : string;
  name:string;
  mobile:string;
  email:string;
  address:string;
  address2:string;
  city:string;
  postcode:string;
  groups:string;
  points:number;
  debt:number;
  note:string;
}

