import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Category, CategoryService} from '../../services/category.service';



@Component({
    selector: 'app-category-table',
    templateUrl: './category-table.component.html',
    styleUrls: ['./category-table.component.scss']
})
export class CategoryTableComponent implements OnInit {

    newCategory: Category;
    results: Category[];
    rootCategories: Category[];
    subCategories: Category[];
    result: Object;

  constructor(private  router: Router,private categoryService: CategoryService) { }


  ngOnInit() {
     var rawResult =  this.categoryService.getRootCategoriesAndItsChildren();
     this.transferRawData(rawResult);
      // console.log(this.rootCategories);
  }

    nav(link:string){
        this.router.navigateByUrl(link);
    }

    dataTitle = ['No', 'Sub Categories','']



    transferRawData(rawResult){
        this.results = [];
        this.rootCategories = [];
        this.subCategories = [];
        rawResult.subscribe(categories => {
                //to do
                //当前所有类型分类包含在内

                //需要将主分类 以及其子分类作为单个数据
                console.log(categories);
                categories.forEach(category => {

                    if (!category["PARENTID"]) {
                        this.newCategory = new Category();
                        this.newCategory.name = category["NAME"];
                        this.newCategory.id = category["ID"];
                        this.newCategory.parentId = category["PARENTID"];
                        this.newCategory.subCategories = [];
                        this.rootCategories.push(this.newCategory);
                        // console.log('this is root');
                    } else {
                        this.newCategory = new Category();
                        this.newCategory.name = category["NAME"];
                        this.newCategory.id = category["ID"];
                        this.newCategory.parentId = category["PARENTID"];
                        this.newCategory.subCategories = [];
                        this.subCategories.push(this.newCategory);
                        // console.log('this is sub');
                    }
                })
                this.rootCategories.forEach(root => {
                    this.subCategories.forEach(sub => {
                        if (root.id == sub.parentId) {
                            root.subCategories.push(sub)
                        }
                    })
                })

            }
        );

    }
}
