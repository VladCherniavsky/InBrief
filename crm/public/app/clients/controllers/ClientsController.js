(function() {
    angular
    .module('InBrief')
    .controller('ClientsController', ClientsController);

    function ClientsController(resolvedClients) {
        var self = this;
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
            }
        ];
        function changeActive(item) {
            self.subnav.map(function(arrIt) {
                arrIt.name === item.name ? arrIt.active = true : arrIt.active = false;
            });
        }
    }
}());
