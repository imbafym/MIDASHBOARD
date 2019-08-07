import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateAdapter, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Category, ProductService } from '../services/product.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Tax } from 'app/model/tax/tax';
import { NgxSpinnerService } from 'ngx-spinner';
import { getToday, getThisMonth, getLastMonth, getYesterday } from 'app/utils/date-format';
import { DatabaseInfoService } from 'app/services/database-info.service';
import { Customer, OptionType } from 'app/direct-sale-report/direct-sale-report.component';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    selected: string;
    categoryName: Array<any>;
    categories = [];
    form: FormGroup;
    productsInTable: (ProductCategoryDiscountWithCustomerDto | ProductCategoryDiscountWithAllCustomerDto)[] = [];
    totalQty: number;
    totalPrice: number;
    // totalTotal: number;
    showTotal = false;
    showProgress = false;
    hasData: boolean = false;
    dataSourceNoPirce: any;
    customers: Customer[] = [];


    //    displayedColumns: string[] = ['productName', 'qtys', 'prices', 'sum', 'catName'];
    forkService: any
    taxes: Tax[] = [];
    selectedCustomer: Customer;
    time: OptionType[] = [];

    displayedColumns: string[] = ['productName', 'qty', 'sale', 'discount'];
    dataSource = new MatTableDataSource<ProductCategoryDiscountWithCustomerDto | ProductCategoryDiscountWithAllCustomerDto>(this.productsInTable);
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
        this.categoryName = [];
        this.selectedCustomer = {
            id: "-999",
            name: "All Customers",
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
        this.getCustomers();
        var rawCategories = this.productService.getCategory();
        rawCategories.subscribe(results => {
            this.categoryName = results;
            this.categoryName.sort((a, b) => {
                var nameA = a.NAME.toLowerCase(), nameB = b.NAME.toLowerCase();
                if (nameA < nameB) //sort string ascending
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0; //default return value (no sorting)
            })
        }
        )
        setTimeout(() => {
            this.initData(0)
        }, 500);
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


    async getFilteredCustomerSearch(dateFrom: string, dateTo: string): Promise<ProductCategoryDiscountWithCustomerDto[] | ProductCategoryDiscountWithAllCustomerDto[]> {
        let res = null;
        if (this.selectedCustomer.id === "-999") {
            res = await this.productService.getProductWithCategoryAndUserAndDiscountWithAllCustomer(dateFrom, dateTo).toPromise();
        } else {
            res = await this.productService.getProductWithCategoryAndUserAndDiscountWithCustomer(dateFrom, dateTo).toPromise();
        }
        return res;
    }



    async initData(option: OptionType, value = null, valid = null): Promise<void> {
        this.spinner.show();
        let dateFrom: string, dateTo: string = null;
        let rawData: ProductCategoryDiscountWithCustomerDto[] | ProductCategoryDiscountWithAllCustomerDto[] = null;
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
        rawData = await this.getFilteredCustomerSearch(dateFrom, dateTo);

        this.productsInTable = rawData;
        if (this.selected !== 'All Categories') {
            this.productsInTable = this.productsInTable.filter(p => p.CategoryName === this.selected)
        }
        if (this.selectedCustomer.id !== "-999") {
            this.productsInTable = this.productsInTable.filter(p => p.CustomerId === this.selectedCustomer.id)
        }

        this.dataSource = new MatTableDataSource<ProductCategoryDiscountWithCustomerDto | ProductCategoryDiscountWithAllCustomerDto>(this.productsInTable);
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
        return this.productsInTable.map(t => t.sale).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);

    }

    getTotalDiscount(): number {
        // return this.productsInTable.map(t => t.prices * t.qtys).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);
        return this.productsInTable.map(t => t.discount).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);

    }

}


export interface ProductCategoryDiscountWithAllCustomerDto {
    productName: string,
    CategoryName: string,
    qtys: number,
    discount: number,
    sale: number,
    CustomerId: string
}
export interface ProductCategoryDiscountWithCustomerDto {
    productName: string,
    CategoryName: string,
    qtys: number,
    discount: number,
    sale: number,
    customerName: string,
    CustomerId: string
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
