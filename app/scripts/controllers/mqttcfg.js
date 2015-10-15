'use strict';

angular.module('phantGraph')
    .controller('MqttCfgCtrl',[ '$scope', 'configServices' , 'configuration', function( $scope , configServices, configuration ) {
        $scope.alerts = [];
        
        $scope.topics = [];
        
        var config = JSON.parse(configuration.data.data );  // The configuration is a Json Object inside another JSON.
        $scope.brokerAddress = config.broker;
        $scope.brokerPort    = config.port;
        $scope.topics        = config.topics;
        
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        function pushError(error) {
            $scope.alerts.push({
                type: "warning",
                msg: error
            });
            // Let's avoid too much error messages:
            if ( $scope.alerts.length > 5 )
                $scope.alerts.shift();  // Delete the top message
        };

        
        function addTopic( index ) {
            $scope.topics.push($scope.newTopic);
            
        }
        
        function deleteTopic( index ) {
                $scope.topics.splice( index , 1 );
            
        }
        
        function saveMQTTCfg( ) {
                console.log("Saving MQTT CFG...");
                var config = { broker:'' , port:'' , topics:'' };
                config.broker = $scope.brokerAddress;
                config.port   = $scope.brokerPort;
                config.topics = $scope.topics;
                
                var cfg = { data: '' };
                
                cfg.data = JSON.stringify(config);
                configServices.update( 'mqtt' , cfg );
            
        }
        
        
        $scope.addTopic    = addTopic;
        $scope.deleteTopic = deleteTopic;
        $scope.saveMQTTCfg = saveMQTTCfg;
    

    }]);