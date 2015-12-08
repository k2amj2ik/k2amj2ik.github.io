define(function(require) {

    var IDBUtil = require('idbUtil');
    var RESTUtil = require('restUtil');
    var Util = require('Util');

    var fnAuctionListView = (function(){

        var _initPageLoad = 1;  // 페이지 재사용일때 Cast El을 선택
        var _pObj;

        var init = function() {
            _initPageLoad = 1;
            _pObj = "";
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

        // ==========================================================================
        var castLotItem = function(_data) {
            // TODO: 데이터가 들어올때만 적용한다(?)
            if( _data.length > 10 ){

                _pObj = eval("("+ _data +")");

                //fnAuctionListView.consoleLog(_pObj,"simple");

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

                    if( data == undefined ){
                        //TODO: 데이터가 없으므로 통신처리
                        RESTUtil.searchLotList({
                            idx : _pObj.pLotIdx,
                            page : 1,
                            forCastYN : "Y"
                        },fnAuctionListView.getCastLotItem);
                    }else{
                        //TODO: 데이터가 있으므로 EL만들기
                        if( _gAucData.cast.lotIdx != _pObj.pLotIdx){
                            Util.console("_onSuccess  1 :: " + _pObj.pLotIdx);
                            fnAuctionListView.genCastLotItemEl(data);
                        }else{
                            Util.console("_onSuccess  2 :: " + _pObj.pLotIdx);
                            if(_initPageLoad == 1){
                                // 페이지를 재 생성 하지 않았을때,
                                // 처음 페이지를 부른다면 새로 El 을 만들기.
                                _initPageLoad = 0;
                                fnAuctionListView.genCastLotItemEl(data);
                            }else{
                                fnAuctionListView.genReCastLotItemEl(data);
                            }
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

        var getCastLotItem = function(data) {
            // Util.console(">>>> getCastLotItem");
			var onsuccess = function(idx){
                Util.console('Data inserted! insertId is: ' + idx);
                _gAucData.cast.lotIdx = data.idx;
            }
            var onerror = function(error){
                Util.console('Oh noes, sth went wrong!', error);
            }
            $.each(data.list, function (index, value) {
                Util.console('length :: ' + data.list.length );
                // Util.console('index :: ' + index );
    			IDBUtil.lot.insert(value, onsuccess, onerror);
                genCastLotItemEl(value);
            });
        };

        //TODO:
        var genReCastLotItemEl = function(data) {
            // Util.console(">>>> genReCastLotItemEl :: " + data);
            var castLotElHtml = [];
            var _obj = _pObj;
            var pAuctionEl = "#auc_idx_" + data.saleInfoIdx + " #aucInfo .c_bot";
            _gAucData.cast.pCurrency = _obj.pCurrency;
            _gAucData.cast.price = Util.numberWithCommas(_obj.pPrice);

            // ON-AIR 일때만~~~~
            if(_obj.pCastStatusValue == "ON-AIR"){
                if(_obj.pType == "SOLD"){
                // pType :: SOLD 상태
                    castLotElHtml.push( "   <div class='soldfor'>Sold for</div>");
                    castLotElHtml.push( "   <div id='currentPrice' class='price'>");
                    castLotElHtml.push( "       <p class='status'>Hammer</p>");
                    castLotElHtml.push( "       <p class='currency'><span class='locale'>"+ ((_obj.pCurrency).split(" "))[1] +"</span> "+ Util.numberWithCommas(_obj.pPrice) +"</p>");
                    castLotElHtml.push( "   </div>");
                }else if(_obj.pType == "BID"){
                // pType :: BID 상태
                    castLotElHtml.push( "   <div class='time'>");
                    castLotElHtml.push( "       <div id='castLotTime'  class='flip-clock-wrapper'></div>");
                    castLotElHtml.push( "   </div>");
                    castLotElHtml.push( "   <div id='currentPrice' class='price'>");
                    castLotElHtml.push( "       <p class='status'>Current</p>");
                    castLotElHtml.push( "       <p class='currency'><span class='locale'>"+ ((_obj.pCurrency).split(" "))[1] +"</span> "+ Util.numberWithCommas(_obj.pPrice) +"</p>");
                    castLotElHtml.push( "   </div>");
                }else if(_obj.pType == "PASSED"){
                // pType :: PASSED 상태
                    castLotElHtml.push( "   <div class='passed'>Passed</div>");
                }else if(_obj.pType == "WITHDRAWN"){
                // pType :: WITHDRAWN 상태
                    castLotElHtml.push( "   <div class='withdrawn'>Withdrawn</div>");
                }else{

                }
            }

            $(pAuctionEl).empty();
            $(pAuctionEl).append( castLotElHtml.join("") );

            //TODO: Countdown
            if(_obj.pCastStatusValue == "ON-AIR"){
                if(_obj.pType == "BID"){
                    //TODO: Countdown
                    var clock = $("#auc_idx_" + data.saleInfoIdx + " #aucInfo #castLotTime").FlipClock({
                        clockFace: 'MinuteCounter'
                    });
                }
            }

            //TODO: Blink~ Blink
            // var className = $("#auc_idx_" + data.saleInfoIdx).attr("class") + "-active";
            // Util.console( ">> className :: " + className );
        };

        //TODO:
        var genCastLotItemEl = function(data) {
            // Util.console(">>>> genCastLotItemEl");

            //TODO:
            _gAucData.cast.auctionIdx = data.saleInfoIdx;
            _gAucData.cast.lotIdx = data.idx;

            //
            var _obj = _pObj;
            _gAucData.cast.pCurrency = _obj.pCurrency;
            _gAucData.cast.price = Util.numberWithCommas(_obj.pPrice);

            //
            var pAuctionEl = "#auc_idx_" + data.saleInfoIdx + " #aucInfo";
            $(pAuctionEl).addClass("detail");
            $(pAuctionEl).empty();

            var _imgUrl = "";
            if(Util.isNotEmpty([data.loc_imageUrl,data.loc_imageFile])){
                _imgUrl = (data.loc_imageUrl).replace("/org/","/L160/") + data.loc_imageFile;
            }else{
                Util.console( "no local Images" );
                //_imgUrl = data.imageUrl;
                _imgUrl = "img/noimage.png";
            }

            // gen Elements
            var castLotElHtml = [];
            castLotElHtml.push( "<span class='line' style='width:0'></span>");
            castLotElHtml.push( "<p class='lot_no'> Lot. "+ data.saleLotNum +"</p>");
            castLotElHtml.push( "<div class='c_wrap'>");
            castLotElHtml.push( "   <div class='thumb img_align'><img src='img/loading.png' class='lazyResult' data-original='"+_imgUrl+"' /></div>");
            castLotElHtml.push( "   <div class='cont'>");
            castLotElHtml.push( "       <p class='artist'>"+ data.artistName +"</p>");
            castLotElHtml.push( "       <p class='title'>"+ data.workTitle +"</p>");

            //TODO: estimate 값이 없을때 문구 처리
            if(Util.isNotEmpty([data.estimateLowCurValue,data.estimateLow]) * Util.isNotEmpty([data.estimateHighCurValue,data.estimateHigh]) ){
                castLotElHtml.push( "               <p class='price'> "+ data.estimateLowCurValue + data.estimateLow +" - "+ data.estimateHighCurValue + data.estimateHigh +"</p>" );
            }else{
                castLotElHtml.push( "               <p class='price'> Estimate Upon Request. </p>" );
            }

            castLotElHtml.push( "   </div>");
            castLotElHtml.push( "</div>");

            // ON-AIR 일때만~~~~
            if(_obj.pCastStatusValue == "ON-AIR"){
                if(_obj.pType == "SOLD"){
                // pType :: SOLD 상태
                    castLotElHtml.push( "<div class='c_bot'>");
                    castLotElHtml.push( "   <div class='soldfor'>Sold for</div>");
                    castLotElHtml.push( "   <div id='currentPrice' class='price'>");
                    castLotElHtml.push( "       <p class='status'>Hammer</p>");
                    castLotElHtml.push( "       <p class='currency'><span class='locale'>"+ ((_obj.pCurrency).split(" "))[1] +"</span> "+ Util.numberWithCommas(_obj.pPrice) +"</p>");
                    castLotElHtml.push( "   </div>");
                    castLotElHtml.push( "</div>");
                }else if(_obj.pType == "BID"){
                // pType :: BID 상태
                    castLotElHtml.push( "<div class='c_bot'>");
                    castLotElHtml.push( "   <div class='time'>");
                    castLotElHtml.push( "       <div id='castLotTime' class='flip-clock-wrapper'></div>");
                    castLotElHtml.push( "   </div>");
                    castLotElHtml.push( "   <div id='currentPrice' class='price'>");
                    castLotElHtml.push( "       <p class='status'>Current</p>");
                    castLotElHtml.push( "       <p class='currency'><span class='locale'>"+ ((_obj.pCurrency).split(" "))[1] +"</span> "+ Util.numberWithCommas(_obj.pPrice) +"</p>");
                    castLotElHtml.push( "   </div>");
                    castLotElHtml.push( "</div>");
                }else if(_obj.pType == "PASSED"){
                // pType :: PASSED 상태
                    castLotElHtml.push( "<div class='c_bot'>");
                    castLotElHtml.push( "   <div class='passed'>Passed</div>");
                    castLotElHtml.push( "</div>");
                }else if(_obj.pType == "WITHDRAWN"){
                // pType :: WITHDRAWN 상태
                    castLotElHtml.push( "<div class='c_bot'>");
                    castLotElHtml.push( "   <div class='withdrawn'>Withdrawn</div>");
                    castLotElHtml.push( "</div>");
                }else{

                }
            }

            $(pAuctionEl).html( castLotElHtml.join("") );
            castLotElHtml = [];

            //TODO: img load
            $(pAuctionEl + " img.lazyResult").lazyload({
                threshold : 200,
                effect : "fadeIn"
            });

            if(_obj.pCastStatusValue == "ON-AIR"){
                if(_obj.pType == "BID"){
                    //TODO: Countdown
                    var clock = $(pAuctionEl+" #castLotTime").FlipClock({
                        clockFace: 'MinuteCounter'
                    });
                }
            }

            //TODO: Blink~ Blink
            //  var className = $("#auc_idx_" + data.saleInfoIdx).attr("class") + "-active";
            //  $("#auc_idx_" + data.saleInfoIdx).toggleClass(className);


        };
        // ===================================================================================

        var setTimerAndCalendar = function(_data) {

            //TODO: Step1. countdown event append
            $("#day_scroller ul span[class='icos']").html("");
            $("#day_scroller ul span[class='dayname']").html("");

            _.each(_data,function(vo,i) {
                if((vo.aucDateFrom != "") && (vo.aucDateFrom != null)){
                    if((vo.castStatus != "CAST_2") || (vo.castStatus != "CAST_3")){
                        var sDate = moment().format('YYYY-MM-DD HH:MM:SS');
                        var eDate = moment(vo.aucDateFrom).format('YYYY-MM-DD HH:MM:SS');
                        var tzName = "Europe/London";   // default zone
                        if( Util.isNotEmpty([vo.locTimeZone])){
                            tzName = vo.locTimeZone;
                        }
                        var remTime = moment.tz(eDate, tzName);
                        var t = moment(sDate).twix(remTime);

                        var rtTitleEL = "#remainCountDownTitle_"+ vo.idx;
                        var rtEL = "#remainCountDown_"+ vo.idx;

                        if( Util.isEmpty([vo.locTimeZone]) ){
                            $(rtTitleEL).html( "TimeZone Missing." );
                        }else if( parseInt(t.count('minutes')) < 0 ){
                            $(rtTitleEL).html( "" );
                        }else if(( parseInt(t.count('minutes')) < (60*48) ) && ( parseInt(t.count('minutes')) > 0 )){
                            $(rtEL).countdown(remTime.toDate(), function(event) {
                                $(this).html(event.strftime('<span>%H</span>h <span>%M</span>m <span>%S</span>s'));
                            });
                        }else{
                            $(rtEL).html( "<span>"+ t.count('days') +"</span> days" );
                        }
                    }

                    //TODO:  Calendar append vendor data
                    var mpDayEl = "#d" + moment(vo.aucDateFrom).format('DD');
                    var weekDay = moment(vo.aucDateFrom).format('ddd');
                    var _vendorClass = "";

                    switch (vo.vendorCd) {
                      case 'CD01' :  _vendorClass = "c1"; break; // VendorCd CD01 Christies
                      case 'CD02' :  _vendorClass = "c2"; break; // VendorCd CD02 Sothebys
                      case 'CD03' :  _vendorClass = "c3"; break; // VendorCd CD03 Bonhams
                      case 'CD04' :  _vendorClass = "c6"; break; // VendorCd CD04 China Guardian
                      case 'CD05' :  _vendorClass = "c4"; break; // VendorCd CD05 Phillips
                      case 'CD06' :  _vendorClass = "c5"; break; // VendorCd CD06 Poly HK
                      case 'CD07' :  _vendorClass = "c5"; break; // VendorCd CD06 Poly HK
                      default   :  _vendorClass = "c6"; break;
                    }

                    var _strEl = "<span class='"+_vendorClass+"'></span>";
                    $(mpDayEl+ " .icos").append(_strEl);
                    $(mpDayEl+ " .dayname").html(weekDay);
                }
            });

        };

        var genFrmTbList = function(_pEL,_data) {

            var _cHtmlEL = "";
            //TODO: Step1. Elements append
            _.each(_data,function(vo,i) {
                _cHtmlEL += genAuctionItems(vo);
            });

            $(_pEL).empty();
            $(_pEL).append( _cHtmlEL );

            //TODO: Step1-2. Auction Data insert
			var onsuccess = function(idx){
                // Util.console('Data inserted! insertId is: ' + idx);
            }
            var onerror = function(error){
                Util.console('Oh noes, sth went wrong!', error);
            }
            $.each(_data, function (index, value) {
    			IDBUtil.auction.insert(value, onsuccess, onerror);
            });

            //TODO: Step2. countdown event append
            $("#day_scroller ul span[class='icos']").html("");
            $("#day_scroller ul span[class='dayname']").html("");

            _.each(_data,function(vo,i) {
                if((vo.aucDateFrom != "") && (vo.aucDateFrom != null)){
                    if((vo.castStatus != "CAST_2") || (vo.castStatus != "CAST_3")){
                        var sDate = moment().format('YYYY-MM-DD HH:MM:SS');
                        var eDate = moment(vo.aucDateFrom).format('YYYY-MM-DD HH:MM:SS');
                        var tzName = "Europe/London";   // default zone
                        if( Util.isNotEmpty([vo.locTimeZone])){
                            tzName = vo.locTimeZone;
                        }
                        var remTime = moment.tz(eDate, tzName);
                        var t = moment(sDate).twix(remTime);

                        var rtTitleEL = "#remainCountDownTitle_"+ vo.idx;
                        var rtEL = "#remainCountDown_"+ vo.idx;

                        if( Util.isEmpty([vo.locTimeZone]) ){
                            $(rtTitleEL).html( "TimeZone Missing." );
                        }else if( parseInt(t.count('minutes')) < 0 ){
                            $(rtTitleEL).html( "" );
                        }else if(( parseInt(t.count('minutes')) < (60*24) ) && ( parseInt(t.count('minutes')) > 0 )){
                            $(rtEL).countdown(remTime.toDate(), function(event) {
                                $(this).html(event.strftime('<span>%H</span>h <span>%M</span>m <span>%S</span>s'));
                            });
                        }else{
                            $(rtEL).html( "<span>"+ t.count('days') +"</span> days" );
                        }
                    }

                    //TODO:  Calendar append vendor data
                    var mpDayEl = "#d" + moment(vo.aucDateFrom).format('DD');
                    var weekDay = moment(vo.aucDateFrom).format('ddd');
                    var _vendorClass = "";

                    switch (vo.vendorCd) {
                      case 'CD01' :  _vendorClass = "c1"; break; // VendorCd CD01 Christies
                      case 'CD02' :  _vendorClass = "c2"; break; // VendorCd CD02 Sothebys
                      case 'CD03' :  _vendorClass = "c3"; break; // VendorCd CD03 Bonhams
                      case 'CD04' :  _vendorClass = "c6"; break; // VendorCd CD04 China Guardian
                      case 'CD05' :  _vendorClass = "c4"; break; // VendorCd CD05 Phillips
                      case 'CD06' :  _vendorClass = "c5"; break; // VendorCd CD06 Poly HK
                      case 'CD07' :  _vendorClass = "c5"; break; // VendorCd CD06 Poly HK
                      default   :  _vendorClass = "c6"; break;
                    }

                    var _strEl = "<span class='"+_vendorClass+"'></span>";
                    $(mpDayEl+ " .icos").append(_strEl);
                    $(mpDayEl+ " .dayname").html(weekDay);
                }
            });

            //TODO:  Step3. scroll event bind
            // Cache selectors
            var lastId;
            var dayMenu = $("#day_scroller");
            var dayMenuHeight = dayMenu.outerHeight()+160;

            //TODO: All list items
            var menuItems = dayMenu.find("a");

            //Util.console( ">>" + menuItems.filter("[class=dayname]").html() );

            //TODO: Anchors corresponding to menu items
            var scrollItems = menuItems.map(function(){
                  var item = $($(this).attr("href"));
                  if (item.length) { return item; }
            });

            //TODO: Bind click handler to menu items
            menuItems.on("click",function(e){
                var href = $(this).attr("href");

                // Util.console("> href : " + href);

                if( $(href).offset() != undefined){
                    var offsetTop = href === "#" ? 0 : $(href).offset().top-dayMenuHeight+1;
                    $('html, body').stop().animate({
                      scrollTop: offsetTop
                    }, 300);
                }
            });

            //TODO: Bind to scroll
            $(window).scroll(function(){
                //TODO: Get container scroll position
                var fromTop = $(this).scrollTop()+dayMenuHeight;

                //TODO: Get id of current scroll item
                var cur = scrollItems.map(function(){
                 if ($(this).offset().top < fromTop)
                   return this;
                });
                //TODO: Get the id of the current element
                cur = cur[cur.length-1];
                var id = cur && cur.length ? cur[0].id : "";

                // Util.console( ">> 1 id :: " + id );

                if (lastId !== id) {
                    lastId = id;

                    // Util.console( ">> 2 id :: " + lastId );
                    if( _gAppData.isScrollYN == "Y" ){
                        //TODO: Set/remove active class
                        menuItems
                            .removeAttr("class")
                            .filter("[href=#"+id+"]").addClass('on');
                    }

                    if((id != null) || (id != undefined)) {
                        var tt = parseInt(id.substr(4,2));

                        //Util.console( tt +" / "+ ((parseInt(tt-3)*60)-35) );
                        //Util.console($(dayMenu).width());

                        if(( tt > 3 ) && ( tt < 28 ) ){
                            $(dayMenu).animate( { scrollLeft: ((parseInt(tt-3)*60)-35)  }, 50 );
                        }else{
                            if( tt <= 3 ){
                                $(dayMenu).animate( { scrollLeft: 0  }, 50 );
                            }else if( tt >= 28 ){
                                $(dayMenu).animate( { scrollLeft: ((parseInt(31-3)*60)-35)  }, 50 );
                            }
                        }
                    }
                }
            });
        };

        var genAuctionItems = function(vo){
            var vendorClass = "";
            var vendorInit = "";
            var auctionStatusClass = "";
            var sbHTML = [];

            switch (vo.vendorCd) {
              case 'CD01' :  vendorInit="C"; vendorClass = "c1"; break; // VendorCd CD01 Christies
              case 'CD02' :  vendorInit="S"; vendorClass = "c2"; break; // VendorCd CD02 Sothebys
              case 'CD03' :  vendorInit="B"; vendorClass = "c3"; break; // VendorCd CD03 Bonhams
              case 'CD04' :  vendorInit="C"; vendorClass = "c6"; break; // VendorCd CD04 China Guardian
              case 'CD05' :  vendorInit="P"; vendorClass = "c4"; break; // VendorCd CD05 Phillips
              case 'CD06' :  vendorInit="P"; vendorClass = "c5"; break; // VendorCd CD06 Poly HK
              case 'CD07' :  vendorInit="P"; vendorClass = "c5"; break; // VendorCd CD07 Poly HK
              default   :  vendor="P"; vendorClass = "c6"; break;
            }

            // b: current | p: past
            if(vo.castStatus == 'CAST_2'){
                auctionStatusClass = "ico b";
            }else if(vo.castStatus == 'CAST_3'){
                auctionStatusClass = "ico p";
            }else{
                auctionStatusClass = "ico";
            }

            sbHTML.push("<li id='auc_idx_"+ vo.idx +"' class='"+ vendorClass +"'>");

            if((vo.aucDateFrom != "") && (vo.aucDateFrom != null)){
                var _day = moment(vo.aucDateFrom).format('DD');
                sbHTML.push( "<a id='day_"+ _day +"' href='#lotList/"+ vo.idx +"' class='top a'>" );
            }else{
                sbHTML.push( "<a  href='#lotList/"+ vo.idx +"' class='top a'>" );
            }

            sbHTML.push( "   <span class='"+ auctionStatusClass +"'>"+vendorInit+"</span>" );
            sbHTML.push( "   <div class='cont'>" );
            if( (vo.aucDateFrom != "") && (vo.aucDateFrom != null) ){
                sbHTML.push( "       <p class='vendor'>"+ vo.vendorName +" &middot; "+ vo.locCity +" </p>" );
            }else{
                sbHTML.push( "       <p class='vendor'>"+ vo.vendorName +"&middot; &nbsp;&nbsp; No schedule </p>" );
            }
            sbHTML.push( "       <p class='title'>"+ vo.aucName +"</p>" );
            sbHTML.push( "       <p class='where'>"+ moment(vo.aucDateFrom).format('MMM Do YYYY, h:mm a')+"</p>" );
            sbHTML.push( "   </div>" );
            sbHTML.push( "</a>" );

            if(vo.castStatus == 'CAST_2'){
            //TODO: ON-AIR ( 경매가 진행중 - 처음화면 )
                sbHTML.push( "<div id='aucInfo'></div>" );
            }else if(vo.castStatus == 'CAST_3'){
            //TODO: OFF-AIR ( 경매가 끝났을때 )
                sbHTML.push( "<div id='aucInfo' class='past price'>" );
                sbHTML.push( "    <p class='tit'>SALE TOTAL(Hammer)</p>" );
                //if( (vo.priceSoldCurValue != "") && (vo.priceSoldCurValue != null) && (vo.priceSold != "") && (vo.priceSold != null) ){
                if(Util.isNotEmpty([vo.priceSoldCurValue,vo.priceSold])){
                    sbHTML.push( "    <p class='currency'><span class='locale'>"+ vo.priceSoldCurValue + "</span> " + Util.numberWithCommas(vo.priceSold) +"</p>" );
                    //TODO: 환율 변환 기능 추가..
                    // sbHTML.push( "    <p class='usd'>"+ "&dollar;15,500,000" +"</p>" );
                }else{
                    sbHTML.push( "    <p class='currency'>"+ " Preparing... " +"</p>" );
                }
                sbHTML.push( "</div>" );
            }else{
            //TODO: ( 경매 준비중.. )
                sbHTML.push( "<div id='aucInfo' class='remaining'>" );
                if( (vo.aucDateFrom != "") && (vo.aucDateFrom != null) && ((vo.castStatus != "CAST_2") || (vo.castStatus != "CAST_3")) ){
                //TODO: 경매 시작 시간이 있을경우
                    sbHTML.push( "    <p id='remainCountDownTitle_"+ vo.idx +"' class='tit'>Starts in</p>" );
                    sbHTML.push( "    <p id='remainCountDown_"+ vo.idx +"' class='times'></p>" );
                }else{
                    sbHTML.push( "    <p class='times'><span> TBD </span></p>" );
                }
                sbHTML.push( "</div>" );

                if(((vo.aucDateFrom != "") && (vo.aucDateFrom != null)) && ((vo.viewTime != "") && (vo.viewTime != null))){
                    sbHTML.push( "<button type='button' class='view_saleinfo' onclick=\"$(this).next().toggle();$(this).toggleClass(\'on\');\">Sale Info</button>" );
                    sbHTML.push( "<div class='sale_info'>" );
                    sbHTML.push( "    <p class='tit'>Auction Times</p>" );
                    sbHTML.push( "    <div class='texts'>" );
                    sbHTML.push( "        <p>"+ moment(vo.aucDateFrom).format('MMMM Do YYYY, h:mm a') +"</p>" );
                    sbHTML.push( "        <p> Lots. "+ vo.lotNumFrom +" - "+ vo.lotNumTo +"</p>" );
                    sbHTML.push( "    </div>" );
                    sbHTML.push( "    <p class='tit'>Viewing Times</p>" );
                    sbHTML.push( "    <p class='where'>"+ vo.locCity +","+ vo.locCityDetail +"</p>" );
                    sbHTML.push( "    <div class='texts'>" );
                    sbHTML.push( "        <pre>" + vo.viewTime + "</pre>" );
                    sbHTML.push( "    </div>" );
                    sbHTML.push( "</div>" );
                }
            }

            sbHTML.push( "</li>" );

            return sbHTML.join("");
        };

        return {
            init : init,
            consoleLog : consoleLog,
            castLotItem : castLotItem,
            getCastLotItem : getCastLotItem,
            genCastLotItemEl : genCastLotItemEl,
            genReCastLotItemEl : genReCastLotItemEl,
            genFrmTbList : genFrmTbList,
            genAuctionItems : genAuctionItems,
            setTimerAndCalendar : setTimerAndCalendar
        }
    })();

    var _param;
    app.views.AuctionListView = Backbone.View.extend({

        initialize: function (options) {

            fnAuctionListView.init();
            $("#day_scroller").stop().animate( { scrollLeft: 0 }, 100 );

            // refresh btn rotate
            $("#btnRefresh img").addClass("do_rotateImage").delay(2500).queue(function() {
                $(this).removeClass("do_rotateImage");
                $(this).dequeue();
            });

            // param setting
            _param = [];

            if(options != undefined){
                _param = options;
            }

            if((_param.reload == null) || (_param.reload == undefined) || (_param.reload == "")){
                _param.reload = "0";
                //console.log("- _param.reload : empty !!-");
            }

            // 벤더 체크
            if(Util.isEmpty([_param.vendor])){   //init
                _param.vendorCd = "";
                _gData.vendorNo = "";
            }else if(_param.vendor == "a"){   // search All
                _param.vendorCd = "";
                _gData.vendorNo = "";
            }else{
                _param.vendorCd = _gData.vendor[parseInt(_param.vendor)];
                _gData.vendorNo = _param.vendor;
            }

            if(Util.isEmpty([_param.month])){
                if(Util.isEmpty([_gData.curYear])){
                    _gData.curYear = moment().format('YYYY');
                }
                if(Util.isEmpty([_gData.month.cur])){
                    _param.month = (parseInt(moment().get('month')) + 1);

                    _gData.month.cur = Util.getMonthYear("C",_gData.curYear,_param.month);
                    _gData.month.curName = Util.getMonthName(_param.month);
                    _gData.month.prev = Util.getMonthYear("P",_gData.curYear,_param.month);
                    _gData.month.next = Util.getMonthYear("N",_gData.curYear,_param.month);

                    // console.log("- _param.month : empty !!-");
                }
            }else{
                if(Util.isEmpty([_gData.curYear])){
                    _gData.curYear = moment().format('YYYY');
                }else{
                    _gData.curYear = _param.month.split("-")[0]
                }

                _param.month = _param.month.split("-")[1];

                _gData.month.cur = Util.getMonthYear("C",_gData.curYear,_param.month);
                _gData.month.curName = Util.getMonthName(_param.month);
                _gData.month.prev = Util.getMonthYear("P",_gData.curYear,_param.month);
                _gData.month.next = Util.getMonthYear("N",_gData.curYear,_param.month);

                // console.log("-_param.month : not empty !!-");
            }

            _param.month_ff = _gData.month.cur + "-01";
            _param.month_ft = _gData.month.cur + "-31";

            //---------------------------------------------------
            Util.console.line();
            Util.console( _gData.searchDirection );
            Util.console( "_param.vendor" , _param.vendor );
            Util.console( "_param.vendorCd" , _param.vendorCd );
            Util.console( "data" , _gData.curYear +"/"+ _gData.month.cur );
            Util.console( "_param.month" , _param.month );
            Util.console( "_param.reload" , _param.reload );
            Util.console.line();
            Util.console( "month_ff" , _param.month_ff );
            Util.console( "month_ft" , _param.month_ft );
            Util.console( "vendorCd" , _param.vendorCd );
            Util.console.line();
            Util.console( "cur " , _gData.month.cur );
            Util.console( "curName " , _gData.month.curName );
            Util.console( "prev " , _gData.month.prev );
            Util.console( "next " , _gData.month.next );
            //---------------------------------------------------

            _.bindAll(this, 'render');
            // create a collection
            this.collection = new app.models.AuctionListCollection({param:{
                apiUrl : "",
                idx : "",
                castStatus : "",
                vendorCd : _param.vendorCd,
                vendorName : "",
                dateFrom_ff : _param.month_ff,
                dateFrom_ft : _param.month_ft
            }});

            // Fetch the collection and call render() method
            var _this = this;
            this.collection.fetch({
                success: function () {
                    _this.subRender();
                },
                error: function () {

                }
            });
        },
        render: function () {
            // Util.console('Inside render');
            this.$el.html(this.template());
            return this;
        },
        subRender: function() {

            Util.loading.show('1'," Main View Loading... ");

            // Util.console('subRender');
            // refresh btn rotate
            $("#btnRefresh img").addClass("do_rotateImage").delay(2000).queue(function() {
               $(this).removeClass("do_rotateImage");
               $(this).dequeue();
            });

            // 날짜 바꾸기.
            var strDateHtml = _gData.month.curName + " . " + _gData.month.cur.split("-")[0];
            $(".top_fix .month_name .mon-text").html(strDateHtml);

            // Data Fetch
            if( (this.collection.size()) > 0 ){
                Util.loading.hide();
                // Scroll 설정
                _gAppData.isScrollYN = "Y";
                $('body').removeClass("noresult");

                //TODO:
                fnAuctionListView.genFrmTbList("#wrapper .auction_list", this.collection.toJSON());

                // 페이지 신규로 만들때만 소켓처리(?)
                if((_param.reload != 1) || (_param.reload == undefined) || (_param.reload == null)){
                    // start Cast Info
                    if(_gAucData.cast.auctionListViewCast == undefined){
                        _gAucData.cast.auctionListViewCast = "castOnFirst";
                    }

                    if(_gAucData.cast.auctionListViewCast == "castOnFirst"){
                        // start Cast Info
                        RESTUtil.liveCastInfo(fnAuctionListView.castLotItem);
                        _gAucData.cast.auctionListViewCast = "castOn";
                    }
                }
            }else{
                Util.loading.hide();
                // Scroll 설정
                _gAppData.isScrollYN = "N";

                //TODO: DATA가 없을경우 화면에 결과없음 보이기.
                var aEls = $("a");
                $("#day_scroller ul").find(aEls).removeAttr("class");

                $("#day_scroller ul span[class='icos']").html("");
                $("#day_scroller ul span[class='dayname']").html("");
                $("#wrapper .auction_list").empty();

                $('body').addClass("noresult");
            }

            Util.windowTopScroll();
        },

        events: {
            "click #vdAll": "goVendorAll",
            "click #vd0": "goVendor0",
            "click #vd1": "goVendor1",
            "click #vd2": "goVendor2",
            "click #vd3": "goVendor3",
            "click #vd4": "goVendor4",
            "click #vd5": "goVendor5",
            "click #vd6": "goVendor6",
            "click #mon-prev": "monthPrev",
            "click #mon-next": "monthNext",
            "click #go_top": "goScrollTop",
            "click #btnRefresh" : "aucListRefresh"
        },

        goVendorAll: function(event) {
            //window.location.href = "#searchAll";
            $("#vendor_scroller li button").removeClass("on");
            $("#vdAll").addClass("on");
            app.router.navigate("searchAll", true);
        },
        goVendor0: function(event) {
            $("#vendor_scroller li button").removeClass("on");
            $("#vd0").addClass("on");
            app.router.navigate("searchVendor/0", true);
        },
        goVendor1: function(event) {
            //window.location.href = "#searchVendor/1";
            $("#vendor_scroller li button").removeClass("on");
            $("#vd1").addClass("on");
            app.router.navigate("searchVendor/1", true);
        },
        goVendor2: function(event) {
            //window.location.href = "#searchVendor/2";
            $("#vendor_scroller li button").removeClass("on");
            $("#vd2").addClass("on");
            app.router.navigate("searchVendor/2", true);
        },
        goVendor3: function(event) {
            //window.location.href = "#searchVendor/3";
            $("#vendor_scroller li button").removeClass("on");
            $("#vd3").addClass("on");
            app.router.navigate("searchVendor/3", true);
        },
        goVendor4: function(event) {
            //window.location.href = "#searchVendor/4";
            $("#vendor_scroller li button").removeClass("on");
            $("#vd4").addClass("on");
            app.router.navigate("searchVendor/4", true);
        },
        goVendor5: function(event) {
            //window.location.href = "#searchVendor/5";
            $("#vendor_scroller li button").removeClass("on");
            $("#vd5").addClass("on");
            app.router.navigate("searchVendor/5", true);
        },
        goVendor6: function(event) {
            //window.location.href = "#searchVendor/6";
            $("#vendor_scroller li button").removeClass("on");
            $("#vd6").addClass("on");
            _gData.searchDirection = "V";
            app.router.navigate("searchVendor/6", true);
        },
        monthPrev: function(event) {
            //window.location.href = "#searchMonth/"+ _gData.month.prev;
            app.router.navigate("searchMonth/"+ _gData.month.prev, true);
        },
        monthNext: function(event) {
            //window.location.href = "#searchMonth/"+ _gData.month.next;
            app.router.navigate("searchMonth/"+ _gData.month.next, true);
        },
        goScrollTop: function(event) {
            Util.windowTopScroll(1);
        },
        aucListRefresh: function(event) {
            this.initialize({reload: 1});
        },

        reAttachEvents: function(event) {
            Util.console("-----------------");
            Util.console("- reAttachEvent -");
            Util.console("-----------------");

            // 페이지 신규로 만들때만 소켓처리(?) - 소켓 재사용 가능해 보임.
            // start Cast Info
            // RESTUtil.liveCastInfo(fnAuctionListView.castLotItem);

            // Step 1. idxDB에서 데이터를 불러온다.
            // Step 2. 데이터를 json으로 변경한다.
            // Step 3. 데이터를 이용하여 Timer & Calendar 값을 변경,이벤트를 다시 붙인다.
            // fnAuctionListView.setTimerAndCalendar
        }
    });

    return app.views.AuctionListView;

});