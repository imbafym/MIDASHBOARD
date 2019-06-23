import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {filter, map} from 'rxjs/operators';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable()
export class CategoryService {




    constructor(private http: HttpClient) {
    }

    // getRootCategoriesAndItsChildren(name):Observable<Category>{
    //
    //     return this.http.get(`api/categories/queryAllCategories`).pipe(map(res=>res as Category || null));
    //
    // }
    getRootCategoriesAndItsChildren(): Observable<Category> {
        return this.http.get(`api/categories/queryAllCategories`).pipe(map(res=>res as Category || null));
    }


}


export class Category {

     id: string;
     name: string;
     parentId: string;
     image: string;
     textTip: number;
     subCategories: Category[]
    constructor(

    ) {
    }

}