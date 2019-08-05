export  function nowDate(date) {
    return date?new Date(date):new Date();
}
/*
    转化成时间戳
    返回（s）秒
*/
export function timeStamp(date){
    date = Date.parse(nowDate(date));
    return date / 1000;
}
/*
    日期加减
*/
export function aroundDate(date, num){
    date = nowDate(date);
    date.setDate(date.getDate() + num);
    return date;
}

export function formatDate(date, format) {
    if (!date) {
        return false;
    }
    date = nowDate(date * 1000);

    let obj = {
        'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'W+': date.getDay()
    };
    let weeks = ['日','一', '二', '三', '四', '五', '六'];
    obj['W+'] = '周'+weeks[obj['W+']];
    if (new RegExp("(y+)").test(format)) {
        format = format.replace(RegExp.$1, obj['y+']);
    }
    for (var j in obj) {
        if (new RegExp("(" + j + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (obj[j]) : (("00" + obj[j]).substr(("" + obj[j]).length)));
        }
    }
    return format;
}

export function formatDataToMinutes(data){
    return Math.ceil(data / 60)
}
export function formatDataToMinute(data){
  return Math.ceil(data / 60)
}

export function timeAxis(date,currentTime){
    // debugger
    let timestampDiff = (currentTime - date) / 60 / 60 / 24;
    let res = '';
    let currentDate = nowDate(currentTime * 1000);
    let times = formatDate(date, 'hh:mm')
    if(timestampDiff > 0){
        if (timestampDiff < 1 && currentDate.getMonth() == nowDate(date * 1000).getMonth() && currentDate.getDate() == nowDate(date * 1000).getDate()) {
          res = '今天 '+times;
        } else if (timestampDiff < 2 && currentDate.getMonth() == nowDate(date * 1000).getMonth() && currentDate.getDate() == nowDate(date * 1000).getDate()+1) {
          res = '昨天 '+times;
        }else if(timestampDiff < 3 && currentDate.getMonth() == nowDate(date * 1000).getMonth() && currentDate.getDate() == nowDate(date * 1000).getDate()+2) {
          res = '前天 '+times;
      } else {
          res = formatDate(date, 'MM-dd')+' '+times
        }
    } else if (timestampDiff < 0) {
     if(timestampDiff > -1 && currentDate.getMonth() == nowDate(date * 1000).getMonth() && currentDate.getDate() == nowDate(date * 1000).getDate()) {
        res = '今天 '+times
      } else if(timestampDiff > -2 && currentDate.getMonth() == nowDate(date * 1000).getMonth() && currentDate.getDate() == nowDate(date * 1000).getDate()-1) {
        res = '明天 '+times
      } else if(timestampDiff > -3 && currentDate.getMonth() == nowDate(date * 1000).getMonth() && currentDate.getDate() == nowDate(date * 1000).getDate()-2) {
        res = '后天 '+times
      } else {
        res = formatDate(date, 'MM-dd')+' '+times
      }
    }
    return res
}

export function closeDateState(currentTime, publishDate, effectiveDate){
    // let currentDate = timeStamp();
    // let timestampDiff = (currentDate - date) / 24 / 60 / 60;
    let res = '';
     if(currentTime < publishDate){
        res = 1;
    } else if(currentTime > effectiveDate) {
        res = -1
    } else {
        res = 0
    }
    return res
}

export function closeDate(currentTime, publishDate, effectiveDate){
    let state = closeDateState(currentTime, publishDate, effectiveDate);

    let res = ''

    switch(state) {
        case 1:
            res = '发布时间还剩: '+countDownDate(currentTime,publishDate);
            break;
        case 0:
            res = '结束时间还剩: '+countDownDate(currentTime,effectiveDate);
            break;
        default:
            res = ''
    }
    return res;
}

export function countDownDate(currentTime,date){
    let timestampDiff = currentTime - date;
    let res = '';

    timestampDiff = timestampDiff < 0 ? (timestampDiff * -1): timestampDiff;

    if(timestampDiff < 3600) {
        res = Math.floor(timestampDiff / 60)+'分'
    } else if (timestampDiff < 3600 * 24) {
        res = Math.floor(timestampDiff / 3600)+'小时'+Math.floor(timestampDiff / 60 % 60)+'分';
    } else if (timestampDiff > 3600 * 24 ) {
        res = Math.floor(timestampDiff / 3600 / 24)+'天'+Math.floor(timestampDiff / 3600 % 24)+'小时'+Math.floor(timestampDiff / 60 % 60)+'分';
    }
    return res
}

export function countLast(date){
    let currentDate = timeStamp();
    let timestampDiff = currentDate - (date);
    let res = '';

    timestampDiff = timestampDiff < 0 ? (timestampDiff * -1): timestampDiff;
    if(timestampDiff < 86400 && nowDate().getMonth() == nowDate(date * 1000).getMonth() && nowDate().getDate() == nowDate(date * 1000).getDate()) {
        res = '今天'
    } else if (timestampDiff < 86400 * 2 && nowDate().getMonth() == nowDate(date * 1000).getMonth() && nowDate().getDate() == nowDate(date * 1000).getDate()+1) {
        res = '昨天'
    } else {
        let lastDays = Math.ceil(timestampDiff / 86400);
        res = lastDays + '天前'
    }
    return res
}

export function stringParam(obj){
    let res= "";
    for(let k in obj){
        res+='&'+k+'='+obj[k];
    }
    return res.slice(1);
}

export function compareDate(date) {
    let res = date - timeStamp();
    return res >= 0 ? true: false;
}

export function parseParam(url){
    let arr = '';
    let obj = {};
    url = url || window.location.href;
    if(url.split("?").length > 1){
        arr  = url.split('?')[1].split('&');
        arr.map(item=>{
            item = item.split('=');
            let k = item[0],v = item[1];
            obj[k] = v;
        })
        return obj;
    }
}

export function gradText(num){
    let data = require('./../data/grads');
    let res = '';
    for(let item of data.default) {
        if(item.id == num) {
            res = item.name;
        }
    }
    return res;
}
// 格式化题干html
export function formatHtml(val,type){
    if(type==3){
        return val.replace(/{#blank#}(\d*){#\/blank#}/g,'<span class="filling-txt"><i class="filling_bg">$1</i></span>')
    }else{
        return val.replace(/&nbsp;/g,' ')
    }
}
// 数字转成字母
export function fromCharCode(val){
    return String.fromCharCode(65+val)
}
// 设置得分(assess= undefined或6:未作答  0:未批改 1:对 2:错 3:半对 4:未知  5:批改失败)
export function setAssess(userAnswer){
    var html='';
    if(userAnswer && userAnswer.score!==undefined){
        if(userAnswer.assess===0){
            html = '评分中'
        }else if(userAnswer.assess===5){
            html = '批改失败'
        }else{
            html = parseFloat(userAnswer.score) + '分'
        }
    }else{
        html = 0 + '分'
    }
    return html;
}

export function toMath(num, count, defaultValue){

    if(num == 0) {
        return 0;
    }else if(num=="-" || !num){
        return num="-"
    }
    return num=parseFloat(parseFloat(num).toFixed(count))
}
export function toPercent(num, count, defaultValue){

    if(num == 0) {
        return 0;
    }else if(num=="-" || !num){
        return num="-"
    }

    return num=Number(num*100).toFixed(count)+"%";
}
