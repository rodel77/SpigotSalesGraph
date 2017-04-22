//Money.js API STUFF
//Get all money exchanges an set to money.js
fx.base = "USD";
fx.rates = JSON.parse(httpGet("https://api.fixer.io/latest?base=USD")).rates;
fx.rates.USD = 1;

class Buyer{
	constructor(price, exchange, date){
		this.price = price;
		this.exchange = exchange;
		this.date = date;
	}
}

class ResourceData{
    constructor(){
        this.name = "";
        this.buyers = new Map();
        this.exchanges = {};
        this.totalSales = 0;
    }
}

function $(selector){
    return document.querySelector(selector);
}

//This needs memberList class
function getAllBuyersData(list){
    var result = new ResourceData();
    for (var i = 0; i < list.children.length; i++) {
        //Member tag (Date, Name, Profile, Img)
    	var member = list.children[i];

    	//Price
    	var extraTag = member.childNodes[3].getElementsByClassName("muted")[1];
    	var userID = onlyNumbers(member.childNodes[1].href.substring(member.childNodes[1].href.lastIndexOf(".")+1));
    	var date = member.childNodes[3].getElementsByClassName("muted")[0].title;
    	var username = member.childNodes[5].childNodes[1].childNodes[0].innerHTML;


    	//-1 = FREE
    	var price = -1;
    	var exchange = "NIL";
    	if(extraTag!=undefined){
    		result.totalSales++;
    		var p = extraTag.innerHTML;
    		var exchange = p.substring(p.length-4, p.length-1);
    		if(!hasLetter(exchange)){
    			exchange = "USD";
    			console.log("Fixed exchange for: %s", userID);
    		}
    		price = onlyNumbers(p);
    		result.exchanges[exchange]=setOrIncrement(result.exchanges[exchange], price)
    	}
    	result.buyers.set(userID, new Buyer(price, exchange, date));
    }
    return result;
}

function hasLetter(str){
	return String(str).match(/[a-z]/i);
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

//EX: From 62.3845689307689 <> To 62.38
function betterFloat(fl){
	fl = fl.toString();
	return parseFloat(fl.lastIndexOf('.')>-1 ? fl.substring(0, Math.min(fl.lastIndexOf('.')+3, fl.length)) : fl);
}

function betterNumber(n) {
    var splitted = n.toString().split('.');
    var first = splitted.shift().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var decimal = splitted.pop();
    return first+(decimal==undefined ? "" : "."+decimal);
}

//Do get request
function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
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
