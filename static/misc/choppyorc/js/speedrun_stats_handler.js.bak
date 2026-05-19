_speedrunStatsHandler = function () {
	var speedrun_stats = {
		time: null,
		loadlessTime: null,
		extraLoadTime: null,
		totalJumps: 0,
		totalAxeThrows: 0,
		totalDeaths: 0,
		levelTimes: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
		loadTimes: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
		fake: false
	}

	/*  
	Show time in m:ss.xxx format if the time is less than 10 minutes, otherwise show it in mm:ss.xxx format.
	This function assumes that no timer will be higher than 1 hour, because then it wouldn't really be a speedrun anymore.
	*/
	var getTimeWithFormat = function (timeInSeconds) {
		var minutesPosition = (timeInSeconds < 600 ? 15 : 14);
		var timeInMilliseconds = Math.round(timeInSeconds * 1000);
		return new Date(timeInMilliseconds).toISOString().slice(minutesPosition, -1);
	}

	var onNewSpeedrun = function () {
		speedrun_stats.time = 0;
		speedrun_stats.loadlessTime = 0;
		speedrun_stats.extraLoadTime = 0;
		speedrun_stats.totalJumps = 0;
		speedrun_stats.totalAxeThrows = 0;
		speedrun_stats.totalDeaths = 0;
		speedrun_stats.levelTimes = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
		speedrun_stats.loadTimes = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
		speedrun_stats.fake = false;
	}

	var onSound = function (soundName) {
		switch (soundName) {
			case "jump":
				speedrun_stats.totalJumps += 1;
				break;
			case "axethrow":
				speedrun_stats.totalAxeThrows += 1;
				break;
			case "playerdie":
				speedrun_stats.totalDeaths += 1;
				break;
		}
	}

	var onLevelEnd = function (level, levelTime) {
		speedrun_stats.time += levelTime;
		speedrun_stats.loadlessTime += levelTime;

		if (!speedrun_stats.levelTimes[level - 1])
			speedrun_stats.levelTimes[level - 1] = 0;

		speedrun_stats.levelTimes[level - 1] += levelTime;
	}

	var onTransitionEnd = function (level, transitionTime) {
		speedrun_stats.time += transitionTime;

		var levelLoadTime = 3;

		if (transitionTime <= levelLoadTime) {
			speedrun_stats.loadlessTime += transitionTime;
		} else {
			speedrun_stats.loadlessTime += levelLoadTime;
			speedrun_stats.extraLoadTime += transitionTime - levelLoadTime;
		}

		if (!speedrun_stats.loadTimes[level - 1])
			speedrun_stats.loadTimes[level - 1] = 0;

		speedrun_stats.loadTimes[level - 1] += transitionTime;
	}

	var displaySpeedrunStats = function () {
		$("#speedrun_time_stat").text(speedrun_stats.time ? getTimeWithFormat(parseFloat(speedrun_stats.time.toFixed(3))) : "---");
		$("#loadless_time_stat").text(speedrun_stats.loadlessTime ? getTimeWithFormat(parseFloat(speedrun_stats.loadlessTime.toFixed(3))) : "---");

		$("#total_deaths_stat").text(speedrun_stats.totalDeaths);
		$("#total_jumps_stat").text(speedrun_stats.totalJumps);
		$("#total_axethrows_stat").text(speedrun_stats.totalAxeThrows);

		$("#extra_load_time_stat").text(speedrun_stats.extraLoadTime ? speedrun_stats.extraLoadTime.toFixed(3) : "---");

		for (var level = 1; level <= 15; level++) {
			var currentLevelTime = speedrun_stats.levelTimes[level - 1];
			var currentLevelLoadTime = speedrun_stats.loadTimes[level - 1];
			var $levelTimeElement = $("[data-stat-level='" + level + "']", "#extra_speedrun_stats");

			if (!currentLevelTime) {
				speedrun_stats.fake = true;
				$levelTimeElement.text("---");
			} else {
				$levelTimeElement.text(currentLevelTime.toFixed(2));
			}

			if (!currentLevelLoadTime || currentLevelLoadTime < 2.98) {
				speedrun_stats.fake = true;
			}
		}

		if (speedrun_stats.fake) {
			$("#speedrun_stats").addClass("fake-speedrun");
			$("#extra_speedrun_stats").addClass("fake-speedrun");
			$("#speedrun_stats_title").text("Last FAKE speedrun");
		} else {
			$("#speedrun_stats").removeClass("fake-speedrun");
			$("#extra_speedrun_stats").removeClass("fake-speedrun");
			$("#speedrun_stats_title").text("Last speedrun");

			if (TAS_MODE) {
				$("#speedrun_stats_title").text("TAS");
			}
		}
	}

	return {
		onNewSpeedrun: onNewSpeedrun,
		onSound: onSound,
		onLevelEnd: onLevelEnd,
		onTransitionEnd: onTransitionEnd,
		getSpeedrunStats: function () {
			return speedrun_stats;
		},
		displaySpeedrunStats: displaySpeedrunStats
	}
}();