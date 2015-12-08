define(function(require) {
	var options = {
		// Namespace. Namespace your Basil stored data
		// default: 'b45i1'
		//namespace: 'foo',

		// storages. Specify all Basil supported storages and priority order
		// default: `['local', 'cookie', 'session', 'memory']`
		storages: ['session', 'memory']

		// expireDays. Default number of days before cookies expiration
		// default: 365
		//expireDays: 31
	};
	var basil = new window.Basil(options);

	var IDBUtil = {
		setting : {},
		auction : {},
		lot : {}
	};

	// TODO : Setting DB 관련
  	IDBUtil.setting.insert = (function(data,fnCallback) {
		var sData = {
			id: 1,
			version: data.version,
			model: data.model,
			platform: data.platform,
			uuid: data.uuid,
			userTermYN: data.userTermYN,
			appVersion: data.appVersion
		};

		basil.set('1', sData, { 'namespace': 'settingData', 'storages': ['local'] });

		if (fnCallback && typeof (fnCallback) === "function") {
			fnCallback();
		}
	});

  	IDBUtil.setting.select = (function(fnCallback) {
		var rData = basil.get('1', { 'namespace': 'settingData' });
		if((rData != null) && (rData != undefined)){
			fnCallback(rData);
		}else{
			fnCallback(null);
		}
	});

//  	IDBUtil.setting.clear = function() {
//  		_settingData = _mainDB.getCollection('settingData');
//		_settingData.removeDataOnly();
//	};
//  	IDBUtil.setting.deleteOne = function(obj, onsuccess, onerror) {
//  		_settingData = _mainDB.getCollection('settingData');
//		_settingData.remove(obj);
//	};

	// TODO : Auction DB 관련
  	IDBUtil.auction.insert = (function(data, onsuccess, onerror) {
		var sData = {
			idx: data.idx,
			saleNumber: data.saleNumber,
			vendorIdx: data.vendorIdx,
			vendorName: data.vendorName,
			vendorCd: data.vendorCd,
			vendorUri: data.vendorUri,
			aucName: data.aucName,
			aucURL: data.aucURL,
			aucImgURL: data.aucImgURL,
			aucDateFrom: data.aucDateFrom,
			aucDateFrom_ff: data.aucDateFrom_ff,
			aucDateFrom_ft: data.aucDateFrom_ft,
			aucDateTo: data.aucDateTo,
			aucTimeFrom: data.aucTimeFrom,
			aucTimeTo: data.aucTimeTo,
			lotNumFrom: data.lotNumFrom,
			lotNumTo: data.lotNumTo,
			priceSoldCurrency: data.priceSoldCurrency,
			priceSoldCurValue: data.priceSoldCurValue,
			priceSold: data.priceSold,
			locCity: data.locCity,
			locCityDetail: data.locCityDetail,
			locTimeZone: data.locTimeZone,
			viewTime: data.viewTime,
			castDateFrom: data.castDateFrom,
			castDateTo: data.castDateTo,
			castStartYN: data.castStartYN,
			castEndYN: data.castEndYN,
			castStatus: data.castStatus,
			castStatusName: data.castStatusName,
			castIdx: data.castIdx,
			customCode: data.customCode,
			lotCnt: data.lotCnt
		};

		// console.log("======>> idx : " + data.idx);
		// console.log("======>> data : " + sData.vendorCd);

		var _idx = "";
		_idx = "" + sData.idx + "";

		basil.set(_idx, sData, { 'namespace': 'auctionData', 'storages': ['session'] });
	});
  	IDBUtil.auction.selectOneByIdx = (function(id, fnCallback, onerror) {
		var _idx = "";
		_idx = "" + id + "";

		var rData = basil.get(_idx, { 'namespace': 'auctionData' });

		//console.log("======>> id : " + id);
		//console.log("======>> rData : " + rData.idx);

		if((rData != null) && (rData != undefined)){
			fnCallback(rData);
		}else{
			fnCallback(null);
		}
	});

//  	IDBUtil.auction.clear = function(onsuccess, onerror) {
//		_aucDB.clear(onsuccess, onerror);
//	};
//  	IDBUtil.auction.deleteOne = function(id, onsuccess, onerror) {
//		_aucDB.remove(id, onsuccess, onerror);
//	};

	// TODO : Lot DB 관련
  	IDBUtil.lot.insert = function(data, onsuccess, onerror) {
		var sData = {
			idx: data.idx,
			vendorName: data.vendorName,
			vendorCd: data.vendorCd,
			lotUrl: data.lotUrl,
			imageUrl: data.imageUrl,
			loc_imageUrl: data.loc_imageUrl,
			loc_imageFile: data.loc_imageFile,
			imageFile: data.imageFile,
			saleInfoIdx: data.saleInfoIdx,
			saleLotNum: data.saleLotNum,
			artistName: data.artistName,
			artistOriginYear: data.artistOriginYear,
			workTitle: data.workTitle,
			estimateLowCurrency: data.estimateLowCurrency,
			estimateLowCurValue: data.estimateLowCurValue,
			estimateLow: data.estimateLow,
			estimateHighCurrency: data.estimateHighCurrency,
			estimateHighCurValue: data.estimateHighCurValue,
			estimateHigh: data.estimateHigh,
			listBidStatus: data.listBidStatus,
			bidStatus: data.bidStatus,
			bidStatusValue: data.bidStatusValue,
			priceSoldCurrency: data.priceSoldCurrency,
			priceSoldCurValue: data.priceSoldCurValue,
			priceSold: data.priceSold,
			category: data.category,
			medium: data.medium,
			size: data.size,
			yearExecuted: data.yearExecuted,
			artistSigned: data.artistSigned,
			otherDescription: data.otherDescription,
			provenance: data.provenance,
			exhibited: data.exhibited,
			literature: data.literature,
			conditionReport: data.conditionReport,
			keywords: data.keywords,
			similarCnt: data.similarCnt
		};
		var _idx = "";
		_idx = data.idx;
		basil.set(_idx, sData, { 'namespace': 'lotData', 'storages': ['session'] });
	};
  	IDBUtil.lot.selectOneByIdx = function(id, fnCallback, onerror) {
		var rData = basil.get(id, { 'namespace': 'lotData' });
		if((rData != null) && (rData != undefined)){
			fnCallback(rData);
		}else{
			fnCallback(null);
		}
	};

//  	IDBUtil.lot.insert = function(data, onsuccess, onerror) {
//		_lotDB.put(data, onsuccess, onerror);
//	};
//  	IDBUtil.lot.selectAll = function(onsuccess, onerror) {
//		_lotDB.getAll(onsuccess, onerror);
//	};
//  	IDBUtil.lot.selectOneByIdx = function(id,onsuccess, onerror) {
//		_lotDB.get(id, onsuccess, onerror);
//	};
//  	IDBUtil.lot.clear = function(onsuccess, onerror) {
//		_lotDB.clear(onsuccess, onerror);
//	};
//  	IDBUtil.lot.deleteOne = function(id, onsuccess, onerror) {
//		_lotDB.remove(id, onsuccess, onerror);
//	};

// -----------------------------------------
//  	IDBUtil.insert = function(data, onsuccess, onerror) {
//		_db.put(data, onsuccess, onerror);
//	};
//
//  	IDBUtil.select = function(onsuccess, onerror) {
//		_db.getAll(onsuccess, onerror);
//	};
//
//  	IDBUtil.selectOneById = function(id, onsuccess, onerror) {
//		_db.get(id, onsuccess, onerror);
//	};
//
//  	IDBUtil.selectOne = function(_column,_value, onItem, onEnd) {
//		var keyRange = _db.makeKeyRange({
//			lower: _value,
//			upper: _value
//		});
//
//		_db.iterate(onItem, {
//          index: _column,
//          keyRange: keyRange,
//          filterDuplicates: true,
//          onEnd: onEnd
//        });
//	};
//
//  	IDBUtil.deleteOne = function(id, onsuccess, onerror) {
//		_db.remove(id, onsuccess, onerror);
//	};
//
//  	IDBUtil.clear = function(id, onsuccess, onerror) {
//		_db.clear(onsuccess, onerror);
//	};


  	return IDBUtil;
});

