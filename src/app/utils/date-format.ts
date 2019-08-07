
import { NativeDateAdapter } from '@angular/material';
const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

export class DateFormat extends NativeDateAdapter {
    useUtcForDisplay = true;
    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('-') > -1)) {
            const str = value.split('-');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
}


export function getToday(): string{
     return getDateStr(0);
}

export function getYesterday(): string{
    return getDateStr(-1);
}

var getDateStr = function (dayCount) {
    if (null == dayCount) {
        dayCount = 0;
    }
    var dd = new Date();
    dd.setDate(dd.getDate() + dayCount);//设置日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}




export function getThisMonth(): string[]{

var getDateStr = function (dayCount) {
    if (null == dayCount) {
        dayCount = 0;
    }
    var dd = new Date();
    dd.setDate(dd.getDate() + dayCount);//设置日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth()+1;
    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    if (month < 10) {
        month = Number("0" + month);
    }
    var firstDay = year + "-" + month + "-" + "01";// zhe个月的第一天
    var myDate = new Date(year, month, 0);
    var lastDay = year + "-" + month + "-" + myDate.getDate();// zhe个月的最后一天
     let dates: string[] =[];
     dates.push(firstDay);
     dates.push(lastDay);
   return dates;
}

export function getLastMonth(): string[]{
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    if (month < 10) {
        month = Number("0" + month);
    }
    var firstDay = year + "-" + month + "-" + "01";// 上个月的第一天
    var myDate = new Date(year, month, 0);
    var lastDay = year + "-" + month + "-" + myDate.getDate();// 上个月的最后一天
    let dates: string[] =[];
    dates.push(firstDay);
    dates.push(lastDay);

   return dates;
}