function GridRow(id, dataRow) {
    var self = this;

    self.gridID = id;
    self.dataRow = ko.observable(dataRow);
    self.Spread = ko.computed(function () {
        return self.dataRow().Ask - self.dataRow().Bid;
    }, self);
}

function createColumn(id, colName){
    var self = this;

    self.cID = id;
    var colRow = {key: colName.replace(/\s/g,''),Name: colName.trim()};
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

    var columnsArr = ["Symbol", "Bid LP", "Bid", "Ask LP", "Ask", "Spread"];

    self.columns = ko.observableArray([]);

    self.addColumn = function(id, Name) {
        self.columns.push(new createColumn(id, Name));
    };

    columnsArr.forEach(function(column){
        self.addColumn(++colCount, column);
    });

    //Editable data
    var myDataRow = [
        ["EURUSD", true, '22', true, '31'],
        ["AUDCAD", false, '23', true, '32'],
        ["GBPUSD", true, '24', true, '33']
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


    var randomData = [
        ["EURUSD", true, '22', true, '31'],
        ["EURUSD", true, '43', false, '52'],
        ["EURUSD", false, '242', true, '333']
    ];

    var j = 0;
    setInterval(function () {
        self.updateRowByID(1, randomData[j]);
        j++;
        j == randomData.length ? j = 0: j = j;
    }, 2000);

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

    $.getJSON("/data", function(allData) {
        var mappedTasks = $.map(allData, function(item) {
            console.log(item);
        });
    });

}


ko.applyBindings(new DataGridViewModel());