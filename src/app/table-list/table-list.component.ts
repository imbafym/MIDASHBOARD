import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

    dailyData = [
        {
            name: 'Monday',
            number: 10
        },
        {
            name: 'Tuesday',
            number: 20
        },

        {
            name: 'Wednesday',
            number: 30
        }
        ,
        {
            name: 'Thursday',
            number: 40
        },
        {
            name: 'Friday',
            number: 80
        },
        {
            name: 'Saturday',
            number: 70
        },
        {
            name: 'Sunday',
            number: 80
        }
    ]
    dailyDataTitle = ['Day', 'Sale']


    constructor() {
    }

    ngOnInit() {
    }

}
