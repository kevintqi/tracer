var taskApp = angular.module('taskApp', []);
 
taskApp .config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/task_list', {
        templateUrl: 'templates/list.html',
        controller: 'ListController'
      }).
      when('/task_details', {
        templateUrl: 'templates/details.html',
        controller: 'DetailsController'
      }).
      otherwise({
        redirectTo: '/task_list'
      });
}]);

taskApp.controller('ListController', function($scope) {
});

taskApp.controller('DetailsController', function($scope) {
});

function taskRowWriter(rowIndex, record, columns, cellWriter) {
    var row;
    row =  '<td class="thumbnail"> <a href="#task_details">' + 
           '<img class="thumbnail" src="' + record.thumbnail + '"/>' + '</a></td>';
    row += '<td class="address">' + record.address + '</td>';
    row += '<td class="time">' + record.scheduledTime + '</td>';
    row += '<td class="assignment">' + record.assignment + '</td>';
    return '<tr class="w3-border-bottom">' +  row + '</tr>';
}

$(document).ready(function() {
    $.getJSON("task_list.json", function(taskData, status) {
        if (status === "success") {
            $('#list_table_id').dynatable({
                features: {
                    paginate: false,
                    recordCount: false,
                    sorting: true
                },
                inputs: {
                    processingText: 'Loading <img src="images/loading.gif"/>'
                },
                dataset: {
                    records: taskData
                },
                writers: {
                    _rowWriter: taskRowWriter
                }
            });
        }
        else {
            alert(status);
        }
    });
});
