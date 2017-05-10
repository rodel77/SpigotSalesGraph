function onReady(convert, options, selector, ajax){
    console.debug("[Buyers] Buyers initialized ")
    // var membersDOM = document.querySelectorAll(".memberListItem");
    // var buyers = new Map();
    // var exchanges = {};

    // var pricedSales = 0;
    // var freeSales = 0;

    // var csv = "Date;User;Money";

    var data = getBuyersData(document.querySelectorAll(".memberListItem"));

    // function pushExchange(exchange, amount){
    //     exchanges[exchange] = (exchanges[exchange]==undefined ? amount : exchanges[exchange]+amount)
    // }

    // function createBuyer(userID, exchange, price, date){
    //     buyers.set(userID, {exchange: exchange, price: price, date: date});
    // }

    // for(var i = 0; i < membersDOM.length; i++){
    //     var cm = membersDOM[i];
    //     var free = cm.querySelectorAll(".muted").length===1;
    //     if(!free){
    //         //Purchased for: *amount* *exchange*
    //         var pur = cm.querySelectorAll(".muted")[1].innerHTML;
    //         var exchange = pur.substring(pur.length-4, pur.length-1);
    //         var money = parseFloat(digits(pur));
    //         var userID = digits(cm.querySelector(".avatar").classList[1]);
    //         var date = cm.querySelector(".DateTime").title;
    //         var username = cm.querySelector(".username .StatusTooltip").innerHTML;
    //         createBuyer(userID, exchange, money, date);
    //         pushExchange(exchange, money);
    //         csv += `#${date};${username};${money+" "+exchange}`;
    //         pricedSales++;
    //     }else{
    //         freeSales++;
    //     }
    // }

    console.debug("[Buyers]", data.pricedSales, "buyers found!");

    displayDashboard({
        pricedSales: data.pricedSales,
        freeSales: data.freeSales,
        buyers: data.buyers,
        exchanges: data.exchanges,
        convert: convert,
        options: options,
        csv: data.csv
    }, selector);
}