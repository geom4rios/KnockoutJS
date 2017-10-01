function GridRow(id, dataRow) {
    var self = this;

    self.gridID = id;
    self.dataRow = ko.observable(dataRow);
    self.Spread = ko.computed(function () {
        return (Math.abs(self.dataRow().Ask - self.dataRow().Bid)).toFixed(4);
    }, self);
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

    var columnsArr = ["Symbol", "Bid LP", "Bid", "Ask LP", "Ask", "Spread"];

    self.columns = ko.observableArray([]);

    self.addColumn = function(id, Name) {
        self.columns.push(new createColumn(id, Name));
    };

    columnsArr.forEach(function(column){
        self.addColumn(++colCount, column);
        appendTD(column);
    });

    self.dataGridRow = ko.observableArray([]);

    self.addDataRow = function(id, row) {
        self.dataGridRow.push(new GridRow(id, createDataRow(columnsArr, row) ) );
    };


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

    $.getJSON("/init", function(allData) {
       allData.forEach(function(row){
           self.addDataRow(++count, row);
       });
    });


    self.startStop = false;
    self.status = null;
    self.msg = ko.observable("Start App");

    self.toggleApp = function () {
        self.startStop = !self.startStop;

        if(self.startStop) {
            self.status = setInterval(function () {
                self.msg("Stop App")
                $.getJSON("/update", function (Data) {
                    var Ask;
                    var Bid;
                    var id;

                    for (pair in Data) {
                        var pairObj = Data[pair];

                        var res = pairObj[2];

                        var BidAsk = Object.keys(res).map(function (k) {
                            return res[k]
                        });
                        Bid = BidAsk[0];
                        Ask = BidAsk[1];

                        BidAsk[0] ? Bid = BidAsk[0] : Bid = 1;
                        BidAsk[1] ? Ask = BidAsk[1] : Ask = 1;

                        var pair_arr = [pair, true, Bid, true, Ask];

                        var row = self.getRowBySymbol(pair);
                        id = row.gridID;

                        self.updateRowByID(id, pair_arr);
                    }
                });
            }, 1000);
        } else {
            clearInterval(self.status);
            self.msg("Start App");
        }
    };

}

ko.applyBindings(new DataGridViewModel());