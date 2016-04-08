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

        function getModal (animationsEnabled, pathToTmpl, controller, controllerAs, data) {
            return $uibModal.open({
                animation: animationsEnabled,
                templateUrl: pathToTmpl,
                controller: controller,
                controllerAs: controllerAs,
                resolve: {
                    data: function () {
                        return data;
                    }
                }

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
    NavBarController.$inject = ["$rootScope", "modalService"];
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
    LinkDetailsController.$inject = ["data"];
    angular
        .module('InBrief')
        .controller('LinkDetailsController', LinkDetailsController);

    function LinkDetailsController (data) {
        var self = this;
        self.title = 'Link details';
        self.link = data.link;
        self.sum = data.sum;
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
    LinksTableController.$inject = ["modalService", "linkService", "Alertify"];
    angular
        .module('InBrief')
        .controller('LinksTableController', LinksTableController);

    function LinksTableController (modalService, linkService, Alertify) {
        var self = this;
        self.linkDetails = linkDetails;



        function linkDetails (linkId) {
            console.log('linkId', linkId);
            linkService
                .getLinkById(linkId)
                .then(getlinkDetailsSuccess)
                .catch(getlinkDetailsError);


        }

        function getlinkDetailsSuccess (res) {
            console.log('res.data', res.data);
            var modalInstance = modalService.getModal(true, 'common/modals.tmpl/templates/linkDetails-tmpl.html', 'LinkDetailsController', 'linkDetailsCtrl', res.data);
        }
        function getlinkDetailsError (err) {
            Alertify.error(err.data.message);
        }

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
        self.getLinkById = getLinkById;

        function getLinks () {
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
        function getLinkById (linkId) {

            console.log('linkId', linkId);
            return $http({
                method: 'GET',
                url: 'api/links/' + linkId
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
    HomeController.$inject = ["resolvedUserLinks", "Alertify", "linkService", "$rootScope"];
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController (resolvedUserLinks, Alertify, linkService, $rootScope) {
        var self = this;
        self.title = 'My links';
        self.addLink = addLink;
        self.userLinks = resolvedUserLinks;
        self.change = change;
        $rootScope.$on('logout', clean);

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
        function clean () {
            self.userLinks = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9tb2RhbC5zZXJ2aWNlL21vZGFsLnNlcnZpY2UuanMiLCJjb21tb24vc2VydmljZXMvaG9zdC5zZXJ2aWNlL2hvc3Quc2VydmljZS5qcyIsImNvbW1vbi9uYXZCYXIvZGlyZWN0aXZlL25hdkJhci5kaXJlY3RpdmUuanMiLCJjb21tb24vbmF2QmFyL2NvbnRyb2xsZXJzL25hdkJhckNvbnRyb2xsZXIuanMiLCJjb21tb24vbW9kYWxzLnRtcGwvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9tb2RhbHMudG1wbC9jb250cm9sbGVycy9MaW5rRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb21tb24vbGlua3NUYWJsZS9kaXJlY3RpdmUvbGlua3NUYWJsZS5kaXJlY3RpdmUuanMiLCJjb21tb24vbGlua3NUYWJsZS9jb250cm9sbGVyL0xpbmtzVGFibGVDb250cm9sbGVyLmpzIiwiY29tbW9uL2F1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmpzIiwiY29tbW9uL2F1dGgvZGlyZWN0aXZlcy9hdXRoRm9ybS5kaXJlY3RpdmUuanMiLCJjb21tb24vYXV0aC9jb250cm9sbGVycy9hdXRoRm9ybUNvbnRyb2xsZXIuanMiLCJsaW5rcy9zZXJ2aWNlcy9saW5rcy5zZXJ2aWNlLmpzIiwibGlua3Mvcm91dGVzL3JvdXRlcy5qcyIsImxpbmtzL2NvbnRyb2xsZXJzL0xpbmtzQ29udHJvbGxlci5qcyIsImhvbWUvcm91dGVzL3JvdXRlcy5qcyIsImhvbWUvY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJpbnRlcmNlcHRvcnMvYXV0aEludGVyY2VwdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRodHRwUHJvdmlkZXJcIl07XHJcbiAgICBydW5CbG9jay4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiRjb29raWVzXCIsIFwiYXV0aFNlcnZpY2VcIiwgXCJob3N0U2VydmljZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJywgW1xyXG4gICAgICAgICAgICAndWkucm91dGVyJyxcclxuICAgICAgICAgICAgJ0FsZXJ0aWZ5JyxcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAgICAgICAgICduZ0Nvb2tpZXMnXHJcbiAgICAgICAgXSlcclxuICAgICAgICAuY29uZmlnKGNvbmZpZylcclxuICAgICAgICAucnVuKHJ1bkJsb2NrKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRodHRwUHJvdmlkZXIpIHtcclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXBvcicpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcnVuQmxvY2sgKCRyb290U2NvcGUsICRjb29raWVzLCBhdXRoU2VydmljZSwgaG9zdFNlcnZpY2UpIHtcclxuICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS5ob3N0ID0gaG9zdFNlcnZpY2UuZ2V0SG9zdCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdob3N0U2VydmljZS5nZXRIb3N0KCknLCBob3N0U2VydmljZS5nZXRIb3N0KCkpO1xyXG5cclxuICAgICAgICBhdXRoU2VydmljZS5kZWZhdWx0UmVxdWVzdCgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkY29va2llcy5nZXRBbGwoKSwgZnVuY3Rpb24gKHYsIGspIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGspXHJcbiAgICAgICAgICAgICAgICAkY29va2llcy5yZW1vdmUoayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnbW9kYWxTZXJ2aWNlJywgbW9kYWxTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb2RhbFNlcnZpY2UoJHVpYk1vZGFsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZ2V0TW9kYWwgPSBnZXRNb2RhbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9kYWwgKGFuaW1hdGlvbnNFbmFibGVkLCBwYXRoVG9UbXBsLCBjb250cm9sbGVyLCBjb250cm9sbGVyQXMsIGRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uc0VuYWJsZWQsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcGF0aFRvVG1wbCxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IGNvbnRyb2xsZXJBcyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBob3N0U2VydmljZS4kaW5qZWN0ID0gW1wiJGxvY2F0aW9uXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdob3N0U2VydmljZScsIGhvc3RTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBob3N0U2VydmljZSgkbG9jYXRpb24pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRIb3N0ID0gZ2V0SG9zdDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SG9zdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkbG9jYXRpb24ucHJvdG9jb2woKSArICc6Ly8nICsgJGxvY2F0aW9uLmhvc3QoKSArICc6JyArICRsb2NhdGlvbi5wb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbmF2QmFyJywgbmF2QmFyRm4pO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5hdkJhckZuICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9uYXZCYXIvdmlld3MvbmF2LWJhci10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTmF2QmFyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ25hdkJhcidcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBOYXZCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwibW9kYWxTZXJ2aWNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdOYXZCYXJDb250cm9sbGVyJywgTmF2QmFyQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTmF2QmFyQ29udHJvbGxlciAoJHJvb3RTY29wZSwgbW9kYWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmFuaW1hdGlvbnNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLm9wZW4gPSBvcGVuO1xyXG4gICAgICAgIHNlbGYubG9nb3V0ID0gbG9nb3V0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuICgpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSBtb2RhbFNlcnZpY2UuZ2V0TW9kYWwodHJ1ZSwgJ2NvbW1vbi9tb2RhbHMudG1wbC90ZW1wbGF0ZXMvbW9kYWxBdXRoLXRtcGwuaHRtbCcsICdNb2RhbEF1dGhDb250cm9sbGVyJywgJ21vZGFsQXV0aCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWxBdXRoQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vZGFsQXV0aENvbnRyb2xsZXInLCBNb2RhbEF1dGhDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBNb2RhbEF1dGhDb250cm9sbGVyICgkdWliTW9kYWxJbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTGlua0RldGFpbHNDb250cm9sbGVyLiRpbmplY3QgPSBbXCJkYXRhXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rRGV0YWlsc0NvbnRyb2xsZXInLCBMaW5rRGV0YWlsc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIExpbmtEZXRhaWxzQ29udHJvbGxlciAoZGF0YSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0xpbmsgZGV0YWlscyc7XHJcbiAgICAgICAgc2VsZi5saW5rID0gZGF0YS5saW5rO1xyXG4gICAgICAgIHNlbGYuc3VtID0gZGF0YS5zdW07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdsaW5rc1RhYmxlJywgbGlua3NUYWJsZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGlua3NUYWJsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vbGlua3NUYWJsZS90ZW1wbGF0ZS9saW5rc1RhYmxlLXRtcGwuanMuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc1RhYmxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2xpbmtzVGFibGVDdHJsJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgbGlua3M6ICc9JyxcclxuICAgICAgICAgICAgICAgIGRldGFpbHM6ICcmJyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnPSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtzVGFibGVDb250cm9sbGVyLiRpbmplY3QgPSBbXCJtb2RhbFNlcnZpY2VcIiwgXCJsaW5rU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5rc1RhYmxlQ29udHJvbGxlcicsIExpbmtzVGFibGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rc1RhYmxlQ29udHJvbGxlciAobW9kYWxTZXJ2aWNlLCBsaW5rU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5saW5rRGV0YWlscyA9IGxpbmtEZXRhaWxzO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmtEZXRhaWxzIChsaW5rSWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2xpbmtJZCcsIGxpbmtJZCk7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua0J5SWQobGlua0lkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZ2V0bGlua0RldGFpbHNTdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldGxpbmtEZXRhaWxzRXJyb3IpO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRsaW5rRGV0YWlsc1N1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVzLmRhdGEnLCByZXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gbW9kYWxTZXJ2aWNlLmdldE1vZGFsKHRydWUsICdjb21tb24vbW9kYWxzLnRtcGwvdGVtcGxhdGVzL2xpbmtEZXRhaWxzLXRtcGwuaHRtbCcsICdMaW5rRGV0YWlsc0NvbnRyb2xsZXInLCAnbGlua0RldGFpbHNDdHJsJywgcmVzLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBnZXRsaW5rRGV0YWlsc0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwVXNlciA9IHNpZ251cFVzZXI7XHJcbiAgICAgICAgc2VsZi5kZWZhdWx0UmVxdWVzdCA9IGRlZmF1bHRSZXF1ZXN0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3NpZ251cCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWZhdWx0UmVxdWVzdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnYXV0aEZvcm0nLCBhdXRoRm9ybSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aEZvcm0gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2F1dGgvdG1wbC9hdXRoLWZvcm0tdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0F1dGhGb3JtQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2F1dGhmb3JtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgY2xvc2U6ICcmJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgQXV0aEZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCIsIFwiJHN0YXRlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBdXRoRm9ybUNvbnRyb2xsZXInLCBBdXRoRm9ybUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEF1dGhGb3JtQ29udHJvbGxlciAoYXV0aFNlcnZpY2UsIEFsZXJ0aWZ5LCAkc3RhdGUpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5sb2dpbiA9IGxvZ2luO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwID0gc2lnbnVwO1xyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gY2FuY2VsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpbiAodXNlcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXNlcicsIHVzZXIpO1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmxvZ2luVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4obG9naW5TdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2dpblN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaWdudXAgKHVzZXIpIHtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UuXHJcbiAgICAgICAgICAgICAgICBzaWdudXBVc2VyKHVzZXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzaWduVXBTdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzaWduVXBTdWNjZXNzIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcygnTG9nIGluLCBwbGVhc2UnKTtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi51c2VyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsICgpIHtcclxuICAgICAgICAgICAgc2VsZi51c2VyID0gbnVsbDtcclxuICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBlcnJvckhhbmRsZXIgKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgbGlua1NlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdsaW5rU2VydmljZScsIGxpbmtTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaW5rU2VydmljZSgkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmdldExpbmtzID0gZ2V0TGlua3M7XHJcbiAgICAgICAgc2VsZi5hZGRMaW5rID0gYWRkTGluaztcclxuICAgICAgICBzZWxmLmdldFVzZXJMaW5rcyA9IGdldFVzZXJMaW5rcztcclxuICAgICAgICBzZWxmLmdldExpbmtCeUlkID0gZ2V0TGlua0J5SWQ7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGluayAobGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogbGlua1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFVzZXJMaW5rcyAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3VzZXJMaW5rcydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtCeUlkIChsaW5rSWQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsaW5rSWQnLCBsaW5rSWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rcy8nICsgbGlua0lkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICBnZXRMaW5rcy4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJHN0YXRlUHJvdmlkZXInLCAkc3RhdGVQcm92aWRlcik7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9saW5rcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpc3RMaW5rcy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZExpbmtzOiBnZXRMaW5rc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2RldGFpbHMnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpbmtEZXRhaWxzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpbmtEZXRhaWxzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rRGV0YWlscydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzIChsaW5rU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0TGlua3MoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtzOiByZXMuZGF0YS5saW5rcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHJlcy5kYXRhLmNvdW50XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKCdFcnJvciBnZXR0aW5nIGxpbmtzJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTGlua3NDb250cm9sbGVyLiRpbmplY3QgPSBbXCJsaW5rU2VydmljZVwiLCBcInJlc29sdmVkTGlua3NcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzQ29udHJvbGxlcicsIExpbmtzQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NDb250cm9sbGVyIChsaW5rU2VydmljZSwgcmVzb2x2ZWRMaW5rcykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnRpdGxlID0gJ0FsbCBsaW5rczogJyArIHJlc29sdmVkTGlua3MuY291bnQ7XHJcbiAgICAgICAgc2VsZi5saW5rcyA9IHJlc29sdmVkTGlua3MubGlua3M7XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIiwgXCIkdXJsUm91dGVyUHJvdmlkZXJcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgIGdldFVzZXJMaW5rcy4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiLCBcIiRyb290U2NvcGVcIl07XHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnaG9tZScpO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvaG9tZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUvdmlld3MvbWFpbi5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFVzZXJMaW5rczogZ2V0VXNlckxpbmtzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyTGlua3MgKGxpbmtTZXJ2aWNlLCBBbGVydGlmeSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRVc2VyTGlua3MoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc2hvd015TGlua3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMuZGF0YS5saW5rcycsIHJlcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcignRXJyb3IgZ2V0dGluZyBsaW5rcycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgSG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFtcInJlc29sdmVkVXNlckxpbmtzXCIsIFwiQWxlcnRpZnlcIiwgXCJsaW5rU2VydmljZVwiLCBcIiRyb290U2NvcGVcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyIChyZXNvbHZlZFVzZXJMaW5rcywgQWxlcnRpZnksIGxpbmtTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYudGl0bGUgPSAnTXkgbGlua3MnO1xyXG4gICAgICAgIHNlbGYuYWRkTGluayA9IGFkZExpbms7XHJcbiAgICAgICAgc2VsZi51c2VyTGlua3MgPSByZXNvbHZlZFVzZXJMaW5rcztcclxuICAgICAgICBzZWxmLmNoYW5nZSA9IGNoYW5nZTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgY2xlYW4pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRMaW5rIChsaW5rKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuYWRkTGluayhsaW5rKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oYWRkTGlua1Jlc3VsdClcclxuICAgICAgICAgICAgICAgIC5jYXRjaChhZGRMaW5rRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkTGlua1Jlc3VsdCAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmxpbmsgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkTGlua0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZSAoKSB7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0VXNlckxpbmtzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldExpbmtzUmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldExpbmtzRXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3NSZXN1bHQgKHJlcykge1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudXNlckxpbmtzID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldExpbmtzRXJyb3IgKGVycikge1xyXG4gICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY2xlYW4gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnVzZXJMaW5rcyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYXV0aEludGVyY2Vwb3IuJGluamVjdCA9IFtcIiRjb29raWVzXCIsIFwiJHJvb3RTY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2Vwb3InLCBhdXRoSW50ZXJjZXBvcik7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aEludGVyY2Vwb3IgKCRjb29raWVzLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIGF1dGhJbnRlcmNlcG9yID0ge1xyXG4gICAgICAgICAgICByZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHJlc3BvbnNlLmhlYWRlcnMoJ3gtYWNjZXNzLXRva2VuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXNwb25zZS5oZWFkZXJzKCdpZCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJOYW1lID0gcmVzcG9uc2UuaGVhZGVycygndXNlck5hbWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ3Rva2VuJywgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCkgeyAkY29va2llcy5wdXQoJ2lkJywgaWQpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJOYW1lKSB7ICRjb29raWVzLnB1dCgndXNlck5hbWUnLCB1c2VyTmFtZSk7IH1cclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ2dlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gYXV0aEludGVyY2Vwb3I7XHJcblxyXG4gICAgfVxyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
