const MONEY_URL = "https://api.fixer.io/latest";

const monthEnum = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"];

// Mini jquery
function $$(selector){
    return document.querySelector(selector);
}

// Only digits
function digits(string){
    return string.replace(/[^\d.-]/g, '');
}

// Make async request
function request(url, callback){
    console.debug("[Request] Making request to", url);
    var xml = new XMLHttpRequest();
    xml.open("GET", url, true);
    xml.setRequestHeader('Content-Type', 'application/json, text/javascript, */*; q=0.01')
    xml.send(null);
    xml.onload = function(){
        callback(xml);
    }
}

function betterFloat(fl){
	fl = fl.toString();
	return betterNumber(fl.lastIndexOf('.')>-1 ? fl.substring(0, Math.min(fl.lastIndexOf('.')+3, fl.length)) : fl);
}

function betterNumber(n) {
    var splitted = n.toString().split('.');
    var first = splitted.shift().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var decimal = splitted.pop();
    return first+(decimal==undefined ? "" : "."+decimal);
}

function ajaxGetRequest(url, callbackSuccess, callbackError = null){
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if(this.status == 200){
				callbackSuccess(this.responseText);
			
			}else{
				if(callbackError != null)
					callbackError();
			}
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

//Get buyers data from spigot buyers section
function getBuyersData(membersDOM){
    var buyers = new Map();
    var exchanges = {};

    var pricedSales = 0;
    var freeSales = 0;

    var csv = "Date;User;Money";

    function pushExchange(exchange, amount){
        exchanges[exchange] = (exchanges[exchange]==undefined ? amount : exchanges[exchange]+amount)
    }

    function createBuyer(userID, username, exchange, price, date, realDate){
        buyers.set(userID, {username: username, exchange: exchange, price: price, date: date, realDate: realDate});
    }

    for(var i = 0; i < membersDOM.length; i++){
        var cm = membersDOM[i];
        var free = cm.querySelectorAll(".muted").length===1;
        if(!free){
            //Purchased for: *amount* *exchange*
            var pur = cm.querySelectorAll(".muted")[1].textContent.replace(/(?:\r\n|\r|\n)/g, '').split(" ");
            var exchange = pur[pur.length-1];
            var money = parseFloat(digits(pur[pur.length-2]));
            var userID = digits(cm.querySelector(".avatar").classList[1]);
            var date = buildDate(cm.querySelector(".DateTime"));
            var username = cm.querySelector(".username .StatusTooltip").innerHTML;

            createBuyer(userID, username, exchange, money, date.date, date.realDate);
            pushExchange(exchange, money);
            csv += `#${date.date};${username};${money+" "+exchange}`;
            pricedSales++;
        }else{
            freeSales++;
        }
    }
	
    return {
        buyers: buyers,
        exchanges: exchanges,
        pricedSales: pricedSales,
        freeSales: freeSales,
        csv: csv
    };
}

function buildDate(date){
	if(date.hasAttribute("title")){
		date = date.title;
	}else{
		date = date.dataset.datestring+" at "+date.dataset.timestring;
	}
	
	return { date: date, realDate: new Date(date.substring(0, date.lastIndexOf("at")-1)) }
}

function getBuyerPagesAmount(body){
	const el = body.querySelectorAll(".pageNavHeader")[0];
	
	if(el == undefined)
		return 1;
	
	const elText = el.textContent;
	
	return parseInt(elText.substring(elText.lastIndexOf(' ')+1));
}

// Ensure all pages are fetched
function ensure(resource, retries, page, callback){
	ajaxGetRequest(resource + "?page=" + page, callback, () => {
		console.error("[Buyers]", "An error occured while fetching content of page " + page + " retries: " + retries);
		setTimeout(()=>{
			ensure(resource, retries+1, page, callback)
		}, retries * 1000);
	});
}