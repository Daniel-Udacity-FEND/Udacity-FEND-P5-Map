/////////////////////////////////////////////////////////////
//
// maps.js:
//
// This file includes wrapper functions for google maps,
// and it encapsulates these functions into a single map object
//
/////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////
//
// MapAppObj():
//
// Map object constructor.  Takes an array of location objects
// as a parameter and stores them for initializeMap().  This
// constructor will create and store the actual google map api object.
//
//////////////////////////////////////////////////////////////
var MapAppObj = function () {

  this.myCenter = new google.maps.LatLng(29.55464378, -95.06847382);

  var mapProp = {
      center : this.myCenter,
      zoom : 12,
      mapTypeId : google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  this.infowindow = new google.maps.InfoWindow;

  this.str1 = "123";

}  // MapAppObj


//////////////////////////////////////////////////////////////
//
// initializeMap():
//
// This function will create a google map info window, markers, and attach
// respective click events to the map and markers.
//
//////////////////////////////////////////////////////////////
MapAppObj.prototype.initializeMap = function(model) {
  var self=this;

  //var infowindow = new google.maps.InfoWindow;

  var i;

  // create the map markers for each location
  for (i = 0; i < model.locations.length; i++) {
      marker = new google.maps.Marker({
          animation : google.maps.Animation.DROP,
          position : new google.maps.LatLng(model.locations[i].lat, model.locations[i].lon),
          map : this.map
      });

      // this adds live marker animation when clicked, make it timeout after a few bounces
      // https://developers.google.com/maps/documentation/javascript/examples/marker-animations
      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          if (marker.getAnimation() != null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // don't let marker bounce indefinitely
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2800);
          }




          loc = new google.maps.LatLng(model.locations[i].lat, model.locations[i].lon);

          // center the map at the lat/long of this marker
          self.map.setCenter(loc);

          var rstr = self.loadFourSquare(model.locations[i].foursquareid);
console.log("rstr=" + rstr);
          // now trigger the marker as if clicked
          //google.maps.event.trigger(model.locations[idx].marker, 'click');

          // and reset the info window
          self.infowindow.setContent(rstr);
          self.infowindow.open(self.map, model.locations[i].marker);






        }
      })(marker, i));

      // adding the click listener for the marker's infowindow
      // on the marker's infowindow, create a button with a link to a popupwindow
      //google.maps.event.addListener(marker, 'click', (function (marker, i) {
      //    return function () {

            //var iws = "";
            //clickStr = "window.open('" + model.locations[i].url + "' , '_blank', 'width=400, height=400');";
            //iws += "<button onclick=\"" + clickStr + "\"> " + model.locations[i].name1 + "</button> ";
			//loadFourSquare(model.locations[i].foursquareid);
            //self.infowindow.setContent(iws);
            //self.infowindow.open(this.map, marker);


			//self.triggerMarker(i);

        //  }
      //})(marker, i));


      // save markers reference so we can manipulate them later
      model.locations[i].marker = marker;
  }
} // initializeMap()

//////////////////////////////////////////////////////////////
//
// triggerMarker():
//
// This function is used to trigger the click event of a single
// map marker.  It will be bound by knockout framework to the
// select list in the html page (the list that is produced when a
// filter is applied).
//
//////////////////////////////////////////////////////////////
MapAppObj.prototype.triggerMarker = function(idx) {
	//loc = new google.maps.LatLng(model.locations[idx].lat, model.locations[idx].lon);

	// center the map at the lat/long of this marker
	//this.map.setCenter(loc);

	//loadFourSquare(model.locations[idx].foursquareid);

	// now trigger the marker as if clicked
	google.maps.event.trigger(model.locations[idx].marker, 'click');

	// and reset the info window
    //this.infowindow.setContent("woot" + idx);
    //this.infowindow.open(this.map, model.locations[idx].marker);

} // triggerMarker()



//////////////////////////////////////////////////////////////
//
// loadFourSquare():
//
// use this to see returned json https://jsonformatter.curiousconcept.com/
//
//////////////////////////////////////////////////////////////
MapAppObj.prototype.loadFourSquare = function(foursquareid) {
// function loadFourSquare(foursquareid) {

    var self=this;

	var url = "https://api.foursquare.com/v2/venues/" + foursquareid;
	url += "?client_id=MXDSBUBGPVFDLPZDUR1RPY0QNSP2YZ0X0JPAJNXSZ23CG5CU";
	url += "&client_secret=30515VPS1GZBJJ1K134WBAA4ZGCUCZXWEEMLVJFTCH5C2FCG";
	url += "&v=20130815";  // version parameter

	// set timeout warning in case foursquare is down
	var wTimeout = setTimeout(function() {
	  console.log("failed to get foursquare resources");
	}, 8000);

/*
	var response =	$.getJSON(
      url,
      function(data) {
         clearTimeout(wTimeout);
         console.log(data);
	});
*/


console.log("loadfoursquare = " + foursquareid);
//console.log("before: " + self.str1);

  $.getJSON(
      url,
      function(data) {
         clearTimeout(wTimeout);
         //console.log(data.response.venue.name);
      }).done(function(data) {
        console.log(  "gtJSON=" + data.response.venue.name );
        self.str1 = data.response.venue.name;
      })
      .fail(function() {
        console.log( "error" );
      })
      .always(function(data) {
        //console.log( "complete");
    });

console.log("after: " + self.str1);

    return self.str1;

/*
	response.complete(function() {
      console.log( response );
      console.log( response.responseText );

      var obj1 = JSON.parse(response.responseText);
      console.log(obj1.response.venue.likes.count);
      console.log(obj1.response.venue.hereNow.count);
      console.log(obj1.response.venue.hereNow.summary);

      this.respStr += "likes=" + obj1.response.venue.likes.count + "<BR>";
      self.respStr += "hereNow=" + obj1.response.venue.hereNow + "<BR>";
      self.respStr += "hereNow.summary=" + obj1.response.venue.hereNow.summary + "<BR>";

      if ( obj1.response.venue.page === undefined ) {
        console.log("no banner provided");
        self.respStr += "no banner provided ";
      }
      else {
        console.log(obj1.response.venue.page.pageInfo.banner);
        self.respStr += obj1.response.venue.page.pageInfo.banner + "<BR>";
      }
	});  */
//console.log(self.respStr);



   // return self.str1;

}

