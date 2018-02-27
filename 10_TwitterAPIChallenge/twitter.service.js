(function() {
    'use strict';
    
    angular.module('twitterApp').factory('twitterService', function($q){
        var authorizationResult = false;

        return {
            initialize: function(){
                OAuth.initialize('5J6n2E3jTU9BR3vY32-WVwq6Atw', {
                    cache: true
                });
                
                authorizationResult = OAuth.create('twitter');
            },
            isReady: function() {
                    return (authorizationResult);
            },
            connectTwitter: function() {
                var deferred = $q.defer();
                OAuth.popup('twitter', {
                    cache: true
                }, function(error, result){
                    if(!error) {
                            authorizationResult = result;
                            deferred.resolve();
                    }else{
                        //error out
                    }
                });
                return deferred.promise;
            },
            clearCache: function() {
                OAuth.clearCache('twitter');
                authorizationResult = false;
            },
            getTweetsByUsername: function(username){
                var deferred = $q.defer();
                var url ='';
                if (username) {
                    url = '/1.1/search/tweets.json?q=%40' + username + "&count=5";
                    //url = '/1.1/search/tweets.json?q=from%3A' + username + "&count=5";
                
                console.log(url);
                var promise = authorizationResult.get(url).done(function(data){
                    deferred.resolve(data);
                    console.log(data);
                }).fail(function(err){
                    deferred.reject(err);
                });
            }
                return deferred.promise;
            }
        }
    });
    
})();
