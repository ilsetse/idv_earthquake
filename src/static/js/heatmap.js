var map, heatmap, allowedBounds;
var csv = [];

function initMap(){

  map = new google.maps.Map($('#map')[0],{
    zoom: 1,
    minZoom: 1,
    center: new google.maps.LatLng(0,0),
    //center: {lat: 60.204598, lng: 24.961859}, // Exactum
    mapTypeId: 'roadmap'
  });

 
  getCoordinates(); // and load heatmap

  /*
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
  */

  // click to zoom
  map.addListener('click', function(event){
    map.setZoom(8);
    lat = event.latLng.lat();
    lng = event.latLng.lng();
    newLatLng = new google.maps.LatLng(lat,lng);
    map.setCenter(newLatLng);
  });
  
} // endof initMap
 
function getCoordinates(){
  // use uncompressed JQuery, not slim minified!
  $.ajax({
    url: 'static/data/aug_01_earthquake_data.json',
    success: function(data) {
      d = data['features'];
      n = d.length;
      idx = 0;
      for (idx=0; idx<n; idx++){
        lng = d[idx]['geometry']['coordinates'][0];
        lat = d[idx]['geometry']['coordinates'][1];
        csv.push(new google.maps.LatLng(lat, lng));
      }

      loadHeatmap(csv);

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
		gradient: gradient
		//opacity: 0.5
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
]
