async function getUpdates(){
	return new Promise(done => {
		getOption("showUpdateAnnotations").then(function(enabled){
			if(!enabled){
				done();
				return;
			}

			let update = document.querySelector(".resourceTabHistory a");
	
			fetch(update.href, {
				'credentials': 'same-origin'
			}).then(function(response){
				return response.text();
			}).then(function(response){
				const parser = new DOMParser();
				return parser.parseFromString(response, "text/html");
			}).then(function(body){
				const elements = body.querySelectorAll(".resourceHistory .dataRow");
				let updates = [];

				for(let i = 0; i < elements.length; i++){
					const element = elements[i];
					if(element.children[0].tagName!="TH"){
						const date = buildDate(element.querySelector(".releaseDate .DateTime"));
						date.text = element.querySelector(".releaseDate .DateTime").innerHTML;
						updates.push({
							date: date,
							version: element.querySelector(".version").innerHTML
						});
					}
				}

				done(updates);
			});
		})
	});
}

function onReady(convert, options, selector){
	console.debug("[Buyers] Buyers initialized");
	
	var done = (data, updatesData) => {
		console.debug("[Buyers]", data.pricedSales, "buyers found!");
		
		displayDashboard({
			pricedSales: data.pricedSales,
			freeSales: data.freeSales,
			buyers: data.buyers,
			exchanges: data.exchanges,
			convert: convert,
			options: options,
			csv: data.csv,
			updatesData: updatesData,
		}, selector);
	};
	
	getUpdates().then(function(updatesData){
		const buyerPagesAmount = getBuyerPagesAmount(document);
		var fetchedBuyerPages = 1;
		
		if(buyerPagesAmount == 1){
			done(getBuyersData(document.querySelectorAll(".memberListItem")), updatesData);
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
						
						done(getBuyersData(buyerElements), updatesData);
					}
				}
			});
		}
	});
}