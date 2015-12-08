define(function(require) {

    var RESTUtil = require('restUtil');
    var IDBUtil = require('idbUtil');
    var Util = require('Util');

    var $ = require('jquery');
    require('countdown');

    var fnLotListView = (function(){
        var lotElHtml = [];

        var setAuctionItem = function(data){
            // 상단 Auction Info 설정.

            var vendorClass = "";
            var vendorInit = "";
            var auctionStatusClass = "";

            console.log("-------------> data.vendorCd :: " + data.vendorCd);

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

            $("#wrapper #auctionInfoWrapper").addClass(vendorClass);
            $("#wrapper #auctionInfoWrapper #ico").addClass(auctionStatusClass);
            $("#wrapper #auctionInfoWrapper #ico").text(vendorInit);
            $("#wrapper #auctionInfoWrapper #vendor").html( data.vendorName +" &middot; "+ moment(data.aucDateFrom).format('MMM Do YYYY, h:mm a') );
            $("#wrapper #auctionInfoWrapper #aucDate").html();
            $("#wrapper #auctionInfoWrapper #title").html( data.aucName );

            // TODO: lotList에 해당 경매 벤더 매핑
            $("#lotList").addClass(vendorClass);

            Util.console(">> castStatus :: " + data.castStatus);
            Util.console(">> aucDateFrom :: " + data.aucDateFrom);

            // TODO: topList에 해당 내용 Append
            if(data.castStatus == 'CAST_1'){    //준비중인 경매
                $(".lot_list").addClass("t145");
                if((data.aucDateFrom != null) && (data.aucDateFrom != undefined) && (data.aucDateFrom != "")){
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
                            $("#auctionInfoWrapper #upcoming .remains .times").html(event.strftime('<span>%H</span>h <span>%M</span>m <span>%S</span>s'));
                        });
                    }else{
                        $(rtEL).html( "<span>"+ t.count('days') +"</span> days" );
                    }
                }
                $(rootEl).show();

            }else if(data.castStatus == 'CAST_2'){  //진행중인 경매
                $(".lot_list").addClass("t145");

                var rootEl = "#auctionInfoWrapper #ongoing";

                $(rootEl + " .tit").empty();
                if((_gAucData.cast.saleLotNum != "") && (_gAucData.cast.saleLotNum != " ")){
                    $(rootEl + " .tit").html(" Current Bid : " + _gAucData.cast.saleLotNum);
                }
                $(rootEl).show();
            }else if(data.castStatus == 'CAST_3'){  //종료된 경매
                $(".lot_list").addClass("t145");

                var rootEl = "#auctionInfoWrapper #past";
                $(rootEl + " .prices .p1").html( data.priceSoldCurValue + Util.numberWithCommas(data.priceSold));
                $(rootEl).show();
            }else if(data.castStatus == null){
                $(".lot_list").addClass("t185");
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
                        $(this).html(event.strftime('<span>%H</span>h <span>%M</span>m <span>%S</span>s'));
                    });
                }else{
                    $(rtEL).html( "<span>"+ t.count('days') +"</span> days" );
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

        var genLotItems = function(data){

            var lotStatusClass = "";
            var lotStatusResultClass = "";

            // READY
            if((data.bidStatus == "LOT_1") || (data.bidStatusValue == "READY")){
                lotStatusClass = "upcoming";
                lotStatusResultClass = "remaining";
            }

            // START
            if((data.bidStatus == "LOT_2") || (data.bidStatusValue == "START")){
                lotStatusClass = "ongoing";
                lotStatusResultClass = "c_bot";
            }

            // WITHDRAWN
            if((data.bidStatus == "LOT_3") || (data.bidStatusValue == "WITHDRAWN")){
                lotStatusClass = "past";
                lotStatusResultClass = "result";
            }

            // PASSED
            if((data.bidStatus == "LOT_4") || (data.bidStatusValue == "PASSED")){
                lotStatusClass = "past";
                lotStatusResultClass = "result";
            }

            // SOLD
            if((data.bidStatus == "LOT_5") || (data.bidStatusValue == "SOLD")){
                lotStatusClass = "past";
                lotStatusResultClass = "result";
            }

            lotElHtml.push( "<li class='"+ lotStatusClass +"'>" );
            lotElHtml.push( "   <div class='bg'></div>" );
            lotElHtml.push( "   <a href='#lotDetail/"+ data.idx +"' class='detail'>" );
            lotElHtml.push( "       <p class='lot_no'>Lot. "+ data.saleLotNum +"</p>" );
            lotElHtml.push( "       <div class='c_wrap'>" );

            //TODO: 이미지 uri에 따라서 이미지 처리
            if(Util.isNotEmpty([data.loc_imageUrl,data.loc_imageFile])){
                var thumbImgUri = (data.loc_imageUrl).replace("/org/","/L160/") + data.loc_imageFile;
                lotElHtml.push( "           <div class='thumb img_align'><img src='img/loading.png' class='lazyResult' data-original='"+ thumbImgUri +"'/></div>" );
            }else{
                //if(Util.isNotEmpty([data.imageUrl])){
                //    lotElHtml.push( "           <div class='thumb img_align'><canvas id='canvas_"+ data.idx +"'/></div>" );
                //}else{
                    lotElHtml.push( "           <div class='thumb img_align'><img src='img/noimage.png'/></div>" );
                //}
            }

            lotElHtml.push( "           <div class='cont'>" );
            lotElHtml.push( "               <p class='artist'>"+ data.artistName +"</p>" );
            lotElHtml.push( "               <p class='title'>"+ data.workTitle +"</p>" );

            //TODO: estimate 값이 없을때 문구 처리
            if(Util.isNotEmpty([data.estimateLowCurValue,data.estimateLow]) * Util.isNotEmpty([data.estimateHighCurValue,data.estimateHigh]) ){
                lotElHtml.push( "               <p class='price'> "+ data.estimateLowCurValue + data.estimateLow +" - "+ data.estimateHighCurValue + data.estimateHigh +"</p>" );
            }else{
                lotElHtml.push( "               <p class='price'> Estimate Upon Request. </p>" );
            }

            lotElHtml.push( "           </div>" );
            lotElHtml.push( "       </div>" );

            //
            if((data.bidStatus == "LOT_5") || (data.bidStatusValue == "SOLD")){
                if(Util.isNotEmpty([data.priceSoldCurValue,data.priceSold])){
                    lotElHtml.push( "       <div class='result'>" );
                    lotElHtml.push( "           <p class='status'>hammer</p>" );
                    lotElHtml.push( "           <span> "+ data.priceSoldCurValue +" "+ data.priceSold +" </span>" );
                    lotElHtml.push( "       </div>" );
                }
            }else if((data.bidStatus == "LOT_4") || (data.bidStatusValue == "PASSED")){
                lotElHtml.push( "       <div class='result'>" );
                lotElHtml.push( "           <span class='c_black'>"+ data.bidStatusValue +"</span>" );
                lotElHtml.push( "       </div>" );
            }else if((data.bidStatus == "LOT_3") || (data.bidStatusValue == "WITHDRAWN")){
                lotElHtml.push( "       <div class='result'>" );
                lotElHtml.push( "           <span class='c_black'>"+ data.bidStatusValue +"</span>" );
                lotElHtml.push( "       </div>" );
            }

            lotElHtml.push( "   </a>" );
            lotElHtml.push( "</li>" );

        };

        var getLotItemsEl = function(){
            // page total 비교후 다음이 나오면, more버튼 추가
            if(parseInt(_gAucData.lotPage.current) != parseInt(_gAucData.lotPage.total)){
                lotElHtml.push( "<div id='btn-more-lot-wrap' class='btns'>" );
                lotElHtml.push( "   <button id='btn-more-lot' class='btn-more'>View More</button>" );
                lotElHtml.push( "</div>" );
            }

            var returnEL = lotElHtml.join("");
            lotElHtml = [];
            return returnEL;
        };

        var initialize = function(){
            lotElHtml = [];
        };

        var imgLoadWithCanvasPreload = function(value){
            //TODO: 이미지 uri에 따라서 이미지 처리
            if(Util.isNotEmpty([value.imageUrl])){
                //if( (value.loc_imageUrl == "") || (value.loc_imageUrl == null) || (value.loc_imageFile == "") || (value.loc_imageFile != null) ){
                if(Util.isNotEmpty([value.loc_imageUrl,value.loc_imageFile])){

                }else{
                    var canvas = document.getElementById("canvas_"+value.idx);
                    var ctx = canvas.getContext("2d");

                    var img = new Image();
                    img.src = "img/noimg.png";
                    img.onload = function (value) {
                        var oc = document.createElement('canvas');
                        var octx = oc.getContext('2d');
                        oc.width = 75;
                        oc.height = 75;
                        octx.drawImage(img, 0, 0, oc.width, oc.height);
                        octx.drawImage(oc, 0, 0, oc.width, oc.height);
                        ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, 75, 75);
                    }
                }
            }
        };

        var imgLoadWithCanvas = function(value){
            //TODO: 이미지 uri에 따라서 이미지 처리
            //if( (value.loc_imageUrl != "") && (value.loc_imageUrl != null) && (value.loc_imageFile != "") && (value.loc_imageFile != null) ){
            if(Util.isNotEmpty([value.loc_imageUrl,value.loc_imageFile])){
                //img.src = value.loc_imageUrl+value.loc_imageFile;
                //TODO: img load
                $(".c_wrap .thumb img.lazyResult").lazyload({
                    threshold : 200,
                    effect : "fadeIn"
                });
            }else if(Util.isNotEmpty([value.imageUrl])){
                var canvas = document.getElementById("canvas_"+value.idx);
                var ctx = canvas.getContext("2d");
                var img = new Image();

                Util.console( "- no local Images -" );
                img.src = value.imageUrl;
                img.onload = function (value) {
                    var oc = document.createElement('canvas');
                    var octx = oc.getContext('2d');
                    oc.width = 75;
                    oc.height = 75;
                    octx.drawImage(img, 0, 0, oc.width, oc.height);
                    octx.drawImage(oc, 0, 0, oc.width, oc.height);
                    ctx.drawImage(oc, 0, 0, oc.width, oc.height,0, 0, 75, 75);
                }
            }
        };

        return {
            initialize : initialize,
            genLotItems : genLotItems,
            getLotItemsEl : getLotItemsEl,
            imgLoadWithCanvasPreload : imgLoadWithCanvasPreload,
            imgLoadWithCanvas : imgLoadWithCanvas,
            setAuctionItem : setAuctionItem
        }
    })();

    var _param;
    app.views.LotListView = Backbone.View.extend({

        initialize: function (options) {
            this.id = options.id;
            this.reload = options.reload;
            _gAucData.auctionIdx = this.id;

            console.log(" -----------------> id: " + this.id);
            console.log(" -----------------> reload: " + this.reload);
            console.log(" -----------------> auctionIdx: " + _gAucData.auctionIdx);

            if(this.reload == undefined){
                this.reload = 0;
            }

            if((this.reload == 1) && (this.reload != undefined)){
                //TODO: Step 0. Auction 정보 세팅하기.
                IDBUtil.auction.selectOneByIdx(parseInt(_gAucData.auctionIdx), fnLotListView.setAuctionItem);
            }else{
                fnLotListView.initialize();

                // _.bindAll(this, 'render');
                //TODO: Step 1. Lot 정보 가져오기.
                RESTUtil.searchLotList({
                    saleInfoIdx : this.id,
                    page : 1,
                    forCastYN : "N"
                },this.render_after);
            }
        },
        render: function (data) {
            // Util.console('Inside render');
            this.$el.html(this.template());

            //TODO: Step 0. Auction 정보 세팅하기.
            IDBUtil.auction.selectOneByIdx(parseInt(_gAucData.auctionIdx), fnLotListView.setAuctionItem);

            return this;
        },
        render_after: function(data) {
            //TODO : Step 0. el empty
            $("#wrapper #lotList").empty();

            //TODO : Step 1. page값 가져오기
            _gAucData.lotPage.current = data.page.page;
            _gAucData.lotPage.next = parseInt(data.page.page) + 1;
            _gAucData.lotPage.total = data.page.pageTotalCnt;

            Util.console( "==================================================");
            Util.console( ">>1 page ::: " + _gAucData.lotPage.current);
            Util.console( ">>1 next ::: " + _gAucData.lotPage.next);
            Util.console( ">>1 pageTotalCnt ::: " + _gAucData.lotPage.total);
            Util.console( "==================================================");

            //TODO : Step 2. list값 가져오기 & 저장하기.
			var onsuccess = function(idx){
                //Util.console('Data inserted! insertId is: ' + idx);
            }
            var onerror = function(error){
                Util.console('Oh noes, sth went wrong!', error);
            }

            $.each(data.list, function (index, value) {
                //Util.console('--------> length :: ' + data.list.length );

    			IDBUtil.lot.insert(value, onsuccess, onerror);
                fnLotListView.genLotItems(value);

    			if((index) == (data.list.length - 1)){
    			    // last index
    			    $("#wrapper #lotList").append( fnLotListView.getLotItemsEl() );
    			}
            });

            $.each(data.list, function (index, value) {
                new fnLotListView.imgLoadWithCanvasPreload(value);
                new fnLotListView.imgLoadWithCanvas(value);
            });

        },

        render_append: function(data) {

            // more버튼 제거
            $("#btn-more-lot-wrap").remove();

            //TODO : Step 1. page값 가져오기
            _gAucData.lotPage.current = data.page.page;
            _gAucData.lotPage.next = parseInt(data.page.page) + 1;
            _gAucData.lotPage.total = data.page.pageTotalCnt;

            // Util.console( "==================================================");
            // Util.console( ">>2 page ::: " + _gAucData.lotPage.current);
            // Util.console( ">>2 next ::: " + _gAucData.lotPage.next);
            // Util.console( ">>2 pageTotalCnt ::: " + _gAucData.lotPage.total);
            // Util.console( "==================================================");

            //TODO : Step 2. list값 가져오기 & 저장하기.
			var onsuccess = function(idx){
                //Util.console('Data inserted! insertId is: ' + idx);
            }
            var onerror = function(error){
                Util.console('Oh noes, sth went wrong!', error);
            }

            $.each(data.list, function (index, value) {
                // Util.console('length :: ' + data.list.length );
                // Util.console('index :: ' + index );

    			IDBUtil.lot.insert(value, onsuccess, onerror);
                fnLotListView.genLotItems(value);

    			if((index) == (data.list.length - 1)){
    			    // last index
    			    $("#wrapper #lotList").append( fnLotListView.getLotItemsEl() );
    			}
            });

            $.each(data.list, function (index, value) {
                new fnLotListView.imgLoadWithCanvasPreload(value);
                new fnLotListView.imgLoadWithCanvas(value);
            });

        },
        events: {
            "click .go_back" : "back",
            "click #go_top"  : "goScrollTop",
            "click #btn-more-lot"  : "showMoreLotList",
            "click #auctionInfoWrapper #ongoing" : "showDetailLotList",
            "click #btnRefresh" : "aucListRefresh"
        },
        back: function(event) {
            app.slider.back();
        },
        goScrollTop: function(event) {
            Util.windowTopScroll(1);
        },
        showMoreLotList: function(event) {
            //TODO: Step 1. Lot 정보 가져오기.
            RESTUtil.searchLotList({
                saleInfoIdx : _gAucData.auctionIdx,
                page : _gAucData.lotPage.next,
                forCastYN : "N"
            },this.render_append);
        },
        showDetailLotList: function(event) {
            if(Util.isNotEmpty([_gAucData.cast.saleLotNum])){
                //window.location.href = "#lotDetail/"+ _gAucData.cast.lotIdx;
                app.router.navigate("lotDetail/"+ _gAucData.cast.lotIdx, true);
            }
        },
        aucListRefresh: function(event) {
            //
            fnLotListView.initialize();
            //TODO: Step 1. Lot 정보 가져오기.
            RESTUtil.searchLotList({
                saleInfoIdx : _gAucData.auctionIdx,
                page : 1,
                forCastYN : "N"
            },this.render_after);
        }

    });

    return app.views.LotListView;

});
