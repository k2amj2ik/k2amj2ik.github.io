//app.models.Auction = Backbone.Model.extend();
app.models.Auction = Backbone.Model.extend({
    // id
    idAttribute: "idx",

    defaults: {
        "idx": 216,
        "saleNumber": "22471",
        "vendorIdx": 3,
        "vendorName": "Bonhams",
        "vendorCd": "CD03",
        "vendorUri": null,
        "aucName": "Made in CaliforniaContemporary Art",
        "aucURL": "http://www.bonhams.com/api/v1/lots/22471/?category=list&length=10&minimal=false&page=1",
        "aucImgURL": null,
        "aucDateFrom": null,
        "aucDateFrom_ff": null,
        "aucDateFrom_ft": null,
        "aucDateTo": "2015-10-08 12:45:30",
        "aucTimeFrom": null,
        "aucTimeTo": null,
        "lotNumFrom": "10000",
        "lotNumTo": "9",
        "locCity": "Los Angeles",
        "locCityDetail": "Los Angeles",
        "viewTime": null,
        "reg_time": "2015-10-08 12:45:30",
        "castDateFrom": null,
        "castDateTo": null,
        "castStartYN": null,
        "castEndYN": null,
        "castStatus": null,
        "codeName": null,
        "codeIdx": null,
        "customCode": null,
        "lotCnt": 88,
        "enabled": 1
    },

    initialize: function() {

    },

    parse: function(data){
        return data;
    }
});

// AuctionListCollection
app.models.AuctionListCollection = Backbone.Collection.extend({

    model: app.models.Auction,

    url : function() {
        //console.log('Collection.url() called');
        if((this.host == "") || (this.host == undefined)){
            this.host = _gAppData.hostUri;
        }

        if((this.apiUrl == "") || (this.apiUrl == undefined)){
            this.apiUrl = "/api/m/searchAuctionWithPriceChk";
        }

        var option1 = "";
        var option2 = "";
        var option3 = "";
        var option4 = "";
        var option5 = "";
        var option6 = "";

        if((this.idx != "") || (this.idx != undefined)){
            option1 = "idx=" + this.idx + "&";
        }
        if((this.castStatus != "") || (this.castStatus != undefined)){
            option2 = "castStatus=" + this.castStatus + "&";
        }
        if((this.vendorCd != "") || (this.vendorCd != undefined)){
            option3 = "vendorCd=" + this.vendorCd + "&";
        }
        if((this.vendorName != "") || (this.vendorName != undefined)){
            option4 = "vendorName=" + this.vendorName + "&";
        }
        if((this.dateFrom_ff != "") || (this.dateFrom_ff != undefined)){
            option5 = "aucDateFrom_ff=" + this.dateFrom_ff + "&";
        }else{
            option5 = "aucDateFrom_ff=2015-10-01&";
        }
        if((this.dateFrom_ft != "") || (this.dateFrom_ft != undefined)){
            option6 = "aucDateFrom_ft=" + this.dateFrom_ft;
        }else{
            option6 = "aucDateFrom_ft=2015-10-31";
        }

        console.log("--> AuctionListCollection URL :: " +  this.host + this.apiUrl + "?" + option1 + option2 + option3 + option4 + option5 + option6 );

        return this.host + this.apiUrl + "?" + option1 + option2 + option3 + option4 + option5 + option6;
    },

    fetch: function (options) {
        options.reset = true;
        return Backbone.Collection.prototype.fetch.call(this, options);
    },

    parse: function (response) {
        // console.log('Collection - parse');
        this.reset(response);
    },

	initialize: function (options) {
        // console.log('Collection - initialize');
        options || (options = {});
        this.host = options.param.host;
        this.apiUrl = options.param.apiUrl;
        this.idx = options.param.idx;
        this.castStatus = options.param.castStatus;
        this.vendorCd = options.param.vendorCd;
        this.vendorName = options.param.vendorName;
        this.dateFrom_ff = options.param.dateFrom_ff;
        this.dateFrom_ft = options.param.dateFrom_ft;

        //console.log( ">> options :: " + this.vendorCd + "/" +  this.dateFrom_ff );
	}
});


