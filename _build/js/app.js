(function() {
    config.$inject = ["$httpProvider"];
    runBlock.$inject = ["$rootScope"];
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
    function runBlock ($rootScope) {
        $rootScope.logged = false;
        console.log('run');
        $rootScope.$on('logged', loggedProcess);

        function loggedProcess () {
            $rootScope.logged = true;
        }
    }
}());
(function () {
    NavBarController.$inject = ["$uibModal", "$rootScope", "$timeout", "$cookies"];
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
(function(){
    authService.$inject = ["$http"];
    angular
        .module('InBrief')
        .service('authService', authService );

    function authService($http){
        var self = this;
        self.loginUser = loginUser;
        self.signupUser = signupUser;

        function loginUser (user) {
            return  $http({
                method: 'POST',
                url: 'api/login',
                data: user
            })
        }
        function signupUser (user) {
            return  $http({
                method: 'POST',
                url: 'api/signup',
                data: user
            })
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
                    if(res.data.success) {
                        Alertify.success(res.data.message);
                    } else {
                        Alertify.error(res.data.message);
                    }
                    self.close();
                }).catch(function (err) {
                    Alertify.error(err.message);
                });
            console.log('user', user);

        }
        function signup (user) {
            authService.
                signupUser(user)
                .then(function (res) {
                    if(res.data.success) {
                        Alertify.success(res.data.message);
                    } else {
                        console.log(res);
                        Alertify.error(res.data.message);
                    }
                    self.loginTab = true;
                    self.user = null;
                }).catch(function (err) {
                    console.log(err);
                    Alertify.error(err.message);
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

        function getLinks (user) {
            return $http({
                method: 'GET',
                url: 'api/links'
            })
        }

    }
}());
(function () {
    config.$inject = ["$stateProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        $stateProvider
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html',
                controller: 'LinksController',
                controllerAs: 'links'
            });

    }
} ());
(function () {
    LinksController.$inject = ["linkService"];
    angular
        .module('InBrief')
        .controller('LinksController', LinksController);

    function LinksController (linkService) {
        var self = this;
        linkService.getLinks();
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
    HomeController.$inject = ["$rootScope", "$timeout"];
    angular
        .module('InBrief')
        .controller('HomeController', HomeController);

    function HomeController ($rootScope, $timeout) {
        var self = this;

        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

        function loggedProcess () {
            console.log('$rootScope.logged', $rootScope.logged);
            $timeout(function () {
                self.logged = true;
            }, 0);
        }
        function logoutProcess () {
            $timeout(function () {
                self.logged = false;
                $rootScope.logged = false;
            }, 0);
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
(function() {
    authIntercepor.$inject = ["$cookies", "$rootScope"];
    angular
        .module('InBrief')
        .factory('authIntercepor', authIntercepor);

    function authIntercepor ($cookies, $rootScope) {
        var authIntercepor = {
            request: function (config) {
                var token = $cookies.get('token');

                return config;
            },
            response: function(response) {
                var token = response.headers('x-access-token');

                if (token !== null) {
                    console.log('check',response.headers('x-access-token'));
                    $cookies.put('token', token);
                    $cookies.put('id', response.data.user.id);
                    $cookies.put('userName', response.data.user.userName);
                    $rootScope.$broadcast('logged');
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9hdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImNvbW1vbi9hdXRoL2RpcmVjdGl2ZXMvYXV0aEZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvc2VydmljZXMvbGlua3Muc2VydmljZS5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0NvbnRyb2xsZXIuanMiLCJob21lL3JvdXRlcy9yb3V0ZXMuanMiLCJob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiY29tbW9uL25hdkJhci9uYXZCYXIuZGlyZWN0aXZlLmpzIiwiaW50ZXJjZXB0b3JzL2F1dGhJbnRlcmNlcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRodHRwUHJvdmlkZXJcIl07XHJcbiAgICBydW5CbG9jay4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJywgW1xyXG4gICAgICAgICAgICAndWkucm91dGVyJyxcclxuICAgICAgICAgICAgJ0FsZXJ0aWZ5JyxcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAgICAgICAgICduZ0Nvb2tpZXMnXHJcbiAgICAgICAgXSlcclxuICAgICAgICAuY29uZmlnKGNvbmZpZylcclxuICAgICAgICAucnVuKHJ1bkJsb2NrKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRodHRwUHJvdmlkZXIpIHtcclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXBvcicpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcnVuQmxvY2sgKCRyb290U2NvcGUpIHtcclxuICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdydW4nKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBOYXZCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJHRpbWVvdXRcIiwgXCIkY29va2llc1wiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTmF2QmFyQ29udHJvbGxlcicsIE5hdkJhckNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE5hdkJhckNvbnRyb2xsZXIgKCR1aWJNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb29raWVzKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLmFuaW1hdGlvbnNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLm9wZW4gPSBvcGVuO1xyXG4gICAgICAgIHNlbGYubG9nb3V0ID0gbG9nb3V0O1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJHJvb3RTY29wZS5sb2dnZWQnLCAkcm9vdFNjb3BlLmxvZ2dlZCk7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJGNvb2tpZXMuZ2V0QWxsKCksIGZ1bmN0aW9uICh2LCBrKSB7XHJcbiAgICAgICAgICAgICAgICAkY29va2llcy5yZW1vdmUoayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3BlbiAoc2l6ZSkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogc2VsZi5hbmltYXRpb25zRW5hYmxlZCxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9tb2RhbEF1dGgtdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEF1dGhDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ21vZGFsQXV0aCcsXHJcbiAgICAgICAgICAgICAgICBzaXplOiBzaXplXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWxBdXRoQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vZGFsQXV0aENvbnRyb2xsZXInLCBNb2RhbEF1dGhDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBNb2RhbEF1dGhDb250cm9sbGVyICgkdWliTW9kYWxJbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIGF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSApO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5sb2dpblVzZXIgPSBsb2dpblVzZXI7XHJcbiAgICAgICAgc2VsZi5zaWdudXBVc2VyID0gc2lnbnVwVXNlcjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzaWdudXBVc2VyICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6ICdhcGkvc2lnbnVwJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdhdXRoRm9ybScsIGF1dGhGb3JtKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoRm9ybSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYXV0aC90bXBsL2F1dGgtZm9ybS10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQXV0aEZvcm1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYXV0aGZvcm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZTogJyYnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBBdXRoRm9ybUNvbnRyb2xsZXIuJGluamVjdCA9IFtcImF1dGhTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhGb3JtQ29udHJvbGxlcicsIEF1dGhGb3JtQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gQXV0aEZvcm1Db250cm9sbGVyIChhdXRoU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5sb2dpbiA9IGxvZ2luO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwID0gc2lnbnVwO1xyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gY2FuY2VsO1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5sb2dpblVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cCAodXNlcikge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5cclxuICAgICAgICAgICAgICAgIHNpZ251cFVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwgKCkge1xyXG4gICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIGxpbmtTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnbGlua1NlcnZpY2UnLCBsaW5rU2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGlua1NlcnZpY2UoJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRMaW5rcyA9IGdldExpbmtzO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRMaW5rcyAodXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9saW5rcydcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9saW5rcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpc3RMaW5rcy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3MnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzQ29udHJvbGxlcicsIExpbmtzQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NDb250cm9sbGVyIChsaW5rU2VydmljZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBsaW5rU2VydmljZS5nZXRMaW5rcygpO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUvdmlld3MvbWFpbi5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwiJHRpbWVvdXRcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyICgkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZCcsIGxvZ2dlZFByb2Nlc3MpO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dvdXQnLCBsb2dvdXRQcm9jZXNzKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nZ2VkUHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCckcm9vdFNjb3BlLmxvZ2dlZCcsICRyb290U2NvcGUubG9nZ2VkKTtcclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5sb2dnZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCduYXZCYXInLCBuYXZCYXJGbik7XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2QmFyRm4gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9uYXYtYmFyLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXZCYXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbmF2QmFyJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYXV0aEludGVyY2Vwb3IuJGluamVjdCA9IFtcIiRjb29raWVzXCIsIFwiJHJvb3RTY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2Vwb3InLCBhdXRoSW50ZXJjZXBvcik7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aEludGVyY2Vwb3IgKCRjb29raWVzLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIGF1dGhJbnRlcmNlcG9yID0ge1xyXG4gICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSAkY29va2llcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzcG9uc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSByZXNwb25zZS5oZWFkZXJzKCd4LWFjY2Vzcy10b2tlbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGVjaycscmVzcG9uc2UuaGVhZGVycygneC1hY2Nlc3MtdG9rZW4nKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMucHV0KCd0b2tlbicsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ2lkJywgcmVzcG9uc2UuZGF0YS51c2VyLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ3VzZXJOYW1lJywgcmVzcG9uc2UuZGF0YS51c2VyLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ2dlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gYXV0aEludGVyY2Vwb3I7XHJcblxyXG4gICAgfVxyXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
