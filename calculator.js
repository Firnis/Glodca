(function() {
	var input = document.getElementById("kml-file");

	var reader = new FileReader();

	input.addEventListener('change', function(evt) {

		var points 		= 0;
		var distance 	= 0;

		if(reader.readyState == reader.LOADING) {
			reader.abort();
		}

		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) {
				var data = evt.target.result;

				var reResult;
				var prevCoords;

				// starting point
				points++;

				var re = /<gx:coord>([^<]+)/gi;

				while( (reResult = re.exec(data)) !== null ) {

					var coords = reResult[1].split(' ');

					if( !prevCoords ) {
						prevCoords = coords;
						continue;
					}

					var lat1 = prevCoords[0],
						lng1 = prevCoords[1],
						lat2 = coords[0],
						lng2 = coords[1];

					// skip repeated coordinates.
					if( lat1 != lat2 && lng1 != lng2 ) {

						distance += getDistance(lat1, lat2, lng1, lng2);

						points++;
					}

					prevCoords = coords;
				}

				readNextFile() || renderResult(distance, points);
			}
		};

		var readNextFile = (function(reader, files) {
			var counter = 0;
			var length  = files.length;

			return function() {
				if( counter < length ) {
					reader.readAsBinaryString( files[counter] );
					counter++;

					return true;
				}
				
				return false;
			}
		})(reader, input.files);

		readNextFile();
	});

	function toRad(value) {
		return value * Math.PI / 180;
	}

	function renderResult(distance, points) {
		document.getElementById("kilometers").innerHTML = distance.toFixed(2);
		document.getElementById("miles").innerHTML = (distance * 0.621371).toFixed(2);
		document.getElementById("points").innerHTML = points;
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
