import {AfterViewInit, Component, OnInit, Sanitizer, ViewChild} from '@angular/core';


import {
    SwiperConfigInterface,
    SwiperCoverflowEffectInterface,
    SwiperComponent,
    SwiperNavigationInterface
} from 'ngx-swiper-wrapper';
import {ApiUrlService} from '../services/api-url.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService, Mode} from '../services/user.service';
import {UserModel} from '../model/user/userModel';
import { Router } from '@angular/router';


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
    constructor(private router: Router,private userService: UserService,public apiUrlService: ApiUrlService, private fb: FormBuilder) {

    }

// swiper config
    config: SwiperConfigInterface;




    ngOnInit() {
      
        if(this.userService.currentUser._role==="user"){
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
        }else{
            this.setAdminMode();
        }
        
    }

    setAdminMode() : void{
        if(this.userService.mode === Mode.add){
            this.user = new UserModel();
            this.form = this.fb.group({
                username: [this.user._username, Validators.required],
                password: [this.user._password, Validators.required],
                email:[this.user._email,Validators.required],
                url: [this.user._url, Validators.required],
                port: [this.user._port, Validators.required],
                status: ['active', Validators.required],
                role: [this.user._role, Validators.required]
            });
        }else if(this.userService.mode === Mode.edit){
            this.user = this.userService.selectedUser
            this.form = this.fb.group({
                username: [this.user._username, Validators.required],
                password: [this.user._password, Validators.required],
                email:[{value:this.user._email, disabled: true}],
                url: [this.user._url, Validators.required],
                port: [this.user._port, Validators.required],
                status: [this.user._active?'active':'disabled', Validators.required],
                role: [this.user._role, Validators.required]
            });
            console.log(this.form.value)
        }
            
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
    
        this.user._port = this.form.getRawValue().port;
      
        this.save(this.user.key,this.user);


        // this.submitted = true;

    }


    isAdd():boolean{
        return  this.isAdmin() && (this.userService.mode === Mode.add);
    }
    isEdit():boolean{
        return  this.isAdmin() && (this.userService.mode === Mode.edit);
    }

    addNewUser(e): void{
        this.user._username = this.form.value.username;
        this.user._password = this.form.value.password;
        this.user._email = this.form.value.email;
        this.user._role = this.form.value.role;
        this.user._url = this.form.value.url;
        this.user._port = this.form.value.port;
        this.user._active = this.form.value.status === 'active'?true:false;
        console.log(this.form.value.status);
        console.log(this.user._active);

        if(this.form.valid){
            this.userService.createUser(this.user);
        }
    }

    updateCurrentUser(e): void{
        e.preventDefault();

        let u = new UserModel();
        u = this.userService.selectedUser

        u._username = this.form.value.username;
        u._password = this.form.value.password;
        u._email = this.form.getRawValue().email;
        u._role = this.form.value.role;
        u._url = this.form.value.url;
        u._port = this.form.value.port;
        u._active = this.form.value.status === 'active'?true:false;
        console.log(u)
        console.log(this.form.value)
        this.userService.updateUser(u.key,u);

        // this.router.navigateByUrl("/user-management");
    }

    isAdmin(): boolean{
        return (this.userService.currentUser._role === 'admin');
    }

    

}



