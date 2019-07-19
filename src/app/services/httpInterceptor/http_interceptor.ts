import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { ErrorHandler } from './error_handler';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(
        public errorHandler : ErrorHandler,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
        console.log('requestInterceptor init')
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((event: HttpEvent<any>) => {}, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                this.errorHandler.handleError(err);
                this.spinner.hide();
                this.router.navigateByUrl('/user-profile');
            }
        });
    }
}