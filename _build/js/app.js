(function() {
    config.$inject = ["$httpProvider"];
    runBlock.$inject = ["$rootScope", "$cookies", "authService"];
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
    function runBlock ($rootScope, $cookies, authService) {
        $rootScope.logged = false;
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

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
    AuthFormController.$inject = ["authService", "Alertify"];
    angular
        .module('InBrief')
        .controller('AuthFormController', AuthFormController);

    function AuthFormController (authService, Alertify) {
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
    config.$inject = ["$stateProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
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
                    console.log('check',response.headers('x-access-token'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9uYXZCYXIvZGlyZWN0aXZlL25hdkJhci5kaXJlY3RpdmUuanMiLCJjb21tb24vbmF2QmFyL2NvbnRyb2xsZXJzL25hdkJhckNvbnRyb2xsZXIuanMiLCJjb21tb24vbW9kYWxzLnRtcGwvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9hdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImNvbW1vbi9hdXRoL2RpcmVjdGl2ZXMvYXV0aEZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvc2VydmljZXMvbGlua3Muc2VydmljZS5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0NvbnRyb2xsZXIuanMiLCJob21lL3JvdXRlcy9yb3V0ZXMuanMiLCJob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiY29tbW9uL21vZGFsLnNlcnZpY2UvbW9kYWwuc2VydmljZS5qcyIsImludGVyY2VwdG9ycy9hdXRoSW50ZXJjZXB0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRodHRwUHJvdmlkZXJcIl07XHJcbiAgICBydW5CbG9jay4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiRjb29raWVzXCIsIFwiYXV0aFNlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicsIFtcclxuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXHJcbiAgICAgICAgICAgICdBbGVydGlmeScsXHJcbiAgICAgICAgICAgICd1aS5ib290c3RyYXAnLFxyXG4gICAgICAgICAgICAnbmdDb29raWVzJ1xyXG4gICAgICAgIF0pXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAgICAgLnJ1bihydW5CbG9jayk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29uZmlnICgkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2Vwb3InKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJ1bkJsb2NrICgkcm9vdFNjb3BlLCAkY29va2llcywgYXV0aFNlcnZpY2UpIHtcclxuICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XHJcblxyXG4gICAgICAgIGF1dGhTZXJ2aWNlLmRlZmF1bHRSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRjb29raWVzLmdldEFsbCgpLCBmdW5jdGlvbiAodiwgaykge1xyXG4gICAgICAgICAgICAgICAgJGNvb2tpZXMucmVtb3ZlKGspO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCduYXZCYXInLCBuYXZCYXJGbik7XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2QmFyRm4gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9uYXYtYmFyLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXZCYXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbmF2QmFyJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE5hdkJhckNvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcIiRyb290U2NvcGVcIiwgXCIkdGltZW91dFwiLCBcIiRjb29raWVzXCIsIFwibW9kYWxTZXJ2aWNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdOYXZCYXJDb250cm9sbGVyJywgTmF2QmFyQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTmF2QmFyQ29udHJvbGxlciAoJHVpYk1vZGFsLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgJGNvb2tpZXMsIG1vZGFsU2VydmljZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5hbmltYXRpb25zRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5vcGVuID0gb3BlbjtcclxuICAgICAgICBzZWxmLmxvZ291dCA9IGxvZ291dDtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGxvZ291dFByb2Nlc3MpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgc2VsZi5sb2dnZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuICgpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSBtb2RhbFNlcnZpY2UuZ2V0TW9kYWwodHJ1ZSwgJ2NvbW1vbi9tb2RhbHMudG1wbC90ZW1wbGF0ZXMvbW9kYWxBdXRoLXRtcGwuaHRtbCcsICdNb2RhbEF1dGhDb250cm9sbGVyJywgJ21vZGFsQXV0aCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWxBdXRoQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vZGFsQXV0aENvbnRyb2xsZXInLCBNb2RhbEF1dGhDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBNb2RhbEF1dGhDb250cm9sbGVyICgkdWliTW9kYWxJbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwVXNlciA9IHNpZ251cFVzZXI7XHJcbiAgICAgICAgc2VsZi5kZWZhdWx0UmVxdWVzdCA9IGRlZmF1bHRSZXF1ZXN0O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3NpZ251cCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBkZWZhdWx0UmVxdWVzdCAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnYXV0aEZvcm0nLCBhdXRoRm9ybSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aEZvcm0gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2F1dGgvdG1wbC9hdXRoLWZvcm0tdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0F1dGhGb3JtQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2F1dGhmb3JtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xyXG4gICAgICAgICAgICAgICAgY2xvc2U6ICcmJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgQXV0aEZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBdXRoRm9ybUNvbnRyb2xsZXInLCBBdXRoRm9ybUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEF1dGhGb3JtQ29udHJvbGxlciAoYXV0aFNlcnZpY2UsIEFsZXJ0aWZ5KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYubG9naW4gPSBsb2dpbjtcclxuICAgICAgICBzZWxmLnNpZ251cCA9IHNpZ251cDtcclxuICAgICAgICBzZWxmLmNhbmNlbCA9IGNhbmNlbDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5sb2dpblVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKHJlcy5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXNlcicsIHVzZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2lnbnVwICh1c2VyKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLlxyXG4gICAgICAgICAgICAgICAgc2lnbnVwVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgbGlua1NlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdsaW5rU2VydmljZScsIGxpbmtTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBsaW5rU2VydmljZSgkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmdldExpbmtzID0gZ2V0TGlua3M7XHJcbiAgICAgICAgc2VsZi5hZGRMaW5rID0gYWRkTGluaztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3MgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGluayAobGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbGlua3MnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogbGlua1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgZ2V0TGlua3MuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIl07XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9saW5rcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpc3RMaW5rcy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZExpbmtzOiBnZXRMaW5rc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlua3MgKGxpbmtTZXJ2aWNlLCBBbGVydGlmeSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlua1NlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXRMaW5rcygpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhLmxpbmtzO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IoJ0Vycm9yIGdldHRpbmcgbGlua3MnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0gKCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBMaW5rc0NvbnRyb2xsZXIuJGluamVjdCA9IFtcImxpbmtTZXJ2aWNlXCIsIFwicmVzb2x2ZWRMaW5rc1wiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTGlua3NDb250cm9sbGVyJywgTGlua3NDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBMaW5rc0NvbnRyb2xsZXIgKGxpbmtTZXJ2aWNlLCByZXNvbHZlZExpbmtzKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNlbGYubGlua3MgPSByZXNvbHZlZExpbmtzO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUvdmlld3MvbWFpbi5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIgKCRyb290U2NvcGUsIGxpbmtTZXJ2aWNlLCBBbGVydGlmeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxvZ2dlZCA9ICRyb290U2NvcGUubG9nZ2VkO1xyXG4gICAgICAgIHNlbGYuYWRkTGluayA9IGFkZExpbms7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZExpbmsgKGxpbmspIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2xpbmsnLCBsaW5rKTtcclxuICAgICAgICAgICAgbGluay50YWdzID0gbGluay50YWdzLnNwbGl0KCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsaW5rJywgbGluayk7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuYWRkTGluayhsaW5rKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oYWRkTGlua1Jlc3VsdClcclxuICAgICAgICAgICAgICAgIC5jYXRjaChhZGRMaW5rRXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGlua1Jlc3VsdCAocmVzKSB7XHJcbiAgICAgICAgICAgIHNlbGYubGluayA9IG51bGw7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMnLCByZXMpO1xyXG4gICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBhZGRMaW5rRXJyb3IgKGVycikge1xyXG4gICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXRQcm9jZXNzICgpIHtcclxuICAgICAgICAgICAgc2VsZi5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIG1vZGFsU2VydmljZS4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdtb2RhbFNlcnZpY2UnLCBtb2RhbFNlcnZpY2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vZGFsU2VydmljZSgkdWliTW9kYWwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRNb2RhbCA9IGdldE1vZGFsO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb2RhbCAoYW5pbWF0aW9uc0VuYWJsZWQsIHBhdGhUb1RtcGwsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJBcykge1xyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb25zRW5hYmxlZCxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBwYXRoVG9UbXBsLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogY29udHJvbGxlckFzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoSW50ZXJjZXBvci4kaW5qZWN0ID0gW1wiJGNvb2tpZXNcIiwgXCIkcm9vdFNjb3BlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoSW50ZXJjZXBvcicsIGF1dGhJbnRlcmNlcG9yKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXBvciAoJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgYXV0aEludGVyY2Vwb3IgPSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gcmVzcG9uc2UuaGVhZGVycygneC1hY2Nlc3MtdG9rZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2snLHJlc3BvbnNlLmhlYWRlcnMoJ3gtYWNjZXNzLXRva2VuJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjb29raWVzLnB1dCgndG9rZW4nLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudXNlcikgeyAkY29va2llcy5wdXQoJ2lkJywgcmVzcG9uc2UuZGF0YS51c2VyLmlkKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnVzZXIpIHsgJGNvb2tpZXMucHV0KCd1c2VyTmFtZScsIHJlc3BvbnNlLmRhdGEudXNlci51c2VyTmFtZSk7IH1cclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ2dlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gYXV0aEludGVyY2Vwb3I7XHJcblxyXG4gICAgfVxyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
