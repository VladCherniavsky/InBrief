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
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        function loggedProcess () {
            self.logged = true;
        }

        function logoutProcess () {
            self.logged = false;
        }

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
                details: '&'
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
                .then(function (res) {
                    if (res.data.success) {
                        $state.go('/');
                        Alertify.success(res.data.message);
                    } else {
                        console.log(res);
                        Alertify.error(res.data.message);
                    }
                    self.close();
                }).catch(function (err) {
                    console.log(err);
                    Alertify.error(err.data.error.message);
                });
            console.log('user', user);

        }
        function signup (user) {
            authService.
                signupUser(user)
                .then(function (res) {
                    if (res.data.success) {
                        Alertify.success(res.data.message);
                    } else {
                        console.log(res);
                        Alertify.error(res.data.c);
                    }
                    self.loginTab = true;
                    self.user = null;
                }).catch(function (err) {
                    console.log(err);
                    Alertify.error(err.data.error.message);
                });

        }

        function cancel () {
            self.user = null;
            self.close();
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

    }
}());
(function () {
    config.$inject = ["$stateProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        getLinks.$inject = ["linkService", "Alertify"];
        $stateProvider
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html',
                controller: 'LinksController',
                controllerAs: 'linksCtrl',
                resolve: {
                    resolvedLinks: getLinks
                }
            });

        function getLinks (linkService, Alertify) {
            return linkService
                .getLinks()
                .then(function (res) {
                    return res.data.links;
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
        self.links = resolvedLinks;
    }
}());
(function () {
    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'home/views/main.html',
                controller: 'HomeController',
                controllerAs: 'home'
            });
    }
} ());
(function () {
    HomeController.$inject = ["$rootScope", "linkService", "Alertify"];
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController ($rootScope, linkService, Alertify) {
        var self = this;
        self.logged = $rootScope.logged;
        self.addLink = addLink;

        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        function addLink (link) {
            console.log('link', link);
            link.tags = link.tags.split();
            console.log('link', link);
            linkService
                .addLink(link)
                .then(addLinkResult)
                .catch(addLinkError);
        }

        function addLinkResult (res) {
            self.link = null;
            console.log('res', res);
            Alertify.success(res.data.message);
        }
        function addLinkError (err) {
            Alertify.error(err.data.message);
        }

        function loggedProcess () {
            self.logged = true;
        }

        function logoutProcess () {
            self.logged = false;
            $rootScope.logged = false;
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
            request: function (config) {
                return config;
            },
            response: function(response) {
                var token = response.headers('x-access-token');
                if (token !== null) {
                    $cookies.put('token', token);
                    if (response.data.user) { $cookies.put('id', response.data.user.id); }
                    if (response.data.user) { $cookies.put('userName', response.data.user.userName); }
                    $rootScope.$broadcast('logged');
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9tb2RhbC5zZXJ2aWNlL21vZGFsLnNlcnZpY2UuanMiLCJjb21tb24vc2VydmljZXMvaG9zdC5zZXJ2aWNlL2hvc3Quc2VydmljZS5qcyIsImNvbW1vbi9uYXZCYXIvZGlyZWN0aXZlL25hdkJhci5kaXJlY3RpdmUuanMiLCJjb21tb24vbmF2QmFyL2NvbnRyb2xsZXJzL25hdkJhckNvbnRyb2xsZXIuanMiLCJjb21tb24vbW9kYWxzLnRtcGwvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9saW5rc1RhYmxlL2RpcmVjdGl2ZS9saW5rc1RhYmxlLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9saW5rc1RhYmxlL2NvbnRyb2xsZXIvTGlua3NUYWJsZUNvbnRyb2xsZXIuanMiLCJjb21tb24vYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuanMiLCJjb21tb24vYXV0aC9kaXJlY3RpdmVzL2F1dGhGb3JtLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9hdXRoL2NvbnRyb2xsZXJzL2F1dGhGb3JtQ29udHJvbGxlci5qcyIsImxpbmtzL3NlcnZpY2VzL2xpbmtzLnNlcnZpY2UuanMiLCJsaW5rcy9yb3V0ZXMvcm91dGVzLmpzIiwibGlua3MvY29udHJvbGxlcnMvTGlua3NDb250cm9sbGVyLmpzIiwiaG9tZS9yb3V0ZXMvcm91dGVzLmpzIiwiaG9tZS9jb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcyIsImludGVyY2VwdG9ycy9hdXRoSW50ZXJjZXB0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkaHR0cFByb3ZpZGVyXCJdO1xyXG4gICAgcnVuQmxvY2suJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCIkY29va2llc1wiLCBcImF1dGhTZXJ2aWNlXCIsIFwiaG9zdFNlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicsIFtcclxuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXHJcbiAgICAgICAgICAgICdBbGVydGlmeScsXHJcbiAgICAgICAgICAgICd1aS5ib290c3RyYXAnLFxyXG4gICAgICAgICAgICAnbmdDb29raWVzJ1xyXG4gICAgICAgIF0pXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAgICAgLnJ1bihydW5CbG9jayk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29uZmlnICgkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2Vwb3InKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJ1bkJsb2NrICgkcm9vdFNjb3BlLCAkY29va2llcywgYXV0aFNlcnZpY2UsIGhvc3RTZXJ2aWNlKSB7XHJcbiAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGxvZ291dFByb2Nlc3MpO1xyXG4gICAgICAgICRyb290U2NvcGUuaG9zdCA9IGhvc3RTZXJ2aWNlLmdldEhvc3QoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnaG9zdFNlcnZpY2UuZ2V0SG9zdCgpJywgaG9zdFNlcnZpY2UuZ2V0SG9zdCgpKTtcclxuXHJcbiAgICAgICAgYXV0aFNlcnZpY2UuZGVmYXVsdFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nZ2VkUHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJGNvb2tpZXMuZ2V0QWxsKCksIGZ1bmN0aW9uICh2LCBrKSB7XHJcbiAgICAgICAgICAgICAgICAkY29va2llcy5yZW1vdmUoayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnbW9kYWxTZXJ2aWNlJywgbW9kYWxTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb2RhbFNlcnZpY2UoJHVpYk1vZGFsKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZ2V0TW9kYWwgPSBnZXRNb2RhbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9kYWwgKGFuaW1hdGlvbnNFbmFibGVkLCBwYXRoVG9UbXBsLCBjb250cm9sbGVyLCBjb250cm9sbGVyQXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uc0VuYWJsZWQsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcGF0aFRvVG1wbCxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IGNvbnRyb2xsZXJBc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgaG9zdFNlcnZpY2UuJGluamVjdCA9IFtcIiRsb2NhdGlvblwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnaG9zdFNlcnZpY2UnLCBob3N0U2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaG9zdFNlcnZpY2UoJGxvY2F0aW9uKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYuZ2V0SG9zdCA9IGdldEhvc3Q7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEhvc3QgKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGxvY2F0aW9uLnByb3RvY29sKCkgKyAnOi8vJyArICRsb2NhdGlvbi5ob3N0KCkgKyAnOicgKyAkbG9jYXRpb24ucG9ydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ25hdkJhcicsIG5hdkJhckZuKTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZCYXJGbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vbmF2QmFyL3ZpZXdzL25hdi1iYXItdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdkJhckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICduYXZCYXInXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTmF2QmFyQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwiJHJvb3RTY29wZVwiLCBcIiR0aW1lb3V0XCIsIFwiJGNvb2tpZXNcIiwgXCJtb2RhbFNlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ05hdkJhckNvbnRyb2xsZXInLCBOYXZCYXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBOYXZCYXJDb250cm9sbGVyICgkdWliTW9kYWwsICRyb290U2NvcGUsICR0aW1lb3V0LCAkY29va2llcywgbW9kYWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmFuaW1hdGlvbnNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLm9wZW4gPSBvcGVuO1xyXG4gICAgICAgIHNlbGYubG9nb3V0ID0gbG9nb3V0O1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgc2VsZi5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW4gKCkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9IG1vZGFsU2VydmljZS5nZXRNb2RhbCh0cnVlLCAnY29tbW9uL21vZGFscy50bXBsL3RlbXBsYXRlcy9tb2RhbEF1dGgtdG1wbC5odG1sJywgJ01vZGFsQXV0aENvbnRyb2xsZXInLCAnbW9kYWxBdXRoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCAoKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nb3V0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBNb2RhbEF1dGhDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxJbnN0YW5jZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTW9kYWxBdXRoQ29udHJvbGxlcicsIE1vZGFsQXV0aENvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1vZGFsQXV0aENvbnRyb2xsZXIgKCR1aWJNb2RhbEluc3RhbmNlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbGlua3NUYWJsZScsIGxpbmtzVGFibGUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxpbmtzVGFibGUgKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2xpbmtzVGFibGUvdGVtcGxhdGUvbGlua3NUYWJsZS10bXBsLmpzLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTGlua3NUYWJsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsaW5rc1RhYmxlQ3RybCcsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIGxpbmtzOiAnPScsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzOiAnJidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua3NUYWJsZUNvbnRyb2xsZXInLCBMaW5rc1RhYmxlQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NUYWJsZUNvbnRyb2xsZXIgKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwVXNlciA9IHNpZ251cFVzZXI7XHJcbiAgICAgICAgc2VsZi5kZWZhdWx0UmVxdWVzdCA9IGRlZmF1bHRSZXF1ZXN0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3NpZ251cCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWZhdWx0UmVxdWVzdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnYXV0aEZvcm0nLCBhdXRoRm9ybSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aEZvcm0gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2F1dGgvdG1wbC9hdXRoLWZvcm0tdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0F1dGhGb3JtQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2F1dGhmb3JtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgY2xvc2U6ICcmJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgQXV0aEZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCIsIFwiJHN0YXRlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBdXRoRm9ybUNvbnRyb2xsZXInLCBBdXRoRm9ybUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEF1dGhGb3JtQ29udHJvbGxlciAoYXV0aFNlcnZpY2UsIEFsZXJ0aWZ5LCAkc3RhdGUpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5sb2dpbiA9IGxvZ2luO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwID0gc2lnbnVwO1xyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gY2FuY2VsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpbiAodXNlcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXNlcicsIHVzZXIpO1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmxvZ2luVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnLycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKHJlcy5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXNlcicsIHVzZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2lnbnVwICh1c2VyKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLlxyXG4gICAgICAgICAgICAgICAgc2lnbnVwVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgbGlua1NlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdsaW5rU2VydmljZScsIGxpbmtTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaW5rU2VydmljZSgkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmdldExpbmtzID0gZ2V0TGlua3M7XHJcbiAgICAgICAgc2VsZi5hZGRMaW5rID0gYWRkTGluaztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3MgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGluayAobGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogbGlua1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgZ2V0TGlua3MuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIl07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9saW5rcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpc3RMaW5rcy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZExpbmtzOiBnZXRMaW5rc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3MgKGxpbmtTZXJ2aWNlLCBBbGVydGlmeSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRMaW5rcygpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhLmxpbmtzO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoJ0Vycm9yIGdldHRpbmcgbGlua3MnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0gKCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBMaW5rc0NvbnRyb2xsZXIuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwicmVzb2x2ZWRMaW5rc1wiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua3NDb250cm9sbGVyJywgTGlua3NDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rc0NvbnRyb2xsZXIgKGxpbmtTZXJ2aWNlLCByZXNvbHZlZExpbmtzKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubGlua3MgPSByZXNvbHZlZExpbmtzO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJHVybFJvdXRlclByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnLycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lL3ZpZXdzL21haW4uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnaG9tZSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0gKCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcImxpbmtTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyICgkcm9vdFNjb3BlLCBsaW5rU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5sb2dnZWQgPSAkcm9vdFNjb3BlLmxvZ2dlZDtcclxuICAgICAgICBzZWxmLmFkZExpbmsgPSBhZGRMaW5rO1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGxvZ291dFByb2Nlc3MpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRMaW5rIChsaW5rKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsaW5rJywgbGluayk7XHJcbiAgICAgICAgICAgIGxpbmsudGFncyA9IGxpbmsudGFncy5zcGxpdCgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbGluaycsIGxpbmspO1xyXG4gICAgICAgICAgICBsaW5rU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmFkZExpbmsobGluaylcclxuICAgICAgICAgICAgICAgIC50aGVuKGFkZExpbmtSZXN1bHQpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goYWRkTGlua0Vycm9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZExpbmtSZXN1bHQgKHJlcykge1xyXG4gICAgICAgICAgICBzZWxmLmxpbmsgPSBudWxsO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVzJywgcmVzKTtcclxuICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGlua0Vycm9yIChlcnIpIHtcclxuICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgc2VsZi5sb2dnZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoSW50ZXJjZXBvci4kaW5qZWN0ID0gW1wiJGNvb2tpZXNcIiwgXCIkcm9vdFNjb3BlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoSW50ZXJjZXBvcicsIGF1dGhJbnRlcmNlcG9yKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXBvciAoJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgYXV0aEludGVyY2Vwb3IgPSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gcmVzcG9uc2UuaGVhZGVycygneC1hY2Nlc3MtdG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRjb29raWVzLnB1dCgndG9rZW4nLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudXNlcikgeyAkY29va2llcy5wdXQoJ2lkJywgcmVzcG9uc2UuZGF0YS51c2VyLmlkKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnVzZXIpIHsgJGNvb2tpZXMucHV0KCd1c2VyTmFtZScsIHJlc3BvbnNlLmRhdGEudXNlci51c2VyTmFtZSk7IH1cclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ2dlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gYXV0aEludGVyY2Vwb3I7XHJcblxyXG4gICAgfVxyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
