import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
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
import {ProductModule} from '../../product/product.module';
import {CategoryModule} from '../../category/category.module';
import {StockModule} from '../../stock/stock.module';
import { AdminPageComponent } from 'app/admin-page/admin-page.component';
import { DailyReportComponent } from 'app/transaction-report/daily-report/daily-report.component';
import { MonthlyReportComponent } from 'app/transaction-report/monthly-report/monthly-report.component';
import { HourlyReportComponent } from 'app/transaction-report/hourly-report/hourly-report.component';
import { ReportGridComponent } from 'app/transaction-report/report-grid/report-grid.component';
import { DirectSaleReportComponent } from 'app/direct-sale-report/direct-sale-report.component';
import { DeletedItemComponent } from 'app/deleted-item/deleted-item.component';
import { CustomerSalesComponent } from 'app/customer-sales/customer-sales.component';
import { UserSalesComponent } from 'app/user-sales/user-sales.component';
import { CustomerListComponent } from 'app/customer-list/customer-list.component';
import { DailyPresenceComponent } from 'app/daily-presence/daily-presence.component';

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
        AdminPageComponent,
        DailyReportComponent,
        MonthlyReportComponent,
        HourlyReportComponent,
        ReportGridComponent,
        DirectSaleReportComponent,
        CustomerSalesComponent,
        CustomerListComponent,
        DailyPresenceComponent,
        UserSalesComponent,
        DeletedItemComponent
    ]
})

export class AdminLayoutModule {
}
