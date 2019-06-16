import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule, MatCheckboxModule, MatDatepickerModule, MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule,MatSortModule,
    MatSlideToggleModule, MatSnackBarModule, MatTableModule,
    MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from '../table/table.module';
import * as moment from 'moment';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    CommonModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatCardModule,
      MatInputModule,
      MatListModule,
      MatSlideToggleModule,
      MatGridListModule,
      MatAutocompleteModule,
      MatMenuModule,
      MatCheckboxModule,
      MatTooltipModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatRadioModule,
      MatSelectModule,
      FormsModule,
      ReactiveFormsModule,
      TableModule,
      MatProgressSpinnerModule,
      MatPaginatorModule,
      MatSortModule,
      MatTableModule,
      SwiperModule,
      MatSnackBarModule,
      NgxSpinnerModule,      
      SweetAlert2Module.forRoot({
          buttonsStyling: false,
          customClass: 'modal-content',
          confirmButtonClass: 'btn btn-primary',
          cancelButtonClass: 'btn'
      })
  ],
    exports:[
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        MatSlideToggleModule,
        MatGridListModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        SwiperModule,
        SweetAlert2Module,
        NgxSpinnerModule,      
        MatSnackBarModule
    ],

  declarations: []
})
export class SharedModule {

}
