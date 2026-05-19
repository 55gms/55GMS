_wrs = (function(){
	var wrs = [
		"3.09",		// 1
		"2.75",		// 2
		"4.05",		// 3
		"3.35",		// 4
		"2.16",		// 5
		"4.86",		// 6
		"6.20",		// 7
		"3.90",		// 8
		"4.49",		// 9
		"5.67",		// 10
		"4.02",		// 11
		"3.83",		// 12
		"10.45",	// 13
		"4.93",		// 14
		"2.69",		// 15
	];
	
	var decimal_places_display = 2;
	var customTimes = null;

    return {
		// Return the WR times, or return custom times if they were set by the user
        getTimes: function() {
			if (customTimes) {
				return {"title": "Pace", "wrs": customTimes};
			}

			// There are no custom times, so just return the WR times instead
            return {"title": "WR", "wrs": wrs};
		},
		// Set new custom level times 
		setCustomTimes: function(times) {
			// Check if the given object by the user is valid - must be array
			// Also disable custom level times in TAS mode
			if (TAS_MODE || !times || !Array.isArray(times)) {
				customTimes = null;
				return;
			}
			
			// Flag to check if at least one value in the custom times is valid
			var validFlag = false;

			// Copy only the first 15 elements, any more are irrelevant
			times = times.slice(0, 15);

			for (var i = 0; i < times.length; i++) {
				levelTime = times[i];
				
				// check if the current level time is a valid number
				if (typeof(levelTime) === "number" && levelTime >= 0 && levelTime < 100){
					times[i] = levelTime.toFixed(decimal_places_display);
					validFlag = true;
				}
				// In case of invalid number, take the WR time instead
				else {
					times[i] = wrs[i];
				}
			}

			// If the length of the custom times array is less than 15, copy the rest of the WR times into it
			times = times.concat(wrs.slice(times.length));

			if (validFlag)
				customTimes = times;
			else
				customTimes = null;
		}
	};
})();