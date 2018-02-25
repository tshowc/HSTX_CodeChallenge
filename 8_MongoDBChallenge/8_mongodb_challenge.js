//Query the database: trends, collection: wordstore
//Run using mongo localhost:27012/trends 8_mongodb_challenge.js

var WordsMapReduce = {

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


	getFrequentWordOverall: function() {
		db.wordstorage.mapReduce(this.map, this.reduce, {out: "overall_word_count"});
		var cursor = db.overall_word_count.find().sort({value:-1}).limit(1);
		//var cursor = db.overall_word_count.find();
		if(cursor.hasNext()){
			var mostFrequentOverall = cursor.next();
			print("The most frequent word in the entire dataset is " + mostFrequentOverall._id + " appearing " + mostFrequentOverall.value + ((mostFrequentOverall.value != 1) ? " times." : "time."));
		}
	}

};


WordsMapReduce.getFrequentWordOverall();




