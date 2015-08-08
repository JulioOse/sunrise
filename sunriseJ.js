 if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(Info, errorHtml)
}
else {
	document.getElementById('content').innerHTML = '<h2>Geolocation is not supported by this browser</h2>'
}

function Info(position) {
	/* coordinates */
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	
	/* create map */
	centerOfMap = new google.maps.LatLng(lat, lon);
	function initialize() {
		var mapProp = {
			center: centerOfMap,
			zoom: 10,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
		var marker = new google.maps.Marker({position:centerOfMap, });
		marker.setMap(map);
	}
	initialize()
	
	/* ajax api call using GET */
	var baseUrl = 'http://api.sunrise-sunset.org/json?' + 'lat='+ lat + '&lng=' + lon + '&formatted=0' + '&callback=mycallback';  
	var apiCall = new XMLHttpRequest();
	apiCall.onreadystatechange = function() {
		if(apiCall.readyState === 4 && apiCall.status === 200) {
			var data = JSON.parse(apiCall.response.slice(11, -2));
			var htmlOut = ''
			for(x in data["results"]) {
				var current = new Date(data["results"][x]).toLocaleTimeString() + ' '
				x = x.replace(/_/g, ' ')
				htmlOut = htmlOut + '<h2>' + x.toUpperCase() +' - ' + current.slice(-11, -1) + '</h2>'
			}
			document.getElementById('content').innerHTML = htmlOut;
		}
	}
	apiCall.open('GET', baseUrl, true);
	apiCall.send();
	

}

function errorHtml(error) {
	var errors = { 
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  document.getElementById('content').innerHTML = "Error: " + errors[error.code];

}

