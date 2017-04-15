/*
*	This extension do not store any data
*	HTTP Request are only used for calculate exchanges
*/

//@see class Buyer
var buyers2 = new Map();
//ex: USD=21 EUR=24 GBP=19
var exchanges = {};
//EXSchema: {"Jan 1, 1999": {amount: 10, money: 10}}
var graphData = {};
var totalMoneyInUSD;
var list = $(".memberList");
var oldInner = list.innerHTML;
var currentTab = "Graph";

class Buyer{
	constructor(price, exchange, date){
		this.price = price;
		this.exchange = exchange;
		this.date = date;
	}
}

//Money.js API STUFF
//Get all money exchanges an set to money.js
fx.base = "USD";
fx.rates = JSON.parse(httpGet("https://api.fixer.io/latest?base=USD")).rates;

//Save all buyers
for (var i = list.children.length - 1; i >= 0; i--) {
	//Member tag (Date, Name, Profile, Img)
	var member = list.children[i];

	//Price
	var extraTag = member.childNodes[3].getElementsByClassName("muted")[1];
	var userID = onlyNumbers(member.childNodes[1].href.substring(member.childNodes[1].href.lastIndexOf(".")+1));
	var date = member.childNodes[3].getElementsByClassName("muted")[0].title;

	//-1 = FREE
	var price = -1;
	var exchange = "NIL";
	if(extraTag!=undefined){
		var p = extraTag.innerHTML;
		var exchange = p.substring(p.length-4, p.length-1);
		price = onlyNumbers(p);
		exchanges[exchange]=setOrIncrement(exchanges[exchange], price)
	}
	buyers2.set(userID, new Buyer(price, exchange, date));
}

//Save amount and money gained from date
function calculateGraph(){
	buyers2.forEach((buy, key, map) => {
		if(buy.price>0){
			var finalPrice = fx.convert(buy.price, {from: buy.exchange, to: getSelectedExchange()})
			finalPrice = betterFloat(finalPrice);
			console.log("From "+buy.price+" to "+finalPrice+" "+getSelectedExchange())
			var onlyDay = buy.date.substring(0, buy.date.lastIndexOf('at')-1);
			if(graphData[onlyDay]==undefined){
				graphData[onlyDay]={amount: 1, money: finalPrice};
			}else{
				graphData[onlyDay].amount+=1;
				graphData[onlyDay].money=parseInt(graphData[onlyDay].money)+parseInt(finalPrice);
			}
		}
	});
}
calculateGraph();

//console.log(graphData)

totalMoneyInUSD = calculateTotalMoney();

//Display new dashboard
function displayDashboard(){
	document.querySelector('.innerContent').innerHTML = `
		<ul class="tabs">
			<li class="buyersTabGraph active">
				<a>Graphs</a>
			</li>
			<li class="buyersTabBList">
				<a>List</a>
			</li>
		</ul>

		<div style="padding:10px;" id="Graph">
			<div style="white-space:pre-wrap;" id="totalMoney">${getTotalMoney()}</div>
			<fieldset style='font-size:25px;'>Total converted to <select style="font-size:20px;" id="exchangeTotal">
				${getExchangesInOptions()}
			</select>
			<span id="tct">${getTotalConverted()}</span>
			</fieldset>

			<div id="graphContainer"></div>
		</div>

		<div id="BList" style="display:none;">
			${oldInner}
		</div>
	`;

}
displayDashboard();
displayGraph();

function displayGraph(){
	var hChart = Highcharts.chart('graphContainer', {
		chart: {
			renderTo: 'graphContainer',
			zoomType: 'x'
		},
		title: {
			text: 'You sale graph in '+getSelectedExchange()
		},
		subtitle: {
			text: document.ontouchstart === undefined ?
					'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
		},
		xAxis: {
			categories: Object.keys(graphData)
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


//Return data in graph format []
function getGData(value){
	var data = [];
	for(gd in graphData){
		data.push(parseFloat(graphData[gd][value]));
	}
	return data;
}


$("#exchangeTotal").addEventListener('change', () => {
	graphData = {};
	calculateGraph();
	displayGraph();
	$("#tct").innerHTML = getTotalConverted();
});

$(".buyersTabGraph a").addEventListener('click', () => {
	toggleDashboard('Graph');
});

$(".buyersTabBList a").addEventListener('click', () => {
	toggleDashboard('BList');
});

// Mini JQuery
function $(selector){
	return document.querySelector(selector);
}

//Remove any no-number char
function onlyNumbers(string){
	return string.replace(/[^\d.-]/g, '');
}

function setOrIncrement(v, number){
	number = parseFloat(number);
	if(v==undefined){
		return number;
	}else{
		v = parseFloat(v);
		return v+=number;
	}
}

function getSelectedExchange(){
	if($("#exchangeTotal")==undefined){
		return "USD";
	}
	return $("#exchangeTotal").options[$("#exchangeTotal").selectedIndex].value;
}

function getTotalMoney(){
	var rs = "<p style='font-size:30px;'>Total money gained</p><br><hr>";
	for(ex in exchanges){
		rs+= "<span style='font-size:20px;'>"+ex+": "+betterFloat(exchanges[ex])+"</span>\n";
	}
	rs+="<hr><br>";
	return rs;
}

function getTotalConverted(){
	return ": "+betterFloat(fx.convert(totalMoneyInUSD, {from: "USD", to: getSelectedExchange()}));
}

function getExchangesInOptions(){
	var totalOptions = ""
	for(ex in fx.rates){
		if(ex=="USD"){
			totalOptions += '<option selected="selected" value="'+ex+'">'+ex+'</option>'
		}else{
			totalOptions += '<option value="'+ex+'">'+ex+'</option>'
		}
	}

	return totalOptions;
}

function calculateTotalMoney(){
	var totalInUSD = 0;
	for(ex in exchanges){
		var value = exchanges[ex];
		totalInUSD += fx.convert(value, {from: ex, to: 'USD'});
	}
	return totalInUSD;
}

//EX: From 62.3845689307689 <> To 62.38
function betterFloat(fl){
	fl = fl.toString();
	return parseFloat(fl.lastIndexOf('.')>-1 ? fl.substring(0, Math.min(fl.lastIndexOf('.')+3, fl.length)) : fl);
}

//Toggle betwen graphs and list
function toggleDashboard(tab){
	if(currentTab!=tab){
		$(".buyersTab"+currentTab).classList.toggle('active');
		$("#"+currentTab).style.display = "none";
		currentTab = tab;
		$(".buyersTab"+currentTab).classList.toggle('active');
		$("#"+currentTab).style.display = "";
	}
}

//Do get request
function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
