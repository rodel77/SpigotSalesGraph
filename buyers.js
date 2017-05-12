function onReady(convert, options, selector, ajax){
    console.debug("[Buyers] Buyers initialized ")
    var data = getBuyersData(document.querySelectorAll(".memberListItem"));

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