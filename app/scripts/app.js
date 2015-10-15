 
'use strict';

angular.module('phantGraph', [
    'chart.js',
    'ngRoute',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.selection'
    ])
 .config(['$routeProvider', function ($routeProvider,phantServerServices, phantStreamsServices, phantGraphsServices, configServices) {
     $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            tagName: null,
            resolve: {
                phantservers: function ( phantServerServices ) {
                    return phantServerServices.all();
                },                
                phantstreams: function ( phantStreamsServices ) {
                    return phantStreamsServices.all();
                },
                phantgraphs: function ( phantGraphsServices ) {
                    return phantGraphsServices.all();
                },
                configuration: function ( configServices ) {
                    return configServices.fetch('dash');
                }
            }             
        })
        .when('/home', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            tagName: 'home',
            resolve: {
                phantservers: function ( phantServerServices ) {
                    return phantServerServices.all();
                },                
                phantstreams: function ( phantStreamsServices ) {
                    return phantStreamsServices.all();
                },
                phantgraphs: function ( phantGraphsServices ) {
                    return phantGraphsServices.all();
                },
                configuration: function ( configServices ) {
                    return configServices.fetch('dash');
                }              
            }             
        })
        .when('/servers', {
            templateUrl: 'views/servers.html',
            controller: 'ServersCtrl',
            tagName: 'server',
            resolve: {
                phantservers: function ( phantServerServices ) {
                    return phantServerServices.all();
                }
            }
        }) 
        .when('/mqtt' , {
            templateUrl: 'views/mqtt.html',
            controller: 'MqttCtrl',
            tagName: 'mqtt',
            resolve: {
                configuration: function ( configServices ) {
                    return configServices.fetch('mqtt');
                }
            }            
        })
        .when('/streams' , {
            templateUrl: 'views/streams.html',
            controller: 'StreamsCtrl',
            tagName: 'stream',
            resolve: {
                phantservers: function ( phantServerServices ) {
                    return phantServerServices.all();
                },
                phantstreams: function ( phantStreamsServices ) {
                    return phantStreamsServices.all();
                }
            }            
        })
        .when('/graphs' , {
            templateUrl: 'views/graphs.html',
            controller: 'GraphsCtrl',
            tagName: 'graphs',
            resolve: {
                phantservers: function ( phantServerServices ) {
                    return phantServerServices.all();
                },                
                phantstreams: function ( phantStreamsServices ) {
                    return phantStreamsServices.all();
                },
                phantgraphs: function ( phantGraphsServices ) {
                    return phantGraphsServices.all();
                }              
            }              
        })
        .when('/dashboard' , {
            templateUrl: 'views/dash.html',
            controller: 'DashCtrl',
            tagName: 'dash',
            resolve: {
                configuration: function ( configServices ) {
                    return configServices.fetch('dash');
                }
            }
        })
        .when('/mqttcfg' , {
            templateUrl: 'views/mqttcfg.html',
            controller: 'MqttCfgCtrl',
            tagName: 'mqttsrv',
            resolve: {
                configuration: function ( configServices ) {
                    return configServices.fetch('mqtt');
                }
            }
        })
        .when('/devices' , {
            templateUrl: 'views/devices.html',
            controller: 'DevicesCtrl',
            tagName: 'devices',
            resolve: {
                devices: function ( devicesServices ) {
                    return devicesServices.all();
                }
            }  

        })
        .when('/device' , {
            templateUrl: 'views/device.html',
            controller: 'DeviceCtrl',
            resolve: {
                devices: function ( devicesServices ) {
                    return devicesServices.all();
                }
            }  

        })        
        .otherwise({
            redirectTo: 'views/main.html'
        });
    }])
 .run(function($rootScope, $route) {
      $rootScope.$on("$routeChangeSuccess", function(ngEvent, currRoute, prevRoute) {
      if (prevRoute && prevRoute.tagName) {
        angular.element(document).find(prevRoute.tagName)
          .parent().parent().removeClass("active");
      }

      if (currRoute && currRoute.tagName) {
        angular.element(document).find(currRoute.tagName)
          .parent().parent().addClass("active");
      }
    });
    
    $rootScope.$on('$routeChangeStart', function(e, curr, prev) { 
        if (curr.$$route && curr.$$route.resolve) {
            // Show a loading message until promises aren't resolved
            $rootScope.loadingView = true;
        }
    });
    $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) { 
        // Hide loading message
        $rootScope.loadingView = false;
    });  
      
  });
    

