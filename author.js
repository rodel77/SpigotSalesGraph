//Check if user have access to see stats
//This is for remove some delayed load in other author pages
var userLogged = $(".accountUsername").innerHTML;
var title = $(".titleBar").children[0].innerHTML;
//Request Index (Request Count)
var rqIndex = 0;
var freeResources = 0;
var resources = {};

///Stats var
var resourcesData = [];
var totalSales = 0;

class Resource{
    constructor(name, free){
        this.name = name;
        this.free = free;
    }
}
console.log(fx.rates)

if(title.lastIndexOf(userLogged)>-1){
    $('.mainContent .section').innerHTML+="<p style='font-size:20px;' id='loadingStats'>Loading 0/0</p>"
    //Get all author resources from DOMElementID
    var resourceList = $(".resourceList");
    var rs = [];
    for (var i = 0; i < resourceList.children.length; i++) {
        var resourceID = resourceList.children[i].id.split('-').pop();
        //Add to list if resource is premium (Added for avoid request request errors)
        if(resourceList.children[i].querySelector('.resourceDetails').children[2].innerHTML=="Premium"){
            rs.push(resourceID);
        }else{
            freeResources++;
        }
    }

    //Request each resource page to get buyers data
    rs.forEach((id, index)=>{
        var xhr = new XMLHttpRequest();
        console.log(id)
        xhr.open("GET", "https://www.spigotmc.org/resources/"+id+"/buyers", true );
        xhr.__id = id;
        xhr.onload = (e) => {
            if(xhr.readyState===4){
                console.log("Checking %s of %s resources (%s)...", (rqIndex++)+1, resourceList.children.length-freeResources, xhr.__id)
                if(xhr.status==403){
                }else{
                    var s = xhr.response;
                    var div = document.createElement("div");
                    div.innerHTML = s;
                    var resourceData = getAllBuyersData(div.querySelector(".memberList"));
                    resourceData.name = div.querySelector(".resourceInfo h1").innerHTML;
                    console.log(resourceData);
                    resourcesData.push(resourceData);
                    totalSales+=resourceData.totalSales;
                }
                if(rqIndex==resourceList.children.length-freeResources){
                    $('#loadingStats').remove();
                    requestEnd();
                }else{
                    $('#loadingStats').innerHTML="Loading "+rqIndex+"/"+(resourceList.children.length-freeResources)+" resources";
                }
            }
        }
        xhr.send(null);
    });
}

function requestEnd(){
    var totalInUSD = calculateTotalMoney();
    $('.mainContent .section').innerHTML+=`
        <div id="authorStats">
            <p style="font-size:20px;">Summary: </p>
            <br>
            <div id="summary">${getSummary()}</div>
            <span style='font-size:25px;'>Total sales: ${betterNumber(totalSales)}</span>
            <fieldset style='font-size:25px;'>Total money gained converted to <select style="font-size:20px;" id="exchangeTotal">
                ${getExchangesInOptions()}
            </select>
            <span id="tct">${getFinalTotalMoney(totalInUSD)}</span>
            </fieldset>
        </div>
    `;
    $("#exchangeTotal").addEventListener('change', () => {
        $("#summary").innerHTML = getSummary();
        $("#tct").innerHTML = getFinalTotalMoney(totalInUSD);
    });
}

function getFinalTotalMoney(totalInUSD){
    return betterNumber(betterFloat(fx.convert(totalInUSD, {from: "USD", to: getSelectedExchange()})));
}

function getSelectedExchange(){
	if($("#exchangeTotal")==undefined){
		return "USD";
	}
	return $("#exchangeTotal").options[$("#exchangeTotal").selectedIndex].value;
}

function getSummary(){
    rs = "";
    for (var i = 0; i < resourcesData.length; i++) {
        var res = resourcesData[i];
        var totalInUSD = 0;
    	for(ex in res.exchanges){
    		var value = res.exchanges[ex];
    		totalInUSD += fx.convert(value, {from: ex, to: getSelectedExchange()});
    	}
        rs+="<hr><span style='font-size:15px;'>"+res.name+": "+betterNumber(betterFloat(totalInUSD))+" "+getSelectedExchange()+" ("+res.totalSales+" Sales)<hr>";

    }
    return rs;
}

function calculateTotalMoney(){
    var totalInUSD = 0;
    for (var i = 0; i < resourcesData.length; i++) {
    	for(ex in resourcesData[i].exchanges){
    		var value = resourcesData[i].exchanges[ex];
    		totalInUSD += fx.convert(value, {from: ex, to: 'USD'});
    	}
    }
    return totalInUSD;
}

/*
var xhr = new XMLHttpRequest();
console.log(resourceID)
xhr.open("GET", "https://www.spigotmc.org/resources/"+resourceID+"/buyers", true );
xhr.test = i;
xhr.onload = (e) => {
    console.log("Checking %s of %s resources...", (rqIndex++)+1, resourceList.children.length)
    console.log(xhr);
    if(rqIndex==resourceList.children.length){
        $('#loadingStats').remove();
    }else{
        $('#loadingStats').innerHTML="Loading "+rqIndex+"/"+resourceList.children.length+" resources";
    }
}
xhr.send(null);
*/
