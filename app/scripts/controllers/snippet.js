'use strict';

angular.module('phantGraph')
	.controller('ConfigCtrl',["$scope","phantServerServices", function($scope,phantServerServices) {
            var config = this;
            
            function getPhantServers() {
                phantServerServices.all()
                    .then( function ( result ) {
                        config.servers = result.data;
                        $scope.servers = JSON.parse(result.data);
                        console.log( result.data );
                    });
            };
            
            
            config.servers = [];
            config.getPhantServers = getPhantServers;
            getPhantServers();
            
        }] );

'use strict';

angular.module('phantGraph')
	.controller('ConfigCtrl',["$scope","phantservers", function($scope,phantservers) {
            var config = this;
            
            $scope.servers = JSON.parse(phantservers.data);

            console.log("Config Controller...");
            console.log(phantservers.data);
            
        }] );