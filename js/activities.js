function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let activityData = [];
	const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType !== "unknown") {
			activityData.push({
				activityType: tweet_array[i].activityType,
				day: daysOfWeek[tweet_array[i].time.getDay()],
				distance: tweet_array[i].distance,
				time: tweet_array[i].time
			});
		}
	}

	let topThree = updateActivityType(tweet_array);
	let topThreeNames = topThree.map(entry => entry[0]);
	let topThreeData = activityData.filter(row => topThreeNames.includes(row.activityType));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": { "field": "activityType", "type": "nominal", "title": "Activity type"},
	  	"y": { "aggregate": "count", "type": "quantitative", "title": "Number of tweets"},
	  }
	};

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	week_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the three most-tweeted activities by day of the week.",
	  "data": {
	    "values": topThreeData
	  },
	  //TODO: Add mark and encoding
	  "mark": "point",
	  "encoding": {
		"x": { "field": "day", "type": "ordinal", "sort": daysOfWeek, "title": "Time (day)"},
	  	"y": { "field": "distance", "type": "quantitative", "title": "Distance (miles)" },
		"color": { "field": "activityType", "type": "nominal", "title": "Activity type" }
		}
	};

	aggregated_week_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the three most-tweeted activities by day of the week.",
	  "data": {
	    "values": topThreeData
	  },
	  //TODO: Add mark and encoding
	  "mark": "point",
	  "encoding": {
		"x": { "field": "day", "type": "ordinal", "sort": daysOfWeek, "title": "Time (day)"},
	  	"y": { "field": "distance", "aggregate": "mean", "type": "quantitative", "title": "Mean of distance (miles)" },
		"color": { "field": "activityType", "type": "nominal", "title": "Activity type" }
		}
	};
	

	document.getElementById('distanceVisAggregated').style.display = "none";

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	vegaEmbed('#distanceVis', week_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', aggregated_week_vis_spec, {actions:false});

	// Toggle between the full and aggregated charts when the button is pressed
	document.getElementById('aggregate').addEventListener('click', function() {
		let full = document.getElementById('distanceVis');
		let aggregated = document.getElementById('distanceVisAggregated');
		if (full.style.display === "none") {
			full.style.display = "block";
			aggregated.style.display = "none";
			this.innerText = "Show means";
		} else {
			full.style.display = "none";
			aggregated.style.display = "block";
			this.innerText = "Show all activities";
		}
	});
}

// Finds the first, second, and third most popular activities, their distances, and weekday/weekend counts
function updateActivityType(tweet_array) {
	const activityTypes = new Map();
	const activityDistances = new Map();
	let weekdayDistance = 0;
	let weekdayCount = 0;
	let weekendDistance = 0;
	let weekendCount = 0;

	for (let i = 0; i < tweet_array.length; i++) {
		let activity = tweet_array[i].activityType;
		if (activity === "unknown") {
			continue;
		}
		activityTypes.set(activity, (activityTypes.get(activity) || 0) + 1);
		activityDistances.set(activity, (activityDistances.get(activity) || 0) + tweet_array[i].distance);

		let day = tweet_array[i].time.getDay();
		if (day === 0 || day === 6) {
			weekendDistance += tweet_array[i].distance;
			weekendCount++;
		} else {
			weekdayDistance += tweet_array[i].distance;
			weekdayCount++;
		}
	}

	const avgDistances = new Map();
	for (const [activity, distance] of activityDistances) {
		avgDistances.set(activity, distance / activityTypes.get(activity));
	}

	const topThree = [...activityTypes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
	const topThreeByDistance = topThree.map(entry => [entry[0], avgDistances.get(entry[0])]).sort((a, b) => b[1] - a[1]);

	let weekdayAvg = weekdayDistance / weekdayCount;
	let weekendAvg = weekendDistance / weekendCount;
	
	document.getElementById('numberActivities').innerText = activityTypes.size;
	document.getElementById('firstMost').innerText = topThree[0][0];
	document.getElementById('secondMost').innerText = topThree[1][0];
	document.getElementById('thirdMost').innerText = topThree[2][0];
	document.getElementById('longestActivityType').innerText = topThreeByDistance[0][0];
	document.getElementById('shortestActivityType').innerText = topThreeByDistance.at(-1)[0];
	document.getElementById('weekdayOrWeekendLonger').innerText = weekdayAvg > weekendAvg ? "weekdays" : "weekends";

	return topThree;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});