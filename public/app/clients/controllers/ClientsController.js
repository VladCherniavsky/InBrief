(function() {
    angular
    .module('InBrief')
    .controller('ClientsController', ClientsController);

    function ClientsController(resolvedClients) {
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
                name: 'Practice',
                active: false
            },
            {
                name: '8gggg8jjj',
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
