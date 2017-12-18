var GoogleMapModule = (function() {
	var shared = {};

	var map;
	var infowindow;
	var startingPoint = {lat: 33.813245, lng: -84.362171};
	shared.startingPoint = startingPoint; 
	var markers = [];

	function placeResults(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {

          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
	}

	function createMarker(place) {
		var marker = new google.maps.Marker({
			map: map,
			position: place.coordinates,
			icon: place.icon
		});

		marker.addListener('click', function() {
			infowindow.setContent(place.content);
			infowindow.open(map, marker);
		})

		markers.push(marker);

		bounds.extend(place.coordinates);
		map.fitBounds(bounds);

		return marker;
	}

	shared.createMarker = createMarker;

	function removeMarkers(place){
		bounds = new google.maps.LatLngBounds();

		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	}

	shared.removeMarkers = removeMarkers

	// Call GoogleMapModule.searchForPlaces(term) to put places on map.

	function searchForPlaces(term, radius) {
		var r = radius || 500;
		var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: startingPoint,
          radius: r,
          keyword: term
        }, placeResults);
	}

	shared.searchForPlaces = searchForPlaces;
	
	function initMap() {
	   map = new google.maps.Map(document.getElementById('map'), {
	     center: startingPoint,
	     zoom: 14
	   });

	   infowindow = new google.maps.InfoWindow();

	   removeMarkers();

	   function getUsersMap_Success(position) {
	   		successStartingPoint = {lat: position.coords.latitude, lng: position.coords.longitude};
	   		map.setCenter(successStartingPoint);

	   		var userMarkerData = {};
	   		userMarkerData.coordinates = successStartingPoint;

	   		userMarkerData.content= '<h1>You are here</h1>';

	   		createMarker(userMarkerData);

	   		map.setZoom(12);
	   }

	   function getUsersMap_Error() {
	   		var defaultMarkerData = {};
	   		defaultMarkerData.coordinates = startingPoint;
	
	   		defaultMarkerData.content= '<h1>This HIV Locator was made at The Creative Circus in Atlanta, GA</h1>';
	
	   		createMarker(defaultMarkerData);       
	   }

	   navigator.geolocation.getCurrentPosition(getUsersMap_Success, getUsersMap_Error);
	   
	   shared.map = map;
	}

	shared.init = initMap;

	return shared;
}());
