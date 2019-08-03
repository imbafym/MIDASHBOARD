import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { DateAdapter, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Category, ProductService } from '../services/product.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Tax } from 'app/model/tax/tax';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit,AfterViewChecked {
    ngAfterViewChecked(): void {
        this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;

    }
    selected: string;
    categoryName: Array<any>;
    categories = [];
    form: FormGroup;
    productsInTable: Array<any>;
    totalQty: number;
    totalPrice: number;
    // totalTotal: number;
    showTotal = false;
    showProgress = false;
    hasData: boolean = false;
    dataSourceNoPirce: any;

    time = ['Today', 'Yesterday', 'This Month', 'Last Month'];
    //    displayedColumns: string[] = ['productName', 'qtys', 'prices', 'sum', 'catName'];
    forkService: any
    taxes: Tax[] = [];
    displayedColumns: string[] = ['productName', 'qtys', 'sum'];
    dataSource = new MatTableDataSource<PeriodicElement>(this.productsInTable);
    constructor(private router: Router, private dateAdapter: DateAdapter<Date>,
        public productService: ProductService, private fb: FormBuilder, private spinner: NgxSpinnerService) {
        dateAdapter.setLocale('nl');
    }


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit() {
        this.spinner.show();
        
        this.selected = 'All Categories';
        this.categoryName = [];
        this.form = this.fb.group({
            dateFrom: [null],
            dateTo: [null],
            radioOptions: ['1', Validators.required],
            timeOption: ['Today']
        },

        );
        this.getTax();

        var rawCategories = this.productService.getCategory();
        rawCategories.subscribe(results => {
            this.categoryName =  results;
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
            this.initShowToday()
        }, 500);
    }

    ngOnDestroy() {
        this.forkService.unsubscribe();
    }

    getTax() {
        var rawTax = this.productService.getTaxes();
        rawTax.subscribe(res => {
            this.taxes = res;
        })
    }

    initShowToday() {
        var rawProduct = this.productService.getProductToday()
        var rawCategory = this.productService.getCategoryToday()
        setTimeout(() => {
            this.forkService = this.productService.getTodayForkStream().subscribe(results => {
                var productSales = results[0];
                var categoriesSales = results[1];

                categoriesSales.forEach(c => {
                    var category = new Category;
                    category.categoryName = c.catName;
                    category.categoryQuantities = c.qtys;
                    category.categoryPrices = c.prices;
                    category.categoryTotals = c.totals;
                    category.categoryProdocuts = [];
                    productSales.forEach(p => {
                        if (p.catName == c.catName) {
                            category.categoryProdocuts.push(p)
                        }
                    })
                    this.categories.push(category)
                })
                this.productsInTable = [];

                if (this.selected == 'All Categories') {
                    this.categories.forEach(c => {
                        c.categoryProdocuts.forEach(p => {
                            this.productsInTable.push(p)
                        })
                    })
                } else {
                    this.categories.forEach(c => {
                        if (c.categoryName == this.selected) {
                            c.categoryProdocuts.forEach(p => {
                                this.productsInTable.push(p)
                            })
                        }
                    })
                }
                this.productsInTable = this.dealData(this.productsInTable);
                this.sortData(this.productsInTable);

                this.calculateTotal();

                this.dataSource = new MatTableDataSource<PeriodicElement>(this.productsInTable);
                if (this.dataSource.data.length > 0) {
                    this.hasData = true;
                }
            
                setInterval(e => {
                    this.showProgress = false
                }, 1500)
                this.spinner.hide();
            })
        }, 500)

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
        this.spinner.show();
        if (value['radioOptions'] == '2') {
            setTimeout(() => {
                this.searchByDates({ value, valid }, e);
            }, 500);
        } else if (value['radioOptions'] == '1') {
            setTimeout(() => {
                this.searchByOptions({ value, valid }, e)
            }, 500);
        } else {
            console.log('radio option no value', value['radioOptions'])
        }


    }


    searchByOptions({ value, valid }, e: Event) {
        this.hasData = false;;
        this.categories = [];
        var option = value['timeOption']
        var stream;
        switch (option) {
            case 'Today':
                stream = this.productService.getTodayForkStream();
                break;
            case 'Yesterday':
                stream = this.productService.getYesterdayForkStream();

                break;
            case 'This Month':
                stream = this.productService.getThisMonthForkStream();

                break;
            case 'Last Month':
                stream = this.productService.getLastMonthForkStream();

                break;
        }
        stream.subscribe(results => {
            var productSales = results[0];
            var categoriesSales = results[1];

            categoriesSales.forEach(c => {
                var category = new Category;
                category.categoryName = c.catName;
                category.categoryQuantities = c.qtys;
                category.categoryPrices = c.prices;
                category.categoryTotals = c.totals;
                category.categoryProdocuts = [];
                productSales.forEach(p => {
                    if (p.catName == c.catName) {
                        category.categoryProdocuts.push(p)
                    }
                })
                this.categories.push(category)
            })
            this.productsInTable = [];
            var obj = {};
            if (this.selected == 'All Categories') {
                this.categories.forEach(c => {
                    c.categoryProdocuts.forEach(p => {
                        this.productsInTable.push(p)
                    })
                })
            } else {
                this.categories.forEach(c => {
                    if (c.categoryName == this.selected) {
                        c.categoryProdocuts.forEach(p => {
                            this.productsInTable.push(p)
                        })
                    }
                })

            }

            this.productsInTable = this.dealData(this.productsInTable);
            this.sortData(this.productsInTable);

            this.calculateTotal();

            this.dataSource = new MatTableDataSource<PeriodicElement>(this.productsInTable);
            if (this.dataSource.data.length > 0) {
                this.hasData = true;
            }
          
            setInterval(e => {
                this.showProgress = false
            }, 1500)
            this.spinner.hide();
        })
    }



    searchByDates({ value, valid }, e: Event) {
        this.hasData = false;
        this.categories = [];
        var dateFrom = this.changeDateFormate(value['dateFrom'])
        var dateTo = this.changeDateFormate(value['dateTo'])

        var rawProductSales = this.productService.getCategoryProductSalesByDate(dateFrom, dateTo);
        var rawCategoriesSales = this.productService.getCategorySalesByDate(dateFrom, dateTo);
        this.productService.getDateForkStream(dateFrom, dateTo)
            .subscribe(results => {
                var productSales = results[0];
                var categoriesSales = results[1];

                categoriesSales.forEach(c => {
                    var category = new Category;
                    category.categoryName = c.catName;
                    category.categoryQuantities = c.qtys;
                    category.categoryPrices = c.prices;
                    category.categoryTotals = c.totals;
                    category.categoryProdocuts = [];
                    productSales.forEach(p => {
                        if (p.catName == c.catName) {
                            category.categoryProdocuts.push(p)
                        }
                    })
                    this.categories.push(category)
                })
                this.productsInTable = [];
                if (this.selected == 'All Categories') {
                    this.categories.forEach(c => {
                        c.categoryProdocuts.forEach(p => {
                            this.productsInTable.push(p)
                        })
                    })
                } else {
                    this.categories.forEach(c => {
                        if (c.categoryName == this.selected) {
                            c.categoryProdocuts.forEach(p => {
                                this.productsInTable.push(p)
                            })
                        }
                    })
                }
                this.productsInTable = this.dealData(this.productsInTable);
                console.log(this.productsInTable)
                this.sortData(this.productsInTable);

                this.calculateTotal();
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.productsInTable);
                if (this.dataSource.data.length > 0) {
                    this.hasData = true;
                }
            
                setInterval(e => {
                    this.showProgress = false
                }, 1500)
                this.spinner.hide();

            }
            )
    }

    sortData(data) {
        data.sort(function (a, b) {
            var textA = a.productName.toUpperCase();
            var textB = b.productName.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }


    calculateTotal() {
        this.totalPrice = 0;
        this.totalQty = 0;
        if (this.productsInTable.length === 0) return;
        this.productsInTable.forEach(p => {
            var price = 0;
            var tax = this.taxes.filter(r => r.taxCategory === p.taxRate);
            price = parseFloat(parseFloat(p.prices).toFixed(2)) * (1 + tax[0].rate);
            p.prices = price.toFixed(2);

            this.totalPrice += (p.prices * p.qtys);

            p.sum = this.calPriceWithTax(p.prices,p.qtys);
         
            this.totalQty += p.qtys;
        })
        this.showProgress = false;
        this.showTotal = true;
    }



    calPriceWithTax(price: string, qty: number): number {
        return parseFloat(parseFloat(price).toFixed(2)) * qty;
    }


    
    dealData(data: any) {
        var listArr = [];
        data.forEach(p => {
            for (var i = 0; i < listArr.length; i++) {
                if (listArr[i].productName == p.productName) {
                    listArr[i].qtys += p.qtys;
                    listArr[i].totals += p.totals;
                    return;
                }
            }
            // first time no data
            listArr.push({
                catName: p.catName,
                prices: p.prices,
                productName: p.productName,
                qtys: p.qtys,
                taxRate: p.taxRate,
                totals: p.totals,
            })
        })
        return listArr;
    }

    getTotal(): number {
        // return this.productsInTable.map(t => t.prices * t.qtys).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);
        return this.productsInTable.map(t => t.sum).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);

    }




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


