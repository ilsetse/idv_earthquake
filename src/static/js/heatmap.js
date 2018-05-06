var map, allowedBounds, globalData;
var heatmap = [];
var globalCsvByBounds = [];
var globalCsv = [];
var globalFilters = new Map();
const zoomLvl = 4;

function initMap(){
  map = new google.maps.Map($('#map')[0],{
    zoom: 1,
    minZoom: 1,
    center: new google.maps.LatLng(0,0),
    //center: {lat: 60.204598, lng: 24.961859}, // Exactum
    mapTypeId: 'roadmap',
    styles: 
     [
			{
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#f5f5f5"
					}
				]
			},
			{
				"elementType": "labels.icon",
				"stylers": [
					{
						"visibility": "on"
					}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#616161"
					}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#f5f5f5"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#bdbdbd"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#eeeeee"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#757575"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#e5e5e5"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#9e9e9e"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#ffffff"
					}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#757575"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#dadada"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#616161"
					}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#9e9e9e"
					}
				]
			},
			{
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#e5e5e5"
					}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#eeeeee"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#c9c9c9"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#9e9e9e"
					}
				]
			}
		] // endof styles
  }); // finish initializing map variable


  getCoordinates(); // and load heatmap

  allowedBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(85, -180), // top left corner
    new google.maps.LatLng(-85, 180), // bottom right corner
  );

  var k = 0;
  var n = allowedBounds.getNorthEast().lat() - k;
  var e = allowedBounds.getNorthEast().lng() - k;
  var s = allowedBounds.getSouthWest().lat() + k;
  var w = allowedBounds.getSouthWest().lng() + k;

  var neNew = new google.maps.LatLng(n, e);
  var swNew = new google.maps.LatLng(s, w);
  var neNew = new google.maps.LatLng(n, e);
  
  boundsNew = new google.maps.LatLngBounds(swNew, neNew);
  map.fitBounds(boundsNew);

  // click to zoom
  map.addListener('click', function(event){
    map.setZoom(zoomLvl);
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    newLatLng = new google.maps.LatLng(lat,lng);
    map.setCenter(newLatLng);
	});
	
	map.addListener('bounds_changed', function(event) {
		if (globalData) {
			loadData(globalData, globalCsv, globalFilters);
		}
	})

 } // endof initMap();



//// interaction

function resetMaps(){
  // todo: close/clear visualization window
  map.fitBounds(boundsNew);
	
	$('#actual-felt-on')[0].checked = false;
  
  getSlider('year', 2000, 2018);
  getSlider('magnitude', 0, 10);
  
  globalFilters = new Map();
  loadData(globalData, globalCsv, globalFilters);
} // endof resetMaps



function getCoordinates(){
  // use uncompressed JQuery, not slim minified!
  $.ajax({
    //url: 'static/data/aug_01_earthquake_data.json',
    url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&updatedafter=2018-04-01',
    success: function(data) {
      globalData = data;
      loadData(globalData, globalCsv, globalFilters);
    },
    error: function() {
      console.log('ERROR getData()');
    }
  });
} // endof getCoordinates();



function loadHeatmap(csv){
  var pointArray = new google.maps.MVCArray(csv);
  //console.log(pointArray);

  //heatmap = new google.maps.visualization.HeatmapLayer({
	heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
    dissipating: true 
  });
  heatmap.setMap(map);
}


// load filtered data
function loadData(data, csv, filters) {
  d = applyFilters(data['features'], filters);
  console.log('items selected', d.length);
	//console.log(d);
  n = d.length;
	
  var coordinates = [];
	var magnitude = [];
	var felt = [];
  var dates = [];
	var depths = [];
	var markerData = [];

	const mapBounds = map.getBounds()
	
	idx = 0;
  for (idx=0; idx<n; idx++){

		const current = d[idx];
		
		// magnitude
		if (isInBounds(mapBounds, current)) {
			magnitude.push(current['properties']['mag']);

			if (map.getZoom() >= zoomLvl) {
				markerData.push(current);
			}
		}
		
		// felt
		// todo check decimals. 104 -> 10.4
		tmp = d[idx]['properties']['felt'];
		if (tmp==null) { tmp = 0 }
		felt.push(tmp);
		
		// coordinates
    lng = current['geometry']['coordinates'][0];
    lat = current['geometry']['coordinates'][1];
    coordinate = new google.maps.LatLng(lat, lng);
    coordinates.push(coordinate);
		
		// date
		date = current['properties']['time'];
		date = new Date(date).toString().slice(0,15);
		dates.push(date);
		
		// depth
		depths.push(current['geometry']['coordinates'][2]);
	}

	globalCsv = coordinates;
  loadHeatmap(coordinates);
	loadHistogram(magnitude);
	//console.log(dates);
	loadLineChart(dates, magnitude, felt);
	loadMarker(markerData, n, map.getZoom());
}

/* Applies filters when sliders are interacted with. Used by both sliders.
`validFilters` are defined in filters.js */
function setRange(namePrefix, minVal, maxVal) {
  //console.log(namePrefix, minVal, maxVal);

  globalFilters = validFilters['min-' + namePrefix](minVal, globalFilters);
  globalFilters = validFilters['max-' + namePrefix](maxVal, globalFilters);

  loadData(globalData, globalCsv, globalFilters);
}

function setMagnitudeRange() {
  setRange('#min-mag', '#max-mag', '#mag-min-val', '#mag-max-val', applyMinMagnitude, applyMaxMagnitude)
}

/* Loads data again. Used by magnitude-checkbox. */
function reapplyFilters() {
  loadData(globalData, globalCsv, globalFilters);
}