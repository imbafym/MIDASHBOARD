import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-table',
  templateUrl: './daily-table.component.html',
  styleUrls: ['./daily-table.component.scss']
})
export class DailyTableComponent implements OnInit {


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
  constructor() { }

  ngOnInit() {
  }

}
