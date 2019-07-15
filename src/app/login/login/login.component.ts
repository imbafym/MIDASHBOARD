import { Component, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrlService } from '../../services/api-url.service';
import { UserModel } from '../../model/user/userModel';
import { interval } from 'rxjs/internal/observable/interval';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    url = '';
    hasUser = false;
    isValid = true;
    hideSpinner: boolean;
    constructor(private router: Router, private userService: UserService,
        public apiUrlService: ApiUrlService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService) {
    }


    ngOnInit() {

        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            // ip:[this.url]
        });
    }

    onSubmit(e: Event) {
        // console.log(this.form.value.username,this.form.value.password,'login input')
        this.userService.authenticateUser(this.form.value.username, this.form.value.password);
        this.spinner.show();
        setTimeout(()=>{

            this.userService.loginResult.subscribe(result => {

                this.hasUser = !!result
    
                if (this.hasUser && result._role === "user") {
                    this.userService.currentUser = result;
                    this.apiUrlService.setBoolean(true);
                    this.apiUrlService.setUrl(result._url, result._port)
                    this.spinner.hide();
                    this.router.navigateByUrl('dashboard')
                    this.hideSpinner = true;
    
                } else if (this.hasUser && result._role === "admin") {
                    this.userService.currentUser = result;
                    this.apiUrlService.setBoolean(true);
                    this.apiUrlService.setUrl(result._url, result._port)
                    this.spinner.hide();
                    this.router.navigateByUrl('user-management')
                } else {
                    this.apiUrlService.setBoolean(false);
                    this.isValid = false;
                    this.spinner.hide();
                }
    
    
            })


        },500)
      

    }

}
