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
            
            
            // For each stream, query the server for the stream fields.
            function getStreamFields( streamID ) {
                try {
                    phantApiServices.streamInfo( $scope.serversList[$scope.streamsList[streamID].serverid-1].url, $scope.streamsList[streamID].key )
                        .then ( function ( result ) {
                            
                            $scope.streamsList[streamID].fields=[];
                            $scope.streamListFields = [];
                            angular.forEach( result.data[0] , function ( value , key ) // yes, its first value and then key 
                            {
                                    //console.log("Key: " + key +"  Value: " + value );
                                    $scope.streamsList[streamID].fields.push(key);
                                    $scope.streamListFields.push(key);
                                
                            });
                            
                        },
                            function ( result ) {
                                console.log("Error.....");
                                $scope.streamsList[streamID].fields=[];
                                $scope.streamListFields = [];
                                pushError("Can't get fields for " + $scope.streamsList[streamID].name);
                            }
                        );
                } catch ( err ) {
                    console.log(err.name + ': "' + err.message +  '" occurred when retrieving Stream Fields.') 
                };
  
            }
            
            
            function updateFields(graph) {
                $scope.streamListFields = [];
                getStreamFields(graph.selectedStream.rowid-1); // Rowid's start at 1, but arrays start at zero...   
            }
            
            function initCreateForm() {
                $scope.newGraph = { name: '' , order: '', charttype:'', streamid:'', fields:''  };
            }
            
            function getPhantGraphs() {
                phantGraphsServices.all()
                    .then( function ( result ) {
                        $scope.graphsList = result.data;
                        //console.log( result.data );
                    });
            };            
            
            function createGraph(graph) {
                graph.streamid = graph.selectedStream.rowid;
                graph.serverid = $scope.streamsList[graph.streamid-1].serverid-1;
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
                $scope.editedGraph.selectedStream =$scope.streamsList[$scope.editedGraph.streamid-1];
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
            
            $scope.createGraph = createGraph;
            $scope.deleteGraph = deleteGraph;
            $scope.setEditedGraph = setEditedGraph;
            $scope.cancelEditing  = cancelEditing;
            $scope.updateGraph = updateGraph;
            
        }]);

