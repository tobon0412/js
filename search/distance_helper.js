var speed_metrobus = 2;
var speed_alimentadora = 1;


function storeCoordinate(x, y, value, type, route, array) {
    array.push({x: x, y: y, val: value, type: type, route: route});
}

var rad = function(x) {
    return x * Math.PI / 180;
};

function parse(callback) {
    var myParser = new geoXML3.parser({map: map});
    myParser.parse('Terminales_y_paraderos.kml');
    //console.log(myParser.docs[0].markers);
    var seen = [];
    var dictstring = JSON.stringify(myParser.docs[0].markers, function(key, val) {
       if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
                return;
            }
            seen.push(val);
        }
        return val;
    });
    //console.log(dictstring);

    fs.writeFile("thing.json", dictstring);
}

//Get distance in meter
var getDistanceLessThan = function(p1, p2) {

  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.x - p1.x);
  var dLong = rad(p2.y - p1.y);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.x)) * Math.cos(rad(p2.x )) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  /*console.log("distance");
  console.log(d);*/
  //console.log(d < limitDistance);
  return d; //return true if distance is less than the limit
};

//Get distance in meter
var getDistance = function(p1, p2) {
   var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

//Get distance in meter for GraphNodes
var getDistanceGraphNode = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

function getPolilyne(json, polyline){
  //console.log(json);
  for(var item in json){
      //console.log(json[item]);
      if(json[item].geometry != undefined)
          var point = new google.maps.LatLng(json[item].geometry.coordinates[1], json[item].geometry.coordinates[0]);
          polyline.getPath().push(point);
  }
  return polyline;
}

function getPolilynePath(path, polyline, start, end){
 /* console.log("polyline final path");
  console.log(path);*/
  //polyline.getPath().push(start);
  for(var item in path){
      /*console.log("item");
      console.log(path[item]);*/
      if(path[item].lat != undefined & path[item].lng != undefined){
        var point = new google.maps.LatLng(path[item].lat, path[item].lng);

        polyline.getPath().push(point);
      }
  }
  //polyline.getPath().push(end);
  //console.log(polyline);
  return polyline;
}

function getNearestPointXml(myParser, location){
  var array = [];
  //console.log(myParser.docs[0].markers[0].position);
  for(var item in myParser.docs[0].markers){
    //console.log(item);
    var point = item.position;
    //console.log(point.lat());
    var station = {
      point: point,
      distance: getDistance(location, point)
    };
    array.push(station);
  }
  array.sort(function(a, b){return a.distance-b.distance});
  //console.log(array);
  return array;
}

function getNearestPointGeoJson(features, location){
  var array = [];
  //console.log(features);
  for(var item in features){
    //console.log(features[item].geometry.coordinates[0]);
    if(features[item].geometry != undefined){
      var point = new google.maps.LatLng(features[item].geometry.coordinates[1], features[item].geometry.coordinates[0]);
      //console.log(point.lat());
      var station = {
        point: point,
        distance: getDistance(location, point),
        name: features[item].properties.Name
      };
      array.push(station);
    }
  }
  array.sort(function(a, b){return a.distance-b.distance});
  //console.log(array);
  return array;
}


function getNearestPoint(list, location){
  var array = [];
  for(var item in list[0].coordinates){
    //console.log(list[0].coordinates[item][0]);
    var point = new google.maps.LatLng(list[0].coordinates[item][0], list[0].coordinates[item][1]);
    //console.log(point.lat());
    var station = {
      point: point,
      distance: getDistance(location, point)
    };
    array.push(station);
  }
  array.sort(function(a, b){return a.distance-b.distance});
  //console.log(array);
  return array;
}


function nearest(value, nearestPoint){
  var current = value;
  if(current <= nearestPoint){
      nearestPoint = current;
  }

  return nearestPoint;
}


function getNearestPointGeoJsonMatrix(list, location){
  var coord = [];
  //console.log(features);
  for(var item in list.features){
    //console.log(features[item].geometry.coordinates[0]);
    if(list.features[item].geometry != undefined){
      var point = new google.maps.LatLng(list.features[item].geometry.coordinates[1], list.features[item].geometry.coordinates[0]);
      //console.log(point.lat());
      //var distance = getDistance(location, point);

     /* var station = {
        point: point,
        distance: distance,
        name: list.features[item].properties.Name,
        type: list.type,
        route: list.route
      };*/
      storeCoordinate(point.lat(), point.lng(), 0, list.crs.type, list.crs.route, coord);
    }
  }
  /*coord.sort(function(a, b){return a.val-b.val});
  console.log("nearest");
  console.log(coord);*/
  return coord;
}


function getPoints(features){
  //console.log(features.length);
  var array = [];
  for(var item in features){
    if(features[item].geometry != undefined){
        var point = new google.maps.LatLng(features[item].geometry.coordinates[1], features[item].geometry.coordinates[0]);
        var place = {'title': features[item].properties.Name, 'latLng': point}
        array.push(place);
      }
  }
  return array;
}

/*function distanceMatrix(destinations, origin){

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: origin,
    destinations: destinations,
    travelMode: 'WALKING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  }, callback);

function callback(response, status) {
  if (status !== 'OK') {
            console.log('Error was: ' + status);
          } else {
            console.log(response);

  }
}*/

//}

function completePath(result, grid, start, end){
  /*console.log("grid");
  console.log(grid);

  console.log(grid[0][start.id]);
  console.log(grid[0][end.id]);*/
  console.log("complete path");
  //result.sort(function(a, b){return a.id - b.id});
  console.log(result);
  var orderedArray = [];
  var unique = result.filter(function(elem, index, self) {
    return self[index].id == self.indexOf(elem).id;
  });
  /*console.log(result);
  for(var item in result){

    if( result[parseInt(item) + 1] != undefined){
      console.log("compare");
      if(parseInt(result[parseInt(item)  + 1].id) - parseInt(result[item].id) != 1) {

        console.log("not complete");
        console.log(parseInt(result[item].id));
        result[parseInt(result[item].id) - 1] = grid[0][parseInt(result[item].id) - 1];
        console.log(result[parseInt(result[item].id) - 1]);
             //Not consecutive sequence, here you can break or do whatever you want
      }
      console.log(result[item].id);
    }
  }*/

  return result;
 /* console.log(result);
  console.log("ordered");
  console.log(result);
*/
}

function runSnapToRoad(path, google, map) {
  console.log("runSnapToRoad");
  console.log(path);
  var pathValues = [];
  for (var i in path) {
    if(path[i].lat != undefined & path[i].lng != undefined)
       pathValues.push(path[i].lat + "," + path[i].lng);
  }
  console.log(pathValues);

  $.get('https://roads.googleapis.com/v1/snapToRoads', {
    interpolate: true,
    key: "AIzaSyDNurmHvHcXvfFc08bVnUtBsTyySuQHu9s",
    path: pathValues.join('|')
  }, function(data) {
    console.log(data);
    drawSnappedPolyline(data, google, map)
    return processSnapToRoadResponse(data);
  });
}

// Store snapped polyline returned by the snap-to-road service.
function processSnapToRoadResponse(data) {
  console.log("processSnapToRoadResponse");
  snappedCoordinates = [];
  placeIdArray = [];
  for (var i = 0; i < data.snappedPoints.length; i++) {
    var latlng = new google.maps.LatLng(
        data.snappedPoints[i].location.latitude,
        data.snappedPoints[i].location.longitude);
    snappedCoordinates.push(latlng);
    placeIdArray.push(data.snappedPoints[i].placeId);
    return snappedCoordinates;
  }
}

function drawSnappedPolyline(snappedCoordinates, google, map) {
  console.log("drawSnappedPolyline");
  var snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: 'blue',
    strokeWeight: 3
  });

  snappedPolyline.setMap(map);
  polylines.push(snappedPolyline);
}


