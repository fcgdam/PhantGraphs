'use strict';

angular.module('phantGraph')
    .controller('DevicesCtrl',[ '$scope', 'devices', function( $scope , devices ) {
       
        $scope.devicesList = devices.data;
        
        //console.log(JSON.stringify(devices.data));

        function lastSeen( field , minutes ) {
            
            var devtime = Math.floor(new Date( field ).getTime()/1000);
            var range   = Math.floor(new Date().getTime()/1000) - (minutes * 60); 
           
            return ( devtime > range );
            
        }
        
        $scope.lastSeen = lastSeen;
        
    }]);
    