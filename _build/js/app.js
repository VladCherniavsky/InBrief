(function() {
    config.$inject = ["$httpProvider"];
    runBlock.$inject = ["$rootScope", "$cookies"];
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
    function runBlock ($rootScope, $cookies) {
        $rootScope.logged = false;
        $rootScope.$on('logged', loggedProcess);
        $rootScope.$on('logout', logoutProcess);

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

        /*function open (size) {
            var modalInstance = $uibModal.open({
                animation: self.animationsEnabled,
                templateUrl: 'common/navBar/views/modalAuth-tmpl.html',
                controller: 'ModalAuthController',
                controllerAs: 'modalAuth',
                size: size
            });
        }*/
        function open () {
            var modalInstance = modalService.getModal(true, 'common/modals.tmpl/templates/modalAuth-tmpl.html', 'ModalAuthController', 'modalAuth');
        }
        function logout () {
            $rootScope.$broadcast('logout');
        }
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
        
        self.logged = $rootScope.logged;

        function loggedProcess () {
            self.logged = true;
        }
        
        function logoutProcess () {
            self.logged = false;
            $rootScope.logged = false;
        }
    }
}());
(function(){
    modalService.$inject = ["$uibModal"];
    angular
        .module('InBrief')
        .service('modalService', modalService);

    function modalService($uibModal){
        var self = this;
        self.getModal = getModal;
        
        function getModal (animationsEnabled, pathToTmpl, controller, controllerAs) {
          return  $uibModal.open({
                animation: animationsEnabled,
                templateUrl: pathToTmpl,
                controller: controller,
                controllerAs: controllerAs
            })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9tb2RhbHMudG1wbC9jb250cm9sbGVycy9Nb2RhbEF1dGhDb250cm9sbGVyLmpzIiwiY29tbW9uL25hdkJhci9kaXJlY3RpdmUvbmF2QmFyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9hdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImNvbW1vbi9hdXRoL2RpcmVjdGl2ZXMvYXV0aEZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvc2VydmljZXMvbGlua3Muc2VydmljZS5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0NvbnRyb2xsZXIuanMiLCJob21lL3JvdXRlcy9yb3V0ZXMuanMiLCJob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiY29tbW9uL21vZGFsLnNlcnZpY2UvbW9kYWwuc2VydmljZS5qcyIsImludGVyY2VwdG9ycy9hdXRoSW50ZXJjZXB0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJGh0dHBQcm92aWRlclwiXTtcbiAgICBydW5CbG9jay4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiRjb29raWVzXCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicsIFtcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAgICAgJ0FsZXJ0aWZ5JyxcbiAgICAgICAgICAgICd1aS5ib290c3RyYXAnLFxuICAgICAgICAgICAgJ25nQ29va2llcydcbiAgICAgICAgXSlcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXG4gICAgICAgIC5ydW4ocnVuQmxvY2spO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcG9yJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJ1bkJsb2NrICgkcm9vdFNjb3BlLCAkY29va2llcykge1xuICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dvdXQnLCBsb2dvdXRQcm9jZXNzKTtcblxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJGNvb2tpZXMuZ2V0QWxsKCksIGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgICAgICAgICAgJGNvb2tpZXMucmVtb3ZlKGspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIE1vZGFsQXV0aENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5jb250cm9sbGVyKCdNb2RhbEF1dGhDb250cm9sbGVyJywgTW9kYWxBdXRoQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNb2RhbEF1dGhDb250cm9sbGVyICgkdWliTW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5kaXJlY3RpdmUoJ25hdkJhcicsIG5hdkJhckZuKTtcblxuICAgIGZ1bmN0aW9uIG5hdkJhckZuICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9uYXZCYXIvdmlld3MvbmF2LWJhci10bXBsLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdkJhckNvbnRyb2xsZXInLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbmF2QmFyJ1xuICAgICAgICB9O1xuICAgIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBOYXZCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJHRpbWVvdXRcIiwgXCIkY29va2llc1wiLCBcIm1vZGFsU2VydmljZVwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuY29udHJvbGxlcignTmF2QmFyQ29udHJvbGxlcicsIE5hdkJhckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTmF2QmFyQ29udHJvbGxlciAoJHVpYk1vZGFsLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgJGNvb2tpZXMsIG1vZGFsU2VydmljZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5hbmltYXRpb25zRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHNlbGYub3BlbiA9IG9wZW47XG4gICAgICAgIHNlbGYubG9nb3V0ID0gbG9nb3V0O1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dvdXQnLCBsb2dvdXRQcm9jZXNzKTtcblxuICAgICAgICBmdW5jdGlvbiBsb2dnZWRQcm9jZXNzICgpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLypmdW5jdGlvbiBvcGVuIChzaXplKSB7XG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHNlbGYuYW5pbWF0aW9uc0VuYWJsZWQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vbmF2QmFyL3ZpZXdzL21vZGFsQXV0aC10bXBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEF1dGhDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdtb2RhbEF1dGgnLFxuICAgICAgICAgICAgICAgIHNpemU6IHNpemVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9Ki9cbiAgICAgICAgZnVuY3Rpb24gb3BlbiAoKSB7XG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9IG1vZGFsU2VydmljZS5nZXRNb2RhbCh0cnVlLCAnY29tbW9uL21vZGFscy50bXBsL3RlbXBsYXRlcy9tb2RhbEF1dGgtdG1wbC5odG1sJywgJ01vZGFsQXV0aENvbnRyb2xsZXInLCAnbW9kYWxBdXRoJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0ICgpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nb3V0Jyk7XG4gICAgICAgIH1cbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbigpe1xuICAgIGF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSApO1xuXG4gICAgZnVuY3Rpb24gYXV0aFNlcnZpY2UoJGh0dHApe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xuICAgICAgICBzZWxmLnNpZ251cFVzZXIgPSBzaWdudXBVc2VyO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luVXNlciAodXNlcikge1xuICAgICAgICAgICAgcmV0dXJuICAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAgJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9zaWdudXAnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2F1dGhGb3JtJywgYXV0aEZvcm0pO1xuXG4gICAgZnVuY3Rpb24gYXV0aEZvcm0gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2F1dGgvdG1wbC9hdXRoLWZvcm0tdG1wbC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBdXRoRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYXV0aGZvcm0nLFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xuICAgICAgICAgICAgICAgIGNsb3NlOiAnJidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgQXV0aEZvcm1Db250cm9sbGVyLiRpbmplY3QgPSBbXCJhdXRoU2VydmljZVwiLCBcIkFsZXJ0aWZ5XCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5jb250cm9sbGVyKCdBdXRoRm9ybUNvbnRyb2xsZXInLCBBdXRoRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXV0aEZvcm1Db250cm9sbGVyIChhdXRoU2VydmljZSwgQWxlcnRpZnkpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2luVGFiID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5sb2dpbiA9IGxvZ2luO1xuICAgICAgICBzZWxmLnNpZ251cCA9IHNpZ251cDtcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBjYW5jZWw7XG5cblxuICAgICAgICBmdW5jdGlvbiBsb2dpbiAodXNlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmxvZ2luVXNlcih1c2VyKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLmRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKHJlcy5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1c2VyJywgdXNlcik7XG5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzaWdudXAgKHVzZXIpIHtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLlxuICAgICAgICAgICAgICAgIHNpZ251cFVzZXIodXNlcilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XG4gICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xuICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgbGlua1NlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5zZXJ2aWNlKCdsaW5rU2VydmljZScsIGxpbmtTZXJ2aWNlKTtcblxuICAgIGZ1bmN0aW9uIGxpbmtTZXJ2aWNlKCRodHRwKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5nZXRMaW5rcyA9IGdldExpbmtzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzICh1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnICgkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvbGlua3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbGlzdExpbmtzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2xpbmtzJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgIExpbmtzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIl07XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzQ29udHJvbGxlcicsIExpbmtzQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMaW5rc0NvbnRyb2xsZXIgKGxpbmtTZXJ2aWNlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgbGlua1NlcnZpY2UuZ2V0TGlua3MoKTtcbiAgICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuY29uZmlnKGNvbmZpZyk7XG5cbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJy8nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lL3ZpZXdzL21haW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJ1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiR0aW1lb3V0XCJdO1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXG4gICAgICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyICgkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZCcsIGxvZ2dlZFByb2Nlc3MpO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XG4gICAgICAgIFxuICAgICAgICBzZWxmLmxvZ2dlZCA9ICRyb290U2NvcGUubG9nZ2VkO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xuICAgICAgICAgICAgc2VsZi5sb2dnZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBsb2dvdXRQcm9jZXNzICgpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24oKXtcbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuc2VydmljZSgnbW9kYWxTZXJ2aWNlJywgbW9kYWxTZXJ2aWNlKTtcblxuICAgIGZ1bmN0aW9uIG1vZGFsU2VydmljZSgkdWliTW9kYWwpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYuZ2V0TW9kYWwgPSBnZXRNb2RhbDtcbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vZGFsIChhbmltYXRpb25zRW5hYmxlZCwgcGF0aFRvVG1wbCwgY29udHJvbGxlciwgY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgcmV0dXJuICAkdWliTW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb25zRW5hYmxlZCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcGF0aFRvVG1wbCxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogY29udHJvbGxlckFzXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgYXV0aEludGVyY2Vwb3IuJGluamVjdCA9IFtcIiRjb29raWVzXCIsIFwiJHJvb3RTY29wZVwiXTtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2Vwb3InLCBhdXRoSW50ZXJjZXBvcik7XG5cbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXBvciAoJGNvb2tpZXMsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIGF1dGhJbnRlcmNlcG9yID0ge1xuICAgICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9ICRjb29raWVzLmdldCgndG9rZW4nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzcG9uc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gcmVzcG9uc2UuaGVhZGVycygneC1hY2Nlc3MtdG9rZW4nKTtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2snLHJlc3BvbnNlLmhlYWRlcnMoJ3gtYWNjZXNzLXRva2VuJykpO1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ3Rva2VuJywgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5wdXQoJ2lkJywgcmVzcG9uc2UuZGF0YS51c2VyLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMucHV0KCd1c2VyTmFtZScsIHJlc3BvbnNlLmRhdGEudXNlci51c2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nZ2VkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGF1dGhJbnRlcmNlcG9yO1xuXG4gICAgfVxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
