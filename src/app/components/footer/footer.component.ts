import { Component, OnInit } from '@angular/core';
import {DatabaseInfoService} from '../../services/database-info.service';
import {ApiUrlService} from '../../services/api-url.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test : Date = new Date();
  dbName = '';
    host = '';
    url:string;
  constructor(public databaseService: DatabaseInfoService,public apiUrlService: ApiUrlService) { }

  ngOnInit() {
    
      var databaseInfo = this.databaseService.getDatabase();
      if(databaseInfo){
        databaseInfo.subscribe(result=>{
          console.log(result)
          this.dbName = result.database
          this.host = result.host
      })
      this.apiUrlService.currentUrl.subscribe(url => this.url = url);
      }
    
  }

}
