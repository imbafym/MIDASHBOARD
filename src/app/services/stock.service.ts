import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ApiUrlService} from './api-url.service';
import {catchError} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class StockService {

    url: string;

    constructor(private http: HttpClient, public apiUrlService: ApiUrlService) {

    }

    httpOptions = this.apiUrlService.getHttpOption()

    searchStockByBarcode(barcode: string): Observable<Stock[]> {
        var data = {
            barcode: barcode
        };
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        // Add safe, URL encoded search parameter if there is a search term
        const options = barcode ?
            {
                headers: new HttpHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type':'application/json'
                })
            } : {
                headers: new HttpHeaders({
                    'Access-Control-Allow-Origin': '*',
                })
            };

        return this.http.post<Stock[]>(this.url + '/api/stock/queryStockById',
            JSON.stringify(data),options);
    }

    updateSellPriceByID(id, price){
       return this.http.put(`${this.url}/api/stock/queryUpdateProductSellPrice?id=${id}&sellprice=${price}`,
           this.httpOptions);
    }

    updateBuyPriceByID(id, price){
        return this.http.put(`${this.url}/api/stock/queryUpdateProductBuyPrice?id=${id}&buyprice=${price}`,
            this.httpOptions);
    }

    updateCurrentStock(id,location,unit){
        var data = {
            id: id,
            location: location,
            unit: unit
        };
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        // Add safe, URL encoded search parameter if there is a search term
        const options = {
                headers: new HttpHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type':'application/json'
                })
            }

        return this.http.post(this.url + '/api/stock/queryUpdateCurrentStock',
            JSON.stringify(data),options);
    }

    insertRecordInStockDiary(reason,id,units,price,location){
        var data = {
            reason: reason,
            location: location,
            product: id,
            units: units,
            price: price
        }
            // Add safe, URL encoded search parameter if there is a search term
            const options = {
                headers: new HttpHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type':'application/json'
                })
            }

        return this.http.post(this.url +'/api/stock/queryInsertRecordInStockDiary',
            JSON.stringify(data),options);
    }

}


export class Stock {
    ID: string;
    NAME: string;
    PRICEBUY: number;
    PRICESELL: number;
    CAT_NAME: string;
    IMAGE: string;
    TAX_RATE: string;
    STOCK: number;
    CODE: string;
    DISPLAY:string;


}