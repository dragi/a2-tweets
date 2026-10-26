class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just posted") || this.text.startsWith("Just completed")) {
            return "completed_event";
        } else if (this.text.startsWith("Watch")) {
            return "live_event";
        } else if (this.text.startsWith("Achieved") || this.text.includes("I just set a goal")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source !== "completed_event") {
           return false;
        }
        
        let linkIndex = this.text.indexOf("https://");
        let stripped = this.text;
        
        if (linkIndex != -1) {
            stripped = this.text.slice(0, linkIndex);
        }

        stripped = stripped.trim();
        return !stripped.endsWith("Check it out!");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        
        let startIndex = this.text.indexOf(" - ") + 3;
        let endIndex = this.text.indexOf("https://");
        if (endIndex === -1) {
            endIndex = this.text.length;
        }

        return this.text.slice(startIndex, endIndex).trim();
    }

    get activityType(): string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        let words = this.text.split(" ");
        if (words[4] !== "mi" && words[4] !== "km") {
            return "unknown";
        }
        return words[5];
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        let words = this.text.split(" ");
        if (words[4] === "mi") {
            return parseFloat(words[3]);
        } else if (words[4] === "km") {
            return parseFloat(words[3]) / 1.609;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}