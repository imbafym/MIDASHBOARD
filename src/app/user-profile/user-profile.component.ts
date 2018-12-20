import {AfterViewInit, Component, OnInit, Sanitizer, ViewChild} from '@angular/core';


import {
    SwiperConfigInterface,
    SwiperCoverflowEffectInterface,
    SwiperComponent,
    SwiperNavigationInterface
} from 'ngx-swiper-wrapper';
import {ApiUrlService} from '../services/api-url.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {UserModel} from '../model/user/userModel';


// 3D 切换效果参数设置
const coverflowEffectConfig: SwiperCoverflowEffectInterface = {
    rotate: 0,
    stretch: 200,
    depth: 200,
    modifier: 1,
    slideShadows: false
};
// 前进后退按钮配置
const navigationConfig: SwiperNavigationInterface = {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    hideOnClick: true
    // disabledClass?: string;
    // hiddenClass?: string;
};

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    url = '';
    form: FormGroup;
    submitted = false;
    user: UserModel = new UserModel();
    constructor(private userService: UserService,public apiUrlService: ApiUrlService, private fb: FormBuilder) {

    }

// swiper config
    config: SwiperConfigInterface;




    ngOnInit() {
        console.log('ng init categoryu')

        this.userService.loginResult.subscribe(user => {
            this.user = user;
            this.user._userId = user._userId;
        })
        this.apiUrlService.currentUrl.subscribe(url => this.url = url)
        this.form = this.fb.group({
            username: [{value:this.user._username, disabled: true}],
            password: [{value:this.user._password, disabled: true}],
            email:[{value:this.user._email, disabled: true}],
            url: [this.user._url, Validators.required],
            port: [{value:this.user._port, disabled: true}]
        });


    }


    continue(): void {
        this.submitted = false;
        this.userService.loginResult.subscribe(user => {
            this.user = user;

        })
    }

    save(id, value) {
        this.userService.updateUser(id,value);
        this.user = new UserModel();
    }



    update(e) {
        e.preventDefault();
        let url = this.apiUrlService.setUrl(this.form.value.url,this.form.value.port );
        this.user._password = this.form.getRawValue().password;
        this.user._username = this.form.getRawValue().username;
        this.user._email = this.form.getRawValue().email;
        this.user._url = this.form.value.url;
        this.user._role = 'user';
        this.user._port = this.form.getRawValue().port;
        console.log(this.user)
        this.save(this.user._userId,this.user);


        // this.submitted = true;

    }




}



