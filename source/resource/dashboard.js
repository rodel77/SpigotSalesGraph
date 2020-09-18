async function displayDashboard(info, $){
    console.debug("[Dashboard] Displaying dashboard");

    var total = 0;
    var graphData = {};
	var monthlyGraphData = {};
    var currentTab = "Graph";

    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ]

	var oldInner = $(".innerContent");


    async function calculateGraph(){
      var showSalelessDays = await getOption("salelessDays");
      
      var lastdate;
      for(entry of info.buyers.entries()){
			var buyer = entry[1];
			if(!isNaN(buyer.price)){
				var finalPrice = info.convert(buyer.price, buyer.exchange, getSelectedExchange());
				var simpleDate = buyer.date.substring(0, buyer.date.lastIndexOf("at")-1);
				var yearMonthDate = buyer.realDate.getFullYear()+" "+monthEnum[buyer.realDate.getMonth()];

				if(monthlyGraphData[yearMonthDate]==undefined){
					monthlyGraphData[yearMonthDate] = {amount: 1, money: finalPrice};
				}else{
					monthlyGraphData[yearMonthDate].amount+=1;
					monthlyGraphData[yearMonthDate].money=monthlyGraphData[yearMonthDate].money+finalPrice;
				}

				if(showSalelessDays) {
					if(lastdate == undefined) {
						lastdate = simpleDate;
					} else {
						var thisdate = new Date(simpleDate);
						var on = new Date(lastdate).getTime()-86400000;

						while(on > thisdate.getTime()) {

						var ondate = new Date(on);
						var keyName = months[ondate.getMonth()]+" "+ondate.getDate()+", "+ondate.getFullYear();
						graphData[keyName] = {
							amount: 0,
							money: 0,
							realDate: ondate,
						};
						on -= 86400000;

						}

						lastdate = simpleDate;
					}
				}


				if(graphData[simpleDate]==undefined){
					graphData[simpleDate] = {
						amount: 1,
						money: finalPrice,
						realDate: buyer.realDate,
					};
				}else{
					graphData[simpleDate].amount += 1;
					graphData[simpleDate].money = graphData[simpleDate].money+finalPrice;
				}
			}
      	};

		// make the money string look better
		for(el in monthlyGraphData){
			el = monthlyGraphData[el];
		};

		for(el in graphData){
			el = graphData[el];
		};
    }
    await calculateGraph();

    function getGData(value){
        var data = [];
        for(var gdata in graphData){
            data.push(graphData[gdata][value]);
        }
        return data.reverse();
    }

	function getMonthlyGData(value){
		var data = [];
        for(var gdata in monthlyGraphData){
            data.push(monthlyGraphData[gdata][value]);
        }
        return data.reverse();
    }

    function getSummary(){
        var result = `<p style="font-size:20px;">Summary</p><hr>`;
        for(var ex in info.exchanges){
			if(ex){
				result+=`<span style="font-size:20px;">${ex}: <b>${betterFloat(info.exchanges[ex])}</b></span>`;
			}
        }
        result += `<hr>`;
        result += `<span style='font-size:20px;'>Sales: <b>${info.pricedSales}</b> (<b>${info.freeSales}</b> free copies) (You giveaway <b>${betterFloat((info.freeSales/(info.freeSales+info.pricedSales))*100)}%</b>)</span><br>`
        return result;
    }

    function getAverages(){
        var keys = Object.keys(graphData);
		var keysM = Object.keys(monthlyGraphData);
        var averageBuy = 0;
		var averageMoney = 0;
		var averageSalesPM = 0;
		var averageMoneyPM = 0;
        for(var i = 0; i < keys.length; i++){
            averageBuy += graphData[keys[i]].amount;
            averageMoney += parseFloat(graphData[keys[i]].money);
        }

		for(var i = 0; i < keysM.length; i++){
			averageSalesPM += monthlyGraphData[keysM[i]].amount;
			averageMoneyPM += parseFloat(monthlyGraphData[keysM[i]].money);
		}

        averageBuy = averageBuy/keys.length;
        averageMoney = averageMoney/keys.length;
		averageSalesPM = averageSalesPM/keysM.length;
		averageMoneyPM = averageMoneyPM/keysM.length;
        return `
			<hr>
            <span style='font-size:15px;'>Average Sales Per Day: <b>${betterFloat(averageBuy)}</b></span><br>
            <span style='font-size:15px;'>Average Money Per Day: <b>${betterFloat(averageMoney)}</b></span><br>
			<hr>
			<span style='font-size:15px;'>Average Sales Per Month: <b>${betterFloat(averageSalesPM)}</b></span><br>
			<span style='font-size:15px;'>Average Money Per Month: <b>${betterFloat(averageMoneyPM)}</b></span><br>
			<hr>
        `;
    }

    function getTotalConverted(){
        var total = 0;
        for(var ex in info.exchanges){
			if(ex){
				total += info.convert(info.exchanges[ex], ex, getSelectedExchange());
			}
        }
        return betterFloat(total);
    }

    function getDownloadCSV(){
		let csvContent = `Date;Username;Price (${getSelectedExchange()});Resource`;

		for(entry of info.buyers.entries()){
			let date = entry[1].realDate;

			csvContent += encodeURIComponent(`\n${date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()};${entry[1].username};${info.convert(entry[1].price, entry[1].exchange, getSelectedExchange())}`);
		}

        return `<a style="font-size:15px;" download="Spigot Premium Resource Sales Report ${getCSVName()}" href="data:text/plain;charset=utf-8,${csvContent}">Download .csv (convert currencies to ${getSelectedExchange()})</a>`;
    }

    function getSelectedExchange(){
        return $("#exchangeTotal")==undefined ? "USD" : $("#exchangeTotal").options[$("#exchangeTotal").selectedIndex].value;
    }

    $(".innerContent").innerHTML = `
    	<style>
    	    hr {
    	    	height: 1px;
    			background-color: #d9d9d9;
    			border: 0px;
    	    }
    		.tabs.sub {
    			border-bottom:none!important;
    		}
    		.tabs.sub li a {
    			background-color: #dddddd!important;
    			margin-left: 5px;
    			border-radius: 8px;
    			transition:100ms;
			}
			.tabs.sub li a:hover {
    			background-color: #cecece!important;
			}
    	    .tabs.sub li:first-child a {
    	    	margin:0px;
    	    }
    	</style>
        <ul class="tabs sub">
			<li class="buyersTabGraph active">
				<a>Graphs</a>
			</li>
			<li class="buyersTabBList">
				<a>List</a>
			</li>
		</ul>

       <div style="padding:10px;" id="Graph">
			<div style="white-space:pre-wrap;" id="sumary">${getSummary()}</div>
			<fieldset style='font-size:25px;'>Total money converted to <select style="font-size:20px;" id="exchangeTotal">
				${info.options}
			</select>
			<b id="tct">${getTotalConverted()}</b>
			</fieldset>
			<div id="averages">${getAverages()}</div>

			<div id="graphContainer"></div>

			<div id="monthlyContainer"></div>

			<div id="csvbtn">${getDownloadCSV()}</div>
		</div>

		<div id="BList" style="display:none;">
			${oldInner.innerHTML}
		</div>
    `;

	var search = oldInner.querySelector("#BList div div");
	search.innerHTML = `Search Buyer: <input type="text" class="textCtrl" id="searchUser"> ${search.innerHTML}`;
	search = $("#searchUser");

	// Search something...
	search.oninput = function(){
		var users = document.querySelectorAll(".memberListItem");
		for(var i = 0; i < users.length; i++){
			var user = users[i];
			var name = user.querySelector(".username .StatusTooltip").innerHTML;
			var id = user.querySelector(".avatar").classList[1];
			id = id.substring(2, id.length-1);

			if(name.toLowerCase().lastIndexOf(search.value.toLowerCase())===-1 && id.lastIndexOf(search.value)===-1){
				user.style.display = "none";
			}else{
				user.style.display = null;
			}
		}
	}

    displayGraph(getSelectedExchange, graphData, getGData, info);
	displayMonthlyGraph(getSelectedExchange, monthlyGraphData, getMonthlyGData);

	chrome.storage.onChanged.addListener((changes)=>{
		let show_annotations = changes.showUpdateAnnotations;
		if(show_annotations!=undefined){
			displayGraph(getSelectedExchange, graphData, getGData, info);
		}
	})

    $("#exchangeTotal").addEventListener('change', function(){
        graphData = {};
		monthlyGraphData = {};
		calculateGraph().then(function(){
			displayGraph(getSelectedExchange, graphData, getGData, info);
			displayMonthlyGraph(getSelectedExchange, monthlyGraphData, getMonthlyGData);
			$("#tct").innerHTML = getTotalConverted();
			$("#averages").innerHTML = getAverages();
			$("#csvbtn").innerHTML = getDownloadCSV();
		})
    });

    $(".buyersTabGraph a").addEventListener("click", function(){
        toggleDashboard('Graph')
    });
    $(".buyersTabBList a").addEventListener('click', () => {
    	toggleDashboard('BList');
    });

	function toggleDashboard(tab){
		if(currentTab!=tab){
			$(".buyersTab"+currentTab).classList.toggle('active');
			$("#"+currentTab).style.display = "none";
			currentTab = tab;
			$(".buyersTab"+currentTab).classList.toggle('active');
			$("#"+currentTab).style.display = "";
		}
	}
}


