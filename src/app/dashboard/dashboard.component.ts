import {Component, OnInit} from '@angular/core';
import * as Chartist from 'chartist';
import {Router} from '@angular/router';
import {Sales, SalesService} from '../services/sales.service';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {DatabaseInfoService} from '../services/database-info.service';

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
    price = 1379;

    constructor(public router: Router, public salesService: SalesService,public databaseService: DatabaseInfoService) {
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
        /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

        const dataDailySalesChart: any = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                [12, 17, 7, 17, 23, 18, 38]
            ]
        };

        const optionsDailySalesChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
        }
        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);


        //to-do
        const dataMonthlySalesChart: any = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
                [56, 21, 34, 45, 23, 45, 55]
            ]
        };
        const optionsMonthlySalesChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 800, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
        }
        var monthlySalesChart = new Chartist.Line('#monthlySalesChart', dataMonthlySalesChart, optionsMonthlySalesChart);

        this.startAnimationForLineChart(monthlySalesChart);


        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        const dataCompletedTasksChart: any = {
            labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
            series: [
                [230, 750, 450, 300, 280, 240, 200, 190]
            ]
        };

        const optionsCompletedTasksChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
        }

        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

        // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(completedTasksChart);


        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        var datawebsiteViewsChart = {
            labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            series: [
                [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

            ]
        };
        var optionswebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 1000,
            chartPadding: {top: 0, right: 5, bottom: 0, left: 0}
        };
        var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];
        var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

        //start animation for the Emails Subscription Chart
        this.startAnimationForBarChart(websiteViewsChart);


        /*-------hide table if mobile-----*/
        this.toggleTable();

        /*-----------------------------Dashboard Table Data-----------------------------------------*/

        var rawTodayData = this.salesService.getTodaySales();
        var rawPayMethod = this.salesService.getPayMethod();
        var rawYesterdayData = this.salesService.getYesterdaySales();
        var rawThisMonthData = this.salesService.getThisMonthSales();
        var rawLastMonthData = this.salesService.getLastMonthSales();
        var databaseInfo = this.databaseService.getDatabase();

        forkJoin([rawTodayData, rawPayMethod,rawYesterdayData,rawThisMonthData,rawLastMonthData,databaseInfo])
            .subscribe(results => {
               var todaySales = results[0];
               var allPayMethods = results[1];
               var yesterdaySales = results[2];
               var thisMonthSales = results[3];
               var lastMonthSales = results[4];
               var db = results[5];

                if (allPayMethods.length > 0) {
                    allPayMethods.forEach(p => {
                            var newSales = new Sales();
                            newSales.paymethod= p['paymethod'];
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
                // console.log(db);


            });






    }


    cleanEmptySalesData(totalSales:Array<any>){
       let result = totalSales.filter(
           sales=> sales.totalToday != 'N/A' || sales.totalYesterday!='N/A' || sales.totalThisMonth!='N/A' || sales.totalLastMonth!='N/A'
        )
        this.totalSales = result;
    }


    nav(link) {
        this.router.navigateByUrl(link);

    }

    refresh(){
        this.router.navigateByUrl('dashboard');
    }

    toggleTable(){
        if (window.screen.width === 360) { // 768px portrait
            this.showTable = false;
        }
    }

    calculateTotalToday(){
        var total = 0.00;
        this.totalSales.forEach(sales=>{
            if(sales.totalToday != 'N/A'){
                total += parseFloat(sales.totalToday)
            }
        })
        if(total==0.00){
            this.totalToday = 'N/A';
        }else{
            this.totalToday = total.toFixed(2);
        }

    }

    calculateTotalYesterday(){
        var total = 0.00;
        this.totalSales.forEach(sales=>{
            if(sales.totalYesterday != 'N/A'){
                total += parseFloat(sales.totalYesterday)
            }
        })
        if(total==0.00){
            this.totalYesterday = 'N/A';
        }else{
            this.totalYesterday = total.toFixed(2);
        }

    }
    calculateTotalThisMonth(){
        var total = 0.00;
        this.totalSales.forEach(sales =>{
            if(sales.totalThisMonth != 'N/A'){
                total += parseFloat(sales.totalThisMonth)
            }
        })
        if(total==0.00){
            this.totalThisMonth = 'N/A';
        }else{
            this.totalThisMonth = total.toFixed(2);
        }

    }
    calculateTotalLastMonth(){
        var total = 0.00;
        this.totalSales.forEach(sales=>{
            if(sales.totalLastMonth != 'N/A'){
                total += parseFloat(sales.totalLastMonth)
            }
        })
        if(total==0.00){
            this.totalLastMonth = 'N/A';
        }else{
            console.log(this.totalLastMonth,'lastmonth')
            this.totalLastMonth = total.toFixed(2)
            console.log(this.totalLastMonth,'lastmonth after')

        }
    }
    setTodaySales(todaySales){
        if (todaySales.length > 0) {
            todaySales.forEach(d => {
                    var newSales = new Sales();
                    newSales.paymethod = d['paymethod'];
                    newSales.totalToday = d['total'];
                    this.todaySales.push(newSales);
                }
            )
        }

        this.totalSales.forEach(i=>{
            this.todaySales.forEach(j=>{
                if(i['paymethod'] == j['paymethod']){
                    i['totalToday'] = j['totalToday']
                }
            })
        })
    }

    setYesterdaySales(yesterdaySales){
        if (yesterdaySales.length > 0) {
            yesterdaySales.forEach(d => {
                    var newSales = new Sales();
                    newSales.paymethod = d['paymethod'];
                    newSales.totalYesterday = d['total'];
                    this.yesterdaySales.push(newSales);
                }
            )
        }
        this.totalSales.forEach(i=>{
            this.yesterdaySales.forEach(j=>{
                if(i['paymethod'] == j['paymethod']){
                    i['totalYesterday'] = j['totalYesterday']
                }
            })
        })


    }
    setThisMonthSales(thisMonthSales){
        if (thisMonthSales.length > 0) {
            thisMonthSales.forEach(d => {
                    var newSales = new Sales();
                    newSales.paymethod = d['paymethod'];
                    newSales.totalThisMonth = d['total'];
                    this.thisMonthSales.push(newSales);
                }
            )
        }
        this.totalSales.forEach(i=>{
            this.thisMonthSales.forEach(j=>{
                if(i['paymethod'] == j['paymethod']){
                    i['totalThisMonth'] = j['totalThisMonth']
                }
            })
        })
    }
    setLastMonthSales(lastMonthSales){
        if (lastMonthSales.length > 0) {
            lastMonthSales.forEach(d => {
                    var newSales = new Sales();
                    newSales.paymethod = d['paymethod'];
                    newSales.totalLastMonth = d['total'];
                    this.lastMonthSales.push(newSales);
                }
            )
        }


        this.totalSales.forEach(i=>{
            this.lastMonthSales.forEach(j=>{
                if(i['paymethod'] == j['paymethod']){
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




    //---------------------------轮播图---------------------------



}

