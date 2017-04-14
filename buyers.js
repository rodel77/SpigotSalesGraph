var buyers = {};
var exchanges = {};
var list = $(".memberList");
var currentTab = "Graph";

//Money.js API STUFF
//Get all money exchanges an set to money.js
fx.base = "USD";
fx.rates = JSON.parse(httpGet("https://api.fixer.io/latest?base=USD")).rates;

for (var i = list.children.length - 1; i >= 0; i--) {
	//Member tag (Date, Name, Profile, Img)
	var member = list.children[i];

	//Price
	var extraTag = member.childNodes[3].getElementsByClassName("muted")[1];

	//-1 = FREE
	var price = -1;
	if(extraTag!=undefined){
		var p = extraTag.innerHTML;
		var exchange = p.substring(p.length-4, p.length-1);
		price = onlyNumbers(p);
		exchanges[exchange]=setOrIncrement(exchanges[exchange], price)
	}

	console.log(price+" - "+fx.convert(price, {from: "EUR", to: "USD"}));

}

console.log(exchanges)

//Display new dashboard
document.querySelector('.innerContent').innerHTML = `
	<ul class="tabs">
		<li class="buyersTabGraph active">
			<a>Graphs</a>
		</li>
		<li class="buyersTabBList">
			<a>List</a>
		</li>
	</ul>

	<div id="Graph">
		<div style="white-space:pre-wrap;">${getTotalMoney()}</div>
	</div>

	<div id="BList" style="display:none;">
		bl
	</div>
`;

$(".buyersTabGraph a").addEventListener('click', () => {
	toggleDashboard('Graph');
})

$(".buyersTabBList a").addEventListener('click', () => {
	toggleDashboard('BList');
})

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

function getTotalMoney(){
	var rs = "";
	for(ex in exchanges){
		rs+= ex+": "+exchanges[ex]+"\n";
	}
	console.log(rs);
	return rs;
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
