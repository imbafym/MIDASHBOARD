

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {ApiUrlService} from './api-url.service';

@Injectable({
    providedIn: 'root'
})
export class ActiveRouterService implements CanActivate {
    constructor(private router: Router, private http: HttpClient, private apiUrlService : ApiUrlService) {}
// : Observable<any>
    isLogin:boolean;
    canActivate() {
        console.log('canActivate goes here');
        // 这里返回一个Observable<boolean>
        // return this.http.get('/api/isLogin').map(item => {
        //     return item['success'];
        // });
        this.apiUrlService.isLogin.subscribe(islogin => this.isLogin = islogin);


        if (!this.isLogin) {
            console.log('User is not login');
            this.router.navigate(['/login']);
            return this.isLogin;
        }else{
            console.log('user login')
            return this.isLogin;
        }
    }
}