//requireJS 기본 설정 부분
requirejs.config({
	baseUrl : 'module',

	paths : {
		jquery: '../lib/jquery/jquery.min',
		countdown: '../lib/jquery/jquery.countdown.min',
		lazyload: '../lib/jquery/jquery.lazyload.min',
		flipclock: '../lib/jquery/flipclock',
		underscore: '../lib/underscore/underscore',
		backbone: '../lib/backbone/backbone',
		idbstore: '../lib/idbstore/idbstore',
		lokijs: '../lib/idbstore/lokijs.min',
		domReady : '../lib/require/domReady',
		text: '../lib/require/text',
		async: '../lib/require/async',
		pageslider: '../lib/pageslider/pageslider',
		fastclick: '../lib/fastclick/fastclick',
		AuctionListView:'views/AuctionListView',
		LotDetailView:'views/LotDetailView',
		LotListView:'views/LotListView',
		AuctionModel:'models/AuctionModel',
		LotModel:'models/LotModel',
		template: '../templates',
		templates:'utils/templates',
		idbUtil: 'utils/idbUtil',
		restUtil: 'utils/restUtil',
		Util: 'utils/comUtil',
		router: 'routers/AppRouter'
	},

	shim : {
		'jquery' : {
			exports : '$'
		},
		'countdown': {
        	deps: ['jquery'],
        	exports: '$.fn.countdown'
    	},
		'lazyload': {
        	deps: ['jquery'],
        	exports: '$.fn.lazyload'
    	},
		'flipclock': {
        	deps: ['jquery'],
        	exports: '$.fn.FlipClock'
    	},
		'underscore' : {
			exports : '_',
			deps : ['jquery']
		},
		'idbstore': {
		  exports: 'IDBStore'
		},
		'backbone': {
		  exports: 'Backbone'
		},
		'pageslider' : {
			exports : 'PageSlider'
		},
		'router' : {
			deps : ['AuctionModel','LotModel','templates','AuctionListView','LotListView','LotDetailView']
		}
	}
});