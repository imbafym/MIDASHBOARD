import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorHandler {

    constructor(
        public snackbar: MatSnackBar,
    ) {}

    public handleError(err: any) {
        this.snackbar.open('Please Type In The Correct URL', 'close');
    }
}