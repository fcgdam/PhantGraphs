'use strict';

angular.module('phantGraph')
	.controller('MainCtrl', [ '$scope','$http', '$timeout', 'phantservers', 'phantstreams', 'phantgraphs', 'phantApiServices', 'configuration', function($scope, $http,$timeout , phantservers, phantstreams, phantgraphs , phantApiServices, configuration) {
            $scope.alerts = [];
            
            $scope.serversList = phantservers.data;
            $scope.streamsList = phantstreams.data; // JSON Array with streams
            $scope.graphsList  = phantgraphs.data;
            $scope.chartjstype = [ 'chart-line', 'chart-bar', 'chart-doughnut', 'chart-radar', 'chart-pie' , 'chart-polar' ];
            
            // Load dashboard configuration:
            var dashconfig = JSON.parse(configuration.data.data); // It's a Json stringify object inside the db field.
            var refresh    = dashconfig.refresh;        // True if disable automatic graphs refresh
            var datapoints = dashconfig.datapoints;     // Number of datapoints for the X axis
            var refreshp   = dashconfig.refreshp;       // Refresh period in ms.
            var labelinter = dashconfig.labelinterval;  // No label interval between Xlabels
            var maxerror   = dashconfig.maxerror;       // Maximum errors before stopping automatic refresh. Click on the graph to resume.
            var errorthrottle = dashconfig.errorthrottle; // Future use.
            
            // Make sure that refreshp has a sane value....
            if ( refreshp < 1000 ) refreshp = 1000;
                    
            
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
            
            
            // For formating the hour for the X-Label.
            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            
            function getTime( timestamp ) {
                var dt = new Date(timestamp);
                var h  = addZero(dt.getHours());
                var m  = addZero(dt.getMinutes());
                var s  = addZero(dt.getSeconds());
                return h + ":" + m + ":" + s;                
            }
            
            // Get stream data to fill up the chart.
            // The function receives the graph ID for the graph that we are rendering,
            // the url for the Phant server and the public key for the stream.
            function getGraphData(graphID, url, key ) {
                phantApiServices.streamData( url, key, datapoints )
                    .then ( function ( response ) {

                        // Initialize common Graph configuration.
                        $scope.graphsList[graphID].isLoading = false;
                        $scope.graphsList[graphID].series = $scope.graphsList[graphID].fields.split(',');
                        $scope.graphsList[graphID].labels = [];
                        $scope.graphsList[graphID].lblpos = 0;
                         
                        var sdata = response.data;      // Get the response data
                        
                        $scope.graphsList[graphID].last =  new Date(sdata[0].timestamp);  // Hold the newest time stamp
                        
                        var data   = [];    // Working variables.
                        var labels = [];
                        
                        ///////////////////////////////////////////////////////////////////////////
                        // Chart Type:  Line chart.
                        if ( $scope.graphsList[graphID].charttype == 0 ) {
                            
                            // For each series get the values
                            for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                data.push([]);
                                
                                for ( var j = 0; j < datapoints ; j++ ) {  // Only showing the first datapoints points.
                                
                                    // Push data to the array holding the values for the current series
                                    data[i].unshift(sdata[j][ $scope.graphsList[graphID].series[i] ]);
                                    
                                    if ( i == 0 ) { //We only create labels at the first run. Otherwise it gets repeated.
                                        if ( (j % labelinter == 0) ) {
                                            var ts = getTime(sdata[j].timestamp);                                               
                                            $scope.graphsList[graphID].labels.unshift( ts );
                                            $scope.graphsList[graphID].lblpos = 0;
                                        } else {
                                            $scope.graphsList[graphID].labels.unshift('');
                                            $scope.graphsList[graphID].lblpos++;
                                        }
                                    }
                                }
                            }
                        }
                        
                        ///////////////////////////////////////////////////////////////////////////
                        // Chart Type:  BAR chart.
                        // There are TWO type. Single BARS with the values for the series
                        // Or range of bars along the time
                        if ( $scope.graphsList[graphID].charttype == 1 ) {
                            
                            data   = [];
                            labels = [];
                            
                            if ($scope.graphsList[graphID].noseries == true) {
                                // Bar chart with field columns and not time series
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                    data.push([]);
                                    data[i].push ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));                                    
                                }
                                var ts = getTime(sdata[0].timestamp);
                                $scope.graphsList[graphID].labels = [ts];
                                
                            } else {
                                
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                    data.push( [] );
                                    for ( var j = 0; j < datapoints ; j++ ) {
                                        data[i].unshift ( parseFloat(sdata[j][ $scope.graphsList[graphID].series[i] ]));
                                        
                                        if ( i==0 ) {
                                            var ts = getTime(sdata[j].timestamp);
                                            labels.unshift( ts );
                                        }
                                    
                                    }
                                }
                                $scope.graphsList[graphID].labels = labels;                                
                            }
                        }
                        
                        ///////////////////////////////////////////////////////////////////////////
                        // Chart Type:  doughnut chart.
                        if ( $scope.graphsList[graphID].charttype == 2 ) {
    
                            data   = [];
                            labels = [];
                            $scope.graphsList[graphID].labels = [];
                            for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                data.push  ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));
                                labels.push( String( $scope.graphsList[graphID].series[i]) );
                            }
                            $scope.graphsList[graphID].labels = labels;
                        }
                        
                        ///////////////////////////////////////////////////////////////////////////
                        // Chart Type:  RADAR chart.
                        if ( $scope.graphsList[graphID].charttype == 3 ) {
    
                            data   = [];
                            labels = [];
                            for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                data.push( [] );
                                for ( var j = 0; j < datapoints ; j++ ) {
                                    data[i].unshift ( parseFloat(sdata[j][ $scope.graphsList[graphID].series[i] ]));
                                    
                                    if ( i==0 ) {
                                        var ts = getTime(sdata[j].timestamp);
                                        labels.unshift( ts );
                                    }
                                
                                }
                            }
                            $scope.graphsList[graphID].labels = labels;  
                        }

                        ///////////////////////////////////////////////////////////////////////////
                        // Chart Type:  PIE chart.
                        if ( $scope.graphsList[graphID].charttype == 4 ) {
    
                            data   = [];
                            labels = [];
                                // Bar chart with field columns and not time series
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                    
                                    data.push ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));  
                                    labels.push ( $scope.graphsList[graphID].series[i] );
                                }
                                $scope.graphsList[graphID].labels = labels;  
                        }                        

                        ///////////////////////////////////////////////////////////////////////////
                        // Chart Type:  POLAR chart.
                        if ( $scope.graphsList[graphID].charttype == 5 ) {
                            console.log("polar chart");
                            data   = [];
                            labels = [];
                                // Bar chart with field columns and not time series
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                    
                                    data.push ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));  
                                    labels.push ( $scope.graphsList[graphID].series[i] );
                                }
                                //labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
                                //data = [300, 500, 100, 40, 120];
                                $scope.graphsList[graphID].labels = labels;  
                        }                            

                        $scope.graphsList[graphID].data   = data;
                        
                        $scope.series = $scope.graphsList[graphID].series;
                        $scope.labels = $scope.graphsList[graphID].labels;
                        
                        console.log("Series: " + $scope.series );
                        console.log("Data  : " + data );
                        console.log("Labels: " + $scope.graphsList[graphID].labels );
                        
                        // For the demo graph.
                        //$scope.data = data;
                        
                        $scope.graphsList[graphID].isRefreshing = false;

                    },
                        function ( response ) {
                            $scope.graphsList[graphID].isLoading = false;
                            $scope.graphsList[graphID].isRefreshing = false;
                            $scope.graphsList[graphID].errorCount++;
                            
                            pushError("Can't get stream Data for " + $scope.graphsList[graphID].name);
                            
                        }
                    );
            }

            // Get stream latest data to fill up the chart without requesting the whole data set
            function getLastGraphData(graphID, url, key ) {
                phantApiServices.streamLastData( url, key )
                    .then ( function ( response ) {
                        $scope.graphsList[graphID].isLoading = false;
                        var sdata = response.data;
                        
                        // Latest data timestamp
                        var nts = Math.floor(new Date(sdata[0].timestamp).getTime()/1000);
                        // Time stamp of the latest data point on the graph data
                        var lts= Math.floor(new Date($scope.graphsList[graphID].last).getTime()/1000);
                        //console.log("GraphID: " + graphID.toString() + " LTS: " + lts.toString() + " New: " + nts.toString() );
                        
                        if ( nts > lts ) { //we got new data
  
                            $scope.graphsList[graphID].last =  new Date(sdata[0].timestamp); // Update the latest timestamp
                            /////////////////////////////////////////////////////////////////////////////////////////////////////////
                            // Line chart
                            if ( $scope.graphsList[graphID].charttype == 0 ) {
                                ;
                                // For each series drop the last value and add the new one at the beggining
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                                                    
                                    var newValue = sdata[0][ $scope.graphsList[graphID].series[i] ];
                                    $scope.graphsList[graphID].data[i].shift();  
                                    $scope.graphsList[graphID].data[i].push( newValue );
                                    
                                    var labelpos = $scope.graphsList[graphID].lblpos; // to simplify expression
                                    
                                    if ( labelpos % labelinter == 0 ) {
                                        var ts = getTime(sdata[0].timestamp);
                                        $scope.graphsList[graphID].labels.shift();
                                        $scope.graphsList[graphID].labels.push(ts);
                                        $scope.graphsList[graphID].lblpos++;
                                    } else {
                                        $scope.graphsList[graphID].labels.shift();
                                        $scope.graphsList[graphID].labels.push('');
                                        $scope.graphsList[graphID].lblpos++ ;
                                    }
                                }
                            } 
                            ///////////////////////////////////////////////////////////////////////////////////////
                            // Bar chart
                            if ( $scope.graphsList[graphID].charttype == 1 ) {                             
                                var data   = [];
                            
                                if ($scope.graphsList[graphID].noseries == true) {
                                    // Bar chart with field columns and not time series
                                    for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                        data.push([]);
                                        data[i].push ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));                                    
                                    }
                                    var ts = getTime(sdata[0].timestamp);
                                    $scope.graphsList[graphID].labels = [ts];
                                    $scope.graphsList[graphID].data = data;
                                    
                                } else {
                                    for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                        var newValue = sdata[0][ $scope.graphsList[graphID].series[i] ];
                                        $scope.graphsList[graphID].data[i].shift();  
                                        $scope.graphsList[graphID].data[i].push( newValue );
                                        
                                        var labelpos = $scope.graphsList[graphID].lblpos; // to simplify expression

                                        var ts = getTime(sdata[0].timestamp);                                        
                                        $scope.graphsList[graphID].labels.shift();
                                        $scope.graphsList[graphID].labels.push(ts);
                                        $scope.graphsList[graphID].lblpos++;                                  
                                    }
                                }
                                
                            }

                            ///////////////////////////////////////////////////////////////////////////////////////
                            // Doughnut chart
                            if ( $scope.graphsList[graphID].charttype == 2 ) {                             
                                var data   = [];
                                
                                
                                // Bar chart with field columns and not time series
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                    
                                    console.log( "Data: " + sdata[0][ $scope.graphsList[graphID].series[i] ] );
                                    data.push ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));                                    
                                }
                                //var ts = getTime(sdata[0].timestamp);
                                //$scope.graphsList[graphID].labels = [ts];
                                $scope.graphsList[graphID].data = data;
                            }
                            
                        
                            ///////////////////////////////////////////////////////////////////////////
                            // Chart Type:  RADAR chart.
                            if ( $scope.graphsList[graphID].charttype == 3 ) {
        
                                data   = [];
                                console.log("updating...");
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                   
                                        var newValue = sdata[0][ $scope.graphsList[graphID].series[i] ];
                                        $scope.graphsList[graphID].data[i].shift();  
                                        $scope.graphsList[graphID].data[i].push( newValue );
                                        
                                        var labelpos = $scope.graphsList[graphID].lblpos; // to simplify expression

                                        var ts = getTime(sdata[0].timestamp);                                        
                                        $scope.graphsList[graphID].labels.shift();
                                        $scope.graphsList[graphID].labels.push(ts);
                                        $scope.graphsList[graphID].lblpos++;    
                                }
                                $scope.graphsList[graphID].labels = labels;  
                            }

                            ///////////////////////////////////////////////////////////////////////////
                            // Chart Type:  PIE chart.
                            if ( $scope.graphsList[graphID].charttype == 4 ) {
                                console.log("updating...");
                                data   = [];
                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                    console.log( sdata[0][ $scope.graphsList[graphID].series[i] ] );
                                    data.push ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));  
                                    
                                }
                                $scope.graphsList[graphID].data = data;  
                            }                        

                            ///////////////////////////////////////////////////////////////////////////
                            // Chart Type:  POLAR chart.
                            if ( $scope.graphsList[graphID].charttype == 5 ) {
                                console.log("polar chart");
                                data   = [];

                                for ( var i = 0; i  < $scope.graphsList[graphID].series.length ; i++ ) {
                                    
                                    data.push ( parseFloat(sdata[0][ $scope.graphsList[graphID].series[i] ]));  
                                    
                                }

                                $scope.graphsList[graphID].data = data;  
                            }                               
   
                        }
                        $scope.graphsList[graphID].isRefreshing = false;
                        
                    },
                        function ( response ) {
                            $scope.graphsList[graphID].isLoading = false;
                            $scope.graphsList[graphID].isRefreshing = false;
                            $scope.graphsList[graphID].errorCount++;
                            
                            pushError("Can't get stream Data for " + $scope.graphsList[graphID].name);
                        }
                    );
              
            }
            
            // For each graphic build the options
            function getOptions() {
                var options;
                
                for (var i = 0 ; i < $scope.graphsList.length ; i++) {
                    options = $scope.graphsList[i].graphoptions.split(',');
                    
                    for ( var opt = 0 ; opt < options.length ; opt++ ) {
                        if ( options[opt] == 1 ) // No animate
                            //$scope.graphsList[i].options = $scope.graphsList[i].options + '{ animate: false }';
                            //explicit bug
                            $scope.graphsList[i].options = '{animation:false}';
                        
                        options[opt] == "2" ? $scope.graphsList[i].xlabels = true : $scope.graphsList[i].xlabels = false;
                        
                        options[opt] == "3" ? $scope.graphsList[i].noseries = true : $scope.graphsList[i].noseries = false;
  
                    }
                }
            }
            
            function updateALL() {
                // Let's update the data for all graphs that are defined.
                for (var i = 0 ; i < $scope.graphsList.length ; i++) {
                    $scope.graphsList[i].isLoading = true;
                    $scope.graphsList[i].isRefreshing = true;
                    $scope.graphsList[i].errorCount = 0;
                    //console.log($scope.graphsList[i].options );
                    
                    getGraphData( i ,  $scope.serversList[$scope.graphsList[i].serverid].url ,  $scope.streamsList[$scope.graphsList[i].streamid-1].key );
                
                }
            }

             function updateLastData( errorClear ) {
                // Let's update the data for all graphs.
                for (var i = 0 ; i < $scope.graphsList.length ; i++) {
                    
                    if ( errorClear == 1 ) $scope.graphsList[i].errorCount = 0;
                    
                    if ( ($scope.graphsList[i].isRefreshing == false) && ($scope.graphsList[i].errorCount < maxerror) ) {
                        
                        $scope.graphsList[i].isLoading = false;
                        // We only refresh the stream data if no other refresh is running.
                        // This is to avoid nested calls to the ws.
                        $scope.graphsList[i].isRefreshing = true ;
                        getLastGraphData( i ,  $scope.serversList[$scope.graphsList[i].serverid].url ,  $scope.streamsList[$scope.graphsList[i].streamid-1].key );
                    }
                }
            }           
 
            // function called when clicking on the graphs.
            $scope.onClickGraph = function (points, evt) {
                console.log(points, evt);
                //updateALL();
                updateLastData( 1 );  // Clear error count.
            };
            
            
            // Function for updating periodically the graph data
            var updateGraphsP = function() {
                $timeout(function() {
                        updateLastData( 0 );  // Don't clear error count.
                        updateGraphsP(); // Let's call again ourselfs.
                }, refreshp );   // refreshp holds the refresh interval in ms.
            };     
                       
            getOptions();
            updateALL();
            if ( refresh == 0 )
                updateGraphsP();   // Update graphs periodically
        }] );
