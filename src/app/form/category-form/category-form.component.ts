import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }


  categories = [];

  ngOnInit() {

  }

}
