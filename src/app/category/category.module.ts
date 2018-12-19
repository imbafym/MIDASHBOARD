import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {CategoryComponent} from './category.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [CategoryComponent]
})
export class CategoryModule { }
