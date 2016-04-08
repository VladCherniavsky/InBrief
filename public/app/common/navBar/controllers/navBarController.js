(function () {
    angular
        .module('InBrief')
        .controller('NavBarController', NavBarController);

    function NavBarController ($rootScope, modalService) {
        var self = this;

        self.animationsEnabled = true;
        self.open = open;
        self.logout = logout;

        function open () {
            var modalInstance = modalService.getModal(true, 'common/modals.tmpl/templates/modalAuth-tmpl.html', 'ModalAuthController', 'modalAuth');
        }
        function logout () {
            $rootScope.$broadcast('logout');
        }
    }
}());