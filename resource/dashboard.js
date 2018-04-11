function displayDashboard(info, $){
    console.debug("[Dashboard] Displaying dashboard");

    var total = 0;
    var graphData = {};
	var monthlyGraphData = {};
    var currentTab = "Graph";

	var oldInner = $(".innerContent");
	
    function calculateGraph(){
        info.buyers.forEach(function(buyer, key, map){
            var finalPrice = betterFloat(info.convert(buyer.price, buyer.exchange, getSelectedExchange()));
            var simpleDate = buyer.date.substring(0, buyer.date.lastIndexOf("at")-1);
			var yearMonthDate = buyer.realDate.getFullYear()+" "+monthEnum[buyer.realDate.getMonth()];
			if(monthlyGraphData[yearMonthDate]==undefined){
				monthlyGraphData[yearMonthDate] = {amount: 1, money: finalPrice};
			}else{
				monthlyGraphData[yearMonthDate].amount+=1;
				monthlyGraphData[yearMonthDate].money=parseInt(monthlyGraphData[yearMonthDate].money)+parseInt(finalPrice);
			}

            if(graphData[simpleDate]==undefined){
                graphData[simpleDate]={amount: 1, money: finalPrice};
            }else{
                graphData[simpleDate].amount+=1;
                graphData[simpleDate].money=parseInt(graphData[simpleDate].money)+parseInt(finalPrice);
            }
        });
    }
    calculateGraph();

    function getGData(value){
        var data = [];
        for(var gdata in graphData){
            data.push(parseFloat(graphData[gdata][value]));
        }
        return data.reverse();
    }

	function getMonthlyGData(value){
        var data = [];
        for(var gdata in monthlyGraphData){
            data.push(parseFloat(monthlyGraphData[gdata][value]));
        }
        return data.reverse();
    }

    function getSummary(){
        var result = `<p style="font-size:20px;">Summary:</p><hr>`;
        for(var ex in info.exchanges){
            result+=`<span style="font-size:20px;">${ex}: <b>${betterFloat(info.exchanges[ex])}</b></span>`;
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
			averageMoneyPM += monthlyGraphData[keysM[i]].money;
		}

        averageBuy = averageBuy/keys.length;
        averageMoney = averageMoney/keys.length;
		averageSalesPM = averageSalesPM/keysM.length;
		averageMoneyPM = averageMoneyPM/keysM.length;
        return `
			<br>
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
            total += info.convert(info.exchanges[ex], ex, getSelectedExchange())
        }
        return betterFloat(total);
    }

    function getDownloadCSV(){
        return `<a style="font-size:25px;" download="sales.csv" href="data:text/plain;charset=utf-8,${encodeURIComponent(info.csv).replace(new RegExp("%23", 'g'), "%0A")}">Download .csv</a>`;
    }

    function getSelectedExchange(){
        return $("#exchangeTotal")==undefined ? "USD" : $("#exchangeTotal").options[$("#exchangeTotal").selectedIndex].value;
    }

    $(".innerContent").innerHTML = `
        <ul class="tabs">
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
			<span>: </span><b id="tct">${getTotalConverted()}</b>
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


    displayGraph(getSelectedExchange, graphData, getGData);
	displayMonthlyGraph(getSelectedExchange, monthlyGraphData, getMonthlyGData);

    $("#exchangeTotal").addEventListener('change', function(){
        graphData = {};
		monthlyGraphData = {};
        calculateGraph();
        displayGraph(getSelectedExchange, graphData, getGData);
		displayMonthlyGraph(getSelectedExchange, monthlyGraphData, getMonthlyGData);
		$("#tct").innerHTML = getTotalConverted();
		$("#averages").innerHTML = getAverages();
        $("#csvbtn").innerHTM = getDownloadCSV();
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