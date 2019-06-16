import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {DailyTableComponent} from '../../table/daily-table/daily-table.component';
import {MonthlyTableComponent} from '../../table/monthly-table/monthly-table.component';
import {TableModule} from '../../table/table.module';

import {
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
} from '@angular/material';
import {LoginModule} from '../../login/login.module';
import {SharedModule} from '../../shared/shared.module';
import {FormModule} from '../../form/form.module';
import {ProductComponent} from '../../product/product.component';
import {ProductModule} from '../../product/product.module';
import {CategoryModule} from '../../category/category.module';
import {StockModule} from '../../stock/stock.module';
import { AdminPageComponent } from 'app/admin-page/admin-page.component';

@NgModule({
    imports: [
        CommonModule,
        // AppRoutingModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        MatTooltipModule,
        TableModule,
        LoginModule,
        SharedModule,
        FormModule,
        ProductModule,
        CategoryModule,
        StockModule
    ],
    declarations: [
        DashboardComponent,
        UserProfileComponent,
        TableListComponent,
        MapsComponent,
        NotificationsComponent,
        AdminPageComponent
    ]
})

export class AdminLayoutModule {
}
