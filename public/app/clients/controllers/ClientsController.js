(function() {
    angular
        .module('InBrief')
        .controller('ClientsController', ClientsController);

    function ClientsController(resolvedClients, Alertify, linkService, commonService, $rootScope) {
        var self = this;
        console.log('all clients', resolvedClients);
        self.data = resolvedClients;
        self.changeActive = changeActive;
        self.subnav = [
            {
                name: 'All',
                active: true
            },
            {
                name: 'Bad',
                active: false
            },
            {
                name: 'FTD',
                active: false
            },
            {
                name: 'New',
                active: false
            },
            {
                name: 'Potential',
                active: false
            },
            {
                name: 'Practice',
                active: false
            },
            {
                name: 'Un-Active',
                active: false
            }
        ];
        function changeActive(item) {
            self.subnav.map(function(arrayItem) {
                arrayItem.name === item.name ? arrayItem.active = true : arrayItem.active = false;
            });
        }
    }
}());
