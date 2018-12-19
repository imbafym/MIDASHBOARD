import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monthly-table',
  templateUrl: './monthly-table.component.html',
  styleUrls: ['./monthly-table.component.scss']
})
export class MonthlyTableComponent implements OnInit {

    monthlyData = []

    dailyDataTitle = ['ID', 'Sales']
  constructor() { }

  ngOnInit() {
      this.addData();
  }

    addData(){
        for(let i = 1; i<= 31;i++){
            this.monthlyData.push({
                name:i,
                number: Math.floor((Math.random() * 100) + 1)
            })
        }
    }



}
