function onReady(convert, options, $){
    var userLogged = $(".accountUsername").innerHTML;
    var title = $(".titleBar h1").innerHTML;

    console.debug("[Author] User logged", userLogged);
    if(title.lastIndexOf(userLogged)>-1){
        console.debug("[Author] Detecting owner profile")

        var resourcesD = []; // Stores the ids of the resources (used to download the resource pages)
        var loadIndex = 0; // The current resource loading

        var resourcesData = []; // The final loaded resources

        // Load the first page from the current document
        console.log("Reading page 1");
        readPage(document);

        var resourcesCount = parseInt($("#authorStats .resourceCount dd").innerText);
        var pages = Math.ceil(resourcesCount / 20); // 20 is number of resources per page

        if(pages==1){
            loadResources();
        }

        for(var j = 0; j < pages; j++){
            const page = j + 1;

            // We already have the first page, so just skip it
            if(page==1){
                continue;
            }

            fetch(window.location.href + "?page=" + page, {
                'credentials': 'same-origin'
            }).then((response) => {
                return response.text();
            }).then((body) => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(body, "text/html");

                console.log("Downloading page: "+page + " of " + pages);
                readPage(htmlDocument);

                if (pages == page) {
                    loadResources();
                }
            });
        }
    }

    function loadResources(){
        $(".mainContent .section").innerHTML+=`<p style="font-size:20px;" id="loadingState">Loading 0/${resourcesD.length}</p>`

        for(var i = 0; i < resourcesD.length; i++){
            var id = resourcesD[i];
            queryResource(id);
        }
    }

    function readPage(page){
        var resources = page.querySelectorAll(".resourceListItem");
        for(var i = 0; i < resources.length; i++){
            var resource = resources[i];
            var premium = resource.querySelector(".cost")!=undefined;
            if(premium){
                let id = resource.id.substr(resource.id.lastIndexOf("-")+1);
                resourcesD.push(id);
            }
        }
    }

    var monthlyGraphData = {};
    var graphData = {};
    var disabledResources = {};

    function queryResource(id){
        const resource = "https://www.spigotmc.org/resources/"+id+"/buyers";
        fetch(resource, {
            'credentials': 'same-origin'
        }).then(function(response){
            return response.text();
        }).then(function(body){
			const html = document.createElement("div");
            html.innerHTML = body;
			const buyerPagesAmount = getBuyerPagesAmount(html);
            var fetchedBuyerPages = 1;
			
			if(buyerPagesAmount == 1){
				done(id, html, getBuyersData(html.querySelectorAll(".memberListItem")));
				return;
			}
			
			const fragment = document.createElement("html");
            var buyerElements = Array.prototype.slice.call(html.querySelectorAll(".memberListItem"));
			
			// now fetch every page
			for(var i=2; i<=buyerPagesAmount; i++){
                const page = i;
				ensure(resource, 0, page, (content) => {
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
							done(id, html, getBuyersData(buyerElements));
						}
					}
				});
			}
        });
    }
	
	function done(id, page, data){
		resourcesData.push({
            data: data,
            id: id,
            name: page.querySelector(".resourceInfo h1").innerText,
            isEnabled: function(){
                return disabledResources[this.id]==undefined;
            }
        });

        loadIndex++;
        console.debug("[Author] Resource", loadIndex, "loaded!")
        $("#loadingState").innerHTML = `Loading ${loadIndex}/${resourcesD.length}`;
        if(loadIndex==resourcesD.length){
           $("#loadingState").remove();
           requestEnd();
        }
	}

    function getMonthlyGData(value){
        var data = [];
        for(var gdata in monthlyGraphData){
            data.push(parseFloat(monthlyGraphData[gdata][value]));
        }
        return data.reverse();
    }

    function getGData(value){
        var data = [];
        for(var gdata in graphData){
            data.push(parseFloat(graphData[gdata][value]));
        }
        return data.reverse();
    }

    function getDownloadCSV(){
		let csvContent = `Date;Username;Price (${getSelectedExchange()});Resource`;

		for(resource of resourcesData){
            for(entry of resource.data.buyers.entries()){
                let date = entry[1].realDate;
                    
                csvContent += encodeURIComponent(`\n${date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()};${entry[1].username};${convert(entry[1].price, entry[1].exchange, getSelectedExchange())};${resource.name}`);
            }
		}

        return `<a style="font-size:15px;" download="Spigot Author Sales Report ${getCSVName()}" href="data:text/plain;charset=utf-8,${csvContent}">Download .csv (convert currencies to ${getSelectedExchange()})</a>`;
    }

    function requestEnd(){
       $('.mainContent .section').innerHTML+=`
            <div id="authorStats">
                <p style="font-size:20px;">Summary: </p>
                <br>
                <div id="summary">${getSummary()}</div>
                <span style='font-size:25px;' id="totalSales">${getTotalSales()}</span>
                <!-- <span style='font-size:25px;' id="revenueRecord"></span> 
                <span style='font-size:25px;' id="averageMonthlyRevenue"></span>
                <span style='font-size:25px;' id="salesRecord"></span>
                <span style='font-size:25px;' id="averageMonthlySales"></span> -->
                <fieldset style='font-size:25px;'>Total money gained converted to <select style="font-size:20px;" id="exchangeTotal">
                    ${options}
                </select>
                <span id="tct">${betterFloat(getTotalInExchange())}</span>
                </fieldset>

                <div id="graphContainer"></div>

                <div id="monthlyContainer"></div>

                <div id="csvbtn">${getDownloadCSV()}</div>
            </div>
        `;
        $("#exchangeTotal").addEventListener('change', () => {
            repaint();
            $("#csvbtn").innerHTML = getDownloadCSV();
        });
        
        set_checkbox_handler();

        calculateGraph();
        displayMonthlyGraph(getSelectedExchange, monthlyGraphData, getMonthlyGData);
        displayGraph(getSelectedExchange, graphData, getGData)

        // averages_records();
    }

    // function averages_records(){
    //     let salesRecord, revenueRecord, salesSum, revenueSum, monthCount = 0;
    //     for(let key in monthlyGraphData){
    //         let line = monthlyGraphData[key];
    //         monthCount++;
    //         salesSum+=line.amount;
    //         revenueSum+=line.money;
            
    //         if(line.amount>salesRecord){
    //             salesRecord = line.amount;
    //         }

    //         if(line.money>revenueRecord){
    //             revenueRecord = line.money;
    //         }
    //     }

    //     $("#revenueRecord").innerText="Revenue Record: "+revenueRecord;
    //     $("#averageMonthlyRevenue").innerText="Average Monthly Revenue: "+betterFloat(revenueSum/monthCount);

    //     $("#salesRecord").innerText="Sales Record: "+salesRecord;
    //     $("#averageMonthlySales").innerText="Average Monthly Sales: "+betterFloat(salesSum/monthCount);
    // }

    function set_checkbox_handler(){
        document.querySelectorAll(".resource-toggle").forEach((checkbox)=>{
            checkbox.addEventListener('change', (element) => {
                if(element.target.checked){
                    delete disabledResources[element.target.dataset.id];
                }else{
                    disabledResources[element.target.dataset.id] = true;
                }
                console.log(disabledResources);
                repaint();
            });
        });
    }

    function repaint(){
        $("#summary").innerHTML = getSummary();
        $("#totalSales").innerHTML = getTotalSales();
        $("#tct").innerHTML = betterFloat(getTotalInExchange());
        monthlyGraphData = {};
        graphData = {};
        calculateGraph();
        displayMonthlyGraph(getSelectedExchange, monthlyGraphData, getMonthlyGData);
        displayGraph(getSelectedExchange, graphData, getGData);

        set_checkbox_handler();
    }

    function calculateGraph(){
        var unordered = {};

        resourcesData.forEach((resource)=>{
            if(resource.isEnabled()){

                var buyers = resource.data.buyers;
                buyers.forEach(function(buyer, key, map){
					if(!isNaN(buyer.price)){
						var finalPrice = betterFloat(convert(buyer.price, buyer.exchange, getSelectedExchange()));
						var simpleDate = buyer.date.substring(0, buyer.date.lastIndexOf("at")-1);
						var yearMonthDate = buyer.realDate.getFullYear()+" "+monthEnum[buyer.realDate.getMonth()];
						if(monthlyGraphData[yearMonthDate]==undefined){
							monthlyGraphData[yearMonthDate] = {amount: 1, money: finalPrice};
						}else{
							monthlyGraphData[yearMonthDate].amount+=1;
							monthlyGraphData[yearMonthDate].money=parseInt(monthlyGraphData[yearMonthDate].money)+parseInt(finalPrice);
						}
						
						if(unordered[simpleDate]==undefined){
							unordered[simpleDate]={amount: 1, money: finalPrice, date: buyer.realDate};
						}else{
							unordered[simpleDate].amount+=1;
							unordered[simpleDate].money=parseInt(unordered[simpleDate].money)+parseInt(finalPrice);
						}
					}
                });
            }
        });

        var ordered = Object.keys(unordered).sort(function(a,b){
            return unordered[a].date > unordered[b].date ? 1 : -1;
        });

        ordered.reverse().forEach(function(value){
            graphData[value] = unordered[value];
        });
    }

    function displayGraph(getSelectedExchange, graphData, getGData){
        var hChart = Highcharts.chart('graphContainer', {
            chart: {
                renderTo: 'graphContainer',
                zoomType: 'x'
            },
            title: {
                text: `You sale graph in ${getSelectedExchange()}`
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                categories: Object.keys(graphData).reverse()
            },
            tooltip: {
                shared: true,
                crosshairs: true
            },
            yAxis: {
                title: {
                    text: 'Amount'
                },
                labels: {
                    format: '{value:.2f}'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                name: 'Sales',
                data: getGData("amount")
            },{
                name: 'Money',
                data: getGData("money")
            }]
        });
    }

    function displayMonthlyGraph(getSelectedExchange, monthlyGraphData, getGData){
        var hChart = Highcharts.chart('monthlyContainer', {
            chart: {
                renderTo: 'monthlyContainer',
                zoomType: 'x'
            },
            title: {
                text: `Monthly sales graph in ${getSelectedExchange()}`
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                categories: Object.keys(monthlyGraphData).reverse()
            },
            tooltip: {
                shared: true,
                crosshairs: true
            },
            yAxis: {
                title: {
                    text: 'Amount'
                },
                labels: {
                    format: '{value:.2f}'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                name: 'Sales',
                data: getGData("amount")
            },{
                name: 'Money',
                data: getGData("money")
            }]
        });
    }

    function getSummary(){
        var result = "";

        resourcesData.forEach((rdata)=>{
            result+=`<li class="resourceListItem" style="padding:5px; ${rdata.isEnabled() ? "" : "background:#f5f5f5;"}"><p style="font-size: 15px; font-weight: bold; ${rdata.isEnabled() ? "color: #383838;" : "color: #ff5b5b;"}">${rdata.name} <input class="resource-toggle" data-id="${rdata.id}" type="checkbox" ${rdata.isEnabled()? "checked" : ""}></p>`;
            result+=`<p style="font-size:15px;">Sales: ${rdata.data.pricedSales}</p>`;
            var totalInUSD = 0;
            for(var ex in rdata.data.exchanges){
				if(ex){
					result+=`<p style="font-size:15px;">${ex}: ${betterFloat(rdata.data.exchanges[ex])}</p>`;
					totalInUSD += convert(rdata.data.exchanges[ex], ex, "USD");
				}
            }
            result+=`<p style="font-size:15px;">Total In USD: ${betterFloat(totalInUSD)}</p>`;
            // result+="</div>";
        })
        return result;
    }

    // function getTotalInUSD(resource){
    //     var totalUSD = 0;
    //     for(var ex in resource.exchanges){
    //         var usd = convert(resource.exchanges[ex], ex, getSelectedExchange());
    //         totalUSD+=usd;
    //     }

    //     return totalUSD;
    //     // total+=totalUSD;
    // }

    function getTotalInExchange(){
        let totalExchange = 0;

            // var totalUSD = 0;
            // for(var ex in data.exchanges){
            //     var usd = convert(data.exchanges[ex], ex, getSelectedExchange());
            //     totalUSD+=usd;
            // }

            // total+=totalUSD;

        resourcesData.forEach((resource)=>{
            if(resource.isEnabled()){
                for(let ex in resource.data.exchanges){
					if(ex){
						let usd = convert(resource.data.exchanges[ex], ex, getSelectedExchange());
						totalExchange+=usd;
					}
                }
            }
        });

        console.log("Total in your exchange: ", totalExchange)

        return totalExchange;
    }

    function getTotalSales(){
        totalSales = 0;

        resourcesData.forEach((resource)=>{
            if(resource.isEnabled()){
                totalSales += resource.data.pricedSales;
            }
        });

        return "Total sales: "+betterNumber(totalSales);
    }

    function getSelectedExchange(){
        if($("#exchangeTotal")==undefined){
            return "USD";
        }
        return $("#exchangeTotal").options[$("#exchangeTotal").selectedIndex].value;
    }
}