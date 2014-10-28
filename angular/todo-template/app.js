var app = angular.module('todo', ['ngRoute']);

//환경설정
app.config(function($routeProvider){
    $routeProvider.when('/main',{
//      template: '{{test}}',
        templateUrl: 'todo.html',
        controller: function($scope){

            $scope.todos = [
                {
                    completed: false,
                    title: '숙제1'
                },
                {
                    completed: true,
                    title: '숙제2'
                },
                {
                    completed: true,
                    title: '숙제3'
                }
            ]
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