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
		const buyerPagesAmount = getBuyerPagesAmount();
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
			ensure(0, page, (content) => {
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

// Ensure all pages are fetched
function ensure(retries, page, runner){
	ajaxGetRequest(window.location.href + "?page=" + page, runner, () => {
		console.error("[Buyers]", "An error occured while fetching content of page " + page);
		//Make sure to not spam too much
		if(retries < 5){
			ensure(retries++, page, runner);
		}
	});
}