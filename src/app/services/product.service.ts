import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiUrlService } from './api-url.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of, throwError, forkJoin, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tax } from 'app/model/tax/tax';
import { HourlyTran } from 'app/transaction-report/hourly-report/hourly-report.component';
import { MonthlyTran } from 'app/transaction-report/monthly-report/monthly-report.component';
import { DirectSale } from 'app/direct-sale-report/direct-sale-report.component';
import { ProductCategoryDiscountWithAllCustomerDto, ProductCategoryDiscountWithCustomerDto } from 'app/product/product.component';
import { CustomerSale } from 'app/customer-sales/customer-sales.component';
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




    getCategory(): Observable<any> {

        return this.http.get(this.url + `/api/categories/queryAllCategories`, this.httpOptions).share();
    }


    getCategorySalesByDate(dateFrom, dateTo): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoriesSalesWithDate?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
    }

    getCategoryProductSalesByDate(dateFrom, dateTo): Observable<any> {


        return this.http.get(this.url + `/api/categories/queryCategoriesProductSalesWithDate?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
    }

    // get all product 
    getProductWithCategoryAndUserAndDiscountWithAllCustomer(dateFrom, dateTo): Observable<ProductCategoryDiscountWithAllCustomerDto> {

        return this.http.get<ProductCategoryDiscountWithAllCustomerDto>(this.url + `/api/categories/queryProductWithCategoryAndUserAndDiscountWithAllCustomer?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
    }
    // get all product with customer id
    getProductWithCategoryAndUserAndDiscountWithCustomer(dateFrom, dateTo): Observable<ProductCategoryDiscountWithCustomerDto> {

        return this.http.get<ProductCategoryDiscountWithCustomerDto>(this.url + `/api/categories/queryProductWithCategoryAndUserAndDiscountWithCustomer?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
    }

    getDirectSaleCategoryProductSalesByDate(dateFrom, dateTo): Observable<DirectSale[]> {
        return this.http.get<DirectSale[]>(this.url + `/api/categories/queryDirectSaleCategoriesProductSalesWithDate?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
    }

    getDeletedItem(): Observable<DeletedItem[]> {
        return this.http.get<DeletedItem[]>(this.url + `/api/categories/queryDeletedItem`, this.httpOptions).share();
    }

    flushDeletedView(){
        return this.http.get(this.url + `/api/categories/queryFlushDeletedView`, this.httpOptions).share();
    }
    flushDeletedtickets() {
        return this.http.get(this.url + `/api/categories/queryFlushDeletedtickets`, this.httpOptions).share();
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

//////////////////////////////////////////////
getDirectSaleProductToday(): Observable<DirectSale[]> {

    return this.http.get<DirectSale[]>(this.url + `/api/categories/queryDirectSaleProductToday`, this.httpOptions).share();
}
getDirectSaleProductYesterday(): Observable<DirectSale[]> {

    return this.http.get<DirectSale[]>(this.url + `/api/categories/queryDirectSaleProductYesterday`, this.httpOptions).share();
}

getDirectSaleProductThisMonth(): Observable<DirectSale[]> {
    return this.http.get<DirectSale[]>(this.url + `/api/categories/queryDirectSaleProductThisMonth`, this.httpOptions).share();
}

getDirectSaleProductLastMonth(): Observable<DirectSale[]> {
    return this.http.get<DirectSale[]>(this.url + `/api/categories/queryDirectSaleProductLastMonth`, this.httpOptions).share();
}
/////////////////////////////////////////////


//==============customer sale==========================
getCustomerSale(dateFrom, dateTo): Observable<CustomerSale[]> {

    return this.http.get<CustomerSale[]>(this.url + `/api/categories/queryCustomerSales?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
}

getUserSale(dateFrom, dateTo): Observable<CustomerSale[]> {

    return this.http.get<CustomerSale[]>(this.url + `/api/categories/queryUserSales?dateFrom=${dateFrom}&dateTo=${dateTo}`, this.httpOptions).share();
}



//==============user sale==========================

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

    getTodayHourlyTran(): Observable<any>{
        return this.http.get(this.url + `/api/categories/queryTodayHourlyTran`, this.httpOptions).share();
    }
    getThisMonthDailyTran(): Observable<any>{
        return this.http.get(this.url + `/api/categories/queryThisMonthDailyTran`, this.httpOptions).share();
    }

    getThisYearMonthlyTran(): Observable<any>{
        return this.http.get(this.url + `/api/categories/queryThisYearMonthlyTran`, this.httpOptions).share();
    }


    getHourlyTranByDate(date: string): Observable<HourlyTran>{
        return this.http.get<HourlyTran>(this.url + `/api/categories/queryHourlyTranBydate?date=${date}`, this.httpOptions).share();
    }
    getMonthlyTranByYear(year: string): Observable<HourlyTran>{
        return this.http.get<HourlyTran>(this.url + `/api/categories/queryMonthlyTranByYear?year=${year}`, this.httpOptions).share();
    }
    getDailyTranByMonthYear(month: string,year: string): Observable<MonthlyTran>{
        return this.http.get<MonthlyTran>(this.url + `/api/categories/queryDailyTranByMonthYear?month=${month}&year=${year}`, this.httpOptions).share();
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


export interface DeletedItem{
    date: string, 
    productName: string, 
    qty: number, 
    sale: string,
    customer: string, // assume id from customer
    user: string
}

