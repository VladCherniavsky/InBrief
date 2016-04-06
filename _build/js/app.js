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
        
        console.log('rs', $rootScope.logged);
        console.log('ss', self.logged);
        self.logged = $rootScope.logged;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9hdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImNvbW1vbi9hdXRoL2RpcmVjdGl2ZXMvYXV0aEZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvc2VydmljZXMvbGlua3Muc2VydmljZS5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0NvbnRyb2xsZXIuanMiLCJob21lL3JvdXRlcy9yb3V0ZXMuanMiLCJob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiY29tbW9uL25hdkJhci9uYXZCYXIuZGlyZWN0aXZlLmpzIiwiaW50ZXJjZXB0b3JzL2F1dGhJbnRlcmNlcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRodHRwUHJvdmlkZXJcIl07XG4gICAgcnVuQmxvY2suJGluamVjdCA9IFtcIiRyb290U2NvcGVcIl07XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJywgW1xuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICAgICAnQWxlcnRpZnknLFxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCcsXG4gICAgICAgICAgICAnbmdDb29raWVzJ1xuICAgICAgICBdKVxuICAgICAgICAuY29uZmlnKGNvbmZpZylcbiAgICAgICAgLnJ1bihydW5CbG9jayk7XG5cbiAgICBmdW5jdGlvbiBjb25maWcgKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2Vwb3InKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcnVuQmxvY2sgKCRyb290U2NvcGUpIHtcbiAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coJ3J1bicpO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nZ2VkUHJvY2VzcyAoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgTmF2QmFyQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwiJHJvb3RTY29wZVwiLCBcIiR0aW1lb3V0XCIsIFwiJGNvb2tpZXNcIl07XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ05hdkJhckNvbnRyb2xsZXInLCBOYXZCYXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIE5hdkJhckNvbnRyb2xsZXIgKCR1aWJNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb29raWVzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmFuaW1hdGlvbnNFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5vcGVuID0gb3BlbjtcbiAgICAgICAgc2VsZi5sb2dvdXQgPSBsb2dvdXQ7XG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGxvZ291dFByb2Nlc3MpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyRyb290U2NvcGUubG9nZ2VkJywgJHJvb3RTY29wZS5sb2dnZWQpO1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dFByb2Nlc3MgKCkge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRjb29raWVzLmdldEFsbCgpLCBmdW5jdGlvbiAodiwgaykge1xuICAgICAgICAgICAgICAgICRjb29raWVzLnJlbW92ZShrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuIChzaXplKSB7XG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHNlbGYuYW5pbWF0aW9uc0VuYWJsZWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vbmF2QmFyL3ZpZXdzL21vZGFsQXV0aC10bXBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEF1dGhDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdtb2RhbEF1dGgnLFxuICAgICAgICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCAoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xuICAgICAgICB9XG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIE1vZGFsQXV0aENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5jb250cm9sbGVyKCdNb2RhbEF1dGhDb250cm9sbGVyJywgTW9kYWxBdXRoQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNb2RhbEF1dGhDb250cm9sbGVyICgkdWliTW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbigpe1xuICAgIGF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSApO1xuXG4gICAgZnVuY3Rpb24gYXV0aFNlcnZpY2UoJGh0dHApe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xuICAgICAgICBzZWxmLnNpZ251cFVzZXIgPSBzaWdudXBVc2VyO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luVXNlciAodXNlcikge1xuICAgICAgICAgICAgcmV0dXJuICAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAgJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9zaWdudXAnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2F1dGhGb3JtJywgYXV0aEZvcm0pO1xuXG4gICAgZnVuY3Rpb24gYXV0aEZvcm0gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2F1dGgvdG1wbC9hdXRoLWZvcm0tdG1wbC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBdXRoRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYXV0aGZvcm0nLFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xuICAgICAgICAgICAgICAgIGNsb3NlOiAnJidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgQXV0aEZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5jb250cm9sbGVyKCdBdXRoRm9ybUNvbnRyb2xsZXInLCBBdXRoRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXV0aEZvcm1Db250cm9sbGVyIChhdXRoU2VydmljZSwgQWxlcnRpZnkpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2luVGFiID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5sb2dpbiA9IGxvZ2luO1xuICAgICAgICBzZWxmLnNpZ251cCA9IHNpZ251cDtcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBjYW5jZWw7XG5cblxuICAgICAgICBmdW5jdGlvbiBsb2dpbiAodXNlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmxvZ2luVXNlcih1c2VyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLmRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKHJlcy5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1c2VyJywgdXNlcik7XG5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzaWdudXAgKHVzZXIpIHtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLlxuICAgICAgICAgICAgICAgIHNpZ251cFVzZXIodXNlcilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XG4gICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgbGlua1NlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5zZXJ2aWNlKCdsaW5rU2VydmljZScsIGxpbmtTZXJ2aWNlKTtcblxuICAgIGZ1bmN0aW9uIGxpbmtTZXJ2aWNlKCRodHRwKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5nZXRMaW5rcyA9IGdldExpbmtzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzICh1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnICgkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvbGlua3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbGlzdExpbmtzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2xpbmtzJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIExpbmtzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIl07XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzQ29udHJvbGxlcicsIExpbmtzQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMaW5rc0NvbnRyb2xsZXIgKGxpbmtTZXJ2aWNlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgbGlua1NlcnZpY2UuZ2V0TGlua3MoKTtcbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuY29uZmlnKGNvbmZpZyk7XG5cbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJy8nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lL3ZpZXdzL21haW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJ1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiR0aW1lb3V0XCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyICgkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZCcsIGxvZ2dlZFByb2Nlc3MpO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZygncnMnLCAkcm9vdFNjb3BlLmxvZ2dlZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzcycsIHNlbGYubG9nZ2VkKTtcbiAgICAgICAgc2VsZi5sb2dnZWQgPSAkcm9vdFNjb3BlLmxvZ2dlZDtcblxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCckcm9vdFNjb3BlLmxvZ2dlZCcsICRyb290U2NvcGUubG9nZ2VkKTtcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IHRydWU7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsb2dvdXRQcm9jZXNzICgpIHtcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnbmF2QmFyJywgbmF2QmFyRm4pO1xuXG4gICAgZnVuY3Rpb24gbmF2QmFyRm4gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9uYXYtYmFyLXRtcGwuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTmF2QmFyQ29udHJvbGxlcicsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICduYXZCYXInXG4gICAgICAgIH07XG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgYXV0aEludGVyY2Vwb3IuJGluamVjdCA9IFtcIiRjb29raWVzXCIsIFwiJHJvb3RTY29wZVwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2Vwb3InLCBhdXRoSW50ZXJjZXBvcik7XG5cbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXBvciAoJGNvb2tpZXMsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIGF1dGhJbnRlcmNlcG9yID0ge1xuICAgICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9ICRjb29raWVzLmdldCgndG9rZW4nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzcG9uc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gcmVzcG9uc2UuaGVhZGVycygneC1hY2Nlc3MtdG9rZW4nKTtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2snLHJlc3BvbnNlLmhlYWRlcnMoJ3gtYWNjZXNzLXRva2VuJykpO1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ3Rva2VuJywgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ2lkJywgcmVzcG9uc2UuZGF0YS51c2VyLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMucHV0KCd1c2VyTmFtZScsIHJlc3BvbnNlLmRhdGEudXNlci51c2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nZ2VkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGF1dGhJbnRlcmNlcG9yO1xuXG4gICAgfVxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
