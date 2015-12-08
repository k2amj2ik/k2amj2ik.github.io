require(['module-cfg','../cordova','gval'], function() {
require(['jquery','backbone','underscore','idbUtil','restUtil','countdown','lazyload','flipclock','Util'], function($,Backbone,_,IDBUtil,RESTUtil) {
require(['domReady','fastclick','pageslider','router'], function(DomReady,FastClick,PageSlider,AppRouter) {
//-------------------------------------------------------------------------------------------------

		//TODO: Ready
		DomReady(function() {
			console.log("[■] DomReady Status - OK");

			//$(function() {
			//	FastClick.attach(document.body);
			//});

			initialize();
		});

		//TODO: Application Constructor
		function initialize() {
			console.log("[■] Application Constructor Status - OK");
			bindEvents();
		};

		//TODO: Bind Event Listeners
		// Bind any events that are required on startup. Common events are:
		// 'load', 'deviceready', 'offline', and 'online'.
		function bindEvents() {
			console.log("[■] bindEvents Status - OK");
			document.addEventListener('deviceready', onDeviceReady, false);
		};

		//TODO: deviceready Event Handler
		// The scope of 'this' is the event. In order to call the 'receivedEvent'
		// function, we must explicitly call 'app.receivedEvent(...);'
		function onDeviceReady() {
            console.log("[■] DeviceReady Status -OK");

			//TODO: Step 0. Device Info Check
			receivedDeviceInfo();

			//TODO: Step 1. App Version 확인하기.
			var appVersionInfo = function(data){
				console.log( ">> app version ::: " + _gAppData.appVersion);
				console.log( ">> RESTUtil.appVersion ::: " + data.appVersion);
				console.log( ">> RESTUtil.redirectUri ::: " + data.redirectUri);

				if( (_gAppData.appVersion) == data.appVersion ){
					//TODO: Step 2. 사용자 동의 얻기.
					settingInfoChk("check",settingInfo);
				}else{
					updateChkView( data.redirectUri );
				}
			}
			RESTUtil.appVersionChk(appVersionInfo);

			//TODO: Step 2. 사용자 동의 얻기.
			var settingInfo = function(data){
				if((data == undefined) || (data == null)){
					// Term Agree Check
					termChkView();
				}else{
					console.info( ">> userTermYN :: " + data.userTermYN );
 					if(data.userTermYN == "agree"){
						//TODO: Step 3. App Start.
						appRun();
					}else{
						//TODO: Term Agree Check
						termChkView();
					}
				}
            }
		};

		function receivedDeviceInfo() {
			// var phoneModel = window.device.model;
			var strInfo = "";
            var phoneModel = device.model;
           	strInfo = device.name + "/" + device.model + "/" + device.cordova + "/" + device.platform + "/" + device.uuid + "/" + device.version

			// Setting Setting Data
			_gAppData.version = device.version;
			_gAppData.model = device.model;
			_gAppData.platform = device.platform;
			_gAppData.uuid = device.uuid;
			_gAppData.appVersion = AppVersion.version;

			 console.log("[■] Device Info :: " + strInfo );
			 console.log("[■] AppVersion.version :: " + AppVersion.version); // e.g. "1.2.3"
             console.log("[■] AppVersion.build :: " + AppVersion.build); // e.g. 1234
		};

		// ===================================================
		// Template Load And Start ~~~~
		// App Run
		// ===================================================
		function appRun() {
	        //StatusBar.overlaysWebView(true);
			
			//console.log("----- AppRun Start !! -----");
			app.router = new app.routers.AppRouter();
			app.utils.templates.load(["AuctionListView", "LotListView", "LotDetailView"],
				function () {
					app.router = new app.routers.AppRouter();
					Backbone.history.start();
				});
		}

		//------------------------------------
		// Utility
		//------------------------------------
		function settingInfoChk( strType, onsuccess, onerror ){
			if(strType == "check"){
				IDBUtil.setting.select(onsuccess, onerror);
			}else if(strType == "remove"){

			}else if(strType == "clear"){
				IDBUtil.setting.clear(onsuccess, onerror);
			}else{
				IDBUtil.setting.insert(_gAppData, onsuccess, onerror);
			}
		}

		//------------------------------------
		// Popup View
		//------------------------------------
		function updateChkView(rUrl){
			var ref = cordova.InAppBrowser.open('./templates/UpdateChk.html', '_blank', 'location=no,toolbar=no');
			ref.addEventListener('loadstart', function(event) {
                if (event.url.match("appUpdate")) {
                    cordova.InAppBrowser.open(rUrl, '_system', 'location=yes');
				};
			});
		};
		function termChkView(){
			var ref = cordova.InAppBrowser.open('./templates/TermsChk.html', '_blank','location=no,toolbar=no');
			ref.addEventListener('loadstart', function(event) {
				if (event.url.match("userAgree")) {
					ref.close();
					// terms agree condition save
					_gAppData.userTermYN = "agree";
					settingInfoChk("save",cbSuccessTermYN);
				};
				if (event.url.match("userDisagree")) {
					//settingInfoChk("clear");
				};
			});
//			ref.addEventListener('exit', function(event) {
//				if( _gAppData.userTermYN != "agree" ){
//					navigator.app.exitApp();
//				}
//			});
		};

		//------------------------------------
		// CallBack
		//------------------------------------
		var cbSuccessTermYN = function(data){
			//TODO: 사용자 동의 후 메인 시작~!
		  	appRun();
		}


//-------------------------------------------------------------------------------------------------
});
});
});