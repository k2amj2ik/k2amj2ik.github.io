var _gAppData = {
    isScrollYN : "Y"
};
var _gAucData = {
    // For Auction
    auctionIdx : 0,
    auctionPage : 1,
    // For Lot
    lotIdx : 0,
    lotPage : {
        // 1.current, 2.total
    },
    // For Cast
    cast: {
        saleLotNum : "",
        auctionIdx : 0,
        lotIdx : 0,
        nLotIdx : 0,
        price : "",
        pCurrency : "",
        rTime : ""
    }
};
var _gData = {
    searchDirection : "C",
    month : {},
    vendorNo : "",
    vendor : ["CD01","CD02","CD03","CD04","CD05","CD06"],
    vendorNm : ["Christies","Sothebys","Bonhams","China Guardian","Phillips","Poly HK"]
};
var app = {
    views: {},
    models: {},
    routers: {},
    utils: {},
    adapters: {}
};

