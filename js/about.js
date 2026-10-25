function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	updateDates(tweet_array);
	updateCategories(tweet_array);
	updateUserWritten(tweet_array);

	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
}

function updateDates(tweet_array) {
	let min = tweet_array[0].time;
	let max = tweet_array[0].time;

	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].time < min) {
			min = tweet_array[i].time;
		}
		if (tweet_array[i].time > max) {
			max = tweet_array[i].time;
		}
	}

	const options = { 
  		weekday: 'long', 
  		year: 'numeric', 
  		month: 'long', 
  		day: 'numeric' 
	};

	document.getElementById('firstDate').innerText = min.toLocaleDateString('en-US', options);
	document.getElementById('lastDate').innerText = max.toLocaleDateString('en-US', options);	
}

function updateCategories(tweet_array) {
	let live_event = 0;
	let achievement = 0;
	let completed_event = 0;
	let miscellaneous = 0;

	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == "live_event") {
			live_event++;
		} else if (tweet_array[i].source == "achievement") {
			achievement++;
		} else if (tweet_array[i].source == "completed_event") {
			completed_event++;
		} else {
			miscellaneous++;
		}
	}

	setClassText('completedEvents', completed_event);
	setClassText('completedEventsPct', formatPct(completed_event, tweet_array.length));
	setClassText('liveEvents', live_event);
	setClassText('liveEventsPct', formatPct(live_event, tweet_array.length));
	setClassText('achievements', achievement);
	setClassText('achievementsPct', formatPct(achievement, tweet_array.length));
	setClassText('miscellaneous', miscellaneous);
	setClassText('miscellaneousPct', formatPct(miscellaneous, tweet_array.length));
}

function setClassText(className, value) {
	document.querySelectorAll('.' + className).forEach(el => el.innerText = value);
}

function formatPct(count, total) {
	return math.format(count / total * 100, { notation: 'fixed', precision: 2 }) + '%';
}

function updateUserWritten(tweet_array) {
	let completedTweets = 0;
	let userWrittenTweets = 0;
	
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source === "completed_event") {
			completedTweets++;
			if (tweet_array[i].written) {
				userWrittenTweets++;
			}
		}
	}

	setClassText('written', userWrittenTweets);
	setClassText('writtenPct', formatPct(userWrittenTweets, completedTweets));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});