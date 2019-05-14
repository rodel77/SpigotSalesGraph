function onReady(convert, options, selector){
	console.debug("[Buyers] Buyers initialized");
	
	var done = (data) => {
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
	};
	
	{
		const buyerPagesAmount = getBuyerPagesAmount(document);
		var fetchedBuyerPages = 1;
		
		if(buyerPagesAmount == 1){
			done(getBuyersData(document.querySelectorAll(".memberListItem")));
			return;
		}
		
		const fragment = document.createElement("html");
		var buyerElements = Array.prototype.slice.call(document.querySelectorAll(".memberListItem"));
		
// now fetch every page
		for(var i=2; i<=buyerPagesAmount; i++){
			const page = i;
			ensure(window.location.href, 0, page, (content) => {
				// parse content
				{
					fragment.innerHTML = content;
					buyerElements = buyerElements.concat(Array.prototype.slice.call(fragment.querySelectorAll(".memberListItem")));
				}
				
				// update state
				{
					fetchedBuyerPages++;
					
					if(fetchedBuyerPages == buyerPagesAmount){
						buyerElements.sort((a, b) => {
							const dateA = buildDate(a.querySelectorAll(".DateTime")[0]).realDate;
							const dateB = buildDate(b.querySelectorAll(".DateTime")[0]).realDate;
							
							return dateA > dateB ? -1 : 1;
						});
						
						done(getBuyersData(buyerElements));
					}
				}
			});
		}
    }
}