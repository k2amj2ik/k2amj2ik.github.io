var app = angular.module('todo', ['ngRoute','ngResource']);

//환경설정
app.config(function($routeProvider){
    $routeProvider.when('/main',{
//      template: '{{test}}',
        templateUrl: 'todo.html',

        controller: function($scope, $resource){
            var todoApi = $resource('http://localhost:3000/todos');

            function success(response){
                $scope.todos = response.data;
            }

            function fail(reason){
                throw reason.messsage;
            }

            todoApi.get(success,fail);

            $scope.statusFilter = {
                completed: false
            }
            $scope.change = function(){
                $scope.statusFilter = {
                    completed:true
                }
            }
            $scope.reset = function(){
                $scope.statusFilter = {}
            }
            $scope.removeTodo = function (todo) {
                $scope.todos = $scope.todos.filter(function(item){
                    return item!=todo;
                });
            };

        }


    });
    //존재하지 않는 URL로 접속하면 모두 메인으로 보내기
    $routeProvider.otherwise({ redirectTo: '/main' });
});