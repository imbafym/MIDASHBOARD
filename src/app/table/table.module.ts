import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyTableComponent } from './daily-table/daily-table.component';
import { MonthlyTableComponent } from './monthly-table/monthly-table.component';
import { CategoryTableComponent } from './category-table/category-table.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DailyTableComponent, MonthlyTableComponent, CategoryTableComponent]
})
export class TableModule { }
