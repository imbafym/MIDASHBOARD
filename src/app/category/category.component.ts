import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DateAdapter, MatPaginator, MatTableDataSource } from '@angular/material';
import { Category, ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { PeriodicElement } from '../product/product.component';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { delay, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
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
    dataSource:MatTableDataSource<PeriodicElement>;
    values$: any;

    time = ['Today', 'Yesterday', 'This Month', 'LastMonth'];
    displayedColumns: string[] = ['catName', 'qtys', 'sum'];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private router: Router, private dateAdapter: DateAdapter<Date>, 
        public productService: ProductService, private fb: FormBuilder,
        private spinner: NgxSpinnerService) {
        dateAdapter.setLocale('nl');
    }


    ngOnInit() {
       
        this.selected = 'All Categories';
        this.categoryName = [];
        this.form = this.fb.group({
            dateFrom: [null],
            dateTo: [null],
            radioOptions: ['1', Validators.required],
            timeOption: ['Today']
        },
        );
       
        var rawCategories = this.productService.getCategory();

        rawCategories.subscribe(results => {
            this.categoryName = results
         }
        )
        this.initShowToday()
    }


    initShowToday() {
        this.spinner.show();
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
                this.setTablePaginator();
                setInterval(e => {
                    this.showProgress = false
                }, 1500)
            })
        } else {
            console.log('initial data error')
        }

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
        if (value['radioOptions'] == '2') {
            this.searchByDates({ value, valid }, e);
        } else if (value['radioOptions'] == '1') {
            this.searchByOptions({ value, valid }, e)
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
        

            this.setTablePaginator();
            setInterval(e => {
                this.showProgress = false
            }, 3000)
        })
    }

    // getTotalQuantities() {
    //     return this.dataSource.map(t => t.qtys).reduce((acc, value) => acc + value, 0);
    // }


    getTotal(): number{
        return this.categoriesInTable.map(t => t.categoryTotals).reduce((acc,value)=> (acc*100 + value*100)/100, 0);
    }

    searchByDates({ value, valid }, e: Event) {
        this.hasData = false;

        this.categories = [];
        var dateFrom = this.changeDateFormate(value['dateFrom'])
        var dateTo = this.changeDateFormate(value['dateTo'])

        this.values$ = this.productService.getDateForkStream(dateFrom,dateTo)
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
                this.setTablePaginator();
                setInterval(e => {
                    this.showProgress = false
                }, 3000)
            }
            )
    }


    calculateEachCategoryTotal() {
        this.categoriesInTable.forEach(c => {
            c.categoryProdocuts.forEach(p => {
                var price = 0;
                if (p.taxRate === '001') {
                    price = parseFloat(parseFloat(p.prices).toFixed(2)) * 1.1;
                } else {
                    price = parseFloat(parseFloat(p.prices).toFixed(2))
                }
                price = parseFloat(price.toFixed(2));
                p.price = price;
                c.categoryTotals += (price * p.qtys);
            }
            )
            c.categoryTotals = c.categoryTotals.toFixed(2);
        })
        this.showProgress = false;
        this.showTotal = true;
    }

    setTablePaginator() {
        this.dataSource.paginator = this.paginator;
    }


    sortData(data){
        data.sort(function(a, b) {
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
    total: number
}

