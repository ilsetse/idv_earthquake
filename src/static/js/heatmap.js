var map, heatmap, allowedBounds;
var csv = [];

function initMap(){

  map = new google.maps.Map($('#map')[0],{
    zoom: 20,
    center: new google.maps.LatLng(0,0),
    //center: {lat: 60.204598, lng: 24.961859}, // Exactum
    mapTypeId: 'roadmap'
  });

 
 /*
  var coordinates = getCoordinates();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(coordinates),
    map: map
  });
  */

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
  
}



function getData(evt){
  var file = evt.target.files[0];
  //file = 'static/data/processed_data.csv'
  Papa.parse(file, {
    delimiter: ',',
    header: true,
    complete: function(results) {
      //console.log(results);
      for (idx in results['data']){
        var row = results['data'][idx];
        csv.push(new google.maps.LatLng(row['latitude'], row['longitude']));
      }
      loadHeatmap(csv);
    } 
  });
}

function loadHeatmap(csv){
  var pointArray = new google.maps.MVCArray(csv);
  console.log(pointArray);
  if(heatmap) heatmap.setMap(null);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray
  });
  heatmap.setMap(map);
}


$(document).ready(function(){
  $("#csv-file").change(getData);
  google.maps.event.addDomListener(window, 'load', initMap);

});






/*
var nData;
var lat = [];
var lng = [];
function getCoordinates(){
  $.getJSON('static/data/apr_15_earthquake_data.json', function (data) {
    nData = data['features'].length;
    d = data['features'];
    for (idx=0; idx<nData; idx++){
      lng[idx] = d[idx]['geometry']['coordinates'][0];
      lat[idx] = d[idx]['geometry']['coordinates'][1];
    }

  });

  //console.log(lng);
  return [lat, lng];
  
  
  // use uncompressed JQuery, not slim minified!
  $.ajax({
    url: 'static/data/apr_15_earthquake_data.json',
    success: function(data) {
      n = data['features'].length;
      d = data['features'];
      idx = 0;
      for (idx=0; idx<n; idx++){
        lng.push(d[idx]['geometry']['coordinates'][0]);
        lat.push(d[idx]['geometry']['coordinates'][1]);
      }

    },
    error: function() {
      console.log('ERROR getData()');
    }
  });
} // endof getCoordinates();

// Heatmap data
function getPoints(coordinates) {
  return [
    new google.maps.LatLng(-5.4954, 151.5068)
  ];
}

*/
