app.models.Lot = Backbone.Model.extend({
    // id
    idAttribute: "idx",

    defaults: {
        "idx": 1584154,
        "statusWork": "89",
        "vendorName": "Christies",
        "vendorCd": "CD01",
        "lotUrl": "http://www.christies.com/lotfinder/lot/yoshihara-jiro-untitled-5935734-details.aspx?from=salesummary&intObjectID=5935734&sid=337febdf-d2b2-4fad-8931-53eb7cff3fca",
        "imageUrl": "http://www.christies.com/lotfinderimages/d59357/yoshihara_jiro_untitled_d5935734h.jpg",
        "loc_imageUrl": null,
        "loc_imageFile": null,
        "saleInfoIdx": 264,
        "saleLotNum": "1",
        "artistName": "Yoshihara Jiro",
        "artistOriginYear": "(1905-1972)",
        "workTitle": "Untitled",
        "estimateLowCurrency": "CUR_GBP",
        "estimateLowCurValue": "(GBP) £",
        "estimateLow": "60,000",
        "estimateHighCurrency": "CUR_GBP",
        "estimateHighCurValue": "(GBP) £",
        "estimateHigh": "50,000",
        "listBidStatus": null,
        "bidStatus": "LOT_4",
        "bidStatusValue": "PASSED",
        "priceSoldCurrency": "CUR_GBP",
        "priceSoldCurValue": "(GBP) £",
        "priceSold": "60,000",
        "category": null,
        "medium": "",
        "size": "<br/>45.5 x 37.5 cm.",
        "yearExecuted": "",
        "artistSigned": null,
        "otherDescription": null,
        "provenance": null,
        "exhibited": null,
        "literature": null,
        "conditionReport": null,
        "keywords": null,
        "similarCnt": 0,
        "enabled": 1,
        "paging": null
    },

    initialize: function() {

    },

    parse: function(data){
        return data;
    }
});

// AuctionListCollection
app.models.LotCollection = Backbone.Collection.extend({

    model: app.models.Lot,

    url : function() {
        //console.log('Collection.url() called');
        if((this.host == "") || (this.host == undefined)){
            this.host = _gAppData.hostUri;
        }

        if((this.apiUrl == "") || (this.apiUrl == undefined)){
            this.apiUrl = "/api/m/searchLotChk";
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
            option6 = "aucDateFrom_ft=2015-10-30";
        }

        console.log( this.host + this.apiUrl + "?" + option1 + option2 + option3 + option4 + option5 + option6 );

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
        this.saleInfoIdx = options.param.saleInfoIdx;
        this.bidStatus = options.param.bidStatus;
        this.page = options.param.page;
	}
});
