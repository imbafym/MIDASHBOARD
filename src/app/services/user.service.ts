import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {UserModel} from '../model/user/userModel';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {BehaviorSubject, Subject} from 'rxjs/Rx';
import {map} from 'rxjs/operators';
import {switchMap} from 'rxjs-compat/operator/switchMap';
import {ApiUrlService} from './api-url.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private dbPath = '/users';
    usersRef: AngularFireList<UserModel> = null;

    users: Observable<any[]>;
    private resultSource = new BehaviorSubject<any>('');
    loginResult = this.resultSource.asObservable();

    constructor(private http: HttpClient, db: AngularFireDatabase, private apiUrlService : ApiUrlService) {
        this.usersRef = db.list(this.dbPath);
        // Use snapshotChanges().map() to store the key
        this.users = this.usersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        );

        //query all
        this.users.subscribe(queriedItems => {
            console.log(queriedItems);
        });
    }


    authenticateUser(username, password) {
        //query all

        this.users.subscribe(queriedItems => {
            queriedItems.map(item => {

                if (item._username == username) {
                    if (item._password == password) {
                        this.resultSource.next(item);
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


