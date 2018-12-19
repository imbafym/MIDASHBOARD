import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ApiUrlService} from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseInfoService {

  constructor(private http: HttpClient,public apiUrlService: ApiUrlService) { }

    // url = this.apiUrlService.getUrl();
    url: string
    httpOptions = this.apiUrlService.getHttpOption()




    getDatabase():Observable<any>{

        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url + `/api/db/getDatabaseInfo`, this.httpOptions);
    }
}
