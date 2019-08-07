import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { DateAdapter, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Category, ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { delay, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tax } from 'app/model/tax/tax';
@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    selected: string;
    categoryName: Array<any>;
    categories = [];
    form: FormGroup;
    categoriesInTable: Array<any>;
    hasData = false;
    showTotal = false;
    showProgress = false;
    dataSource = new MatTableDataSource<PeriodicElement>(this.categoriesInTable);
    values$: any;

    time = ['Today', 'Yesterday', 'This Month', 'LastMonth'];
    displayedColumns: string[] = ['catName', 'qtys', 'sum'];

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
    constructor(private router: Router, private dateAdapter: DateAdapter<Date>,
        public productService: ProductService, private fb: FormBuilder,
        private spinner: NgxSpinnerService) {
        dateAdapter.setLocale('nl');
    }


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
        setTimeout(() => {
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
            this.initShowToday()
        }, 500)
    }


    initShowToday() {
        this.hasData = false;

        var rawProduct = this.productService.getProductToday()
        var rawCategory = this.productService.getCategoryToday()

        if (rawCategory && rawProduct) {
            this.productService.getTodayForkStream().pipe(catchError(error => of(error))).subscribe(results => {
                var productSales = results[0];
                var categoriesSales = results[1];
                categoriesSales.forEach(c => {
                    var category = new Category;
                    category.categoryName = c.catName;
                    category.categoryQuantities = c.qtys;
                    category.categoryPrices = c.prices;
                    category.categoryTotals = 0;
                    category.categoryProdocuts = [];
                    productSales.forEach(p => {
                        if (p.catName == c.catName) {
                            category.categoryProdocuts.push(p)
                        }
                    })
                    this.categories.push(category)
                })
                this.categoriesInTable = [];
                if (this.selected == 'All Categories') {
                    this.categories.forEach(c => {
                        this.categoriesInTable.push(c)
                    })
                } else {
                    this.categories.forEach(c => {
                        if (c.categoryName == this.selected) {

                            this.categoriesInTable.push(c)

                        }
                    })
                }
                this.calculateEachCategoryTotal();
                this.sortData(this.categoriesInTable);
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.categoriesInTable);
                if (this.dataSource.data.length > 0) {
                    this.hasData = true
                }

                setInterval(e => {
                    this.showProgress = false
                }, 1000)
                this.spinner.hide();

            })
        } else {
            console.log('initial data error')
        }

    }

    nav(link) {
        this.router.navigateByUrl(link);
    }




    changeStringNumberTo2Float(value: string) {
        var result = Number(value)
        return parseFloat(result.toFixed(2))
    }


    onSubmit({ value, valid }, e: Event) {
        e.preventDefault();
        this.spinner.show();
        this.showProgress = true;
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
        this.hasData = false;
        this.categories = [];
        var option = value['timeOption']
        var stream;
        switch (option) {
            case 'Today':
                stream = this.productService.getTodayForkStream()
                break;
            case 'Yesterday':
                stream = this.productService.getYesterdayForkStream()
                break;
            case 'This Month':
                stream = this.productService.getThisMonthForkStream()
                break;
            case 'LastMonth':
                stream = this.productService.getLastMonthForkStream()
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
                category.categoryTotals = 0;
                category.categoryProdocuts = [];
                productSales.forEach(p => {
                    if (p.catName == c.catName) {
                        category.categoryProdocuts.push(p)
                    }
                })
                this.categories.push(category)
            })
            this.categoriesInTable = [];
            if (this.selected == 'All Categories') {
                this.categories.forEach(c => {
                    this.categoriesInTable.push(c)
                })
            } else {
                this.categories.forEach(c => {
                    if (c.categoryName == this.selected) {
                        this.categoriesInTable.push(c)
                    }
                })
            }
            this.calculateEachCategoryTotal();
            this.sortData(this.categoriesInTable);

            this.dataSource = new MatTableDataSource<PeriodicElement>(this.categoriesInTable);
            if (this.dataSource.data.length > 0) {
                this.hasData = true
            }



            setInterval(e => {
                this.showProgress = false
            }, 3000)
            this.spinner.hide()
        })
    }

    // getTotalQuantities() {
    //     return this.dataSource.map(t => t.qtys).reduce((acc, value) => acc + value, 0);
    // }


    getTotal(): number {
        return this.categoriesInTable.map(t => t.sum).reduce((acc, value) => (acc * 100 + value * 100) / 100, 0);
    }

    searchByDates({ value, valid }, e: Event) {
        this.hasData = false;

        this.categories = [];
        var dateFrom = changeDateFormate(value['dateFrom'])
        var dateTo = changeDateFormate(value['dateTo'])

        this.values$ = this.productService.getDateForkStream(dateFrom, dateTo)
            .subscribe(results => {
                var productSales = results[0];
                var categoriesSales = results[1];
                categoriesSales.forEach(c => {
                    var category = new Category;
                    category.categoryName = c.catName;
                    category.categoryQuantities = c.qtys;
                    category.categoryPrices = c.prices;
                    category.categoryTotals = 0;
                    category.categoryProdocuts = [];
                    productSales.forEach(p => {
                        if (p.catName == c.catName) {
                            category.categoryProdocuts.push(p);
                        }
                    })
                    this.categories.push(category)
                })
                this.categoriesInTable = [];
                if (this.selected == 'All Categories') {
                    this.categories.forEach(c => {

                        this.categoriesInTable.push(c)

                    })
                } else {
                    this.categories.forEach(c => {
                        if (c.categoryName == this.selected) {

                            this.categoriesInTable.push(c)

                        }
                    })
                }
                this.calculateEachCategoryTotal();
                this.sortData(this.categoriesInTable);
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.categoriesInTable);
                if (this.dataSource.data.length > 0) {
                    this.hasData = true
                }

                setInterval(e => {
                    this.showProgress = false
                }, 3000)
                this.spinner.hide()
            }
            )
    }

    getTax() {
        var rawTax = this.productService.getTaxes();
        rawTax.subscribe(res => {
            this.taxes = res;
        })
    }
    taxes: Tax[] = [];
    calculateEachCategoryTotal() {
        this.categoriesInTable.forEach(c => {
            c.categoryProdocuts.forEach(p => {
                var price = 0;
                var tax = this.taxes.filter(r => r.taxCategory === p.taxRate);
                price = parseFloat(parseFloat(p.prices).toFixed(2)) * (1 + tax[0].rate);
                p.price = price.toFixed(2);

                c.categoryTotals += this.calPriceWithTax(p.price , p.qtys);
            }
            )
            c.catName = c.categoryName;
            c.qtys= c.categoryQuantities;
            c.sum = c.categoryTotals = c.categoryTotals.toFixed(2);
        })
        this.showProgress = false;
        this.showTotal = true;
    }


    calPriceWithTax(price: string, qty: number): number {
        return parseFloat(parseFloat(price).toFixed(2)) * qty;
    }
  

    sortData(data) {
        data.sort(function (a, b) {
            var textA = a.categoryName.toUpperCase();
            var textB = b.categoryName.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
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

export function changeDateFormate(date): string {
    // var date = "2018-05-29T02:51:39.692104";
    var stillUtc = moment.utc(date).toDate(); //change utc time
    var local = moment(stillUtc).local().format('YYYY-MM-DD'); //change local timezone
    return local;
}