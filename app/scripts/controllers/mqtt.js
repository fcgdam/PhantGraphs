"use strict";

angular.module("phantGraph")
    .controller("MqttCtrl", ["$scope" , "configuration" , function( $scope , configuration ) {
        
        $scope.alerts = [];
        $scope.mqtt   = "";

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

        
        var config        = JSON.parse( configuration.data.data );  // Configuration data that comes from the REST server
        var brokerAddress = config.broker;
        var brokerPort    = parseInt(config.port);
        var topics        = [];
        topics            = config.topics;

        for ( var i = 0 ;  i < topics.length ; i++ )
                console.log("Topic subscribed: " + topics[i] );        
        
        var client;
        var connectTimeout   = 3; /* secs */
        var reconnectTimeout = 5000; /* msecs */
        var path             = "/";
        
        function addText(text) {
            var obj = document.getElementById("mqtt");
            var txt = document.createTextNode(text);
            obj.appendChild(txt);
        }
        
        function mqttConnect() {
            var wsID = "phantGraph-mqtt-" + Date.now();
            
            client = new Paho.MQTT.Client(brokerAddress, brokerPort, path, wsID);
            var options = {
                timeout: connectTimeout,
                onSuccess: onConnect,
                onFailure: function(msg) {
                    pushError(msg.errorMessage);
                    setTimeout(mqttConnect, reconnectTimeout);
                }
            };
            client.onConnectionLost = onConnectionLost;
            client.onMessageArrived = onMessageArrived;
            client.connect(options);
            
            $scope.mqtt="";
            addText("Connecting to: " + brokerAddress + ":" + config.port + "... ") ;
            
        }
        
        function onConnect() {
            addText( " -> Connected to MQTT broker via WebSockets transport.\n");
            addText( "Subscribing to topics: \n" );
            for ( var i = 0 ;  i < topics.length ; i++ ) {
                client.subscribe(topics[i]);
                addText( "  -> " + topics[i] + "\n");
            }
            addText("\nReady!\n");
        }
        
        function onConnectionLost(msg) {
            if (msg.errorCode !== 0) pushError(msg.errorMessage);
            setTimeout(mqttConnect, reconnectTimeout);
        }
        
        function onMessageArrived(msg) {
            // Messages are added to the top due to the scroll bars.
            $scope.mqtt = Math.floor(Date.now() / 1000 ) + ": "
                + msg.destinationName + " ~> "
                + msg.payloadString + "\n"
                + $scope.mqtt;
            $scope.$apply();
        }

        mqttConnect();

}]);


