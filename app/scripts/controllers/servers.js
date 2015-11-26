'use strict';

// The Servers List doesn't have any problem with no sequence rowids.

angular.module('phantGraph')
	.controller('ServersCtrl',["$scope","phantservers","phantServerServices", function($scope,phantservers,phantServerServices) {
            var servers = this;
            
            $scope.serversList = phantservers.data;

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            function pushError(error) {
                $scope.alerts.push({
                    type: "warning",
                    msg: error
                });
            };

            function getPhantServers() {
                phantServerServices.all()
                    .then( function ( result ) {
                        $scope.serversList = result.data;
                        //console.log( result.data );
                    });
            };
                 
            function createServer(server) {
                phantServerServices.create(server)
                    .then(function (result) {
                        initCreateForm();
                        getPhantServers();
                    });
            }

            function initCreateForm() {
                $scope.newServer = { name: '', url: '' };
            }

            function deleteServer(serverID) {
                phantServerServices.destroy(serverID)
                    .then(function (result) {
                        cancelEditing();
                        getPhantServers();
                });
            }

            function setEditedServer(server) {
                //console.log("Editing....");
                //console.log("Name:" + server.name );
                $scope.editedServer = angular.copy(server);
                $scope.isEditing = true;               
            }
            
            function cancelEditing() {
                $scope.editedServer = null;
                $scope.isEditing = false;
            }
            
            
            function updateServer(server) {
                //console.log("Update: " + server.name );
                phantServerServices.update( server.rowid , server)
                    .then( function (result) {
                        cancelEditing();
                        getPhantServers(); 
                    });
                
            }
            
            function isCurrentItem(itemId) {
                if ( $scope.editedServer !== null ) {
                    console.log("is current: " +$scope.editedServer.rowid );
                }
                return $scope.editedServer !== null && $scope.editedServer.rowid === itemId;
            }       
            
            $scope.newServer = { name: '' , url: '' };
            $scope.createServer = createServer;
            $scope.deleteServer = deleteServer;
            $scope.updateServer = updateServer;
            $scope.setEditedServer = setEditedServer;
            $scope.cancelEditing = cancelEditing;
            $scope.isCurrentItem = isCurrentItem;
            $scope.editedServer = null;
            $scope.isEditing = false;
  
            //createServer();
            
        }] );
