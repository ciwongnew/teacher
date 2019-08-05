export default {
    TimeStatus : function (effectiveDate,sendDate){
        var curTimestamp = parseInt(new Date().getTime() / 1000);//当前时间戳
        if(curTimestamp>effectiveDate){
            return 2;//已经结束状态
        }else if(curTimestamp<sendDate){
            return 0;//未开始状态
        }else {
            return 1;//进行中状态
        }
    },
    timeStamp : function timeStamp( second_time ){
        var time = parseInt(second_time) + "秒";
        if( parseInt(second_time )> 60){
            var min = parseInt(second_time / 60);
            time = min + "分" ;
            if( min > 60 ){
                min = parseInt(second_time / 60) % 60;
                var hour = parseInt( parseInt(second_time / 60) /60 );
                time = hour + "小时" + min + "分" ;
                if( hour > 24 ){
                    hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                    var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                    time = day + "天" + hour + "小时" + min + "分" ;
                }
            }
        }
        return time;
    }
}
