(function() {
    MainController.$inject = ["$scope", "hello", "$timeout"];
    angular.module('InBrief', [])
        .controller('Main', MainController);

    function MainController ($scope, hello, $timeout) {
        $scope.vlad = hello.getString();
        $timeout(function () {
            console.log(hello.getString());
        }, 0);
    }

}());
(function() {
    angular.module('InBrief')
        .directive('ara', ara);

    function ara () {
        return {
            templateUrl: 'messages.html'
        };
    }
}());
(function() {
    angular.module('InBrief')
        .factory('hello', hello);

    function hello () {
        return {
            getString: function () {
                return 'ssssssss';
            }
        };
    }

}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInRlc3QuanMiLCJzZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBNYWluQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiaGVsbG9cIiwgXCIkdGltZW91dFwiXTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdJbkJyaWVmJywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01haW4nLCBNYWluQ29udHJvbGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gTWFpbkNvbnRyb2xsZXIgKCRzY29wZSwgaGVsbG8sICR0aW1lb3V0KSB7XHJcbiAgICAgICAgJHNjb3BlLnZsYWQgPSBoZWxsby5nZXRTdHJpbmcoKTtcclxuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlbGxvLmdldFN0cmluZygpKTtcclxuICAgICAgICB9LCAwKTtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ0luQnJpZWYnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2FyYScsIGFyYSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXJhICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21lc3NhZ2VzLmh0bWwnXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnSW5CcmllZicpXHJcbiAgICAgICAgLmZhY3RvcnkoJ2hlbGxvJywgaGVsbG8pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhlbGxvICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnc3Nzc3Nzc3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0oKSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
