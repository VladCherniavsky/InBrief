(function() {
angular
    .module('InBrief')
    .config(config);

function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('home');

    $stateProvider
        .state('clients', {
            url: '/clients',
            templateUrl: 'clients/views/clients.html',
            controller: 'ClientsController',
            controllerAs: 'clients',
            resolve: {
                resolvedClients: getClients
            }
        });

    function getClients(clientsService, Alertify, commonService) {
        return clientsService
        .getClients()
        .then(function(res) {
            return res.data;
        })
        .catch(function(err) {
            Alertify.error('Error getting clients');
        });
    }
}
}());
