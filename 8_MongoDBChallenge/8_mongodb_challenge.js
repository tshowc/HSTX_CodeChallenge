//Querying the database: trends, collection: wordstore
//Executed and tested using mongo localhost:27012/trends 8_mongodb_challenge.js

var WordAnalyzer = {

	getAllDocuments: function() {
		var cursor = db.wordstorage.find();
		if(cursor.hasNext()){
			printjson(cursor.next());
		}
	},

	map: function() {
		var wordsdata = this.words; //Array
		if(wordsdata) {
			var wordsLowerCase = wordsdata.map(function(word) {
				return word.toLowerCase();
			});
			for (var i = wordsLowerCase.length - 1; i >= 0; i--){
				if(wordsLowerCase[i]) {
					emit(wordsLowerCase[i], 1);
				}
			}
		}
	},

	reduce: function(k, v) {
		var wordCount = 0;
		v.forEach(function(v) {
			wordCount +=v;
		});
		return wordCount;
	},

	createCollectionLast24HrsWords: function(){
                var currentDate = new Date();
                var last24Hrs =  new Date((new Date().setDate(currentDate.getDate()-1)));
                db.wordstorage.aggregate([ {$match: {date: {$gte: last24Hrs, $lt:currentDate}}}, {$out: "last24hrs_words"}]);
	},

	createCollectionPrev24HrsPeriodWords: function(){
	        var currentDate = new Date();
                var last24Hrs =  new Date((new Date().setDate(currentDate.getDate()-1)));
                var prev24Hrs = new Date((new Date().setDate(last24Hrs.getDate()-1)));
		db.wordstorage.aggregate([ {$match: {date: {$gte: prev24Hrs, $lt:last24Hrs}}}, {$out: "prev24hrs_words"}]);
	},

	getFrequentWordOverall: function() {
		db.wordstorage.mapReduce(this.map, this.reduce, {out: "overall_word_count"});
		var cursor = db.overall_word_count.find().sort({value:-1}).limit(1);
		//var cursor = db.overall_word_count.find();
		if(cursor.hasNext()){
			var mostFrequentOverall = cursor.next();
			print("The most frequent word in the entire dataset is " + mostFrequentOverall._id + " appearing " + mostFrequentOverall.value + ((mostFrequentOverall.value != 1) ? " times." : "time."));
		}
	},

	getFrequentWordLast24Hrs: function() {
		this.createCollectionLast24HrsWords();
		db.last24hrs_words.mapReduce(this.map, this.reduce, {out: "last24hrs_word_count"});
		var cursor = db.last24hrs_word_count.find().sort({value:-1}).limit(1);
		if(cursor.hasNext()){
			var mostFrequentLast24Hrs = cursor.next();
			print("The most frequent word in the last 24 hours is " + mostFrequentLast24Hrs._id + " appearing " + mostFrequentLast24Hrs.value + ((mostFrequentLast24Hrs.value != 1) ? " times." : "time."));
		}	
		
	},

	getTrendingWordPast24Hrs: function() {
		this.createCollectionLast24HrsWords();
		this.createCollectionPrev24HrsPeriodWords();

		db.last24hrs_words.mapReduce(this.map, this.reduce, {out: "last24hrs_word_count"});
		db.prev24hrs_words.mapReduce(this.map, this.reduce, {out: "prev24hrs_word_count"});

		var trendingWord = {word: null, freqChange: null};
		var prev24Word = null;
		var tmpFreqChange = 0;

		db.last24hrs_word_count.find().forEach(function(last24Word){
			if(trendingWord.word === null){
				trendingWord.word = last24Word._id;
				trendingWord.freqChange =  last24Word.value;
			}
			
			prev24Word =  db.prev24hrs_word_count.findOne( {_id: last24Word._id});
			tmpFreqChange = (prev24Word) ? (last24Word.value - prev24Word.value) : last24Word.value;

			if(tmpFreqChange > trendingWord.freqChange){
				trendingWord.word = last24Word._id;
				trendingWord.freqChange = tmpFreqChange; 
			}

		});
		print("The trending word in the last 24 hrs is " + trendingWord.word + " with " + trendingWord.freqChange + " more occurrences compared to the previous 24 hour period.");
	}
	

};


WordAnalyzer.getFrequentWordOverall();
WordAnalyzer.getFrequentWordLast24Hrs();
WordAnalyzer.getTrendingWordPast24Hrs();



