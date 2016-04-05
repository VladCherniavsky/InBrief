(function() {
    MainController.$inject = ["$scope"];
    angular
        .module('InBrief', [
            'ui.router',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvbmF2QmFyQ29udHJvbGxlci5qcyIsImNvbW1vbi9uYXZCYXIvY29udHJvbGxlcnMvTW9kYWxBdXRoQ29udHJvbGxlci5qcyIsImxpbmtzL3JvdXRlcy9yb3V0ZXMuanMiLCJjb21tb24vbmF2QmFyL25hdkJhci5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICAgTWFpbkNvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRzY29wZVwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJywgW1xyXG4gICAgICAgICAgICAndWkucm91dGVyJyxcclxuICAgICAgICAgICAgJ3VpLmJvb3RzdHJhcCdcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNYWluJywgTWFpbkNvbnRyb2xsZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE1haW5Db250cm9sbGVyICgkc2NvcGUpIHtcclxuICAgICAgICAkc2NvcGUudmxhZCA9ICdzc3MnO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBOYXZCYXJDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIl07XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ05hdkJhckNvbnRyb2xsZXInLCBOYXZCYXJDb250cm9sbGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBOYXZCYXJDb250cm9sbGVyICgkdWliTW9kYWwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHNlbGYuYW5pbWF0aW9uc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYub3BlbiA9IG9wZW47XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW4gKHNpemUpIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHNlbGYuYW5pbWF0aW9uc0VuYWJsZWQsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9uYXZCYXIvdmlld3MvbW9kYWxBdXRoLXRtcGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxBdXRoQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdtb2RhbEF1dGgnLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogc2l6ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkID0gc2VsZWN0ZWRJdGVtO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIE1vZGFsQXV0aENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCJdO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNb2RhbEF1dGhDb250cm9sbGVyJywgTW9kYWxBdXRoQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTW9kYWxBdXRoQ29udHJvbGxlciAoJHVpYk1vZGFsSW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgICBzZWxmLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlbGYuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdJbkJyaWVmJylcclxuICAgICAgICAuY29uZmlnKGNvbmZpZyk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29uZmlnICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnLycsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsaW5rcy92aWV3cy9tYWluLmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbGlua3MnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbGlua3MnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsaW5rcy92aWV3cy9saXN0TGlua3MuaHRtbCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59ICgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ25hdkJhcicsIG5hdkJhckZuKTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZCYXJGbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vbmF2QmFyL3ZpZXdzL25hdi1iYXItdG1wbC5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdkJhckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICduYXZCYXInXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
