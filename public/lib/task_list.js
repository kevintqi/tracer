function taskRowWriter(rowIndex, record, columns, cellWriter) {
    var row;
    row = '<td class="thumbnail">' + '<img class="thumbnail" src="' + record.thumbnail + '"/>' + '</td>';
    row += '<td class="address">' + record.address + '</td>';
    row += '<td class="time">' + record.scheduledTime + '</td>';
    row += '<td class="assignment">' + record.assignment + '</td>';
    return '<tr>' + row + '</tr>';
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
