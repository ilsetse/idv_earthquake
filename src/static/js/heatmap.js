var map, heatmap, allowedBounds, globalData;
var globalCsv = [];
var globalFilters = new Map();

function initMap(){

  map = new google.maps.Map($('#map')[0],{
    zoom: 1,
    minZoom: 1,
    center: new google.maps.LatLng(0,0),
    //center: {lat: 60.204598, lng: 24.961859}, // Exactum
    mapTypeId: 'roadmap'
  });


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
    map.setZoom(4);
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    newLatLng = new google.maps.LatLng(lat,lng);
    map.setCenter(newLatLng);
    console.log(map.getBounds());
  });

 } // endof initMap


//// interaction



function setMarkerStyle(){
  return{
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .2,
    scale: 2,
    strokeWeight: .1
  };
}

function resetMaps(){
  // todo: close/clear visualization window
  map.fitBounds(boundsNew);

  $('#magnitude-filter-is-on')[0].checked = false; 
  $('#min-mag').val(0);
  $('#max-mag').val(10);
  $('#min-year').val(2000);
  $('#max-year').val(2018);
  
  setMagnitudeRange();
  setYearRange();
} // endof resetMaps



function getCoordinates(){
  // use uncompressed JQuery, not slim minified!
  $.ajax({
    url: 'static/data/aug_01_earthquake_data.json',
    //url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&updatedafter=2018-04-01',
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

  if(heatmap) heatmap.setMap(null);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
		gradient: gradient,
    dissipating: true 
  });
  heatmap.setMap(map);
}


var gradient = [
	'rgba(0, 255, 255, 0)',
	'rgba(0, 255, 255, 1)',
	'rgba(0, 191, 255, 1)',
	'rgba(0, 127, 255, 1)',
	'rgba(0, 63, 255, 1)',
	'rgba(0, 0, 255, 1)',
	'rgba(0, 0, 223, 1)',
	'rgba(0, 0, 191, 1)',
	'rgba(0, 0, 159, 1)',
	'rgba(0, 0, 127, 1)',
	'rgba(63, 0, 91, 1)',
	'rgba(127, 0, 63, 1)',
	'rgba(191, 0, 31, 1)',
	'rgba(255, 0, 0, 1)'
];

function loadData(data, csv, filters) {
  d = applyFilters(data['features'], filters);
  console.log('items selected', d.length);
  n = d.length;
  idx = 0;

  csv = [];

  for (idx=0; idx<n; idx++){
    lng = d[idx]['geometry']['coordinates'][0];
    lat = d[idx]['geometry']['coordinates'][1];
    coordinate = new google.maps.LatLng(lat, lng);
    csv.push(coordinate);

    // js bool option for marker?
    /*
    var marker = new google.maps.Marker({
      position: coordinate,
      map: map,
      icon: setMarkerStyle()
    });
    */
  }

  globalCsv = csv;
  loadHeatmap(csv);
}

function setRange(minId, maxId, minValId, maxValId, applyMin, applyMax) {
  globalFilters = applyMin($(minId)[0], globalFilters);
  globalFilters = applyMax($(maxId)[0], globalFilters);

  const round = v => Math.round(v * 100) / 100;

  $(minValId).text(round($(minId)[0].value))
  $(maxValId).text(round($(maxId)[0].value))

  loadData(globalData, globalCsv, globalFilters);
}

function setMagnitudeRange() {
  setRange('#min-mag', '#max-mag', '#mag-min-val', '#mag-max-val', applyMinMagnitude, applyMaxMagnitude)
}

function setYearRange() {
  setRange('#min-year', '#max-year', '#year-min-val', '#year-max-val', applyMinYear, applyMaxYear)
}
