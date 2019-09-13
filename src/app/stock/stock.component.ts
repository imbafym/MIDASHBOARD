import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Category, ProductService } from '../services/product.service';
import { FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { Stock, StockService } from '../services/stock.service';
import { MatDialog, MatDialogRef, DateAdapter, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { ProgressSpinnerDialogComponent } from 'app/shared/progress-spinner-dialog/progress-spinner-dialog.component';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
@Component({
    selector: 'app-category',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

    form: FormGroup;
    isBuyPriceModified: boolean;
    isSellPriceModified: boolean;
    barcode: string;
    productName:string;
    currentStock: Stock;
    showStock: boolean;
    selected: string;
    showProgress: boolean;
    showError: boolean;
    private paginator: MatPaginator;
    private sort: MatSort;
    displayedColumns: string[] = ['product', 'qty', 'price', 'reason','date'];
    stockDiaries: StockDiary[] = [];

    _dataSource = new MatTableDataSource<StockDiary>(this.stockDiaries);
    hasData: boolean = false;
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    get dataSource(){
        return this._dataSource;
    }
   set dataSource(input: any){
       this._dataSource = input;
   }


    constructor(private router: Router, private dateAdapter: DateAdapter<Date>,public stockService: StockService, private fb: FormBuilder,
        private dialog: MatDialog, private spinner : NgxSpinnerService) {
            dateAdapter.setLocale('nl');
    }


    async ngOnInit() {
        this.barcode = '';
        this.productName = '';

        this.showStock = false;
        this.showProgress = false;
        this.selected = '+1';
        this.form = this.fb.group({
            buyPrice: [{
                value: this.currentStock ? this.currentStock.PRICEBUY : 0,
                disabled: !this.isBuyPriceModified
            }, Validators.required],
            sellPrice: [{
                value: this.currentStock ? this.currentStock.PRICESELL : 0,
                disabled: !this.isSellPriceModified
            }, Validators.required],
            quantity: [{
                value: 0
            }, Validators.required],
            ID: [{
                value: this.currentStock ? this.currentStock.ID : 0
            }],

        },
        );
        
        await this.initData();

    }


    updatePrice(type) {

        if (type == 'buy') {
            var result = this.stockService.updateBuyPriceByID(this.form.controls['ID'].value, this.form.controls['buyPrice'].value)
            result.subscribe(res => {

                if (res['affectedRows'] == 1) {
                    this.currentStock.PRICEBUY = this.form.controls['buyPrice'].value
                    this.isBuyPriceModified = !this.isBuyPriceModified
                    if (this.isBuyPriceModified) {
                        this.form.controls['buyPrice'].enable()
                    } else {
                        this.form.controls['buyPrice'].disable()
                    }
                } else {
                    console.log('update failed')
                }
            })
        }
        if (type == 'sell') {
            var resultPrice = 0;
            if (this.currentStock.TAX_RATE == "0.1") {
                resultPrice = this.form.controls['sellPrice'].value / 1.1
            } else {
                resultPrice = this.form.controls['sellPrice'].value
            }

            var result = this.stockService.updateSellPriceByID(this.form.controls['ID'].value, resultPrice)
            result.subscribe(res => {
                if (res['affectedRows'] == 1) {




                    this.currentStock.PRICESELL = this.form.controls['sellPrice'].value
                    this.isSellPriceModified = !this.isSellPriceModified
                    if (this.isSellPriceModified) {
                        this.form.controls['sellPrice'].enable()
                    } else {
                        this.form.controls['sellPrice'].disable()
                    }
                } else {
                    console.log('update failed')
                }

            })
        }
    }

    modifyPrice(type) {

        if (type == 'buy') {
            this.isBuyPriceModified = !this.isBuyPriceModified
            if (this.isBuyPriceModified) {
                this.form.controls['buyPrice'].enable()
            } else {
                this.form.controls['buyPrice'].disable()
            }


        }
        if (type == 'sell') {
            this.isSellPriceModified = !this.isSellPriceModified

            if (this.isSellPriceModified) {
                this.form.controls['sellPrice'].enable()
            } else {
                this.form.controls['sellPrice'].disable()
            }


        }
    }

    onKey(e) {
        var barcode = e.target.value;
        this.barcode = barcode;
    }

    onKey2(e) {
        var productName = e.target.value;
        this.productName = productName;
    }

    searchStockByBarcode() {
        this.spinner.show();
        this.showProgress = true;
        this.showError = false;
        setTimeout(() => {
            if (!this.barcode || this.barcode != '') {
                var rawStockData = this.stockService.searchStockByBarcode(this.barcode);
                rawStockData.subscribe(stock => {
                    var sell_price = 0;
                    if (stock[0]) {
                        this.currentStock = new Stock();
                        this.currentStock = stock[0];
                        if (!this.currentStock.STOCK) {
                            this.currentStock.STOCK = 0;
                        }
                        if (this.currentStock.TAX_RATE == "0.1") {
                            sell_price = this.currentStock.PRICESELL * 1.1
                            sell_price = parseFloat(sell_price.toFixed(2))
                        } else {
                            sell_price = parseFloat(this.currentStock.PRICESELL.toFixed(2))
                        }
    
                        this.form.patchValue({ buyPrice: this.currentStock.PRICEBUY });
                        this.form.patchValue({ sellPrice: sell_price });
                        this.form.patchValue({ quantity: 0 });
                        this.form.patchValue({ ID: this.currentStock.ID });
                        this.showProgress = false;
                        this.showStock = true;
                    } else {
                        this.showError = true;
                        this.showProgress = false;
                        this.showStock = false;
                    }
                    this.spinner.hide();
                })
            }
        }, 500);
        
    }

    searchStockByProductName() {
        this.spinner.show();
        this.showProgress = true;
        this.showError = false;
        setTimeout(() => {
            if (!this.productName || this.productName != '') {
                var rawStockData = this.stockService.searchStockByProductName(this.productName);
                rawStockData.subscribe(stock => {
                    var sell_price = 0;
                    if (stock[0]) {
                        this.currentStock = new Stock();
                        this.currentStock = stock[0];
                        if (!this.currentStock.STOCK) {
                            this.currentStock.STOCK = 0;
                        }
                        if (this.currentStock.TAX_RATE == "0.1") {
                            sell_price = this.currentStock.PRICESELL * 1.1
                            sell_price = parseFloat(sell_price.toFixed(2))
                        } else {
                            sell_price = parseFloat(this.currentStock.PRICESELL.toFixed(2))
                        }
    
                        this.form.patchValue({ buyPrice: this.currentStock.PRICEBUY });
                        this.form.patchValue({ sellPrice: sell_price });
                        this.form.patchValue({ quantity: 0 });
                        this.form.patchValue({ ID: this.currentStock.ID });
                        this.showProgress = false;
                        this.showStock = true;
                    } else {
                        this.showError = true;
                        this.showProgress = false;
                        this.showStock = false;
                    }
                    this.spinner.hide();
                })
            }
        }, 500);
        
    }


    updateStockStatus(e) {
        let id = this.form.controls['ID'].value;
        let quantity = this.form.controls['quantity'].value;
        let reason = this.selected
        let location = 0;
        let price = 0;
        let currentStock = this.currentStock.STOCK
        if (reason == "-1" || reason == "+2") {
            price = this.currentStock.PRICESELL;
        } else {
            price = this.currentStock.PRICEBUY;
        }
        if (parseInt(reason) > 0) {
            currentStock = currentStock + quantity;
        } else if (parseInt(reason) < 0) {
            currentStock = currentStock - quantity;
        }

        let rawInsertResult = this.stockService.insertRecordInStockDiary(reason, id, quantity, price, location)
        rawInsertResult.subscribe(res => {

            if (res['code'] == '0') {
                let rawUpdateResult = this.stockService.updateCurrentStock(id, location, currentStock)
                rawUpdateResult.subscribe(res => {
                    if (res['code'] == '0') {
                        this.currentStock.STOCK = currentStock
                        this.form.patchValue({ quantity: 0 })
                    } else {
                        console.log('Error Notification update failed')
                    }
                })
            } else {
                console.log('Error Notification Insert failed')
            }
        })
    }


    async initData(): Promise<void> {
        this.spinner.show();
        let dateFrom: string, dateTo: string = null;
        let rawData: StockDiary[] = null;
      
        rawData = await this.stockService.getStockDiary().toPromise();

        this.stockDiaries = rawData;
      
        this.dealData(this.stockDiaries);
        this.dataSource = new MatTableDataSource<StockDiary>(this.stockDiaries);

        if (this.dataSource.data.length > 0 || this.stockDiaries.length>0) {
            this.hasData = true;
        }

        setInterval(e => {
            this.showProgress = false;
            this.spinner.hide();
        }, 1500)
       

    }

    dealData(stockDiaries: StockDiary[]){
        for(let s of stockDiaries){
            s.date = this.changeDateFormate(s.date);
            s.reason = this.getReasonName(s.reason);
        }
      }
    
      changeDateFormate(date): string {
        // var date = "2018-05-29T02:51:39.692104";
        var stillUtc = moment.utc(date).toDate(); //change utc time
        var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm'); //change local timezone
        return local;
      }



      getReasonName(reasonId: string){

        switch(reasonId.toString()){
            case '-1': return 'OUT_EXPIRED';
            case '-2': return 'OUT_REFUND';
            case '-3': return 'OUT_BREAK';
            case '-4': return 'OUT_MOVEMENT';
            case '1': return 'IN_PURCHASE';
            case '2': return 'IN_REFUND';
            case '4': return 'IN_MOVEMENT';
        }
      }



}

export interface StockDiary {
    ID: string,
    date: string,
    reason: string,
    name: string,
    units: string,
    Price: string
}


