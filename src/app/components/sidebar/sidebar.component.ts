import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Home',  icon: 'dashboard', class: '' },
    { path: '/product', title: 'Product Sale',  icon: 'business_center', class: '' },
    { path: '/category', title: 'Category Sale',  icon:'library_books', class: '' },
    { path: '/hourly-report', title: 'Hourly Sale',  icon:'calendar_today', class: '' },
    { path: '/daily-report', title: 'Daily Sale',  icon:'calendar_today', class: '' },
    { path: '/monthly-report', title: 'Monthly Sale',  icon:'calendar_today', class: '' },
    { path: '/customer-sales', title: 'Customer Sale',  icon:'calendar_today', class: '' },
    { path: '/user-sales', title: 'User Sale',  icon:'calendar_today', class: '' },

    { path: '/direct-sales-report', title: 'Direct Sale',  icon:'calendar_today', class: '' },

    { path: '/stock', title: 'Stock Movement',  icon:'archive', class: '' },
    { path: '/deletedItem-report', title: 'Deleted Items',  icon:'archive', class: '' },

    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/user-management', title: 'User Management',  icon:'person', class: '' },
    
    // { path: '/login', title: 'Logout',  icon:'exit_to_app', class: '' },

    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private _userService: UserService, private router: Router) { }

  ngOnInit() {
    this.menuItems = (this._userService.currentUser._role === "admin") ?
    ROUTES.filter(menuItem => menuItem.path==='/user-management') : ROUTES.filter(menuItem => menuItem.path!=='/user-management');
  }

  listenLogout(){
      window.location.reload();
  }



  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
