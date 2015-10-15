'use strict';

angular.module('phantGraph')
    .constant('RESTENDPOINT_URI','http://localhost:3000/api/')
    .service('phantServerServices',[ '$http', 'RESTENDPOINT_URI', function ( $http , RESTENDPOINT_URI) {
        var phantServer = this;
        
        var path = 'phantservers/';
        
        function getUrl() {
            //console.log("phantServerServices URL: " + RESTENDPOINT_URI + path );
            return RESTENDPOINT_URI + path;
        }

        function getUrlForId(itemId) {
            //console.log("URL: " + getUrl(path) + itemId );
            return getUrl(path) + itemId;
        }

        phantServer.all = function () {
            return $http.get(getUrl());
        };

        phantServer.fetch = function (itemId) {
            return $http.get(getUrlForId(itemId));
        };

        phantServer.create = function (item) {
            return $http.post(getUrl(), item);
        };

        phantServer.update = function (itemId, item) {
            return $http.put(getUrlForId(itemId), item);
        };

        phantServer.destroy = function (itemId) {
            return $http.delete(getUrlForId(itemId));
        };

    }
    ])
    .service('phantStreamsServices',[ '$http', 'RESTENDPOINT_URI', function ( $http , RESTENDPOINT_URI) {
        var phantStreams = this;
        
        var path = 'phantstreams/';
        
        function getUrl() {
            //console.log("phantServerServices URL: " + RESTENDPOINT_URI + path );
            return RESTENDPOINT_URI + path;
        }

        function getUrlForId(itemId) {
            //console.log("URL: " + getUrl(path) + itemId );
            return getUrl(path) + itemId;
        }

        phantStreams.all = function () {
            return $http.get(getUrl());
        };

        phantStreams.fetch = function (itemId) {
            return $http.get(getUrlForId(itemId));
        };

        phantStreams.create = function (item) {
            return $http.post(getUrl(), item);
        };

        phantStreams.update = function (itemId, item) {
            return $http.put(getUrlForId(itemId), item);
        };

        phantStreams.destroy = function (itemId) {
            return $http.delete(getUrlForId(itemId));
        };

    }
    ])
    .service('phantGraphsServices',[ '$http', 'RESTENDPOINT_URI', function ( $http , RESTENDPOINT_URI) {
        var phantGraphs = this;
        
        var path = 'phantgraphs/';
        
        function getUrl() {
            //console.log("phantServerServices URL: " + RESTENDPOINT_URI + path );
            return RESTENDPOINT_URI + path;
        }

        function getUrlForId(itemId) {
            //console.log("URL: " + getUrl(path) + itemId );
            return getUrl(path) + itemId;
        }

        phantGraphs.all = function () {
            return $http.get(getUrl());
        };

        phantGraphs.fetch = function (itemId) {
            return $http.get(getUrlForId(itemId));
        };

        phantGraphs.create = function (item) {
            return $http.post(getUrl(), item);
        };

        phantGraphs.update = function (itemId, item) {
            return $http.put(getUrlForId(itemId), item);
        };

        phantGraphs.destroy = function (itemId) {
            return $http.delete(getUrlForId(itemId));
        };

    }
    ])  
    .service('configServices',[ '$http', 'RESTENDPOINT_URI', function ( $http , RESTENDPOINT_URI) {
        var configServices = this;
        
        var path = 'config/';
        
        function getUrl() {
            //console.log("phantServerServices URL: " + RESTENDPOINT_URI + path );
            return RESTENDPOINT_URI + path;
        }

        function getUrlForId(itemId) {
            //console.log("URL: " + getUrl(path) + itemId );
            return getUrl(path) + itemId;
        }

        configServices.all = function () {
            return $http.get(getUrl());
        };

        configServices.fetch = function (itemId) {
            return $http.get(getUrlForId(itemId));
        };

        configServices.create = function (item) {
            return $http.post(getUrl(), item);
        };

        configServices.update = function (itemId, item) {
            return $http.put(getUrlForId(itemId), item);
        };

        configServices.destroy = function (itemId) {
            return $http.delete(getUrlForId(itemId));
        };

    }
    ])  

    .service('devicesServices',[ '$http', 'RESTENDPOINT_URI', function ( $http , RESTENDPOINT_URI) {
        var devicesServices = this;
        
        var path = 'devices/';
        
        function getUrl() {
            //console.log("phantServerServices URL: " + RESTENDPOINT_URI + path );
            return RESTENDPOINT_URI + path;
        }

        function getUrlForId(itemId) {
            //console.log("URL: " + getUrl(path) + itemId );
            return getUrl(path) + itemId;
        }

        devicesServices.all = function () {
            return $http.get(getUrl());
        };

        devicesServices.fetch = function (itemId) {
            return $http.get(getUrlForId(itemId));
        };

        devicesServices.create = function (item) {
            return $http.post(getUrl(), item);
        };

        devicesServices.update = function (itemId, item) {
            return $http.put(getUrlForId(itemId), item);
        };

        devicesServices.destroy = function (itemId) {
            return $http.delete(getUrlForId(itemId));
        };

    }
    ])      
    
    
    
    
    
    
    ;