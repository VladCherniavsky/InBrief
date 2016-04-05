(function() {
    MainController.$inject = ["$scope"];
    angular
        .module('InBrief', [
            'ui.router',
            'Alertify',
            'ui.bootstrap'
        ])
        .controller('Main', MainController);

    function MainController ($scope) {
        $scope.vlad = 'sss';
    }
}());
(function () {
    NavBarController.$inject = ["$uibModal"];
    angular
        .module('InBrief')
        .controller('NavBarController', NavBarController);

    function NavBarController ($uibModal) {
        var self = this;

        self.animationsEnabled = true;
        self.open = open;

        function open (size) {
            var modalInstance = $uibModal.open({
                animation: self.animationsEnabled,
                templateUrl: 'common/navBar/views/modalAuth-tmpl.html',
                controller: 'ModalAuthController',
                controllerAs: 'modalAuth',
                size: size
            });

            /*modalInstance.result.then(function (selectedItem) {
                self.selected = selectedItem;
            }, function () {
            });*/
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
(function () {
    config.$inject = ["$stateProvider"];
    angular
        .module('InBrief')
        .config(config);

    function config ($stateProvider) {
        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'links/views/main.html'
            })
            .state('links', {
                url: '/links',
                templateUrl: 'links/views/listLinks.html'
            });

    }
} ());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImNvbW1vbi9hdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImNvbW1vbi9hdXRoL2RpcmVjdGl2ZXMvYXV0aEZvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2F1dGgvY29udHJvbGxlcnMvYXV0aEZvcm1Db250cm9sbGVyLmpzIiwibGlua3Mvcm91dGVzL3JvdXRlcy5qcyIsImNvbW1vbi9uYXZCYXIvbmF2QmFyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBNYWluQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHNjb3BlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnLCBbXHJcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxyXG4gICAgICAgICAgICAnQWxlcnRpZnknLFxyXG4gICAgICAgICAgICAndWkuYm9vdHN0cmFwJ1xyXG4gICAgICAgIF0pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01haW4nLCBNYWluQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTWFpbkNvbnRyb2xsZXIgKCRzY29wZSkge1xyXG4gICAgICAgICRzY29wZS52bGFkID0gJ3Nzcyc7XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE5hdkJhckNvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignTmF2QmFyQ29udHJvbGxlcicsIE5hdkJhckNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE5hdkJhckNvbnRyb2xsZXIgKCR1aWJNb2RhbCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5hbmltYXRpb25zRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgc2VsZi5vcGVuID0gb3BlbjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3BlbiAoc2l6ZSkge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogc2VsZi5hbmltYXRpb25zRW5hYmxlZCxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9tb2RhbEF1dGgtdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEF1dGhDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ21vZGFsQXV0aCcsXHJcbiAgICAgICAgICAgICAgICBzaXplOiBzaXplXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLyptb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWQgPSBzZWxlY3RlZEl0ZW07XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgfSk7Ki9cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgTW9kYWxBdXRoQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vZGFsQXV0aENvbnRyb2xsZXInLCBNb2RhbEF1dGhDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBNb2RhbEF1dGhDb250cm9sbGVyICgkdWliTW9kYWxJbnN0YW5jZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcblxyXG4gICAgICAgIHNlbGYub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbigpe1xyXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlICk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aFNlcnZpY2UoJGh0dHApe1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxvZ2luVXNlciA9IGxvZ2luVXNlcjtcclxuICAgICAgICBzZWxmLnNpZ251cFVzZXIgPSBzaWdudXBVc2VyO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpblVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9sb2dpbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB1c2VyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNpZ251cFVzZXIgKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogJ2FwaS9zaWdudXAnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdXNlclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2F1dGhGb3JtJywgYXV0aEZvcm0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhGb3JtICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9hdXRoL3RtcGwvYXV0aC1mb3JtLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBdXRoRm9ybUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhdXRoZm9ybScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlOiAnJidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIEF1dGhGb3JtQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiYXV0aFNlcnZpY2VcIiwgXCJBbGVydGlmeVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29udHJvbGxlcignQXV0aEZvcm1Db250cm9sbGVyJywgQXV0aEZvcm1Db250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBBdXRoRm9ybUNvbnRyb2xsZXIgKGF1dGhTZXJ2aWNlLCBBbGVydGlmeSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLmxvZ2luVGFiID0gdHJ1ZTtcclxuICAgICAgICBzZWxmLmxvZ2luID0gbG9naW47XHJcbiAgICAgICAgc2VsZi5zaWdudXAgPSBzaWdudXA7XHJcbiAgICAgICAgc2VsZi5jYW5jZWwgPSBjYW5jZWw7XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dpbiAodXNlcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXNlcicsIHVzZXIpO1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmxvZ2luVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihyZXMuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndXNlcicsIHVzZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2lnbnVwICh1c2VyKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLlxyXG4gICAgICAgICAgICAgICAgc2lnbnVwVXNlcih1c2VyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQWxlcnRpZnkuc3VjY2VzcyhyZXMuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydGlmeS5lcnJvcihyZXMuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dpblRhYiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0aWZ5LmVycm9yKGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYudXNlciA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbWFpbi5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2xpbmtzJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xpbmtzJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlua3Mvdmlld3MvbGlzdExpbmtzLmh0bWwnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSAoKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuZGlyZWN0aXZlKCduYXZCYXInLCBuYXZCYXJGbik7XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2QmFyRm4gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL25hdkJhci92aWV3cy9uYXYtYmFyLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXZCYXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbmF2QmFyJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0oKSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
