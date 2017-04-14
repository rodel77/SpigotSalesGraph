/*
*	This extension do not store any data
*	HTTP Request are only used for calculate exchanges
*/

//@see class Buyer
var buyers = {};
//ex: USD=21 EUR=24 GBP=19
var exchanges = {};
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
	buyers[userID] = new Buyer(price, exchange, date);


	console.log(price+" - "+fx.convert(price, {from: "EUR", to: "USD"}));

}

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
		</div>

		<div id="BList" style="display:none;">
			${oldInner}
		</div>
	`;
}
displayDashboard();

$("#exchangeTotal").addEventListener('change', () => {
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
	console.log(rs);
	return rs;
}

function getTotalConverted(){
	return ": "+betterFloat(fx.convert(totalMoneyInUSD, {from: "USD", to: getSelectedExchange()}));
}

function getExchangesInOptions(){
	var totalOptions = ""
	for(ex in fx.rates){
		console.log(ex);
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
	return fl.lastIndexOf('.')>-1 ? fl.substring(0, Math.min(fl.lastIndexOf('.')+3, fl.length)) : fl;
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
