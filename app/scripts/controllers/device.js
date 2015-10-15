'use strict';

angular.module('phantGraph')
    .controller('DeviceCtrl',[ '$scope', '$routeParams', 'devicesServices', 'devices', function( $scope , $routeParams, devicesServices, devices ) {

        $scope.devicesList = devices.data;
        $scope.device      = {};
        $scope.config      = []; //This is used to hold data
        $scope.newPropName = "";
        $scope.newPropValue= "";
        
        $scope.$back = function() { 
            window.history.back();
        };
        
        
        var addProp = false;
                        
        $scope.cfgprops  = { name:'', value:'' };
        
        // Get the device ID from the URL.
        var deviceID = $routeParams.deviceID; 
        for( var i = 0 ; i < $scope.devicesList.length ; i++ ) {
            if ( $scope.devicesList[i].deviceid == deviceID ) {
                // Found the device
                $scope.device = $scope.devicesList[i];
                $scope.config = angular.fromJson($scope.devicesList[i].data);
                                
            }
        }

        function addCfg( name, value ) {
            addProp = true ;   // To avoid the increment of cfgsn because saveDeviceCfg is also called.
            var cfg = {};
            cfg[name] = value;
            $scope.config.push( cfg );  // Push { name : value }
            
            console.log("cfg: " + JSON.stringify( $scope.config ) );
           
        }
        
        function deleteCfg( index ) {
                $scope.config.splice( index , 1 );

        }
      
        
        function saveDeviceCfg() {
            
            if ( addProp == true ) {
                addProp = false;
                return;
            }
            
            $scope.device.data = angular.toJson( $scope.config );
            
            if ( addProp == false ) {
                // Increment the serial configuration serial number
                $scope.device.cfgsn++;
                addProp = false;
            }

            console.log("Data to be saved: " + JSON.stringify( $scope.device ) );
            devicesServices.update( $scope.device.deviceid , $scope.device );
            console.log("Device configuration saved.");
        }
    
    
        $scope.saveDeviceCfg = saveDeviceCfg;
        $scope.addCfg    = addCfg;
        $scope.deleteCfg = deleteCfg;
        
    }]);

