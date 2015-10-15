'use strict';

angular.module('phantGraph')
    .service('phantApiServices',[ '$http', function ( $http ) {

        var phantApi = this;
        
        phantApi.streamInfo = function( URL , key ) {
            var url = URL + "/output/" + key + "/latest.json";
            //console.log("Get stream Info for: " + url );
            return $http.get(url);    
        }
        
        phantApi.streamLastData = function( URL , key ) {
            var url = URL + "/output/" + key + "/latest.json";
            //console.log("Get stream Info for: " + url );
            return $http.get(url);    
        }
        
        phantApi.streamData = function( URL , key , datapoints ) {
            var url = URL + "/output/" + key + ".json";
            //console.log("Get stream Data for: " + url );
            return $http.get(url , { params: {  limit:datapoints } });
        }

}]);