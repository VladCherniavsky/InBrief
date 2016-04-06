(function () {
    angular
        .module('InBrief')
        .controller('NavBarController', NavBarController);

    function NavBarController ($uibModal, $rootScope, $timeout, $cookies) {
        var self = this;

        self.animationsEnabled = true;
        self.open = open;
        self.logout = logout;
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        function loggedProcess () {
            console.log('$rootScope.logged', $rootScope.logged);
            $timeout(function () {
                self.logged = true;
            }, 0);
        }
        function logoutProcess () {
            angular.forEach($cookies.getAll(), function (v, k) {
                $cookies.remove(k);
            });
            $timeout(function () {
                self.logged = false;
                $rootScope.logged = false;
            }, 0);

        }

        function open (size) {
            var modalInstance = $uibModal.open({
                animation: self.animationsEnabled,
                templateUrl: 'common/navBar/views/modalAuth-tmpl.html',
                controller: 'ModalAuthController',
                controllerAs: 'modalAuth',
                size: size
            });
        }
        function logout () {
            $rootScope.$broadcast('logout');
        }
    }
}());