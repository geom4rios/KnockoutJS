function appendTD(key) {
    key = key.replace(/\s/g,'');
    var LP = key.includes("LP");
    var isSpread = key.includes("Spread");

    if (LP) {
        var tdEL = $("<td></td>");
        $(tdEL).attr("class", key);
        $(".table-rows").append(tdEL);
        var iconEL = $("<i></i>").attr("class", "fa fa-university").attr("aria-hidden", "true").attr("data-bind", "visible: dataRow()." + key + " == true");
        $("."+key).append(iconEL);
    } else if (isSpread) {
        var tdEL = $("<td></td>").attr("data-bind", "text: " + key);
        $(tdEL).attr("class", key);
        $(".table-rows").append(tdEL);
    } else {
        var tdEL = $("<td></td>").attr("data-bind", "text: dataRow()." + key);
        $(tdEL).attr("class", key);
        $(".table-rows").append(tdEL);
    }
}

