import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiUrlService } from './api-url.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of, throwError, forkJoin, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tax } from 'app/model/tax/tax';
@Injectable()
export class ProductService {

    constructor(private http: HttpClient, public apiUrlService: ApiUrlService) {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);
        this.initForkStream();
    }

    url: string;
    todayProcut: any;
    todayCategorty: any;
    forkTodayStream: any;
    forkYesterdayStream: any;
    forkThisMonthStream: any;
    forkLastMonthStream: any;
    forkDateStream: any;


    allTodayProductsData$: Observable<any>;
    allTodayCategortyData$: Observable<any>;
    allYesterdayProductData$: Observable<any>;
    allYesterdayCategortyData$: Observable<any>;
    allThisMonthProductData$: Observable<any>;
    allThisMonthCategortyData$: Observable<any>;
    allLastMonthProductData$: Observable<any>;
    allLastMonthCategortyData$: Observable<any>;
    allProductFromDate$: Observable<any>;
    allCategortyFromDate$: Observable<any>;
    httpOptions = this.apiUrlService.getHttpOption()


    initForkStream() {
        var todayProduct = this.getProductToday();
        var todayCategorty = this.getCategoryToday();
        this.forkTodayStream = forkJoin(todayProduct, todayCategorty)

        var yesterdayProduct = this.getProductYesterday();
        var yesterdayCategorty = this.getCategoryYesterday();
        this.forkYesterdayStream = forkJoin(yesterdayProduct, yesterdayCategorty)

        var thisMonthProduct = this.getProductThisMonth();
        var thisMonthCategorty = this.getCategoryThisMonth();
        this.forkThisMonthStream = forkJoin(thisMonthProduct, thisMonthCategorty)

        var lastMonthProduct = this.getProductLastMonth();
        var lastMonthCategorty = this.getCategoryLastMonth();
        this.forkLastMonthStream = forkJoin(lastMonthProduct, lastMonthCategorty)



    }
    getTodayForkStream() {
        return this.forkTodayStream;
    }
    getYesterdayForkStream() {
        return this.forkYesterdayStream;
    }
    getThisMonthForkStream() {
        return this.forkThisMonthStream;
    }
    getLastMonthForkStream() {
        return this.forkLastMonthStream;
    }
    getDateForkStream(fromDate,endDate){
     var productFromDate = this.getCategoryProductSalesByDate(fromDate,endDate)
     var categoryFromDate = this.getCategorySalesByDate(fromDate,endDate)
     this.forkDateStream = forkJoin(productFromDate,categoryFromDate);
     return this.forkDateStream;
    }

    getStreamTodayProducts() {
        if (this.todayProcut) {
            return Observable.of(this.todayProcut);
        }
        if (this.allTodayProductsData$) {
            return this.allTodayProductsData$
        }
        this.allTodayProductsData$ = this.http
            .get(this.url + `/api/categories/queryProductToday`, this.httpOptions)
            .pipe(catchError(error => of(error)))
            .share();
        return this.allTodayProductsData$
    }
    getStreamTodayCategories() {
        if (this.todayProcut) {
            return Observable.of(this.todayProcut);
        }
        if (this.allTodayCategortyData$) {
            return this.allTodayCategortyData$
        }
        this.allTodayCategortyData$ = this.http
            .get(this.url + `/api/categories/queryCategoryToday`, this.httpOptions).share()
            .pipe(catchError(error => of(error)))
            .share();
        return this.allTodayCategortyData$
    }



    getCategory(): Observable<any> {

        return this.http.get(this.url + `/api/categories/queryAllCategories`, this.httpOptions).share();
    }


    getCategorySalesByDate(dateFrom, dateTo): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoriesSalesWithDate?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
    }

    getCategoryProductSalesByDate(dateFrom, dateTo): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoriesProductSalesWithDate?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
    }



    getProductToday(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryProductToday`, this.httpOptions).share();
    }

    getProductYesterday(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryProductYesterday`, this.httpOptions).share();
    }
    getProductThisMonth(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryProductThisMonth`, this.httpOptions).share();
    }
    getProductLastMonth(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryProductLastMonth`, this.httpOptions).share();
    }

    getCategoryToday(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoryToday`, this.httpOptions).share();
    }
    getCategoryYesterday(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoryYesterday`, this.httpOptions).share();
    }
    getCategoryThisMonth(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoryThisMonth`, this.httpOptions).share();
    }
    getCategoryLastMonth(): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoryLastMonth`, this.httpOptions).share();
    }

    getTaxes(): Observable<any>{
        return this.http.get(this.url + `/api/categories/queryTaxes`, this.httpOptions).share();
    }


}

export class Category {
    categoryName: string
    categoryQuantities: string
    categoryPrices: string
    categoryTotals: number
    categoryProdocuts: Array<any>
    categoryTaxRate: string
    constructor() {
    }
}


