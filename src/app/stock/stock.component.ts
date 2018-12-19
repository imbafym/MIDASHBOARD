import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Category, ProductService} from '../services/product.service';
import {FormBuilder, FormControl, FormGroup, NgControl, Validators} from '@angular/forms';
import {Stock, StockService} from '../services/stock.service';

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
    currentStock: Stock;
    showStock: boolean;
    selected : string;
    constructor(private router: Router, public stockService: StockService, private fb: FormBuilder) {
    }


    ngOnInit() {
        // this.isBuyPriceModified = false;
        // this.isSellPriceModified = false;
        this.barcode = '';
        this.showStock = false;
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
                    value:  0
                }, Validators.required],
                ID: [{
                    value: this.currentStock ? this.currentStock.ID : 0
                }],

            },
        );


    }


    updatePrice(type) {
        console.log(this.form)
        if (type == 'buy') {
            var result = this.stockService.updateBuyPriceByID(this.form.controls['ID'].value, this.form.controls['buyPrice'].value)
            result.subscribe(res=>{
                console.log(res, 'this is result')
                if(res['affectedRows'] == 1) {
                    this.currentStock.PRICEBUY = this.form.controls['buyPrice'].value
                    this.isBuyPriceModified = !this.isBuyPriceModified
                    if (this.isBuyPriceModified) {
                        this.form.controls['buyPrice'].enable()
                    } else {
                        this.form.controls['buyPrice'].disable()
                    }
                }else{
                    console.log('update failed')
                }
            })
        }
        if (type == 'sell') {
            var result = this.stockService.updateSellPriceByID(this.form.controls['ID'].value, this.form.controls['sellPrice'].value)
            result.subscribe(res=>{
                console.log(res, 'this is result')
                if(res['affectedRows'] == 1){
                    this.currentStock.PRICESELL = this.form.controls['sellPrice'].value
                    this.isSellPriceModified = !this.isSellPriceModified
                    if (this.isSellPriceModified) {
                        this.form.controls['sellPrice'].enable()
                    } else {
                        this.form.controls['sellPrice'].disable()
                    }
                }else{
                    console.log('update failed')
                }

            })
        }
    }

    modifyPrice(type) {
        console.log(this.form)
        if (type == 'buy') {
            this.isBuyPriceModified = !this.isBuyPriceModified
            if (this.isBuyPriceModified) {
                this.form.controls['buyPrice'].enable()
            } else {
                this.form.controls['buyPrice'].disable()
            }

            console.log(this.form.get('buyPrice'))
        }
        if (type == 'sell') {
            this.isSellPriceModified = !this.isSellPriceModified

            if (this.isSellPriceModified) {
                this.form.controls['sellPrice'].enable()
            } else {
                this.form.controls['sellPrice'].disable()
            }
            console.log(this.form.get('sellPrice'))

        }
    }

    onKey(e) {
        var barcode = e.target.value;
        this.barcode = barcode;
    }

    searchStockByBarcode() {
        if (!this.barcode || this.barcode != '') {
            var rawStockData = this.stockService.searchStockByBarcode(this.barcode);
            rawStockData.subscribe(stock => {
                var sell_price = '';
                if (stock[0]) {
                    this.currentStock = new Stock();
                    this.currentStock = stock[0];
                    if (!this.currentStock.STOCK) {
                        this.currentStock.STOCK = 0;
                    }
                    // if(this.currentStock.TAX_RATE == "0.1"){
                    //     sell_price  = this.currentStock.PRICESELL* 1.1.toFixed(2)
                    // }else{
                    //     sell_price = this.currentStock.PRICESELL.toFixed(2)
                    // }

                    this.form.patchValue({buyPrice: this.currentStock.PRICEBUY});
                    this.form.patchValue({sellPrice: this.currentStock.PRICESELL});
                    this.form.patchValue({quantity: 0});
                    this.form.patchValue({ID: this.currentStock.ID});
                    this.showStock = true;
                } else {
                    this.showStock = false;
                }
            })
        }
    }


    updateStockStatus(e){
        let id = this.form.controls['ID'].value;
        let quantity = this.form.controls['quantity'].value;
        let reason = this.selected
        let location = 0;
        let price = 0;
        let currentStock = this.currentStock.STOCK
        if(reason=="-1" || reason == "+2"){
            price = this.currentStock.PRICESELL;
        }else{
            price = this.currentStock.PRICEBUY;
        }
        if(parseInt(reason)>0){
            currentStock = currentStock + quantity;
        }else if(parseInt(reason)<0){
            currentStock = currentStock - quantity;
        }

        let rawInsertResult =  this.stockService.insertRecordInStockDiary(reason,id,quantity,price,location)
        rawInsertResult.subscribe(res=>{

            if(res['code'] == '0'){
                let rawUpdateResult = this.stockService.updateCurrentStock(id,location,currentStock)
                rawUpdateResult.subscribe(res=>{
                    if(res['code'] == '0'){
                        this.currentStock.STOCK = currentStock
                        this.form.patchValue({quantity:0})
                    }else{
                        console.log('Error Notification update failed')
                    }
                })
            }else{
                console.log('Error Notification Insert failed')
            }
        })
    }


}




