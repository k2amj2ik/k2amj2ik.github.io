define(function(require) {

    var RESTUtil = require('restUtil');
    var IDBUtil = require('idbUtil');
    var Util = require('Util');

    var $ = require('jquery');
    require('countdown');

    var fnLotDetailView = (function(){

        var lotElHtml = [];
        var _initPageLoad = 1;  // 페이지 재사용일때 Cast El을 선택
        var _pObj;

        var init = function() {
            _initPageLoad = 1;
            _pObj = "";
            lotElHtml = [];
        };

        var consoleLog = function(_data,_pType) {
            //
            if(_pType == "simple"){
                var _obj = _data;
                Util.console("■ castLotItem ■----------------------");
                Util.console("   ■ Cast Status : " + _obj.pCastStatusValue);
                Util.console("   ■ Auction Status : " + _obj.pType);
                Util.console("   ■ Date : " + _obj.pDate +" / "+ _obj.pTime);
                Util.console("   ■ Sale No (Auction No) : " + _obj.pSaleNo);
                Util.console("   ■ Sale Lot No : " + _obj.pSaleLotNo);
                Util.console("   ■ Lot No : " + _obj.pLotIdx);
                Util.console("   ■ Next Lot No : " + _obj.pNextLotIdx);
                Util.console("   ■ Sold Price : " + _obj.pCurrency + " " + _obj.pPrice);
                Util.console("■ -------------------------------------");
            }else{
                if( _data.length > 10 ){
                    var _obj = eval("("+ _data +")");

                    Util.console("■ castLotItem ■----------------------");
                    Util.console("   ■ Cast Status : " + _obj.pCastStatusValue);
                    Util.console("   ■ Auction Status : " + _obj.pType);
                    Util.console("   ■ Date : " + _obj.pDate +" / "+ _obj.pTime);
                    Util.console("   ■ Sale No (Auction No) : " + _obj.pSaleNo);
                    Util.console("   ■ Sale Lot No : " + _obj.pSaleLotNo);
                    Util.console("   ■ Lot No : " + _obj.pLotIdx);
                    Util.console("   ■ Next Lot No : " + _obj.pNextLotIdx);
                    Util.console("   ■ Sold Price : " + _obj.pCurrency + " " + _obj.pPrice);
                    Util.console("■ -------------------------------------");
                }
            }
        };

        var castLotItem = function(_data) {
            // TODO: 데이터가 들어올때만 적용한다(?)
            if( _data.length > 10 ){
                _pObj = eval("("+ _data +")");

                fnLotDetailView.consoleLog(_pObj,"simple");

                // OFF-AIR 상태에는 처리를 불가.
                if(_pObj.pCastStatusValue != "ON-AIR"){
                    Util.console(" - [ OFF-AIR ] - ");
                    return false;
                }

                var _onSuccess = function(data){
                    //Util.console("_onSuccess :: " + data);
                    if(Util.isNotEmpty([_pObj.pAlarmVR])){
                        if( parseInt(_pObj.pAlarmVR) <= 1000){
                            navigator.vibrate([psraeInt(_pObj.pAlarmVR)]);
                        }
                    }

                    if(Util.isNotEmpty([_pObj.pType,_pObj.pCastStatusValue])){
                        if((_pObj.pType === "SOLD") && (_pObj.pCastStatusValue === "ON-AIR")){
                            //진동으로 알려준다~~~ ㅋㅋ
                            //navigator.vibrate([100]);
                        }
                    }
                    //TODO: 데이터가 있으므로 EL만들기
                    if( _gAucData.cast.lotIdx != _pObj.pLotIdx){
                        Util.console("_onSuccess  1 :: " + _pObj.pLotIdx);
                        fnLotDetailView.genCastLotItemEl(data);
                    }else{
                        Util.console("_onSuccess  2 :: " + _pObj.pLotIdx);
                        if(_initPageLoad == 1){
                            // 페이지를 재 생성 하지 않았을때,
                            // 처음 페이지를 부른다면 새로 El 을 만들기.
                            _initPageLoad = 0;
                            fnLotDetailView.genCastLotItemEl(data);
                        }else{
                            fnLotDetailView.genReCastLotItemEl(data);
                        }
                    }
                }
                var _onError = function(error){
                    // Util.console("_onError");
                    // Util.console('ERROR!', error);
                }
                //TODO: Step 0. Auction 정보 세팅하기.
                IDBUtil.lot.selectOneByIdx(parseInt(_pObj.pLotIdx), _onSuccess, _onError);
            }
        };

        var genCastLotItemEl = function(data) {
            var castLotElHtml = [];
            var _obj = _pObj;
            _gAucData.cast.pCurrency = _obj.pCurrency;
            _gAucData.cast.price = Util.numberWithCommas(_obj.pPrice);

            castLotElHtml.push( "   <div class='time'>");
            castLotElHtml.push( "       <div id='castLotTime' class='flip-clock-wrapper'></div>");
            castLotElHtml.push( "   </div>");
            castLotElHtml.push( "   <div id='currentPrice' class='price'>");
            castLotElHtml.push( "       <p class='status'>Current</p>");
            castLotElHtml.push( "       <p class='currency'><span class='locale'>"+_obj.pCurrency+"</span>"+ Util.numberWithCommas(_obj.pPrice) +"</p>");
            castLotElHtml.push( "   </div>");

            $("#price_info").addClass("price_info");
            $("#price_info").html( castLotElHtml.join("") );
            castLotElHtml = [];

            //TODO: Countdown
            var clock = $("#price_info #castLotTime").FlipClock({
                clockFace: 'MinuteCounter'
            });
        };

        var genReCastLotItemEl = function(data) {
            var castLotElHtml = [];
            var _obj = _pObj;
            var pAuctionEl = "#price_info #currentPrice";
            _gAucData.cast.pCurrency = _obj.pCurrency;
            _gAucData.cast.price = Util.numberWithCommas(_obj.pPrice);

            castLotElHtml.push( "       <p class='status'>Current</p>");
            castLotElHtml.push( "       <p class='currency'><span class='locale'>"+_obj.pCurrency+"</span>"+ Util.numberWithCommas(_obj.pPrice) +"</p>");
            $(pAuctionEl).html( castLotElHtml.join("") );
            castLotElHtml = [];

            //TODO: Countdown
            var clock = $("#price_info #castLotTime").FlipClock({
                clockFace: 'MinuteCounter'
            });
        };

        var genLotItem = function(data){
            var priceElHtml = [];

            if((data.bidStatus == "LOT_3") || (data.bidStatusValue == "WITHDRAWN")){
            // WITHDRAWN
                if(Util.isNotEmpty([data.bidStatusValue])){
                    priceElHtml.push( "<p class='not_sold'>"+ data.bidStatusValue +"</p>" );
                }else{
                    priceElHtml.push( "<p class='not_sold'> WITHDRAWN </p>" );
                }

                $("#price_info").addClass("done");
                $("#price_info").append( priceElHtml.join("") );
                priceElHtml = [];
            }else if((data.bidStatus == "LOT_4") || (data.bidStatusValue == "PASSED")){
            // PASSED
                if(Util.isNotEmpty([data.bidStatusValue])){
                    priceElHtml.push( "<p class='not_sold'>"+ data.bidStatusValue +"</p>" );
                }else{
                    priceElHtml.push( "<p class='not_sold'> PASSED </p>" );
                }

                $("#price_info").addClass("done");
                $("#price_info").append( priceElHtml.join("") );
                priceElHtml = [];
            }else if((data.bidStatus == "LOT_5") || (data.bidStatusValue == "SOLD")){
            // SOLD
                priceElHtml.push( "<div class='price_range'>" );
                priceElHtml.push( "     <p class='price1'> "+ data.estimateLowCurValue +" "+ data.estimateLow + " - " + data.estimateHighCurValue +" "+ data.estimateHigh +" </p>" );
                priceElHtml.push( "</div>" );

                //TODO:
                if( Util.isNotEmpty([data.priceSoldCurValue,data.priceSold]) ){
                    priceElHtml.push( "<p class='buyer'>hammer</p>" );
                    priceElHtml.push( "<div class='price'>" );
                    priceElHtml.push( "     <p class='currency'><span class='locale'> "+ data.priceSoldCurValue +" </span>"+ Util.numberWithCommas(data.priceSold) +"</p>" );
                    priceElHtml.push( "</div>" );
                }

                $("#price_info").addClass("done");
                $("#price_info").append( priceElHtml.join("") );
                priceElHtml = [];
            }else{
            // LOT_1 : READY || LOT_2 : START
                if((this.reload != 1) || (this.reload == undefined)){
                    priceElHtml.push( "<div class='price_range'>" );
                    priceElHtml.push( "     <p class='price1'> "+ data.estimateLowCurValue +" "+ data.estimateLow + " - " + data.estimateHighCurValue +" "+ data.estimateHigh +" </p>" );
                    priceElHtml.push( "</div>" );
                    $("#price_info").removeClass("price_info");
                    $("#price_info").after( priceElHtml.join("") );
                    priceElHtml = [];
                }
            }
        };

        var setAuctionItem = function(data){

            var vendorClass = "";
            var vendorInit = "";
            var auctionStatusClass = "";

            switch (data.vendorCd) {
              case 'CD01' :  vendorInit="C"; vendorClass = "c1"; break; // VendorCd CD01 Christies
              case 'CD02' :  vendorInit="S"; vendorClass = "c2"; break; // VendorCd CD02 Sothebys
              case 'CD03' :  vendorInit="B"; vendorClass = "c3"; break; // VendorCd CD03 Bonhams
              case 'CD04' :  vendorInit="C"; vendorClass = "c6"; break; // VendorCd CD04 China Guardian
              case 'CD05' :  vendorInit="P"; vendorClass = "c4"; break; // VendorCd CD05 Phillips
              case 'CD06' :  vendorInit="P"; vendorClass = "c5"; break; // VendorCd CD06 Poly HK
              case 'CD07' :  vendorInit="P"; vendorClass = "c5"; break; // VendorCd CD06 Poly HK
              default   :  vendor="P"; vendorClass = "c6"; break;
            }
            // CAST_1 : ready | CAST_2 : on-air | CAST_3 : off-air
            // b: current | p: past
            if(data.castStatus == 'CAST_2'){
                auctionStatusClass = "ico b";
            }else if(data.castStatus == 'CAST_3'){
                auctionStatusClass = "ico p";
            }else{
                auctionStatusClass = "ico";
            }

            //$("#wrapper #auctionInfoWrapper").addClass(vendorClass);
            $(".lot_view").addClass(vendorClass);

            $("#wrapper #auctionInfoWrapper #ico").addClass(auctionStatusClass);
            $("#wrapper #auctionInfoWrapper #ico").text(vendorInit);
            $("#wrapper #auctionInfoWrapper #vendor").html( data.vendorName +" &middot; "+ moment(data.aucDateFrom).format('MMM Do YYYY, h:mm a') );
            $("#wrapper #auctionInfoWrapper #aucDate").html();
            $("#wrapper #auctionInfoWrapper #title").html( data.aucName );

            Util.console(">> (Detail) castStatus :: " + data.castStatus);
            Util.console(">> (Detail) aucDateFrom :: " + data.aucDateFrom);

            // TODO: topList에 해당 내용 Append
            if(data.castStatus == 'CAST_1'){    //준비중인 경매
                $(".lot_view").addClass("t145");

                if(data.aucDateFrom != undefined){
                    var rootEl = "#auctionInfoWrapper #upcoming";
                    // ------------------------------------------------------
                    // 남아있는 시간 설정.
                    // ------------------------------------------------------
                    var sDate = moment().format('YYYY-MM-DD HH:MM:SS');
                    var eDate = moment(data.aucDateFrom).format('YYYY-MM-DD HH:MM:SS');
                    var t = moment(sDate).twix(eDate);
                    var rtEL = rootEl+" .remains .times";

                    if(( parseInt(t.count('minutes')) < (60*48) ) && ( parseInt(t.count('minutes')) > 0 )){
                        var tzName = "Europe/London";   // default zone
                        if( Util.isNotEmpty([data.locTimeZone])){
                            tzName = data.locTimeZone;
                        }
                        var remTime = moment.tz(eDate, tzName);
                        $(rtEL).countdown(remTime.toDate(), function(event) {
                            $("#auctionInfoWrapper #upcoming .remains .times").html(event.strftime('<span>%H</span>h <span>%M</span>m <span>%S</span>s , '));
                        });
                    }else{
                        $(rtEL).html( "<span>"+ t.count('days') +"</span> days , " );
                    }
                    // ------------------------------------------------------
                    $(rootEl).show();
                }
            }else if(data.castStatus == 'CAST_2'){  //진행중인 경매
                $(".lot_view").addClass("t175");

                var rootEl = "#auctionInfoWrapper #ongoing";

                $(rootEl + " .tit").empty();
                $(rootEl + " .prices .p1").empty();

                Util.console(">> _gAucData.cast.saleLotNum :: " + _gAucData.cast.saleLotNum );

                if((_gAucData.cast.saleLotNum != "") || (_gAucData.cast.saleLotNum != " ")){
                    //$(rootEl + " .tit").html(" Current Bid ");
                    $(rootEl + " .prices .p1").html( _gAucData.cast.saleLotNum );
                }
                $(rootEl).show();
            }else if(data.castStatus == 'CAST_3'){  //종료된 경매
                $(".lot_view").addClass("t185");

                var rootEl = "#auctionInfoWrapper #past";
                $(rootEl + " .prices .p1").html( data.priceSoldCurValue + Util.numberWithCommas(data.priceSold));
                $(rootEl).show();
            }else if(data.castStatus == null){
                var rootEl = "#auctionInfoWrapper #upcoming";
                // ------------------------------------------------------
                // 남아있는 시간 설정.
                // ------------------------------------------------------
                var sDate = moment().format('YYYY-MM-DD HH:MM:SS');
                var eDate = moment(data.aucDateFrom).format('YYYY-MM-DD HH:MM:SS');
                var t = moment(sDate).twix(eDate);
                var rtEL = rootEl+" .remains .times";

                if(( parseInt(t.count('minutes')) < (60*48) ) && ( parseInt(t.count('minutes')) > 0 )){
                    var tzName = "Europe/London";   // default zone
                    if( Util.isNotEmpty([data.locTimeZone])){
                        tzName = data.locTimeZone;
                    }
                    var remTime = moment.tz(eDate, tzName);
                    $(rtEL).countdown(remTime.toDate(), function(event) {
                        $(this).html(event.strftime('<span>%H</span>h <span>%M</span>m <span>%S</span>s ,'));
                    });
                }else{
                    $(rtEL).html( "<span>"+ t.count('days') +"</span> days , " );
                }
                // ------------------------------------------------------
                $(rootEl).show();
            }else{
                // 아무것도 없을경우
                var rootEl = "#auctionInfoWrapper #upcoming";
                $(rootEl + " .remains .tit").empty();
                $(rootEl + " .remains .times").empty();
                $(rootEl).show();
            }

            // show auctionInfoWrapper
            $("#wrapper .top_fix").show();
        };

        var setLotItem = function(data){
            var _imgUrl = "";

            if( (data.loc_imageUrl != "") && (data.loc_imageUrl != null) && (data.loc_imageFile != "") && (data.loc_imageFile != null) ){
                _imgUrl = (data.loc_imageUrl).replace("/org/","/L600/") + data.loc_imageFile;
            }else if(Util.isNotEmpty([data.imageUrl])){
                _imgUrl = data.imageUrl;
            }else{
                _imgUrl = "img/noimage_detail.png";
            }

            //TODO : Lot Num
            $("#auctionInfoWrapper #lotNum").html(" Lot. " + data.saleLotNum);

            //TODO : default_info
            $(".default_info #lot_image_div img.lazyResult").attr("data-original",_imgUrl);
            $(".default_info .similar_lots .tit").html("Similar Artwork by <strong>"+ data.artistName +"</strong>");

            //TODO : artist_info
            $(".artist_info .name").html( data.artistName );
            $(".artist_info .info").html( data.artistOriginYear );
            $(".art_title").html( data.workTitle );
            $(".price_range #lowHighPrice").html( data.estimateLowCurValue +" "+ data.estimateLow + " - " + data.estimateHighCurValue +" "+ data.estimateHigh );

            //TODO : price_info
            fnLotDetailView.genLotItem(data);

            //TODO : art_info
            $(".lot_detail .art_info #artistSigned").html( data.artistSigned );
            $(".lot_detail .art_info #category").html( data.category );
            $(".lot_detail .art_info #medium").html( data.medium );
            $(".lot_detail .art_info #yearExecuted").html( data.yearExecuted );
            $(".lot_detail .art_info #size").html( data.size );

            //TODO : detail_info
            if( (data.provenance != "") && (data.provenance != null) && (data.provenance != undefined) ){
                $(".detail_info #s_provenance").html( data.provenance );
            }else{
                //$(".detail_info #s_provenance").html("&nbsp;&nbsp; none.");
                $(".detail_info #provenance").hide();
                $(".detail_info #provenanceCont").hide();
            }
            if( (data.exhibited != "") && (data.exhibited != null) && (data.exhibited != undefined) ){
                $(".detail_info #s_exhibition").html( data.exhibited );
            }else{
                $(".detail_info #exhibition").hide();
                $(".detail_info #exhibitionCont").hide();
            }
            if( (data.literature != "") && (data.literature != null) && (data.literature != undefined) ){
                $(".detail_info #s_literature").html( data.literature );
            }else{
                $(".detail_info #literature").hide();
                $(".detail_info #literatureCont").hide();
            }
            if( (data.conditionReport != "") && (data.conditionReport != null) && (data.conditionReport != undefined) ){
                $(".detail_info #s_condition").html( data.conditionReport );
            }else{
                $(".detail_info #condition").hide();
                $(".detail_info #conditionCont").hide();
            }
            if( (data.otherDescription != "") && (data.otherDescription != null) && (data.otherDescription != undefined) ){
                $(".detail_info #s_other").html( data.otherDescription );
            }else{
                $(".detail_info #other").hide();
                $(".detail_info #otherCont").hide();
            }
        };

        return {
            init : init,
            setLotItem : setLotItem,
            setAuctionItem : setAuctionItem,
            genLotItem : genLotItem,
            consoleLog : consoleLog,
            castLotItem : castLotItem,
            genCastLotItemEl : genCastLotItemEl,
            genReCastLotItemEl : genReCastLotItemEl
        }
    })();

    app.views.LotDetailView = Backbone.View.extend({

        initialize: function (options) {
            this.id = options.id;
            this.reload = options.reload;

            //Util.console( ">>1. options.reload : " +  options.reload);
            //Util.console( ">>1. this.reload : " +  this.reload);

            if(options.reload == undefined){
                this.reload = 0;
            }

            //Util.console( ">>2. options.reload : " +  options.reload);
            //Util.console( ">>2. this.reload : " +  this.reload);

            if((this.reload != 0) && (this.reload != undefined)){
                //Util.console( ">>3. this.reload : " +  this.reload);
                //TODO: Step 0. Auction 정보 세팅하기.
                IDBUtil.auction.selectOneByIdx(parseInt(_gAucData.auctionIdx), fnLotDetailView.setAuctionItem );
            }else{
                //Util.console( ">>4. this.reload : " +  this.reload);
                //TODO: Step 0. init.
                fnLotDetailView.init();

                //TODO: Step 1. Lot 정보 가져오기.
                IDBUtil.lot.selectOneByIdx(parseInt(this.id), this.render_after);

                //Util.console( ">>>>> _gAucData.cast.detailViewCast :: " + _gAucData.cast.detailViewCast );

                if(_gAucData.cast.detailViewCast == undefined){
                    _gAucData.cast.detailViewCast = "castOnFirst";
                }

                if(_gAucData.cast.detailViewCast == "castOnFirst"){
                    // start Cast Info
                    RESTUtil.liveCastInfo(fnLotDetailView.castLotItem);
                    _gAucData.cast.detailViewCast = "castOn";
                }
            }
        },

        render: function (data) {
            this.$el.html(this.template());

            //TODO: Step 0. Auction 정보 세팅하기.
            IDBUtil.auction.selectOneByIdx(parseInt(_gAucData.auctionIdx), fnLotDetailView.setAuctionItem );

            return this;
        },
        render_after: function(data) {

            //TODO: Step 1. Lot 정보 세팅하기.
            fnLotDetailView.setLotItem(data);

            //TODO: Step 2. Lot 이미지 가져오기.
            $(".default_info #lot_image_div img.lazyResult").lazyload({
                threshold : 200,
                effect : "fadeIn"
            });

//            //TODO : Step 0. el empty
//            $("#wrapper #lotList").empty();
//
//            //TODO : Step 1. page값 가져오기
//            _gAucData.lotPage = data.page.page;
//            _gAucData.lotPageTotalCnt = data.page.pageTotalCnt;
//
//            Util.console( "==================================================");
//            Util.console( ">> page ::: " + _gAucData.lotPage);
//            Util.console( ">> pageTotalCnt ::: " + _gAucData.lotPageTotalCnt);
//            Util.console( "==================================================");
//
//            //TODO : Step 2. list값 가져오기 & 저장하기.
//			var onsuccess = function(idx){
//                //Util.console('Data inserted! insertId is: ' + idx);
//            }
//            var onerror = function(error){
//                Util.console('Oh noes, sth went wrong!', error);
//            }
//
//            $.each(data.list, function (index, value) {
//                // Util.console('length :: ' + data.list.length );
//                // Util.console('index :: ' + index );
//
//    			IDBUtil.lot.insert(value, onsuccess, onerror);
//                fnLotListView.genLotItems(value);
//
//    			if((index) == (data.list.length - 1)){
//    			    // last index
//    			    $("#wrapper #lotList").append( lotElHtml.join("") );
//                    $("img.lazyResult").lazyload({
//                        threshold : 100,
//                        effect : "fadeIn"
//                    });
//    			}
//            });
        },

        events: {
            "click .go_back": "back",
            "click #go_top": "goScrollTop"
        },

        back: function(event) {
            app.slider.back();
        },

        goScrollTop: function(event) {
            Util.windowTopScroll(1);
        }

    });

    return app.views.LotDetailView;

});