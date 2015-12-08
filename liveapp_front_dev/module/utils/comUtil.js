define(function(require) {

    var $ = require("jquery");

    var Util = {
        loading : {}
    };
       
    _gAppData.isDebug = 1;
    _gAppData.isLoading = 0;
       
    Util.console = function (obj,cont) {
        var _obj = "";
        var _cont = "";

        if((obj != "") && (obj != undefined)){
            _obj = "[■] " + obj;
        }
        if((cont != "") && (cont != undefined)){
            _cont = " :: " + cont;
        }

       if( _gAppData.isDebug ){
            console.log(_obj +  _cont);
        }
    };
    Util.console.line = function () {
        console.info("-----------------------------------");
    };

    // 가격 자리체크
    Util.numberWithCommas = function (x) {
        x = x.replace(",","");
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    Util.scrollTop = function (h) {
        var body = $("html, body");
        body.scrollTop(h);
    };
    Util.windowTopScroll = function (_pType,fnCallback) {
        var body = $("html, body");

        if((_pType == null) || (_pType == undefined)){
            body.scrollTop(300);
        }

        body.stop().animate({scrollTop:0}, '200', 'swing', function() {
            if (fnCallback && typeof (fnCallback) === "function") {
                fnCallback();
            }
        });
    };

    Util.isNotEmpty = function (obj) {
        var r = 1;
        for(i=0;i<obj.length;i++){
            if((obj[i] != null) && (obj[i] != undefined) && (obj[i] != "")){
                r = r * 1;
            }else{
                r = r * 0;
            }
        }
        return r;
    };
    Util.isEmpty = function (obj) {
        var r = 1;
        for(i=0;i<obj.length;i++){
            if((obj[i] == null) || (obj[i] == undefined) || (obj[i] == "")){
                r = r * 1;
            }else{
                r = r * 0;
            }
        }
        return r;
    };

    Util.getMonthYear = function (type,_year,_month) {
        var rMonth = "";
        var rYear = _year;

        switch (type) {
            case "P" :  rMonth = ((parseInt(_month) - 1) % 12);
                        if(rMonth == 0){
                            rMonth = 12;
                            rYear = parseInt(_year) - 1;
                        }
                        break;
            case "C" :  rMonth = parseInt(_month);
                        break;
            case "N" :  rMonth = ((parseInt(_month) + 1) % 12);
                        if(rMonth == 0){
                            rMonth = 12;
                        }
                        if(rMonth == 1){
                            rYear = parseInt(_year) + 1;
                        }
                        break;
            default   : rMonth = parseInt(_month);
                        break;
        }

        return (rYear + "-" + rMonth);
    };

    Util.getMonthName = function (_month) {
        var monthName = ["All","January","February","March","April","May","June","July","August","September","October","November","December"];
        return monthName[parseInt(_month)];
    };

    Util.loading.show = function(_type,_cont){
        _gAppData.isLoading = 1;

        console.log( _type +"/"+ _cont);

        switch (_type) {
            case '1' :
                ProgressIndicator.showSimpleWithLabelDetail(true,"Initial Processing....",_cont);
                break;
            case '2' :
                ProgressIndicator.showSimpleWithLabelDetail(true,"Initial Processing....",_cont);
                break;
            default   :  ProgressIndicator.showSimple(true); break;
        }
    };

    Util.loading.hide = function(){
       if(_gAppData.isLoading){
           _gAppData.isLoading = 0;
           ProgressIndicator.hide();
       }
    };

  	return Util;
});
