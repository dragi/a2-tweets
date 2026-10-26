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

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	updateActivityType(tweet_array);
}

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
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});