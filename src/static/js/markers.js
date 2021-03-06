var markers = [];
//////////////////////////////////////////
///////////////// MARKERS ////////////////
//////////////////////////////////////////

// js bool option for marker?

function clearMarkers() {
	markers.map(m => m.setMap(null));
	markers.length = 0;
}

function loadMarker(d, data_length, zoom) {
	idx = 0;

	clearMarkers();

	for (idx = 0; idx < d.length; idx++) {
		lng = d[idx]['geometry']['coordinates'][0];
		lat = d[idx]['geometry']['coordinates'][1];
		coordinate = new google.maps.LatLng(lat, lng);

		var marker = new google.maps.Marker({
			position: coordinate,
			map: map,
			icon: getCircle(d[idx]['properties']['mag'], zoom)
			//icon: styleFeature(d[idx]['properties']['mag'])
			// icon: setMarkerStyle()
		});
		var magnitude = d[idx]['properties']['mag'];
		date = d[idx]['properties']['time'];
		date = new Date(date).toString().slice(0, 15);
		var place = d[idx]['properties']['place'];

		var contentString = '<div id="content">' +
			'<div id="siteNotice">' +
			'</div>' +
			// '<h1 id="firstHeading" class="firstHeading">Hello</h1>' +
			'<div id="bodyContent">' +
			'<p><b>' + place + '</br><b> Date: ' + date + '</br><b>Magnitude: ' + magnitude + '</br></p>' +
			'</div>' +
			'</div>';

		// var ClickEventHandler = function (map, marker) {
		// 	this.origin = marker;
		// 	this.map = map;
		// 	this.infowindow = new google.maps.InfoWindow;
		// 	this.infowindowContent = contentString;
		// 	this.infowindow.setContent(contentString);

		// 	// Listen for clicks on the map.
		// 	map.addListener('click', this.handleClick.bind(this));
		// };

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		marker.addListener('click', infoCallback(infowindow, marker));
		markers.push(marker);
	}

	markers.map(m => m.setMap(map));
}
function infoCallback(infowindow, marker) { return function () { infowindow.open(map, marker); }; }


// 	data = loadFilteredData(d, data_length);
// 	coordinates = data[0];
// 	magnitude = data[1];


// 	var marker = new google.maps.Marker({
// 	 position: coordinates,
// 	 map: map,
// 	 icon: setMarkerStyle()
// 	});

// 	map.data.setStyle(function(feature) {
// 										return { icon: getCircle(magnitude) };
// 										});
// } // endof loadMarker



// function setMarkerStyle(){
// 	return {
// 		path: google.maps.SymbolPath.CIRCLE,
// 		fillColor: 'red',
// 		fillOpacity: .2,
// 		scale: Math.pow(2, magnitude) / 2,
// 		strokeColor: 'white',
// 		strokeWeight: .5
// 	};
// }

// Marker with magnitude determing the size
function getCircle(magnitude, zoom) {
	var colour = '';

	if (magnitude < 4) {
		colour = 'green';
	} else if (magnitude >= 4 && magnitude < 6) {
		colour = 'yellow';
	} else {
		colour = 'red';
	}

	return {
		path: google.maps.SymbolPath.CIRCLE,
		fillColor: colour,
		fillOpacity: .2,
		scale: (Math.pow(2, magnitude) / 2 / 5) * zoom,
		strokeColor: 'white',
		strokeWeight: .5
	};
}

