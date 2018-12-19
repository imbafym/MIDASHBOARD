import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ApiUrlService} from './api-url.service';
@Injectable()
export class SalesService {

  constructor(private http: HttpClient,public apiUrlService: ApiUrlService) { }
     url:string
     httpOptions = this.apiUrlService.getHttpOption()


    getSalesByDate(date):Observable<any>{
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)

        return this.http.get(this.url+ `/api/payments/queryByDate?date=${date}`,this.httpOptions);

    }

    getTodaySales():Observable<any>{
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        return this.http.get(this.url+ `/api/payments/queryToday`,this.httpOptions);

    }
    getYesterdaySales():Observable<any>{
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        return this.http.get(this.url+ `/api/payments/queryYesterday`,this.httpOptions);
    }
    getThisMonthSales():Observable<any>{
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        return this.http.get(this.url+ `/api/payments/queryThisMonth`,this.httpOptions);
    }
    getLastMonthSales():Observable<any>{
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        return this.http.get(this.url+ `/api/payments/queryLastMonth`,this.httpOptions);
    }
    getPayMethod():Observable<any>{
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        return this.http.get(this.url+`/api/payments/queryPayMethod`,this.httpOptions);
    }


}

export class Sales {
    paymethod:string;
    totalToday:string;
    totalYesterday:string;
    totalThisMonth:string;
    totalLastMonth:string;
    constructor(){}
}


