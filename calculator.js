(function() {
	var input = document.getElementById("kml-file");

	input.addEventListener('change', function(evt) {

		var reader = new FileReader();

		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) {
				var result = evt.target.result;

				var re = /<gx:coord>([0-9.]+)\s([0-9.]+)/gi;

				var coords;
				var prevCoords;

				var points 		= 1;
				var distance 	= 0;

				while( (coords = re.exec(result)) !== null ) {
					if( !prevCoords ) {
						prevCoords = coords;
						continue;
					}

					var lat1 = prevCoords[1],
						lng1 = prevCoords[2],
						lat2 = coords[1],
						lng2 = coords[2];

					// skip repeated coordinates.
					if( lat1 != lat2 && lng1 != lng2 ) {

						distance += getDistance(lat1, lat2, lng1, lng2);

					}

					++points;
					prevCoords = coords;
				}

				// Render result
				document.getElementById("result").innerHTML = distance.toFixed(2);
				document.getElementById("points").innerHTML = points;

				// reset input value
				input.value = '';
			}
		};

		reader.readAsBinaryString( input.files[0] );
	});

	function toRad(value) {
		return value * Math.PI / 180;
	}

	// "haversine" formula. http://www.movable-type.co.uk/scripts/latlong.html
	function getDistance(lat1, lat2, lng1, lng2) {
		var earthRadius = 6371; // km
		var dLat = toRad(lat2-lat1);
		var dLon = toRad(lng2-lng1);
		var lat1 = toRad(lat1);
		var lat2 = toRad(lat2);

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

		var d = earthRadius * c;

		return d;
	}

})();
