(function() {
    'use strict';
    
    angular.module('twitterApp').factory('dictionaryService', function($http, $q){
        return {
            
            tokenizeTweet: function(tweet){
                console.log(tweet);
                if(tweet){
                    return(tweet.split(" "));
                }    
            },
            matchInEnglishDictionary: function(word){
                var deferred = $q.defer();
                $http.get("https://owlbot.info/api/v2/dictionary/" + word)
                        .then(function(success){
                          //  console.log(word + " was found!");
                            deferred.resolve(success.data.length);
                        }, (function(error){
//                            console.log(word + " was not found :(");
                           // deferred.reject(error);
                        }));
                return deferred.promise;
            }
        };
    });
})();
