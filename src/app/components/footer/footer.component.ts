import { Component, OnInit } from '@angular/core';
import { DatabaseInfoService } from '../../services/database-info.service';
import { ApiUrlService } from '../../services/api-url.service';
import { forkJoin } from 'rxjs';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  dbName = '';
  host = '';
  businessName: string;
  url: string;
  constructor(public userService : UserService, public databaseService: DatabaseInfoService, public apiUrlService: ApiUrlService) { }

  ngOnInit() {

    var databaseInfo = this.databaseService.getDatabase();
    var businessName = this.databaseService.getBusiness();

    forkJoin([databaseInfo, businessName])
      .subscribe(results => {
        var db = results[0];
        var businessName = results[1];
        if (db) {
          this.apiUrlService.setDbName(db.database);
          this.apiUrlService.setHost(db.host);
        }
        if(businessName){
          this.apiUrlService.setBusiness(businessName[0].BUSINESS_NAME);
        }
      })

    this.apiUrlService.currentUrl.subscribe(url => this.url = url);
    this.apiUrlService.dbName.subscribe(dbName => this.dbName = dbName);
    this.apiUrlService.host.subscribe(host => this.host = host);
    this.apiUrlService.businessName.subscribe(businessName => this.businessName = businessName);

    
  } 




}


