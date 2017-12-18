var AppModule = (function () {
	var shared = {}

	var BASE_URL = './locator.php?';

	var markersByServiceType = {
		clinics: [],
		testing: [],
		ryanwhite: []
	};

	shared.markersByServiceType = markersByServiceType;

	function setupListeners(){
		var btn = document.querySelector('#btn');
		btn.addEventListener('click', search);
	}


	function search (evt){
		evt.preventDefault();
		var input = document.querySelector('#query');
		var query = input.value; // ZIP code

		//GoogleMapModule.recenterMapOnZip( query )

		var fetchOptions = {
			method: 'GET', 
		};
		var queryString = "zip=" + query + '&';
		queryString += 'lat=' + '&';
		queryString += 'lng=' + '&';
		queryString += '&distance=10';


		fetch(BASE_URL + queryString, fetchOptions)
			.then(response => response.json())
			.then(data => addLocationsToMap(data))
	}

	function addLocationsToMap(data){
		console.log('got data', data);

		GoogleMapModule.removeMarkers();


		// loop through the services array (in the data)
		var services = data.services;

		var resultEl = document.querySelector('.results');

		while (resultEl.hasChildNodes()){
			resultEl.removeChild(resultEl.lastChild);
		}

		for (var i = 0; i < services.length; i++) {
			//for each of the services you'll loop through the providers array
			var providers = services[i].providers;
			console.log("looping through " + services[i].serviceType + " providers");
			var serviceTypeIcon = "img/" + services[i].serviceType + ".png";

			for (var j = 0; j < providers.length; j++) {
				var provider = providers[j]

				//for each of the providers grab, name, coordinates, telephone info, to put in the info window of the Marker
				var markerData = {};
				markerData.coordinates = {
					lat: parseFloat(provider.point.lat), 
					lng: parseFloat(provider.point.long)
				}

				

				markerData.content = 
				`<div class="marker-content">
					<li><a href="${provider.link}" target="_blank" id="title">${provider.title}</a></li>
					</br>
					<li><a href="http://google.com/search?q=${provider.streetAddress}, ${provider.region} ,${provider.postalCode}" target="_blank" id="address">${provider.streetAddress}, ${provider.region}, ${provider.postalCode}</a></li>
					</br>
					<li><a href"" target="_blank">Contact: ${provider.telephone}</a></li>
				</div>`;


				markerData.icon = serviceTypeIcon;

				

				var li = document.createElement("li");
				li.innerHTML = markerData.content;

				resultEl.appendChild(li);

				var createdMarker = GoogleMapModule.createMarker(markerData);
				markersByServiceType[ services[i].serviceType ].push(createdMarker);


			}
		}
	}



	function setMapOnAll(map, type) {
		console.log(map);
		       for (var i = 0; i < markersByServiceType[type].length; i++) {
		         markersByServiceType[type][i].setMap(map);
		       }
	}

	shared.setMapOnAll = setMapOnAll;

	var checkbox = document.querySelectorAll(".checkbox"); 	//add checkbox if statement
	for (var i = checkbox.length - 1; i >= 0; i--) {
		checkbox[i].addEventListener('change', function(e) {

			if(e.target.classList.contains('checkbox')) {
		     	if(e.target.checked) {
		     		setMapOnAll(GoogleMapModule.map, e.target.id)
		     	} else {
		     		setMapOnAll(null, e.target.id)
		     	}
			};
		});
	}

	function init () {
		setupListeners();
		coordinates = GoogleMapModule.startingPoint;
		console.log ('coordinates', coordinates);
	}

	shared.init = init

	return shared
}())

window.onload = function(){
	AppModule.init();
};

// // Adds a marker to the map and push to the array.
// function addMarker(location) {
//   var marker = new google.maps.Marker({
//     position: location,
//     map: map
//   });
//   markers.push(marker);
// }

// // Sets the map on all markers in the array.
// function setMapOnAll(map) {
//   for (var i = 0; i < markers.length; i++) {
//     markers[i].setMap(map);
//   }
// }

// // Removes the markers from the map, but keeps them in the array.
// function clearMarkers() {
//   setMapOnAll(null);
// }

// // Shows any markers currently in the array.
// function showMarkers() {
//   setMapOnAll(map);
// }

// // Deletes all markers in the array by removing references to them.
// function deleteMarkers() {
//   clearMarkers();
//   markers = [];
// }