function calculateGraph(graph, startIndex, endIndex){
  //console.log("calculate Graph");
  //console.log(array);
  /*var graphWithWeight = new Graph([
        ["1,2,3","1,2,3","2,2,3","30,2,3"],
        ["0,2,3","4,2,3","4,2,3","2,2,3"],
        ["0,2,3","0,2,3","5,2,3","1,2,3"]
      ]);*/


  var graphWithWeight = graph;
  //console.log(graph);
  //console.log(graphWithWeight);
  var startWithWeight = graphWithWeight.grid[0][0];
  //markerNearL1.setPosition(new google.maps.LatLng(startWithWeight[0][0].lat, startWithWeight[0][0].lng));
  //markerNearL1.setPosition(endWithWeight);
  //markerNearL2.setPosition(startWithWeight);

  /*console.log(graphWithWeight.grid[0][startIndex]);
  console.log(graphWithWeight.grid[1][endIndex]);
  console.log(startIndex);
  console.log(endIndex  );*/
  var endWithWeight = graphWithWeight.grid[0][60];
  var resultWithWeight = astar.search(graphWithWeight, startWithWeight, endWithWeight, {closest: true});//,  { heuristic: astar.heuristics.manhattan });
  // resultWithWeight is an array containing the shortest path taking into account the weight of a node
  //console.log("astar with weight example");
  //console.log(resultWithWeight);
  return completePath(resultWithWeight, graphWithWeight.grid, startWithWeight, endWithWeight);
 // console.log(graphWithWeight.list[1229]);
  //return resultWithWeight;
}
