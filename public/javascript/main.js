function GridRow(id, dataRow) {
    var self = this;

    self.gridID = id;
    dataRow.hasOwnProperty("RowID") ?  dataRow.RowID = id : undefined;
    self.dataRow = ko.observable(dataRow);
}

function appendTD(key) {
    key = key.replace(/\s/g,'');
    var tdEL = $("<td></td>").attr("data-bind", "text: dataRow()." + key);
    $(tdEL).attr("id", key);
    $(".table-rows").append(tdEL);
}

function hideTdByID(key) {
    $("td#" + key).hide();
}

function showTdByID(key) {
    $("td#" + key).show();
}

function createColumn(id, colName){
    var self = this;

    self.cID = id;
    var colRow = {key: colName.replace(/\s/g,''),Name: colName.trim(), show: true};
    self.column = ko.observable(colRow);
}

function createDataRow(colArr, rowData) {
    var i = 0;
    var rowDataSize = rowData.length;

    var modifiedDataRow = {};
    colArr.forEach(function(column) {
        i <= rowDataSize ? modifiedDataRow[column.replace(/\s/g,'')] = rowData[i] : modifiedDataRow[column] = '';
        i++;
    });

    return modifiedDataRow;
}


function DataGridViewModel() {
    var self = this;

    var count = 0;
    var colCount = 0;

    var columnsArr = ["Symbol", "Bid LP", "Bid", "Ask LP", "Ask", "Spread", "Row ID"];

    self.columns = ko.observableArray([]);

    self.addColumn = function(id, Name) {
        self.columns.push(new createColumn(id, Name));
    };

    columnsArr.forEach(function(column){
        self.addColumn(++colCount, column);
    });


    //Editable data
    var myDataRow = [
        ["EURUSD", '', '22', '', '31', '33'],
        ["AUDCAD", '', '23', '', '32', '33'],
        ["GBPUSD", '', '24', '', '33', '33']
    ];

    self.dataGridRow = ko.observableArray([]);

    self.addDataRow = function(id, row) {
        self.dataGridRow.push(new GridRow(id, createDataRow(columnsArr, row) ) );
    };

    myDataRow.forEach(function(row){
        self.addDataRow(++count, row);
    });

    columnsArr.forEach(function(column){
        appendTD(column);
    });


    /* This requires that the column name is Symbol */
    self.getRowBySymbol = function (symbol) {
        return ko.utils.arrayFirst(self.dataGridRow(), function(row) {
            return row.dataRow().Symbol === symbol;
        }) || null;
    };

    self.getRowByID = function(id) {
        return ko.utils.arrayFirst(self.dataGridRow(), function(row) {
            return row.gridID === id;
        }) || null;
    };

    /* update Column Visibility by Name */
    self.toggleColumnVisibilityByName = function(Name) {
        var col = self.getColumnByName(Name);

        console.log(col.column().show);

        self.columns().forEach(function (currentColumn) {
            if (currentColumn.column().Name == col.column().Name) {
                currentColumn.column().show = !currentColumn.column().show;
            }
        });
    };


    /* get column by name */
    self.getColumnByName = function(Name) {
        return ko.utils.arrayFirst(self.columns(), function(col) {
            return col.column().Name === Name;
        }) || null;
    };

    /*var randomData = [
        ["EURUSD", '', '22', '', '31', '33'],
        ["EURUSD", '', '43', '', '52', '63'],
        ["EURUSD", '', '242', '', '333', '335']
    ];

    var j = 0;
    setInterval(function () {
        self.updateRowByID(1, randomData[j]);
        j++;
    }, 2000);*/

    /* update Row by ID */
    self.updateRowByID = function(id, newRow) {
        var row = self.getRowByID(id);
        if (row) {
            row.dataRow(createDataRow(columnsArr, newRow));
        }
    };

    /* Remove row by ID */
    self.removeID = 0;
    self.removeDataRow = function () {
        self.dataGridRow.remove(function(row) {
            return row.gridID == self.removeID;
        });
    };

}


ko.applyBindings(new DataGridViewModel());