import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { UserService, Mode } from 'app/services/user.service';
import { UserModel } from 'app/model/user/userModel';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit,AfterViewChecked{
  
  users = [];
  constructor(private _userService: UserService,public router: Router) { }
  selectedIndex: number;
  selectedUser: UserModel;
  ngOnInit() {
     this.fetchUsers();
      console.log(this.users)
  }

  fetchUsers(): void{
    this.users = [];
    this._userService.initialData();
    this._userService.userList.map(res=>{
      this.users.push(res);
    });
  }

  ngAfterViewChecked(): void {
    this.fetchUsers();
  }
  rowSelected(user: UserModel,i : number): void{
    this.selectedIndex = i;
    this.selectedUser = user;
    this._userService.selectedUser = user;
    console.log(this.selectedUser.key);
  }

  isAcitve(status:string): boolean{
    return status==="active";
  }

  onChangeStatus(status: boolean,user: UserModel): void{
     user._active = !status;
     this._userService.updateUser(user.key ,user);
  }

  add(): void{
    this._userService.mode = Mode.add;
    this.router.navigateByUrl('/user-profile');
  }

  edit(): void{
    if(!this._userService.selectedUser) {
      alert('please select one user!');
      return;
    }
    this._userService.mode = Mode.edit;
    this.router.navigateByUrl('/user-profile');
  }
  

  delete():void{
    console.log(' i am delete')
    if(this.selectedUser._role === 'admin'){
      alert('cannot delete admin');
      return;
    };
    this._userService.deleteUser(this.selectedUser.key);
    alert('User' + this.selectedUser._username +  ' is deleted');
    this.fetchUsers();
  }
}
