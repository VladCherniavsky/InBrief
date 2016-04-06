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
        self.defaultRequest = defaultRequest;

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
        function defaultRequest () {
            return  $http({
                method: 'GET',
                url: 'api/'
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
        self.addLink = addLink;

        function getLinks (user) {
            return $http({
                method: 'GET',
                url: 'api/links'
            })
        }

        function addLink (link) {
            return  $http({
                method: 'POST',
                url: 'api/links',
                data: link
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
        linkService.getLinks().then(function (res) {
            console.log(res);
        });
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
            Alertify.error(res.data.message);
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
                return config;
            },
            response: function(response) {
                var token = response.headers('x-access-token');

                if (token !== null) {
                    console.log('check',response.headers('x-access-token'));
                    $cookies.put('token', token);
                    if(response.data.user) $cookies.put('id', response.data.user.id);
                    if(response.data.user) $cookies.put('userName', response.data.user.userName);
                    $rootScope.$broadcast('logged');
                }
                return response;
            }
        };
        return authIntercepor;

    }
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9uYXZCYXIvZGlyZWN0aXZlL25hdkJhci5kaXJlY3RpdmUuanMiLCJjb21tb24vbmF2QmFyL2NvbnRyb2xsZXJzL25hdkJhckNvbnRyb2xsZXIuanMiLCJjb21tb24vbW9kYWxzLnRtcGwvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9hdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImNvbW1vbi9hdXRoL2RpcmVjdGl2ZXMvYXV0aEZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvc2VydmljZXMvbGlua3Muc2VydmljZS5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJsaW5rcy9jb250cm9sbGVycy9MaW5rc0NvbnRyb2xsZXIuanMiLCJob21lL3JvdXRlcy9yb3V0ZXMuanMiLCJob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiY29tbW9uL21vZGFsLnNlcnZpY2UvbW9kYWwuc2VydmljZS5qcyIsImludGVyY2VwdG9ycy9hdXRoSW50ZXJjZXB0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkaHR0cFByb3ZpZGVyXCJdO1xyXG4gICAgcnVuQmxvY2suJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCIkY29va2llc1wiLCBcImF1dGhTZXJ2aWNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnLCBbXHJcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxyXG4gICAgICAgICAgICAnQWxlcnRpZnknLFxyXG4gICAgICAgICAgICAndWkuYm9vdHN0cmFwJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcydcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5ydW4ocnVuQmxvY2spO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJGh0dHBQcm92aWRlcikge1xyXG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcG9yJyk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBydW5CbG9jayAoJHJvb3RTY29wZSwgJGNvb2tpZXMsIGF1dGhTZXJ2aWNlKSB7XHJcbiAgICAgICAgJHJvb3RTY29wZS5sb2dnZWQgPSBmYWxzZTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkJywgbG9nZ2VkUHJvY2Vzcyk7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ291dCcsIGxvZ291dFByb2Nlc3MpO1xyXG5cclxuICAgICAgICBhdXRoU2VydmljZS5kZWZhdWx0UmVxdWVzdCgpO1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nZ2VkUHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkY29va2llcy5nZXRBbGwoKSwgZnVuY3Rpb24gKHYsIGspIHtcclxuICAgICAgICAgICAgICAgICRjb29raWVzLnJlbW92ZShrKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbmF2QmFyJywgbmF2QmFyRm4pO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5hdkJhckZuICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9uYXZCYXIvdmlld3MvbmF2LWJhci10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTmF2QmFyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ25hdkJhcidcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBOYXZCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJHRpbWVvdXRcIiwgXCIkY29va2llc1wiLCBcIm1vZGFsU2VydmljZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTmF2QmFyQ29udHJvbGxlcicsIE5hdkJhckNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE5hdkJhckNvbnRyb2xsZXIgKCR1aWJNb2RhbCwgJHJvb3RTY29wZSwgJHRpbWVvdXQsICRjb29raWVzLCBtb2RhbFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuYW5pbWF0aW9uc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYub3BlbiA9IG9wZW47XHJcbiAgICAgICAgc2VsZi5sb2dvdXQgPSBsb2dvdXQ7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZCcsIGxvZ2dlZFByb2Nlc3MpO1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dvdXQnLCBsb2dvdXRQcm9jZXNzKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nZ2VkUHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0UHJvY2VzcyAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYubG9nZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKmZ1bmN0aW9uIG9wZW4gKHNpemUpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHNlbGYuYW5pbWF0aW9uc0VuYWJsZWQsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9uYXZCYXIvdmlld3MvbW9kYWxBdXRoLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxBdXRoQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdtb2RhbEF1dGgnLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogc2l6ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9Ki9cclxuICAgICAgICBmdW5jdGlvbiBvcGVuICgpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSBtb2RhbFNlcnZpY2UuZ2V0TW9kYWwodHJ1ZSwgJ2NvbW1vbi9tb2RhbHMudG1wbC90ZW1wbGF0ZXMvbW9kYWxBdXRoLXRtcGwuaHRtbCcsICdNb2RhbEF1dGhDb250cm9sbGVyJywgJ21vZGFsQXV0aCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ291dCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWxBdXRoQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vZGFsQXV0aENvbnRyb2xsZXInLCBNb2RhbEF1dGhDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBNb2RhbEF1dGhDb250cm9sbGVyICgkdWliTW9kYWxJbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKXtcclxuICAgIGF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSApO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCRodHRwKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5sb2dpblVzZXIgPSBsb2dpblVzZXI7XHJcbiAgICAgICAgc2VsZi5zaWdudXBVc2VyID0gc2lnbnVwVXNlcjtcclxuICAgICAgICBzZWxmLmRlZmF1bHRSZXF1ZXN0ID0gZGVmYXVsdFJlcXVlc3Q7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luVXNlciAodXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2lnbnVwVXNlciAodXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL3NpZ251cCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGRlZmF1bHRSZXF1ZXN0ICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpLydcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdhdXRoRm9ybScsIGF1dGhGb3JtKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoRm9ybSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYXV0aC90bXBsL2F1dGgtZm9ybS10bXBsLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQXV0aEZvcm1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYXV0aGZvcm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZTogJyYnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBBdXRoRm9ybUNvbnRyb2xsZXIuJGluamVjdCA9IFtcImF1dGhTZXJ2aWNlXCIsIFwiQWxlcnRpZnlcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhGb3JtQ29udHJvbGxlcicsIEF1dGhGb3JtQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gQXV0aEZvcm1Db250cm9sbGVyIChhdXRoU2VydmljZSwgQWxlcnRpZnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5sb2dpbiA9IGxvZ2luO1xyXG4gICAgICAgIHNlbGYuc2lnbnVwID0gc2lnbnVwO1xyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gY2FuY2VsO1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5sb2dpblVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VzZXInLCB1c2VyKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cCAodXNlcikge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5cclxuICAgICAgICAgICAgICAgIHNpZ251cFVzZXIodXNlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuZXJyb3IocmVzLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9naW5UYWIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwgKCkge1xyXG4gICAgICAgICAgICBzZWxmLnVzZXIgPSBudWxsO1xyXG4gICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIGxpbmtTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnbGlua1NlcnZpY2UnLCBsaW5rU2VydmljZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbGlua1NlcnZpY2UoJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRMaW5rcyA9IGdldExpbmtzO1xyXG4gICAgICAgIHNlbGYuYWRkTGluayA9IGFkZExpbms7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldExpbmtzICh1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGluayAobGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnYXBpL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGxpbmtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdsaW5rcycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9saW5rcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpbmtzL3ZpZXdzL2xpc3RMaW5rcy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaW5rc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbGlua3MnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIExpbmtzQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibGlua1NlcnZpY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmtzQ29udHJvbGxlcicsIExpbmtzQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTGlua3NDb250cm9sbGVyIChsaW5rU2VydmljZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBsaW5rU2VydmljZS5nZXRMaW5rcygpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcgKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUvdmlld3MvbWFpbi5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwibGlua1NlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIgKCRyb290U2NvcGUsIGxpbmtTZXJ2aWNlLCBBbGVydGlmeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxvZ2dlZCA9ICRyb290U2NvcGUubG9nZ2VkO1xyXG4gICAgICAgIHNlbGYuYWRkTGluayA9IGFkZExpbms7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2dnZWQnLCBsb2dnZWRQcm9jZXNzKTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9nb3V0JywgbG9nb3V0UHJvY2Vzcyk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZExpbmsgKGxpbmspIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2xpbmsnLCBsaW5rKTtcclxuICAgICAgICAgICAgbGluay50YWdzID0gbGluay50YWdzLnNwbGl0KCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsaW5rJywgbGluayk7XHJcbiAgICAgICAgICAgIGxpbmtTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuYWRkTGluayhsaW5rKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oYWRkTGlua1Jlc3VsdClcclxuICAgICAgICAgICAgICAgIC5jYXRjaChhZGRMaW5rRXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTGlua1Jlc3VsdCAocmVzKSB7XHJcbiAgICAgICAgICAgIHNlbGYubGluayA9IG51bGw7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXMnLCByZXMpO1xyXG4gICAgICAgICAgICBBbGVydGlmeS5zdWNjZXNzKHJlcy5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBhZGRMaW5rRXJyb3IgKGVycikge1xyXG4gICAgICAgICAgICBBbGVydGlmeS5lcnJvcihyZXMuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2dlZFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dFByb2Nlc3MgKCkge1xyXG4gICAgICAgICAgICBzZWxmLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuc2VydmljZSgnbW9kYWxTZXJ2aWNlJywgbW9kYWxTZXJ2aWNlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb2RhbFNlcnZpY2UoJHVpYk1vZGFsKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5nZXRNb2RhbCA9IGdldE1vZGFsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vZGFsIChhbmltYXRpb25zRW5hYmxlZCwgcGF0aFRvVG1wbCwgY29udHJvbGxlciwgY29udHJvbGxlckFzKSB7XHJcbiAgICAgICAgICByZXR1cm4gICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uc0VuYWJsZWQsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcGF0aFRvVG1wbCxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IGNvbnRyb2xsZXJBc1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhdXRoSW50ZXJjZXBvci4kaW5qZWN0ID0gW1wiJGNvb2tpZXNcIiwgXCIkcm9vdFNjb3BlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoSW50ZXJjZXBvcicsIGF1dGhJbnRlcmNlcG9yKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXBvciAoJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgYXV0aEludGVyY2Vwb3IgPSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gcmVzcG9uc2UuaGVhZGVycygneC1hY2Nlc3MtdG9rZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2snLHJlc3BvbnNlLmhlYWRlcnMoJ3gtYWNjZXNzLXRva2VuJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjb29raWVzLnB1dCgndG9rZW4nLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcG9uc2UuZGF0YS51c2VyKSAkY29va2llcy5wdXQoJ2lkJywgcmVzcG9uc2UuZGF0YS51c2VyLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5kYXRhLnVzZXIpICRjb29raWVzLnB1dCgndXNlck5hbWUnLCByZXNwb25zZS5kYXRhLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9nZ2VkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBhdXRoSW50ZXJjZXBvcjtcclxuXHJcbiAgICB9XHJcbn0oKSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
