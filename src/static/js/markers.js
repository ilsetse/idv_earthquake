
 //////////////////////////////////////////
 ///////////////// MARKERS ////////////////
 //////////////////////////////////////////
 
 // js bool option for marker?
/*
function loadMarker(d, data_length){
 
	data = loadFilteredData(d, data_length);
	coordinates = data[0];
	magnitude = data[1];


	var marker = new google.maps.Marker({
	 position: coordinates,
	 map: map,
	 icon: setMarkerStyle()
	});

	map.data.setStyle(function(feature) {
										return { icon: getCircle(magnitude) };
										});
} // endof loadMarker



function setMarkerStyle(){
	return {
		path: google.maps.SymbolPath.CIRCLE,
		fillColor: 'red',
		fillOpacity: .2,
		scale: Math.pow(2, magnitude) / 2,
		strokeColor: 'white',
		strokeWeight: .5
	};
}


*/


