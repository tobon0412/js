//TODO: Create function to create complete graph and for add individual routes(lines, buses)
function initMap() {



        /*$.getJSON("ruta.line1", function(line1) {
           polyline = getPolilyne(line1);
        });*/
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 19.045, lng: -98.209},
          zoom: 13
        });
        var origin = /** @type {!HTMLInputElement} */(
            document.getElementById('pac-input_origin'));
        var destination = /** @type {!HTMLInputElement} */(
            document.getElementById('pac-input_destination'));

        //var types = document.getElementById('type-selector');
        /*map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
*/
        var autocomplete_origin = new google.maps.places.Autocomplete(origin);
        var autocomplete_destination = new google.maps.places.Autocomplete(destination);
        autocomplete_origin.bindTo('bounds', map);
        autocomplete_destination.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });
        console.log(parseFloat(0)*100);
        console.log(Math.round(parseFloat(20.1213231)*100)/100 <= Math.round(parseFloat(50)*100)/100);
        autocomplete_origin.addListener('place_changed', function() {
          //$(function() {
            var polylineL1 = new google.maps.Polyline({
                path: [],
                strokeColor: '#0000FF',
                strokeWeight: 3
            });
            var polylineL2 = new google.maps.Polyline({
                path: [],
                strokeColor: '#00000F',
                strokeWeight: 3
            });

            var nearesPath = new google.maps.Polyline({
                path: [],
                strokeColor: '#00FFFF',
                strokeWeight: 4
            });

            var markerNearL1 = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29)
            });
            var markerNearL2 = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29)
            });
            var place = autocomplete_origin.getPlace();
            var line1 = JSON.parse($('#jsonL1').html());
            var line2 = JSON.parse($('#jsonL2').html());
            //calculateGraph(line1.features);
            //console.log(line1.features);
            //console.log(line2.features);

            var arrayOrigin = [];
            arrayOrigin.push(place.geometry.location);
            //var arrayDestinationsL1 = getPoints(line1.features);
            //var arrayDestinationsL2 = getPoints(line2.features);
            //distanceMatrix(arrayDestinations, arrayOrigin);
            //console.log(line1);
            polylineL1 = getPolilyne(line1.features, polylineL1);
            polylineL2 = getPolilyne(line2.features, polylineL2);
            polylineL1.setMap(map);
            polylineL2.setMap(map);
            var nearestArrayL1 = getNearestPointGeoJsonMatrix(line1, place.geometry.location);
            var nearestArrayL2 = getNearestPointGeoJsonMatrix(line2, place.geometry.location);
           /* console.log("nearpoint");
            console.log(nearestArrayL1[0]);
            console.log(nearestArrayL2[0]);*/
            //concat two arrays if works: TODO : make function for concate all arrays or concat
            var completeArray = nearestArrayL2.concat(nearestArrayL1);

            //var graph = new Graph([nearestArrayL2, nearestArrayL1]);
            var graph = new Graph([completeArray]);
            /*console.log("graph");
            console.log(graph);*/
            //console.log(nearestArrayL2);
            var indexL2 = 0;
            /*for(var item in nearestArrayL2){
              indexL2 ++;
              var markerL2 = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29),
                label: "[" + nearestArrayL2[item].route + ", " + indexL2 + "]",
              });
              markerL2.setPosition(new google.maps.LatLng(nearestArrayL2[item].x, nearestArrayL2[item].y));
            }

            //console.log(nearestArrayL1);
            var indexL1 = 0;
            for(var item in nearestArrayL1){
              indexL1 ++;
              var markerL1 = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29),
                label: "[" + nearestArrayL1[item].route + ", " + indexL1 + "]",
              });
              markerL1.setPosition(new google.maps.LatLng(nearestArrayL1[item].x, nearestArrayL1[item].y));
            }*/
            //clone arrays
            var cloneL2 = nearestArrayL2.slice(0);
            var cloneL1 = nearestArrayL1.slice(0);

           /* console.log(nearestArrayL1.length);
            console.log(nearestArrayL2.length);*/
            //get the nearest point to origin
            nearestArrayL2.sort(function(a, b){return a.val-b.val});
            //get nearest point to destination
            nearestArrayL1.sort(function(a, b){return a.val-b.val});
           /* console.log(nearestArrayL1);
            console.log(cloneL1);*/

            markerNearL1.setPosition(new google.maps.LatLng(nearestArrayL1[0].x, nearestArrayL1[0].y));
            markerNearL2.setPosition(new google.maps.LatLng(nearestArrayL2[0].x, nearestArrayL2[0].y));
            var indexL2 = cloneL2.indexOf(nearestArrayL2[0]);
            var indexL1 = cloneL1.indexOf(nearestArrayL1[0]);

           /* console.log(cloneL2[indexL2]);
            console.log(cloneL1[indexL1]);
*/

            var path = calculateGraph(graph, indexL2, indexL1);
            /*console.log("start element");
            console.log(graph.grid[0][0]);*/
            /*for(var item in path){
              var m = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29),
                label: "[" + path[item].x + ", " + path[item].y + "]",
              });
              m.setPosition(new google.maps.LatLng(path[item].lat, path[item].lng));
            }*/
            runSnapToRoad(path, google, map);
            /*nearesPath = getPolilynePath(path, nearesPath, new google.maps.LatLng(graph.grid[0][0].lat, graph.grid[0][0].lng), new google.maps.LatLng(graph.grid[0][22].lat, graph.grid[0][22].lng));
            nearesPath.setMap(map);
*/


            for(var item in path){
              //console.log("[" + path[item].lat + ", " + path[item].lng + "]");
              var markerL1 = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29),
                label: "[" + path[item].x + ", " + path[item].y + "]",
              });
              markerL1.setPosition(new google.maps.LatLng(path[item].lat, path[item].lng));
            }
            /*for(var i = 0; i<=2; i++ ){
              //console.log(nearestArray[i]);
              var markerNear = new google.maps.Marker({
                  position: nearestArray[i].point,
                  title: nearestArray[i].name
              });
                markerNear.setMap(map);
            }*/
            //  });

          infowindow.close();
          marker.setVisible(false);
          var dict = [];


          //console.log(myParser.docs[0].markers[0].position.lat());

          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          //var origin_place = place;
          //console.log(google.maps.geometry.poly.isLocationOnEdge(place.geometry.location, polyline, 1));
          /*dict.push({
            key:   "keyName",
            value: "the value"
          });*/
          // calculate nearest stations

          //get distance in meters
          /*for(var station in stations ){
            var distance = getDistance(station, place.geometry.location);
            dict.push({
              key:   place.name,
              value: distance
            });
          }
*/
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);

          /*parse(function(myParser){
            console.log(myParser);
              var nearestArray = getNearestPointXml(myParser, place.geometry.location);

              for(var i = 0; i<=2; i++ ){
                console.log(nearestArray[i]);
                var markerNear = new google.maps.Marker({
                    position: nearestArray[i].point,
                    title: nearestArray[i].distance.toString()
                });
                  markerNear.setMap(map);
              };

          });*/

        });

        autocomplete_destination.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete_destination.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);
        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        /*function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
          });
        }*/

        /*setupClickListener('changetype-all', []);*/
        /*setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);*/


      }

