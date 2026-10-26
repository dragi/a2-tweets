let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			writtenTweets.push(tweet_array[i]);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchBox = document.getElementById('textFilter');
	const table = document.getElementById('tweetTable');

	searchBox.addEventListener('input', function() {
		const query = searchBox.value.trim();

		if (query === "") {
			table.innerHTML = "";
			document.getElementById('searchCount').innerText = 0;
			document.getElementById('searchText').innerText = "";
			return;
		}

		let rows = "";
		let rowNumber = 1;
		for (let i = 0; i < writtenTweets.length; i++) {
			if (writtenTweets[i].text.toLowerCase().includes(query.toLowerCase())) {
				rows += writtenTweets[i].getHTMLTableRow(rowNumber);
				rowNumber++;
			}
		}
		table.innerHTML = rows;
		document.getElementById('searchCount').innerText = rowNumber - 1;
		document.getElementById('searchText').innerText = query;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});