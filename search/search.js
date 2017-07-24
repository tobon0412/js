var directionsDisplay = null;
var directionsService = null;
var map = null;
var start = '';
var end = '';
var markers = [];
var polyline = null;
var myOriginLatLng = null;
var myDestinationLatLng = null;
var tips = null;
var default_message = "Use cinturon de seguridad.";
var placeSearch, autocomplete_origen, autocomplete_destino;
/*var componentForm = {
  administrative_area_level_1: 'short_name'
};

var styles = [
    {
      featureType: "all",
      stylers: [
        { hue: "#15B9FD" },
        { saturation: -90 },
        { lightness: 0 }
      ]
    }
];
*/
//Function after load google api
function initAutocomplete() {
  var myLatlng = new google.maps.LatLng(19.42847, -99.12766);

  var myOptions = {
      zoom: 12,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map'), myOptions);

  //map.setOptions({styles: styles});

 /* directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
*/

  autocomplete_origen = new google.maps.places.Autocomplete(document.getElementById('origen'));
 //   {types: ['geocode']});

  autocomplete_destino = new google.maps.places.Autocomplete(document.getElementById('destino'));
  //  {types: ['geocode']});

  autocomplete_origen.bindTo('bounds', map);
  autocomplete_destino.bindTo('bounds', map);

}



  /*autocomplete_origen.addListener('place_changed', getOrigin);
  autocomplete_destino.addListener('place_changed', fillInAddress);*/


  //Check if the user has saved path
  /*if($('#origin_session').val() != "" & $('#destination_session').val() != ""){
            myOriginLatLng = $('#origin_session').text();
            myDestinationLatLng = $('#destination_session').text();
            tracePath();
  }*/
  /*else{
    $.unblockUI();
  }*/

/*  if (document.addEventListener) {
        document.addEventListener("click", handleClick, false);
      }
  else if (document.attachEvent) {
        document.attachEvent("onclick", handleClick);
  }*/


  /*$("#clean_map").on('click', function($event){
      $event.preventDefault();
      clean_map();
  });*/

  //Add event to buttos with name "blockui"
 /* function handleClick(event) {
    event = event || window.event;
    event.target = event.target || event.srcElement;

    var element = event.target;

    // Climb up the document tree from the target of the event
    while (element) {
        if (element.nodeName === "BUTTON" && /blockui/.test(element.name)) {
            // The user clicked on a <button> or clicked on an element inside a <button>
            // with a name called "blockui"
            validate_data_modal(element.id, element.title);
            break;
        }
        element = element.parentNode;
    }
  }*/
// }
