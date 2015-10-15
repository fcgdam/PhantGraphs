'use strict';

angular.module('phantGraph')
    .controller('DashCtrl',[ '$scope','configServices', 'configuration', function( $scope , configServices , configuration ) {
        $scope.alerts = [];
        $scope.dash = JSON.parse(configuration.data.data);
        
        console.log('Config: ' + JSON.stringify(configuration.data.data));
        console.log("refreshp: " + $scope.dash.refreshp );
        
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        function pushError(error) {
            $scope.alerts.push({
                type: "warning",
                msg: error
            });
        };        
        
        function saveDashOptions( dash ) {            
            console.log("Dados: " + JSON.stringify(dash) ); 
            var config = { data : '' };
            config.data = JSON.stringify(dash);
            
            configServices.update( 'dash' , config);
        }
        
        $scope.saveDashOptions = saveDashOptions;
      
    }]);


