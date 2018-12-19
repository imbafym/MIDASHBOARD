import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {StockComponent} from './stock.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [StockComponent]
})
export class StockModule { }
