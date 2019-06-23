import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';


import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';

import {AppComponent} from './app.component';

import {DashboardComponent} from './dashboard/dashboard.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {MapsComponent} from './maps/maps.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {
    AgmCoreModule
} from '@agm/core';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {UserService} from './services/user.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CategoryService} from './services/category.service';

import {SharedModule} from './shared/shared.module';

import {SalesService} from './services/sales.service';
import {DateAdapter, MAT_DATE_LOCALE, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {DateFormat} from './utils/date-format';
import {ProductService} from './services/product.service';
import {SWIPER_CONFIG} from 'ngx-swiper-wrapper';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {DatabaseInfoService} from './services/database-info.service';

import {ApiUrlService} from './services/api-url.service';

import {LoginModule} from './login/login.module';


import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {environment} from '../environments/environment';

import {ErrorHandler} from './services/httpInterceptor/error_handler';
import {RequestInterceptor} from './services/httpInterceptor/http_interceptor';

import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SwiperModule,
        SharedModule,
        LoginModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        NgxSpinnerModule
// AgmCoreModule.forRoot({
//     apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
// })
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent
    ],
    providers:
        [
            UserService,
            CategoryService,
            SalesService,
            ProductService,
            DatabaseInfoService,
            ApiUrlService,
            ErrorHandler,
            {provide: LocationStrategy, useClass: HashLocationStrategy},
            {provide: DateAdapter, useClass: DateFormat},
            {
                provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG
            },
            {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true}



        ],


    bootstrap:
        [AppComponent]
})

export class AppModule {
}
