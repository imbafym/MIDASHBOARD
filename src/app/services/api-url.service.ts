import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/Rx';

@Injectable({
    providedIn: 'root'
})
export class ApiUrlService {

    serverUrl = {
        url: '', //http://192.168.123.110:3000
        httpOptions: {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
            })
        }
    }




    private urlSource = new BehaviorSubject<string>('default message');
    private isLoginSource = new BehaviorSubject<boolean>(false);
    currentUrl = this.urlSource.asObservable();
    isLogin = this.isLoginSource.asObservable();
    constructor() {
    }


    setUrl(url: string,port:string) {
        this.urlSource.next("http://" + url+ ":"+port);
    }

    setBoolean(flag){
        this.isLoginSource.next(flag);
    }





    getHttpOption(){
        return this.serverUrl.httpOptions
    }


// const serverUrl: string = '//192.168.123.150:3011';


}
