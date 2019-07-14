import {  OnInit, Component, Input } from '@angular/core';

@Component({
  selector: 'tran-report-chart',
  templateUrl: './report-grid.component.html',
  styleUrls: ['./report-grid.component.scss']
})

export class ReportGridComponent implements OnInit {

  @Input() chartData: any;
  @Input() chartColor: any;
  @Input() chartType:string;
  constructor() { }

  ngOnInit() {
    this.colorScheme.domain = this.chartColor;
    this.chartValues = this.chartData;
    this.setChartType();
  }

  view: any[] = [];
  // view: any[] = [700, 300];
  chartValues = [];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Day';
  showYAxisLabel = true;
  yAxisLabel = 'Total';


  setChartType(){
    switch(this.chartType){
      case 'hour': this.xAxisLabel = "Hour"; break;
      case 'day': this.xAxisLabel = 'Day'; break;
      case 'month': this.xAxisLabel = 'Months'; break;
    }
  }

  colorScheme = {
    domain: []
  };

  onSelect(event) {
    console.log(event);
  }
}
