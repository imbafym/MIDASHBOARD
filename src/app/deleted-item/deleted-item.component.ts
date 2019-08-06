import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Tax } from 'app/model/tax/tax';
import { MatTableDataSource, DateAdapter, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ProductService, DeletedItem } from 'app/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseInfoService } from 'app/services/database-info.service';
import { forkJoin, Observable } from 'rxjs';
import moment from 'moment';
import { Customer } from 'app/direct-sale-report/direct-sale-report.component';


@Component({
  selector: 'app-deleted-item',
  templateUrl: './deleted-item.component.html',
  styleUrls: ['./deleted-item.component.scss']
})
export class DeletedItemComponent implements OnInit {
  selectedCustomer: Customer;
  categories = [];
  form: FormGroup;
  deletedItemInTable:DeletedItem[] = [];
  totalQty: number;
  totalPrice: number;

  showTotal = false;
  showProgress = false;
  hasData: boolean = false;

 

  forkService: any
  taxes: Tax[] = [];
  customers: Customer[] = [];
  displayedColumns: string[] = ['date', 'customer','productName', 'qty','sale','user'];
  dataSource = new MatTableDataSource<DeletedItem>(this.deletedItemInTable);
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

    this.selectedCustomer = {
      id: "-999",
      name: "All Customers",
    };
    this.form = this.fb.group({
    },
    );

    this.getTax();

    this.getCustomers();
    setTimeout(() => {
      this.initData()
    }, 500);
  }
  onSelectChanged(event: any){
    console.log('i am changed',event);
    this.initData();
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

  getCustomers() {
    var rawCustomer = this.dbInfoService.getCustomers();
    rawCustomer.subscribe(res => {
      this.customers = res;
      this.customers.push(this.selectedCustomer);
      this.customers.sort((a, b) => {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
    })
    console.log(this.customers)
  })
  }


  async flushData():Promise<void>{
    
    let flush1 = await this.productService.flushDeletedView().toPromise();
    let flush2 = await this.productService.flushDeletedtickets().toPromise();

    this.initData();
  }
 


  initData(): void{
    let rawData: Observable<DeletedItem[]> = null;

      rawData = this.productService.getDeletedItem();
    

    forkJoin(rawData).subscribe(results => {
      this.deletedItemInTable = results[0];
      console.log(this.selectedCustomer)
      if(this.selectedCustomer && this.selectedCustomer.id !== '-999'){
        this.deletedItemInTable = this.deletedItemInTable.filter(p=>p.customer === this.selectedCustomer.id)
      }

      this.dealData(this.deletedItemInTable);

      this.dataSource = new MatTableDataSource<DeletedItem>(this.deletedItemInTable);
      if (this.dataSource.data.length > 0) {
          this.hasData = true;
      }
      setInterval(e => {
        this.showProgress = false
      }, 1500)
      this.spinner.hide();
    })
  }


  dealData(productsInTable: DeletedItem[]){
    for(let product of productsInTable){
        product.date = this.changeDateFormate(product.date);
    }
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

  // onSubmit({ value, valid }, e: Event) {
  //   e.preventDefault();
  //   this.showProgress = true;
  //   this.spinner.show();
  //   let option:OptionType = null;
  //   if (value['radioOptions'] == '2') {
  //     option = OptionType.ByDate;
  //   } else if (value['radioOptions'] == '1') {
  //     option = Number(value['timeOption']);
  //   } else {
  //     console.log('radio option no value', value['radioOptions'])
  //     return;
  //   }
  //   setTimeout(() => {
  //     this.initData(option,{ value, valid })
  //   }, 500);
  // }

  sortData(data) {
    data.sort(function (a, b) {
      var textA = a.productName.toUpperCase();
      var textB = b.productName.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }

  getTotal() {
     return this.deletedItemInTable.map(p => Number(p.sale)).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);
  }
}







