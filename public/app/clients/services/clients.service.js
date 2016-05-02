(function() {
    angular
        .module('InBrief')
        .service('clientsService', clientsService);

    function clientsService($http) {
        console.log('sssss');
        var self = this;
        self.getClients = getClients;

        function getClients() {
            return $http({
                method: 'GET',
                url: 'api/clients'
            });
        }
    }
}());
