(function() {
    'use strict';
    
    angular.module('twitterApp').component('twitterView', {
        controllerAs: 'vm',
        controller: function(twitterService,dictionaryService,$q){
            var vm = this; 
            
            twitterService.initialize();
            
            vm.refreshTimeline = function() {
                vm.tweets = [];
                if(vm.userName){
                    twitterService.getTweetsByUsername(vm.userName).then(function(data){
                       //vm.analyzeTweetsForEnglishWords(data.statuses);
                       vm.tweets = vm.tweets.concat(data.statuses);
                    }, function() {
                        vm.rateLimitError = true;
                    });
                }
            }
            
            vm.analyzeTweetsForEnglishWords = function(tweets) {  
                var tokenizedTweet = [];
                vm.wordPromises = [];
                vm.tweetsArr = []; // Array of {"tweet": {}, "enWordCount": 0}
                tweets.forEach(function(tweet){
                    tokenizedTweet = dictionaryService.tokenizeTweet(tweet.text);
                    vm.enWordCount = 0;
                    tokenizedTweet.forEach(function(word){
                        vm.wordPromises.push(dictionaryService.matchInEnglishDictionary(word));
                    });
                    
                    $q.all(vm.wordPromises).then(function(success){
                            console.log("Success values! "  + success);
                            
                    }, function(error){
                            console.log("ERROR");
                    });
                    vm.tweetsArr.push({"tweet": tweet, "enWordCount": vm.enWordCount});
                });
            }
            
            vm.connectButton = function() {
                console.log("Button was clicked!")
                twitterService.connectTwitter().then(function() {
                    if(twitterService.isReady()){
                        $('#connectButton').fadeOut(function(){
                            $('#getTimelineButton, #signOut, #searchButton, #searchBox').fadeIn();
                            vm.refreshTimeline();
                        });
                        
                    } else {
                        //do something?
                    }
                });
            }
            
            vm.signOut = function() {
                twitterService.clearCache();
                vm.tweets.length = 0;
                $('#getTimelineButton, #signOut, #searchButton, #searchBox').fadeOut(function() {
                    $('#connectButton').fadeIn();
                });
            }
//            
            if (twitterService.isReady()){
                $('#connectButton').hide();
                $('#getTimelineButton, #signOut, #searchButton, #searchBox').show();
                console.log("Ready!");
            }
            
//            vm.$onInit = function(){
//                console.log("Hello world!");
//                vm.hello="Helloooo!";
//            }
         
        },
        templateUrl: 'twitter-view.component.html'
    
    });

})();


