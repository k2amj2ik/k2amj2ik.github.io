define(function(require) {

    var Util = require('Util');

    app.routers.AppRouter = Backbone.Router.extend({
        routes: {
            "" :   "home",
            "home" :   "auctionList",
            "searchAll"       :  "searchAll",
            "searchMonth/:id"   :  "searchMonth",
            "searchVendor/:id"  :  "searchVendor",
            "lotList/:id"       :  "lotList",
            "lotDetail/:id"     :  "lotDetail"
        },

        initialize: function () {
            app.slider = new PageSlider($('body'));
        },

        home: function () {
            if (!app.auctionListView) {
                app.auctionListView = new app.views.AuctionListView();
                app.auctionListView.render();
            } else {
                app.auctionListView.delegateEvents();
            }
            app.slider.slidePage(app.auctionListView.$el);
        },

        auctionList: function () {
            app.auctionListView = new app.views.AuctionListView({reload: 1,vendor: "a"});
            app.auctionListView.render();
            //app.auctionListView.delegateEvents();
            Util.windowTopScroll();
            app.slider.slidePage(app.auctionListView.$el);
        },

        searchAll: function () {
            console.log(" ----------------->(router) searchAll ");
            app.auctionListView.initialize({reload: 1,vendor: "a"});
            app.auctionListView.delegateEvents();
            //app.auctionListView.reAttachEvents();
        },

        searchMonth: function (id) {
            console.log(" ----------------->(router) searchMonth: " + id);
            app.auctionListView.initialize({reload: 1,month: id});
            app.auctionListView.delegateEvents();
        },

        searchVendor: function (id) {
            console.log(" ----------------->(router) searchVendor: " + id);
            app.auctionListView.initialize({reload: 1,vendor: id});
            app.auctionListView.delegateEvents();
        },

        lotList: function (id) {
            console.log(" ----------------->(router) lotList: " + id);

            _gAucData.auctionIdx = id;
            app.lotListView = new app.views.LotListView({reload: 0,id: id});
            app.lotListView.render();
            Util.scrollTop(0);
            app.slider.slidePage(app.lotListView.$el);
        },

        lotDetail: function (id) {
            console.log(" ----------------->(router) lotDetail: " + id);

            _gAucData.lotIdx = id;
            app.lotDetailView = new app.views.LotDetailView({reload: 0,id: id});
            app.lotDetailView.render();

            Util.scrollTop(0);
            app.slider.slidePage(app.lotDetailView.$el);
        }
    });

    return app.routers.AppRouter;

});