import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ApiUrlService} from './api-url.service';

@Injectable()
export class ProductService {

    constructor(private http: HttpClient, public apiUrlService: ApiUrlService) {
    }

    url :string;


    httpOptions = this.apiUrlService.getHttpOption()
    getCategory(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);
        return this.http.get(this.url+ `/api/categories/queryAllCategories`,this.httpOptions);
    }


    getCategorySalesByDate(dateFrom, dateTo): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryCategoriesSalesWithDate?dateFrom=${dateFrom}&dateTo=${dateTo}`,this.httpOptions);
    }

    getCategoryProductSalesByDate(dateFrom, dateTo): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryCategoriesProductSalesWithDate?dateFrom=${dateFrom}&dateTo=${dateTo}`,this.httpOptions);
    }



    getProductToday(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryProductToday`,this.httpOptions);
    }
    getProductYesterday(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryProductYesterday`,this.httpOptions);
    }
    getProductThisMonth(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryProductThisMonth`,this.httpOptions);
    }
    getProductLastMonth(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryProductLastMonth`,this.httpOptions);
    }

    getCategoryToday(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryCategoryToday`,this.httpOptions);
    }
    getCategoryYesterday(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryCategoryYesterday`,this.httpOptions);
    }
    getCategoryThisMonth(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryCategoryThisMonth`,this.httpOptions);
    }
    getCategoryLastMonth(): Observable<any> {
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url+ `/api/categories/queryCategoryLastMonth`,this.httpOptions);
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


