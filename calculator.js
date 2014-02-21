(function() {
	var input = document.getElementById("kml-file");
	input.addEventListener('change', function(evt) {
		var file = input.files[0];

		var reader = new FileReader();

		// If we use onloadend, we need to check the readyState.
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				var result = evt.target.result;
				var re = /<gx:coord>([0-9.]+)\s([0-9.]+)/gi;
				var coords;
				var prevCoords;
				var distance = 0;
				var points = 1;
				while( (coords = re.exec(result)) !== null ) {
					if( !prevCoords ) {
						prevCoords = coords;
						continue;
					}

					if( coords[1] != prevCoords[1] && coords[2] != prevCoords[2] ) {
						var x_sqrd = Math.pow(Math.abs(coords[1] - prevCoords[1]), 2);
						var y_sqrd = Math.pow(Math.abs(coords[2] - prevCoords[2]), 2);
						distance += Math.sqrt(x_sqrd + y_sqrd);
					}

					++points;
					prevCoords = coords;
				}

				document.getElementById("result").innerHTML = (distance * 85.28).toFixed(2);
				document.getElementById("points").innerHTML = points;
				input.value = '';
			}
		};

		reader.readAsBinaryString(file);
	});
})();