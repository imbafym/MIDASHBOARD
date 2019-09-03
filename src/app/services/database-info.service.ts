import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ApiUrlService} from './api-url.service';
import { UserService } from './user.service';
import { CustomerInfo } from 'app/customer-list/customer-list.component';


@Injectable({
  providedIn: 'root'
})
export class DatabaseInfoService {

  constructor(private http: HttpClient,public apiUrlService: ApiUrlService,private _userService : UserService) { }

    // url = this.apiUrlService.getUrl();
    url: string
    httpOptions = this.apiUrlService.getHttpOption()




    getDatabase():Observable<any>{
      if(this._userService.currentUser._role === "admin") return;
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url + `/api/db/getDatabaseInfo`, this.httpOptions);
    }


    getCustomers():Observable<any>{
      this.apiUrlService.currentUrl.subscribe(url => this.url = url);
      return this.http.get(this.url + `/api/users/getCustomers`, this.httpOptions);
  }
getCustomerInfo():Observable<CustomerInfo[]>{
  this.apiUrlService.currentUrl.subscribe(url => this.url = url);
  return this.http.get<CustomerInfo[]>(this.url + `/api/users/queryCustomerInfo`, this.httpOptions);
}


  getUsers():Observable<User[]>{
    this.apiUrlService.currentUrl.subscribe(url => this.url = url);
    return this.http.get<User[]>(this.url + `/api/users/getUsers`, this.httpOptions);
}


    getBusiness():Observable<any>{
        this.apiUrlService.currentUrl.subscribe(url => this.url = url);

        return this.http.get(this.url + `/api/users/getBusinessName`, this.httpOptions);
    }
}


export interface User{
  userName: string;
  userId: string;
}