import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { Router } from '@angular/router';
import { Sales, SalesService } from '../services/sales.service';

import { forkJoin } from 'rxjs/observable/forkJoin';
import { DatabaseInfoService } from '../services/database-info.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'app/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    show: boolean = true;
    todaySales = [];
    yesterdaySales = [];
    thisMonthSales = [];
    lastMonthSales = [];
    todayDate = '';
    totalSales = [];

    totalToday = '';
    totalYesterday = '';
    totalThisMonth = '';
    totalLastMonth = '';
    showTable = false;

    constructor(
        public router: Router,
        public salesService: SalesService,
        public databaseService: DatabaseInfoService,
        private spinner: NgxSpinnerService,
        private _userService: UserService) {
    }

    startAnimationForLineChart(chart) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;

        chart.on('draw', function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;
    };

    startAnimationForBarChart(chart) {
        let seq2: any, delays2: any, durations2: any;

        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq2 = 0;
    };

    ngOnInit() {

        /*-------hide table if mobile-----*/
        this.toggleTable();

        /*-----------------------------Dashboard Table Data-----------------------------------------*/
        this.populateData();
    }


    populateData(): void {
        var rawTodayData = this.salesService.getTodaySales();
        var rawPayMethod = this.salesService.getPayMethod();
        var rawYesterdayData = this.salesService.getYesterdaySales();
        var rawThisMonthData = this.salesService.getThisMonthSales();
        var rawLastMonthData = this.salesService.getLastMonthSales();
        // if (this._userService.currentUser._role !== "admin") {
        //     var databaseInfo = this.databaseService.getDatabase();
        // }

        forkJoin([rawTodayData, rawPayMethod, rawYesterdayData, rawThisMonthData, rawLastMonthData])
            .subscribe(results => {
                var todaySales = results[0];
                var allPayMethods = results[1];
                var yesterdaySales = results[2];
                var thisMonthSales = results[3];
                var lastMonthSales = results[4];
             

                if (allPayMethods.length > 0) {
                    allPayMethods.forEach(p => {
                        var newSales = new Sales();
                        newSales.paymethod = p['paymethod'];
                        newSales.totalToday = 'N/A';
                        newSales.totalYesterday = 'N/A';
                        newSales.totalThisMonth = 'N/A';
                        newSales.totalLastMonth = 'N/A';
                        this.totalSales.push(newSales);
                    }
                    )
                }
                this.setTodaySales(todaySales);
                this.setYesterdaySales(yesterdaySales);
                this.setThisMonthSales(thisMonthSales);
                this.setLastMonthSales(lastMonthSales);
                this.calculateTotalToday();
                this.calculateTotalYesterday();
                this.calculateTotalThisMonth();
                this.calculateTotalLastMonth();
                this.cleanEmptySalesData(this.totalSales);
            });
    }

    initData(): void {
        this.show = true;
        this.todaySales = [];
        this.yesterdaySales = [];
        this.thisMonthSales = [];
        this.lastMonthSales = [];
        this.todayDate = '';
        this.totalSales = [];

        this.totalToday = '';
        this.totalYesterday = '';
        this.totalThisMonth = '';
        this.totalLastMonth = '';
        this.showTable = false;
    }
    refresh(): void {
        this.initData();
        this.populateData();
    }


    cleanEmptySalesData(totalSales: Array<any>) {
        let result = totalSales.filter(
            sales => sales.totalToday != 'N/A' || sales.totalYesterday != 'N/A' || sales.totalThisMonth != 'N/A' || sales.totalLastMonth != 'N/A'
        )
        this.totalSales = result;
    }


    nav(link) {
        this.router.navigateByUrl(link);

    }



    toggleTable() {
        if (window.screen.width === 360) { // 768px portrait
            this.showTable = false;
        }
    }

    calculateTotalToday() {
        var total = 0.00;
        this.totalSales.forEach(sales => {
            if (sales.totalToday != 'N/A') {
                total += parseFloat(sales.totalToday)
            }
        })
        if (total == 0.00) {
            this.totalToday = 'N/A';
        } else {
            this.totalToday = total.toFixed(2);
        }

    }

    calculateTotalYesterday() {
        var total = 0.00;
        this.totalSales.forEach(sales => {
            if (sales.totalYesterday != 'N/A') {
                total += parseFloat(sales.totalYesterday)
            }
        })
        if (total == 0.00) {
            this.totalYesterday = 'N/A';
        } else {
            this.totalYesterday = total.toFixed(2);
        }

    }
    calculateTotalThisMonth() {
        var total = 0.00;
        this.totalSales.forEach(sales => {
            if (sales.totalThisMonth != 'N/A') {
                total += parseFloat(sales.totalThisMonth)
            }
        })
        if (total == 0.00) {
            this.totalThisMonth = 'N/A';
        } else {
            this.totalThisMonth = total.toFixed(2);
        }

    }
    calculateTotalLastMonth() {
        var total = 0.00;
        this.totalSales.forEach(sales => {
            if (sales.totalLastMonth != 'N/A') {
                total += parseFloat(sales.totalLastMonth)
            }
        })
        if (total == 0.00) {
            this.totalLastMonth = 'N/A';
        } else {

            this.totalLastMonth = total.toFixed(2)


        }
    }
    setTodaySales(todaySales) {
        if (todaySales.length > 0) {
            todaySales.forEach(d => {
                var newSales = new Sales();
                newSales.paymethod = d['paymethod'];
                newSales.totalToday = d['total'];
                this.todaySales.push(newSales);
            }
            )
        }

        this.totalSales.forEach(i => {
            this.todaySales.forEach(j => {
                if (i['paymethod'] == j['paymethod']) {
                    i['totalToday'] = j['totalToday']
                }
            })
        })
    }

    setYesterdaySales(yesterdaySales) {
        if (yesterdaySales.length > 0) {
            yesterdaySales.forEach(d => {
                var newSales = new Sales();
                newSales.paymethod = d['paymethod'];
                newSales.totalYesterday = d['total'];
                this.yesterdaySales.push(newSales);
            }
            )
        }
        this.totalSales.forEach(i => {
            this.yesterdaySales.forEach(j => {
                if (i['paymethod'] == j['paymethod']) {
                    i['totalYesterday'] = j['totalYesterday']
                }
            })
        })


    }
    setThisMonthSales(thisMonthSales) {
        if (thisMonthSales.length > 0) {
            thisMonthSales.forEach(d => {
                var newSales = new Sales();
                newSales.paymethod = d['paymethod'];
                newSales.totalThisMonth = d['total'];
                this.thisMonthSales.push(newSales);
            }
            )
        }
        this.totalSales.forEach(i => {
            this.thisMonthSales.forEach(j => {
                if (i['paymethod'] == j['paymethod']) {
                    i['totalThisMonth'] = j['totalThisMonth']
                }
            })
        })
    }
    setLastMonthSales(lastMonthSales) {
        if (lastMonthSales.length > 0) {
            lastMonthSales.forEach(d => {
                var newSales = new Sales();
                newSales.paymethod = d['paymethod'];
                newSales.totalLastMonth = d['total'];
                this.lastMonthSales.push(newSales);
            }
            )
        }


        this.totalSales.forEach(i => {
            this.lastMonthSales.forEach(j => {
                if (i['paymethod'] == j['paymethod']) {
                    i['totalLastMonth'] = j['totalLastMonth']
                }
            })
        })
    }


    getTodayDate(): string {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var mString = '';
        var dString = '';
        if (mm < 10) {
            mString = '0' + mm.toString();
        } else {
            mString = mm.toString();
        }
        if (dd < 10) {
            dString = '0' + dd.toString();
        } else {
            dString = dd.toString();
        }


        var result = yyyy + '-' + mString + '-' + dString;
        return result;
    }








}

