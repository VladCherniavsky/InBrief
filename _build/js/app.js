(function() {
    config.$inject = ["$httpProvider"];
    runBlock.$inject = ["$rootScope", "$cookies", "authService", "hostService"];
    angular
        .module('InBrief', [
            'ui.router',
            'Alertify',
            'ui.bootstrap',
            'ngCookies'
        ])
        .config(config)
        .run(runBlock);

    function config ($httpProvider) {
        $httpProvider.interceptors.push('authIntercepor');
    }
    function runBlock ($rootScope, $cookies, authService, hostService) {
        $rootScope.logged = false;
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);
        $rootScope.host = hostService.getHost();
        console.log('hostService.getHost()', hostService.getHost());

        authService.defaultRequest();

        function loggedProcess () {
            $rootScope.logged = true;
        }

        function logoutProcess () {
            angular.forEach($cookies.getAll(), function (v, k) {
                console.log(k)
                $cookies.remove(k);
            });
            $rootScope.logged = false;
        }
    }
}());
(function() {
    modalService.$inject = ["$uibModal"];
    angular
        .module('InBrief')
        .service('modalService', modalService);

    function modalService($uibModal) {
        var self = this;
        self.getModal = getModal;

        function getModal (animationsEnabled, pathToTmpl, controller, controllerAs) {
            return $uibModal.open({
                animation: animationsEnabled,
                templateUrl: pathToTmpl,
                controller: controller,
                controllerAs: controllerAs
            });
        }
    }
}());
(function() {
    hostService.$inject = ["$location"];
    angular
        .module('InBrief')
        .service('hostService', hostService);

    function hostService($location) {
        var self = this;
        self.getHost = getHost;

        function getHost () {
            return $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }
    }
}());
(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('navBar', navBarFn);

    function navBarFn () {
        return {
            restrict: 'E',
            templateUrl: 'common/navBar/views/nav-bar-tmpl.html',
            controller: 'NavBarController',
            controllerAs: 'navBar'
        };
    }
}());
(function () {
    NavBarController.$inject = ["$uibModal", "$rootScope", "$timeout", "$cookies", "modalService"];
    angular
        .module('InBrief')
        .controller('NavBarController', NavBarController);

    function NavBarController ($uibModal, $rootScope, $timeout, $cookies, modalService) {
        var self = this;

        self.animationsEnabled = true;
        self.open = open;
        self.logout = logout;
        /*$rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        function loggedProcess () {
            self.logged = true;
        }

        function logoutProcess () {
            self.logged = false;
        }*/

        function open () {
            var modalInstance = modalService.getModal(true, 'common/modals.tmpl/templates/modalAuth-tmpl.html', 'ModalAuthController', 'modalAuth');
        }
        function logout () {
            $rootScope.$broadcast('logout');
        }
    }
}());
(function () {
    ModalAuthController.$inject = ["$uibModalInstance"];
    angular
        .module('InBrief')
        .controller('ModalAuthController', ModalAuthController);

    function ModalAuthController ($uibModalInstance) {
        var self = this;
        self.ok = function () {
            $uibModalInstance.close();
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
}());
(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('linksTable', linksTable);

    function linksTable () {
        return {
            restrict: 'E',
            templateUrl: 'common/linksTable/template/linksTable-tmpl.js.html',
            controller: 'LinksTableController',
            controllerAs: 'linksTableCtrl',
            bindToController: {
                links: '=',
                details: '&',
                title: '='
            }
        };
    }
}());
(function () {
    angular
        .module('InBrief')
        .controller('LinksTableController', LinksTableController);

    function LinksTableController () {
        var self = this;
    }
}());
(function() {
    authService.$inject = ["$http"];
    angular
        .module('InBrief')
        .service('authService', authService);

    function authService($http) {
        var self = this;
        self.loginUser = loginUser;
        self.signupUser = signupUser;
        self.defaultRequest = defaultRequest;

        function loginUser (user) {
            return $http({
                method: 'POST',
                url: 'api/login',
                data: user
            });
        }
        function signupUser (user) {
            return $http({
                method: 'POST',
                url: 'api/signup',
                data: user
            });
        }
        function defaultRequest () {
            return $http({
                method: 'GET',
                url: 'api/'
            });
        }
    }
}());
(function () {
    'use strict';
    angular
        .module('InBrief')
        .directive('authForm', authForm);

    function authForm () {
        return {
            restrict: 'E',
            templateUrl: 'common/auth/tmpl/auth-form-tmpl.html',
            controller: 'AuthFormController',
            controllerAs: 'authform',
            bindToController: {
                close: '&'
            }
        };
    }
}());
(function () {
    AuthFormController.$inject = ["authService", "Alertify", "$state"];
    angular
        .module('InBrief')
        .controller('AuthFormController', AuthFormController);

    function AuthFormController (authService, Alertify, $state) {
        var self = this;
        self.loginTab = true;
        self.login = login;
        self.signup = signup;
        self.cancel = cancel;

        function login (user) {
            console.log('user', user);
            authService
                .loginUser(user)
                .then(loginSuccess)
                .catch(errorHandler);

            function loginSuccess (res) {
                $state.go('home');
                Alertify.success(res.data);
                self.close();
            }
        }
        function signup (user) {
            authService.
                signupUser(user)
                .then(signUpSuccess)
                .catch(errorHandler);

            function signUpSuccess (res) {
                Alertify.success(res.data);
                Alertify.success('Log in, please');
                self.loginTab = true;
                self.user = null;
            }
        }

        function cancel () {
            self.user = null;
            self.close();
        }
        function errorHandler (err) {
            console.log(err);
            Alertify.error(err.data.message);
        }
    }
}());
(function() {
    linkService.$inject = ["$http"];
    angular
        .module('InBrief')
        .service('linkService', linkService);

    function linkService($http) {
        var self = this;
        self.getLinks = getLinks;
        self.addLink = addLink;
        self.getUserLinks = getUserLinks;

        function getLinks (user) {
            return $http({
                method: 'GET',
                url: 'api/links'
            });
        }

        function addLink (link) {
            return $http({
                method: 'POST',
                url: 'api/links',
                data: link
            });
        }

        function getUserLinks () {
            return $http({
                method: 'GET',
                url: 'api/userLinks'
            });
        }

    }
}());
(function () {
    config.$inject = ["$stateProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        getLinks.$inject = ["linkService", "Alertify"];
        console.log('$stateProvider', $stateProvider);
        $stateProvider
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html',
                controller: 'LinksController',
                controllerAs: 'linksCtrl',
                resolve: {
                    resolvedLinks: getLinks
                }
            })
            .state('details', {
                url: '/details',
                templateUrl: 'links/views/linkDetails.html',
                controller: 'LinkDetailsController',
                controllerAs: 'linkDetails'
            });

        function getLinks (linkService, Alertify) {
            return linkService
                .getLinks()
                .then(function (res) {
                    return {
                        links: res.data.links,
                        count: res.data.count
                    };
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }

    }
} ());
(function () {
    LinksController.$inject = ["linkService", "resolvedLinks"];
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService, resolvedLinks) {
        var self = this;
        self.title = 'All links: ' + resolvedLinks.count;
        self.links = resolvedLinks.links;
    }
}());
(function () {
    LinkDetailsController.$inject = ["linkService"];
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (linkService) {
        var self = this;
        self.title = 'Link details';
    }
}());
(function () {
    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        getUserLinks.$inject = ["linkService", "Alertify", "$rootScope"];
        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/views/main.html',
                controller: 'HomeController',
                controllerAs: 'home',
                resolve: {
                    resolvedUserLinks: getUserLinks
                }
            });

        function getUserLinks (linkService, Alertify, $rootScope) {
            return linkService
                .getUserLinks()
                .then(function (res) {
                    $rootScope.showMyLinks = true;
                    console.log('res.data.links', res.data);
                    return res.data;
                })
                .catch(function (err) {
                    Alertify.error('Error getting links');
                });
        }
    }
} ());
(function () {
    HomeController.$inject = ["resolvedUserLinks", "Alertify", "linkService"];
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController (resolvedUserLinks, Alertify, linkService) {
        var self = this;
        self.title = 'My links';
        self.addLink = addLink;
        self.userLinks = resolvedUserLinks;
        self.change = change;

        function addLink (link) {
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);

            function addLinkResult (res) {
                self.link = null;
                self.change();
                Alertify.success(res.data.message);
            }
            function addLinkError (err) {
                Alertify.error(err.data.message);
            }
        }
        function change () {
            linkService
                .getUserLinks()
                .then(getLinksResult)
                .catch(getLinksError);

            function getLinksResult (res) {
                self.userLinks = res.data;
            }

            function getLinksError (err) {
                Alertify.error(err.data.message);
            }
        }
    }
}());
(function() {
    authIntercepor.$inject = ["$cookies", "$rootScope"];
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor ($cookies, $rootScope) {
        var authIntercepor = {
            response: function(response) {
                var token = response.headers('x-access-token'),
                    id = response.headers('id'),
                    userName = response.headers('userName');

                if (token !== null) {
                    $cookies.put('token', token);
                    if (id) { $cookies.put('id', id); }
                    if (userName) { $cookies.put('userName', userName); }
                    $rootScope.$broadcast('logged');
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9tb2RhbC5zZXJ2aWNlL21vZGFsLnNlcnZpY2UuanMiLCJjb21tb24vc2VydmljZXMvaG9zdC5zZXJ2aWNlL2hvc3Quc2VydmljZS5qcyIsImNvbW1vbi9uYXZCYXIvZGlyZWN0aXZlL25hdkJhci5kaXJlY3RpdmUuanMiLCJjb21tb24vbmF2QmFyL2NvbnRyb2xsZXJzL25hdkJhckNvbnRyb2xsZXIuanMiLCJjb21tb24vbW9kYWxzLnRtcGwvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9saW5rc1RhYmxlL2RpcmVjdGl2ZS9saW5rc1RhYmxlLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9saW5rc1RhYmxlL2NvbnRyb2xsZXIvTGlua3NUYWJsZUNvbnRyb2xsZXIuanMiLCJjb21tb24vYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuanMiLCJjb21tb24vYXV0aC9kaXJlY3RpdmVzL2F1dGhGb3JtLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9hdXRoL2NvbnRyb2xsZXJzL2F1dGhGb3JtQ29udHJvbGxlci5qcyIsImxpbmtzL3NlcnZpY2VzL2xpbmtzLnNlcnZpY2UuanMiLCJsaW5rcy9yb3V0ZXMvcm91dGVzLmpzIiwibGlua3MvY29udHJvbGxlcnMvTGlua3NDb250cm9sbGVyLmpzIiwibGlua3MvY29udHJvbGxlcnMvTGlua0RldGFpbHNDb250cm9sbGVyLmpzIiwiaG9tZS9yb3V0ZXMvcm91dGVzLmpzIiwiaG9tZS9jb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcyIsImludGVyY2VwdG9ycy9hdXRoSW50ZXJjZXB0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJGh0dHBQcm92aWRlclwiXTtcclxuICAgIHJ1bkJsb2NrLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwiJGNvb2tpZXNcIiwgXCJhdXRoU2VydmljZVwiLCBcImhvc3RTZXJ2aWNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnLCBbXHJcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxyXG4gICAgICAgICAgICAnQWxlcnRpZnknLFxyXG4gICAgICAgICAgICAndWkuYm9vdHN0cmFwJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcydcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5ydW4ocnVuQmxvY2spO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJGh0dHBQcm92aWRlcikge1xyXG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcG9yJyk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBydW5CbG9jayAoJHJvb3RTY29wZSwgJGNvb2tpZXMsIGF1dGhTZXJ2aWNlLCBob3N0U2VydmljZSkge1xyXG4gICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZCcsIGxvZ2dlZFByb2Nlc3MpO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dvdXQnLCBsb2dvdXRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLmhvc3QgPSBob3N0U2VydmljZS5nZXRIb3N0KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2hvc3RTZXJ2aWNlLmdldEhvc3QoKScsIGhvc3RTZXJ2aWNlLmdldEhvc3QoKSk7XHJcblxyXG4gICAgICAgIGF1dGhTZXJ2aWNlLmRlZmF1bHRSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRjb29raWVzLmdldEFsbCgpLCBmdW5jdGlvbiAodiwgaykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaylcclxuICAgICAgICAgICAgICAgICRjb29raWVzLnJlbW92ZShrKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIG1vZGFsU2VydmljZS4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdtb2RhbFNlcnZpY2UnLCBtb2RhbFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vZGFsU2VydmljZSgkdWliTW9kYWwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRNb2RhbCA9IGdldE1vZGFsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb2RhbCAoYW5pbWF0aW9uc0VuYWJsZWQsIHBhdGhUb1RtcGwsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb25zRW5hYmxlZCxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBwYXRoVG9UbXBsLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogY29udHJvbGxlckFzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBob3N0U2VydmljZS4kaW5qZWN0ID0gW1wiJGxvY2F0aW9uXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdob3N0U2VydmljZScsIGhvc3RTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBob3N0U2VydmljZSgkbG9jYXRpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRIb3N0ID0gZ2V0SG9zdDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SG9zdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkbG9jYXRpb24ucHJvdG9jb2woKSArICc6Ly8nICsgJGxvY2F0aW9uLmhvc3QoKSArICc6JyArICRsb2NhdGlvbi5wb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbmF2QmFyJywgbmF2QmFyRm4pO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5hdkJhckZuICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9uYXZCYXIvdmlld3MvbmF2LWJhci10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTmF2QmFyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ25hdkJhcidcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBOYXZCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJHRpbWVvdXRcIiwgXCIkY29va2llc1wiLCBcIm1vZGFsU2VydmljZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTmF2QmFyQ29udHJvbGxlcicsIE5hdkJhckNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE5hdkJhckNvbnRyb2xsZXIgKCR1aWJNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb29raWVzLCBtb2RhbFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuYW5pbWF0aW9uc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYub3BlbiA9IG9wZW47XHJcbiAgICAgICAgc2VsZi5sb2dvdXQgPSBsb2dvdXQ7XHJcbiAgICAgICAgLyokcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGxvZ291dFByb2Nlc3MpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgc2VsZi5sb2dnZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfSovXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW4gKCkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9IG1vZGFsU2VydmljZS5nZXRNb2RhbCh0cnVlLCAnY29tbW9uL21vZGFscy50bXBsL3RlbXBsYXRlcy9tb2RhbEF1dGgtdG1wbC5odG1sJywgJ01vZGFsQXV0aENvbnRyb2xsZXInLCAnbW9kYWxBdXRoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCAoKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nb3V0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbEF1dGhDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxJbnN0YW5jZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTW9kYWxBdXRoQ29udHJvbGxlcicsIE1vZGFsQXV0aENvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1vZGFsQXV0aENvbnRyb2xsZXIgKCR1aWJNb2RhbEluc3RhbmNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbGlua3NUYWJsZScsIGxpbmtzVGFibGUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtzVGFibGUgKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2xpbmtzVGFibGUvdGVtcGxhdGUvbGlua3NUYWJsZS10bXBsLmpzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua3NUYWJsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rc1RhYmxlQ3RybCcsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIGxpbmtzOiAnPScsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzOiAnJicsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJz0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzVGFibGVDb250cm9sbGVyJywgTGlua3NUYWJsZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtzVGFibGVDb250cm9sbGVyICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxvZ2luVXNlciA9IGxvZ2luVXNlcjtcclxuICAgICAgICBzZWxmLnNpZ251cFVzZXIgPSBzaWdudXBVc2VyO1xyXG4gICAgICAgIHNlbGYuZGVmYXVsdFJlcXVlc3QgPSBkZWZhdWx0UmVxdWVzdDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaWdudXBVc2VyICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9zaWdudXAnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZGVmYXVsdFJlcXVlc3QgKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS8nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2F1dGhGb3JtJywgYXV0aEZvcm0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhGb3JtICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9hdXRoL3RtcGwvYXV0aC1mb3JtLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBdXRoRm9ybUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhdXRoZm9ybScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlOiAnJidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIEF1dGhGb3JtQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiYXV0aFNlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcIiRzdGF0ZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignQXV0aEZvcm1Db250cm9sbGVyJywgQXV0aEZvcm1Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBBdXRoRm9ybUNvbnRyb2xsZXIgKGF1dGhTZXJ2aWNlLCBBbGVydGlmeSwgJHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYubG9naW4gPSBsb2dpbjtcclxuICAgICAgICBzZWxmLnNpZ251cCA9IHNpZ251cDtcclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGNhbmNlbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5sb2dpblVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKGxvZ2luU3VjY2VzcylcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9naW5TdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2lnbnVwICh1c2VyKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLlxyXG4gICAgICAgICAgICAgICAgc2lnbnVwVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc2lnblVwU3VjY2VzcylcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2lnblVwU3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MoJ0xvZyBpbiwgcGxlYXNlJyk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmxvZ2luVGFiID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZXJyb3JIYW5kbGVyIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIGxpbmtTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnbGlua1NlcnZpY2UnLCBsaW5rU2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGlua1NlcnZpY2UoJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRMaW5rcyA9IGdldExpbmtzO1xyXG4gICAgICAgIHNlbGYuYWRkTGluayA9IGFkZExpbms7XHJcbiAgICAgICAgc2VsZi5nZXRVc2VyTGlua3MgPSBnZXRVc2VyTGlua3M7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZExpbmsgKGxpbmspIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGxpbmtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyTGlua3MgKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS91c2VyTGlua3MnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICBnZXRMaW5rcy4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJHN0YXRlUHJvdmlkZXInLCAkc3RhdGVQcm92aWRlcik7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9saW5rcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpc3RMaW5rcy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZExpbmtzOiBnZXRMaW5rc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2RldGFpbHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpbmtEZXRhaWxzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpbmtEZXRhaWxzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rRGV0YWlscydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzIChsaW5rU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua3MoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtzOiByZXMuZGF0YS5saW5rcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHJlcy5kYXRhLmNvdW50XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKCdFcnJvciBnZXR0aW5nIGxpbmtzJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTGlua3NDb250cm9sbGVyLiRpbmplY3QgPSBbXCJsaW5rU2VydmljZVwiLCBcInJlc29sdmVkTGlua3NcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzQ29udHJvbGxlcicsIExpbmtzQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NDb250cm9sbGVyIChsaW5rU2VydmljZSwgcmVzb2x2ZWRMaW5rcykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0FsbCBsaW5rczogJyArIHJlc29sdmVkTGlua3MuY291bnQ7XHJcbiAgICAgICAgc2VsZi5saW5rcyA9IHJlc29sdmVkTGlua3MubGlua3M7XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtEZXRhaWxzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtEZXRhaWxzQ29udHJvbGxlcicsIExpbmtEZXRhaWxzQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua0RldGFpbHNDb250cm9sbGVyIChsaW5rU2VydmljZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0xpbmsgZGV0YWlscyc7XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIiwgXCIkdXJsUm91dGVyUHJvdmlkZXJcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIGdldFVzZXJMaW5rcy4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcIiRyb290U2NvcGVcIl07XHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnaG9tZScpO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvaG9tZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUvdmlld3MvbWFpbi5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFVzZXJMaW5rczogZ2V0VXNlckxpbmtzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyTGlua3MgKGxpbmtTZXJ2aWNlLCBBbGVydGlmeSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRVc2VyTGlua3MoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc2hvd015TGlua3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMuZGF0YS5saW5rcycsIHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgSG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcInJlc29sdmVkVXNlckxpbmtzXCIsIFwiQWxlcnRpZnlcIiwgXCJsaW5rU2VydmljZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIgKHJlc29sdmVkVXNlckxpbmtzLCBBbGVydGlmeSwgbGlua1NlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi50aXRsZSA9ICdNeSBsaW5rcyc7XHJcbiAgICAgICAgc2VsZi5hZGRMaW5rID0gYWRkTGluaztcclxuICAgICAgICBzZWxmLnVzZXJMaW5rcyA9IHJlc29sdmVkVXNlckxpbmtzO1xyXG4gICAgICAgIHNlbGYuY2hhbmdlID0gY2hhbmdlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRMaW5rIChsaW5rKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuYWRkTGluayhsaW5rKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oYWRkTGlua1Jlc3VsdClcclxuICAgICAgICAgICAgICAgIC5jYXRjaChhZGRMaW5rRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkTGlua1Jlc3VsdCAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmxpbmsgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkTGlua0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZSAoKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0VXNlckxpbmtzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldExpbmtzUmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldExpbmtzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NSZXN1bHQgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51c2VyTGlua3MgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NFcnJvciAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoSW50ZXJjZXBvci4kaW5qZWN0ID0gW1wiJGNvb2tpZXNcIiwgXCIkcm9vdFNjb3BlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoSW50ZXJjZXBvcicsIGF1dGhJbnRlcmNlcG9yKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXBvciAoJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgYXV0aEludGVyY2Vwb3IgPSB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gcmVzcG9uc2UuaGVhZGVycygneC1hY2Nlc3MtdG9rZW4nKSxcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHJlc3BvbnNlLmhlYWRlcnMoJ2lkJyksXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlck5hbWUgPSByZXNwb25zZS5oZWFkZXJzKCd1c2VyTmFtZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRjb29raWVzLnB1dCgndG9rZW4nLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkKSB7ICRjb29raWVzLnB1dCgnaWQnLCBpZCk7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlck5hbWUpIHsgJGNvb2tpZXMucHV0KCd1c2VyTmFtZScsIHVzZXJOYW1lKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nZ2VkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBhdXRoSW50ZXJjZXBvcjtcclxuXHJcbiAgICB9XHJcbn0oKSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
