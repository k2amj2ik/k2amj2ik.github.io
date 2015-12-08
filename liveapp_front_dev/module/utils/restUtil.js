define(function(require) {
    var Util = require('Util');

	var RESTUtil = {};

	//var _hostURI = "http://192.168.0.13:8080/liveweb";
	var _hostURI = "http://live.gandsart.com";

    _gAppData.hostUri = _hostURI;

	RESTUtil.appChkUri = _hostURI + "/api/m/appVersionChk?appType=iPhone";
    RESTUtil.castChkUri = _hostURI + "/api/m/appVersionChk?appType=cast";

    //RESTUtil.lotListChkUri = _hostURI + "/api/m/";
    //RESTUtil.castInfoUri= _hostURI + "/api/m/appCastInfoChk";
    //
	RESTUtil.appVersionChk = function(onSuccess, onFail, onError){
		commAjax('GET', RESTUtil.appChkUri, '', onSuccess, onFail, onError);
	};

    //
	RESTUtil.searchAuctionWithPriceChk = function(params, onSuccess, onFail, onError){

	    var apiUri = "/api/m/searchAuctionWithPriceChk";

        params || (params = {});
        this.idx = params.idx;
        this.castStatus = params.castStatus;
        this.vendorCd = params.vendorCd;
        this.vendorName = params.vendorName;
        this.dateFrom_ff = params.dateFrom_ff;
        this.dateFrom_ft = params.dateFrom_ft;

        var option1 = "";
        var option2 = "";
        var option3 = "";
        var option4 = "";
        var option5 = "";
        var option6 = "";

        if((this.idx != "") && (this.idx != undefined)){
            option1 = "idx=" + this.idx + "&";
        }
        if((this.castStatus != "") && (this.castStatus != undefined)){
            option2 = "castStatus=" + this.castStatus + "&";
        }
        if((this.vendorCd != "") && (this.vendorCd != undefined)){
            option3 = "vendorCd=" + this.vendorCd + "&";
        }
        if((this.vendorName != "") && (this.vendorName != undefined)){
            option4 = "vendorName=" + this.vendorName + "&";
        }
        if((this.dateFrom_ff != "") && (this.dateFrom_ff != undefined)){
            option5 = "dateFrom_ff=" + this.dateFrom_ff + "&";
        }else{
            option5 = "aucDateFrom_ff=2015-10-01&";
        }
        if((this.dateFrom_ft != "") && (this.dateFrom_ft != undefined)){
            option6 = "dateFrom_ft=" + this.dateFrom_ft;
        }else{
            option6 = "dateFrom_ft=2015-10-31";
        }

        _uri = _hostURI + apiUri + "?" + option1 + option2 + option3 + option4 + option5 + option6;

        Util.console( ">> (searchAuctionWithPriceChk)  _uri :: " + _uri );
		commAjax('GET', _uri,'', onSuccess, onFail, onError);
	};

    RESTUtil.searchLotList = function(params, onSuccess, onFail, onError){

	    var apiUri = "/api/m/searchLotChk";

        params || (params = {});
        this.idx = params.idx;
        this.saleInfoIdx = params.saleInfoIdx;
        this.bidStatus = params.bidStatus;
        this.page = params.page;
        this.forCastYN = params.forCastYN;

        var option = [];
        option.push("bidStatus=LOT_1&bidStatus=LOT_2&bidStatus=LOT_3&bidStatus=LOT_4&bidStatus=LOT_5&");

        if((this.saleInfoIdx != "") && (this.saleInfoIdx != undefined)){
            option.push( "saleInfoIdx=" + this.saleInfoIdx + "&" );
        }
        if((this.idx != "") && (this.idx != undefined)){
            option.push( "idx=" + this.idx + "&" );
        }

        if((this.page != "") && (this.page != undefined)){
            option.push("page=" + this.page );
        }else{
            option.push("page=1");
        }

        _uri = _hostURI + apiUri + "?" + option.join("");

        Util.console( ">> (searchLotList)  _uri :: " + _uri );
        if(this.forCastYN == "Y"){
            commAjaxWithoutLoading('GET', _uri,'', onSuccess, onFail, onError);
        }else{
            commAjax('GET', _uri,'', onSuccess, onFail, onError);
        }
    };

    //
    RESTUtil.genAuctionList = function ( obj, frm ){
        var strHTML = "";
        _.each(obj.toJSON() ,function(vo,i){
            if( vo.vendorCd === "CD01" ){
            // Christies
                //console.log("Christies");
            }else if( vo.vendorCd === "CD02" ){
            // Sothebys
                //console.log("Sothebys");
            }else if( vo.vendorCd === "CD03" ){
            // Bonhams
                //console.log("Bonhams");
            }else if( vo.vendorCd === "CD04" ){
            // China Guardian
                //console.log("China Guardian");
            }else if( vo.vendorCd === "CD05" ){
            // Phillips
                //console.log("Phillips");
            }else if( vo.vendorCd === "CD06" ){
            // Poly HK
                //console.log("Poly HK");
            }
        });
    };

    RESTUtil.liveCastInfo = function(onSuccess, onFail, onError){

        var Chat = {};
        var castUri = "none";
        Chat.socket = null;

        var _onSuccess = function(data){
            castUri = data.castUri+"0";

            Util.console(">>>>>>>>>>>>>>>>>>>>> ws :: " + castUri);
            Chat.initialize(castUri);
        }
        var _onError = function(error){
            Util.console('Oh noes, sth went wrong!', error);
        }
		commAjax('GET', RESTUtil.castChkUri,'', _onSuccess, onFail, _onError);

		//
        // connect() 함수 정의
        Chat.connect = (function(host) {
            // 서버에 접속시도
            if ('WebSocket' in window) {
                Chat.socket = new WebSocket(host);
            } else if ('MozWebSocket' in window) {
                Chat.socket = new MozWebSocket(host);
            } else {
                Util.console('Error: WebSocket is not supported by this browser.');
                return;
            }

             // 서버에 접속이 되면 호출되는 콜백함수
            Chat.socket.onopen = function () {
                Util.console('Info: socket connection opened.');
            };

            // 연결이 끊어진 경우에 호출되는 콜백함수
            Chat.socket.onclose = function () {
                Util.console('Info: socket closed.');
            };

            // 서버로부터 메시지를 받은 경우에 호출되는 콜백함수
            Chat.socket.onmessage = function (message) {
                // 수신된 메시지를 화면에 출력함
                if (onSuccess && typeof (onSuccess) === "function") {
					onSuccess(message.data);
				}
            };
        });

        // 위에서 정의한 connect() 함수를 호출하여 접속을 시도함
        Chat.initialize = function(_castUri) {
            Util.console("Chat.initialize -1-");

            Chat.connect(_castUri);

            if (window.location.protocol == 'http:') {
                Util.console("Chat.initialize -2-");
                Chat.connect(_castUri);
            }
        };
    };

	//
	function commAjax(_type, _uri, _data, fnSuccess, fnFail, fnError, fnDone) {
		ProgressIndicator.showSimpleWithLabel(true,"Data Loading....");

		$.ajax({
			type : _type,
			url : _uri,
			data : _data,
			cache : true,
			dataType : 'json',
			success : function(response) {
			    ProgressIndicator.hide();
				if (fnSuccess && typeof (fnSuccess) === "function") {
					fnSuccess(response);
				}
			},
			fail : function(response) {
			    ProgressIndicator.hide();
				if (fnFail && typeof (fnFail) === "function") {
					fnFail();
				}
			},
			error : function(error) {
			    ProgressIndicator.hide();
				if (fnError && typeof (fnError) === "function") {
					fnError();
				}
			}
		}).done(function() {
			if (fnDone && typeof (fnDone) === "function") {
				fnDone();
			}
		});
	};

	//
	function commAjaxWithoutLoading(_type, _uri, _data, fnSuccess, fnFail, fnError, fnDone) {
		$.ajax({
			type : _type,
			url : _uri,
			data : _data,
			cache : true,
			dataType : 'json',
			success : function(response) {
                ProgressIndicator.hide();
				if (fnSuccess && typeof (fnSuccess) === "function") {
					fnSuccess(response);
				}
			},
			fail : function(response) {
			    ProgressIndicator.hide();
				if (fnFail && typeof (fnFail) === "function") {
					fnFail();
				}
			},
			error : function(error) {
			    ProgressIndicator.hide();
				if (fnError && typeof (fnError) === "function") {
					fnError();
				}
			}
		}).done(function() {
			if (fnDone && typeof (fnDone) === "function") {
				fnDone();
			}
		});
	};

  	return RESTUtil;
});
