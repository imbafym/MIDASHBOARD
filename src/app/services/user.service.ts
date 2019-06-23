import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../model/user/userModel';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Subject } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { ApiUrlService } from './api-url.service';
import { User } from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    currentUser: UserModel;
    selectedUser: UserModel;
    mode: Mode = Mode.add;
    private dbPath = '/users';
    usersRef: AngularFireList<UserModel> = null;

    users: Observable<UserModel[]>;
    userList: UserModel[] = [];
    private resultSource = new BehaviorSubject<any>('');
    loginResult = this.resultSource.asObservable();

    constructor(private http: HttpClient, db: AngularFireDatabase, private apiUrlService: ApiUrlService) {
        this.usersRef = db.list(this.dbPath);
       this.initialData();
       this.users.subscribe(queriedItems => {
        this.userList = queriedItems;
    });
    }

    initialData(): void{
        this.users = this.fetchAllUser();
        //query all
        
    }

    clean(){
        this.users = new Observable<UserModel[]>();
        this.userList = [];
        console.log('this is clean')
    }

    fetchAllUser(): Observable<any> {
        // Use snapshotChanges().map() to store the key
       return  this.usersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    authenticateUser(username, password) {
        //query all
        this.users.subscribe(queriedItems => {
            queriedItems.map(item => {

                if (item._username == username) {
                    if (item._password == password) {
                        if(item._active){
                            this.resultSource.next(item);
                        }
                    }
                }

            })

        });


    }

    createUser(user: UserModel): void {
        this.usersRef.push(user);
    }

    updateUser(key: string, value: any): void {
        this.usersRef.update(key, value).catch(error => this.handleError(error));
    }

    deleteUser(key: string): void {
        this.usersRef.remove(key).catch(error => this.handleError(error));
    }

    getUsersList(): AngularFireList<UserModel> {
        return this.usersRef;
    }

    deleteAll(): void {
        this.usersRef.remove().catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }

}

export enum Mode{
    add,
    edit,
    delete
} 