function displayGraph(getSelectedExchange, graphData, getGData, info){
	const updatesData = info.updatesData;
	const money_data = getGData("money");
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
			crosshairs: true,
			pointFormat: "<span style=\"color:{point.color}\">●</span> {series.name}: <b>{point.y:,.2f}</b><br>",
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
			color: '#ed8106',
			name: 'Sales',
			data: getGData("amount")
		},{
			color: '#393e44',
			name: 'Money',
			data: money_data
		}]
	});

	getOption("showUpdateAnnotations").then((visible) => {
		return visible==true;
	}).then((visible)=>{
		if(!visible) return;
		// console.log("Visible", visible);
		const dates = Object.keys(graphData).reverse();
		const indices = {};
		if(updatesData!=undefined){
			for(let i = 0; i < updatesData.length; i++){
				const update = updatesData[i];
				const graph = graphData[update.date.text];
	
				if(graph){
					let index;
					for(let j = 0; j < dates.length; j++){
						if(dates[j]==update.date.text){
							index = j;
							break;
						}
					}
	
					if(indices.hasOwnProperty(index)){
						indices[index].labels[0].text += ", "+update.version;
						continue;
					}
	
					indices[index] = {
						labelOptions: {
							verticalAlign: "top",
							y: 15
						},
						labels: [{
							point: {
								x: index,
								y: Math.max(2, getGData("money")[index]),
								xAxis: 0,
								yAxis: 0,
							},
							text: update.version,
						}],
						visible: visible,
					};
				}else{
					let index;
					let whole_index;
					let lastDate;
					const updateDate = update.date.realDate.getTime();
					for(let j = 0; j < dates.length; j++){
						const purchaseDate = graphData[dates[j]].realDate.getTime();
	
						if(updateDate<purchaseDate){
							whole_index = j;
							if(!lastDate) {
								index = j;
							}else{
								index = (updateDate - lastDate) / (purchaseDate - lastDate) * (j - (j-1)) + (j-1);
							}
							break;
						}
	
						lastDate = purchaseDate;
					}
	
					if(indices.hasOwnProperty(index)){
						indices[index].labels[0].text += ", "+update.version;
						continue;
					}
	
					indices[index] = {
						labelOptions: {
							verticalAlign: "top",
							y: 15
						},
						labels: [{
							point: {
								x: index,
								y: Math.max(2, getGData("money")[whole_index]),
								xAxis: 0,
								yAxis: 0,
							},
							text: update.version,
						}],
						visible: visible,
					};
				}
			}
	
			let indicesKeys = Object.keys(indices);
			for(let i = 0; i < indicesKeys.length; i++){
				hChart.addAnnotation(indices[indicesKeys[i]]);
			}
		}
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
			crosshairs: true,
			pointFormat: "<span style=\"color:{point.color}\">●</span> {series.name}: <b>{point.y:,.2f}</b><br>",
        },
		yAxis: {
	        title: {
	            text: 'Amount'
	        },
			labels: {
            	format: '{value:,.2f}'
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
			color: '#ed8106',
			name: 'Sales',
			data: getGData("amount")
		},{
			color: '#393e44',
			name: 'Money',
			data: getGData("money")
		}]
	});
}

function getOption(name) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([name], (result) => {
      resolve(result[name]);
    })
  })
}