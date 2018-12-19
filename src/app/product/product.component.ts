import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DateAdapter, MatPaginator, MatTableDataSource} from '@angular/material';
import {Category, ProductService} from '../services/product.service';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';


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
    productsInTable: Array<any>;
    totalQty: number;
    totalPrice: number;
    // totalTotal: number;
    showTotal = false;
    showProgress = false;
    dataSource:any;


    time = ['Today', 'Yesterday', 'This Month', 'Last Month'];
//    displayedColumns: string[] = ['productName', 'qtys', 'prices', 'sum', 'catName'];
    displayedColumns: string[] = ['productName', 'qtys', 'prices', 'sum'];





    constructor(private router: Router, private dateAdapter: DateAdapter<Date>, public productService: ProductService, private fb: FormBuilder) {
        dateAdapter.setLocale('nl');
    }


    @ViewChild(MatPaginator) paginator: MatPaginator;

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



    initShowToday(){
        var rawProduct = this.productService.getProductToday()
        var rawCategory = this.productService.getCategoryToday()
        forkJoin([rawProduct, rawCategory]).subscribe(results => {
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

            this.calculateTotal();

            this.dataSource = new MatTableDataSource<PeriodicElement>(this.productsInTable);
            console.log(this.dataSource, 'DATA')

            this.setTablePaginator();
            setInterval(e => {
                this.showProgress = false
            }, 1500)
        })
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


    onSubmit({value, valid}, e: Event) {
        e.preventDefault();
        this.showProgress = true;
        if (value['radioOptions'] == '2') {
            this.searchByDates({value, valid}, e);
        } else if (value['radioOptions'] == '1') {
            this.searchByOptions({value, valid}, e)
        } else {
            console.log('radio option no value', value['radioOptions'])
        }


    }


    searchByOptions({value, valid}, e: Event) {
        this.categories = [];
        var option = value['timeOption']
        // var rawProduct,rawCategory;
        switch (option) {
            case 'Today':
                var rawProduct = this.productService.getProductToday()
                var rawCategory = this.productService.getCategoryToday()
                break;
            case 'Yesterday':
                var rawProduct = this.productService.getProductYesterday()
                var rawCategory = this.productService.getCategoryYesterday()
                break;
            case 'This Month':
                var rawProduct = this.productService.getProductThisMonth()
                var rawCategory = this.productService.getCategoryThisMonth()
                break;
            case 'Last Month':
                var rawProduct = this.productService.getProductLastMonth()
                var rawCategory = this.productService.getCategoryLastMonth()
                break;
        }
        forkJoin([rawProduct, rawCategory]).subscribe(results => {
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

            this.calculateTotal();

            this.dataSource = new MatTableDataSource<PeriodicElement>(this.productsInTable);
            console.log(this.dataSource, 'DATA')

            this.setTablePaginator();
            setInterval(e => {
                this.showProgress = false
            }, 1500)
        })
    }

    getTotalQuantities() {
        return this.dataSource.map(t => t.qtys).reduce((acc, value) => acc + value, 0);
    }



    searchByDates({value, valid}, e: Event) {
        this.categories = [];
        var dateFrom = this.changeDateFormate(value['dateFrom'])
        var dateTo = this.changeDateFormate(value['dateTo'])

        var rawProductSales = this.productService.getCategoryProductSalesByDate(dateFrom, dateTo);
        var rawCategoriesSales = this.productService.getCategorySalesByDate(dateFrom, dateTo);
        forkJoin([rawProductSales, rawCategoriesSales])
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

                    this.calculateTotal();
                this.dataSource = new MatTableDataSource<PeriodicElement>(this.productsInTable);
                this.setTablePaginator();
                    setInterval(e => {
                        this.showProgress = false
                    }, 1500)
                }
            )
    }


    calculateTotal() {
        this.totalPrice = 0;
        // this.totalTotal = 0;
        this.totalQty = 0;

        this.productsInTable.forEach(p => {

            // console.log(p,'this is products in Table')
            var price = 0;
            if(p.taxRate === "001"){
               price  = parseFloat(parseFloat(p.prices).toFixed(2)) * 1.1;
            }else{
                price  = parseFloat(parseFloat(p.prices).toFixed(2))
            }
            p.prices = price;
            // console.log(p.qtys*price,"this is qtys * price")
            this.totalPrice += (price * p.qtys);
            this.totalQty += p.qtys;
        })
        // console.log(this.totalPrice, 'this is total price')
        this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
        this.showProgress = false;
        this.showTotal = true;
    }

    setTablePaginator() {
        this.dataSource.paginator = this.paginator;
    }

}


export interface PeriodicElement {
    productName: string;
    catName: string;
    qtys: number;
    prices: number;
    totals:number;
    total: number
}


