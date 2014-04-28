var Crawler = require("crawler").Crawler;
var geocoder = require("node-geocoder").getGeocoder("google", "http", {});

	//geocoder.geocode(address, function(err, res) {
	//	console.log(res);
	//});


var c = new Crawler({
	"maxConnections":15,

	// This will be called for each crawled page
	"callback":function(error,result,$) {

	    // $ is a jQuery instance scoped to the server-side DOM of the page
	    var next_link = "";

	    $(".add_list.add_type4").each(function(index) {

	    	var flat_info = {}
	    	//Geocoding Google API

		    var address = $(this).find(".add_info .main_props .add_title_wrap").text();
		    flat_info["address"] = address;
		    // Using callback
			geocoder.geocode(address, function(err, res) {
		    	flat_info["lat"] = res[0].latitude;
	   			flat_info["lon"] = res[0].longitude;
			});


			var lat1 = 54.1972531;
			var lon1 = 45.175309;
            var lat2 = flat_info["lat"];
            var lon2 = flat_info["lon"];
			var dlon = lon2 - lon1;
			var dlat = lat2 - lat1;
			var a = (Math.sin(dlat/2))^2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon/2))^2;
			var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
			var d = 6373 * c;

           	flat_info["dist_to_kp"] = d * 1000;

	    	flat_info["price"] = parseInt($(this).find(".add_info .right_block .add_cost").clone().children().remove().end().text().replace(/\s+/g, ""));
	    	flat_info["kind"] = "NA";
	    	flat_info["clazz"] = "econom";
	    	flat_info["room_no"] = parseInt($(this).find(".add_info .main_props .flat_prop .flat_p .flat_p_txt p:eq(0)").text());;
	    	flat_info["size_t"] = parseInt($(this).find(".add_info .main_props .flat_prop .flat_p .flat_p_txt p:eq(1)").text().split(" ")[0]);
	    	flat_info["size_l"] = parseInt(0.1 * flat_info["size_t"]);
	    	flat_info["size_k"] = "NA";
	    	flat_info["dist_to_subway"] = "NA";
	    	flat_info["state"] = "normal";
	    	flat_info["beds"] = "NA";
	    	flat_info["furniture"] = "1";
	    	flat_info["district"] = "NA";
	    	flat_info["subway"] = "NA";
	    	flat_info["floor"] = parseInt($(this).find(".add_info .main_props .flat_prop .flat_p .flat_p_txt p:eq(2)").text().split("/")[0]);
	    	flat_info["floors"] = parseInt($(this).find(".add_info .main_props .flat_prop .flat_p .flat_p_txt p:eq(2)").text().split("/")[1]);
	    	flat_info["year_built"] = 1980;
	    	flat_info["walls"] = "panel";
	    	flat_info["date"] = "NA";
			flat_info["url"] = $(this).find("a.adv_pic").attr("href");
	    	flat_info["img_link"] = $(this).find("a.adv_pic > img").attr("src");
	    	flat_info["pub_date"] = $(this).find(".adv_data").text();
	    	flat_info["dop_info"] = $(this).find(".add_info .main_props .tags span").text();


	    	//console.log(flat_info);
	    	
	    	var max_pages = parseInt($("ul.same_adds_paging li:last a").text());
	    	var current_link = parseInt($("ul.same_adds_paging li.current a").text());
	    	if (current_link + 1 < max_pages) {
		    	next_link = "http://saransk.irr.ru/real-estate/apartments-sale/search/list=list/page"+(current_link + 1)+"/";
	    	} else {
		    	next_link = "http://saransk.irr.ru/real-estate/apartments-sale/search/list=list/page"+max_pages+"/";
	    	}

	    });
        c.queue(next_link);
	}
});


c.queue("http://saransk.irr.ru/real-estate/apartments-sale/");
