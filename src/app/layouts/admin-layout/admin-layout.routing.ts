import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { DailyTableComponent } from '../../table/daily-table/daily-table.component';
import { MonthlyTableComponent } from '../../table/monthly-table/monthly-table.component';
import { CategoryTableComponent } from '../../table/category-table/category-table.component';
import { LoginComponent } from '../../login/login/login.component';
import { CategoryFormComponent } from '../../form/category-form/category-form.component';
import { ProductComponent } from '../../product/product.component';
import { CategoryComponent } from '../../category/category.component';
import { StockComponent } from '../../stock/stock.component';
import { AdminPageComponent } from 'app/admin-page/admin-page.component';
import { HourlyReportComponent } from 'app/transaction-report/hourly-report/hourly-report.component';
import { DailyReportComponent } from 'app/transaction-report/daily-report/daily-report.component';
import { MonthlyReportComponent } from 'app/transaction-report/monthly-report/monthly-report.component';








export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard', component: DashboardComponent },
    { path: 'product', component: ProductComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'stock', component: StockComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'user-management', component: AdminPageComponent },
    // { path: 'typography',     component: TypographyComponent },
    { path: 'hourly-report', component: HourlyReportComponent },
    { path: 'daily-report', component: DailyReportComponent },
    { path: 'monthly-report', component: MonthlyReportComponent },
    // { path: 'upgrade',        component: UpgradeComponent },
    { path: 'dailyTable', component: DailyTableComponent },
    { path: 'monthlyTable', component: MonthlyTableComponent },
    { path: 'categoryTable', component: CategoryTableComponent },
    // { path: 'login',          component: LoginComponent },
    { path: 'editCategory', component: CategoryFormComponent },
    // { path: '', redirectTo:'/dashboard',pathMatch:'full'},
];
