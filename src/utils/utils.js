export function download(data) {
    if (!data) {
        return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', 'test.png')

    document.body.appendChild(link)
    link.click()
}

export function curDate()  
{   
    var now = new Date();  
         
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
         
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss=now.getSeconds();            //秒  
         
    var clock = year;  
         
    if(month < 10) clock += "0";         
    clock += month;  
         
    if(day < 10) clock += "0";   
    clock += day;
  
    return(clock);   
}  
export function isDate(val) {
    if (val) {
        val = val.replace(/[^\d-]/g, "");
        if (val.length == 10 && val.split("-").length == 3) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function isNotNumber(val) {
    let exp = new RegExp(/^[0-9]+$/gi);
    return !exp.test(val);
}
export function isFNumber(val) {
    let exp = new RegExp(/^-[0-9]+(\.?[0-9]+)?$/gi);
    return exp.test(val);
}

export function isNumber(val) {
    let exp = new RegExp(/^[0-9]+$/gi);
    return exp.test(val);
}
export function isEmpty(val) {
    if (val) {
        return false;
    } else {
        return true;
    }
}


export function guid() {
    function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
   }
   