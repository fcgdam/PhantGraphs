'use strict';

angular.module('phantGraph')
	.controller('GraphsCtrl',[ '$scope', 'phantservers', 'phantstreams', 'phantgraphs', 'phantApiServices', 'phantGraphsServices', function($scope , phantservers, phantstreams, phantgraphs, phantApiServices, phantGraphsServices) {
            
            $scope.alerts = [];
                        
            $scope.serversList = phantservers.data;
            $scope.streamsList = phantstreams.data; // JSON Array with streams
            $scope.graphsList  = phantgraphs.data;
            $scope.charttypedesc = ['Line Graph' , 'Bar Graph', 'Doughnut Chart', 'Radar Chart' , 'Pie Chart' ,'Polar Chart'];

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            function pushError(error) {
                $scope.alerts.push({
                    type: "warning",
                    msg: error
                });
            };       
            
            // For debugging
            function printArray( arr ) {
                for (var  i = 0 ; i < arr.length ; i++ ) {
                    console.log("[" + i +"]= " + arr[i].rowid );
                }
            }
            
            function findByRowId(source, id) {
                for (var i = 0; i < source.length; i++) {
                    if (source[i].rowid === id) {
                        return source[i];
                    }
                }
                throw "Couldn't find object with id: " + id;
            }
            
            // Based on the Stream ID gets the server id. This is needed because the server ID on the database
            // might not match the array position
            function getStreamServer( streamID ) {
                var server = findByRowId($scope.streamsList , streamID );
                return server.serverid;
             }    
             
            function getServerName( servers , id ) {
                for ( var i = 0 ; i < servers.length ; i++ ) {
                        if ( servers[i].rowid == id ) 
                            return servers[i].name;
                }
                
            }
                    
            // Obtains the server url for the specified stream ID        
            function getStreamURL( streamID ) {
                var serverID = getStreamServer ( streamID );
                var server   = findByRowId($scope.serversList , serverID );
                return server.url;
             }            
            
             function getStreamKey( streamID ) {
                var stream = findByRowId($scope.streamsList , streamID );
                return stream.key;
             }         
             
             function getStreamName( streams , id ) {
                for ( var i = 0 ; i < streams.length ; i++ ) {
                        if ( streams[i].rowid == id ) 
                            return streams[i].name;
                }
                
             }
                                 

            function aPos( source , id ) {
                for (var i = 0; i < source.length; i++) {
                    if (source[i].rowid === id) {
                        return i;
                    }
                }
                throw "Couldn't find object with id: " + id;                
            }
            
            // Gets the Server Name and Stream name for displaying from the serverid and streamid.
            function setGraphData() {
                for ( var i = 0 ; i < $scope.graphsList.length ; i++ ) {
                    console.log("Server ID: " + $scope.graphsList[i].serverid );
                    $scope.graphsList[i].servername = getServerName( $scope.serversList , $scope.graphsList[i].serverid );
                    $scope.graphsList[i].streamname = getStreamName( $scope.streamsList , $scope.graphsList[i].streamid );
                }             
            }            
            
            
            // For each stream, query the server for the stream fields.
            function getStreamFields( streamID ) {
                var arrP;   // Variable to hold array position correspoding to streamID data.

                try {
                   
                    phantApiServices.streamInfo( getStreamURL(streamID), getStreamKey(streamID) )
                        .then ( function ( result ) {
                            
                            arrP = aPos( $scope.streamsList , streamID );
                            $scope.streamsList[arrP].fields=[];
                            $scope.streamListFields = [];
                            angular.forEach( result.data[0] , function ( value , key ) // yes, its first value and then key 
                            {
                                    //console.log("Key: " + key +"  Value: " + value );
                                    $scope.streamsList[arrP].fields.push(key);
                                    $scope.streamListFields.push(key);
                                
                            });
                            
                        },
                            function ( result ) {
                                console.log("Error.....");
                                $scope.streamsList[arrP].fields=[];
                                $scope.streamListFields = [];
                                pushError("Can't get fields for " + $scope.streamsList[arrP].name);
                            }
                        );
                } catch ( err ) {
                    console.log(err.name + ': "' + err.message +  '" occurred when retrieving Stream Fields.') 
                };
  
            }
            
            
            function updateFields(graph) {
                $scope.streamListFields = [];
                var arrP = aPos( $scope.streamsList , graph.selectedStream.rowid); // get Array index position
                getStreamFields(graph.selectedStream.rowid);    
            }
            
            function initCreateForm() {
                $scope.newGraph = { name: '' , order: '', charttype:'', streamid:'', fields:''  };
            }
            
            function getPhantGraphs() {
                phantGraphsServices.all()
                    .then( function ( result ) {
                        $scope.graphsList = result.data;
                        setGraphData();
                        //console.log( result.data );
                    });
            };            
            
            function createGraph(graph) {
                graph.streamid = graph.selectedStream.rowid;
                console.log("Stream ID: " + graph.streamid );
                var arrP = aPos( $scope.streamsList , graph.streamid ); // get Array index position
                graph.serverid = $scope.streamsList[arrP].serverid;
                graph.charttype = $scope.charttypedesc.indexOf(graph.charttypedesc);
                
                
                if( typeof graph.options === 'undefined'){
                    graph.options = ""; // Just for not saving undefined on the database.
                }
                phantGraphsServices.create(graph)
                    .then(function (result) {
                        initCreateForm();
                        getPhantGraphs();
                        //displayStreamFields();
                    });
            }            

            function deleteGraph(graphID) {
                //console.log("Deleting server via REST...");
                phantGraphsServices.destroy(graphID)
                    .then(function (result) {
                        cancelEditing();
                        getPhantGraphs();
                        
                });
            }

            function setEditedGraph(graph) {
                //console.log("Editing....");
                //console.log("Name:" + server.name );
                $scope.editedGraph = angular.copy(graph);
                $scope.editedGraph.charttypedesc = $scope.charttypedesc[$scope.editedGraph.charttype];
                var arrP = aPos( $scope.streamsList , $scope.editedGraph.streamid);
                $scope.editedGraph.selectedStream =$scope.streamsList[arrP];
                updateFields($scope.editedGraph);
                
                $scope.isEditing = true;               
            }
            
            function cancelEditing() {
                $scope.editedGraph = null;
                $scope.isEditing = false;
            }
                        
            function isCurrentItem(itemId) {
                if ( $scope.editedGraph !== null ) {
                    console.log("is current: " + $scope.editedGraph.rowid );
                }
                return $scope.editedGraph !== null && $scope.editedGraph.rowid === itemId;
            }
            
            function updateGraph(graph) {
                //console.log("Update: " + server.name );
                console.log("Chart type selected: " + graph.charttypedesc );
                console.log("Chart type id : " + $scope.charttypedesc.indexOf(graph.charttypedesc));
                graph.charttype = $scope.charttypedesc.indexOf(graph.charttypedesc);
                phantGraphsServices.update( graph.rowid , graph)
                    .then( function (result) {
                        cancelEditing();
                        getPhantGraphs(); 
                        //displayStreamFields();
                    });
                
            }            
            
           
            
            initCreateForm();
            
            $scope.updateFields = updateFields;
            $scope.streamListFields = [];
            $scope.newGraph.charttypedesc = $scope.charttypedesc[0];
            
            $scope.createGraph    = createGraph;
            $scope.deleteGraph    = deleteGraph;
            $scope.setEditedGraph = setEditedGraph;
            $scope.cancelEditing  = cancelEditing;
            $scope.updateGraph    = updateGraph;
            
            setGraphData();  // Fills up the Server name and Stream name for display
            
        }]);

