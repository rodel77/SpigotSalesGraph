function onReady(convert, options, $, ajax){
    var userLogged = $(".accountUsername").innerHTML;
    var title = $(".titleBar h1").innerHTML;
    var resources = document.querySelectorAll(".resourceListItem");

    console.debug("[Author] User logged", userLogged);
    if(title.lastIndexOf(userLogged)>-1){
        console.debug("[Author] Detecting owner profile")

        var resourcesD = [];
        var loadIndex = 0;

        for(var i = 0; i < resources.length; i++){
            var resource = resources[i];
            var premium = resource.querySelector(".cost")!=undefined;
            if(premium){
                var id = resource.id.substr(resource.id.lastIndexOf("-")+1);
                resourcesD.push(id);
            }
        }

        $(".mainContent .section").innerHTML+=`<p style="font-size:20px;" id="loadingState">Loading 0/${resourcesD.length}</p>`

        var resourcesData = [];
        var total = 0;
        var totalSales = 0;

        for(var i = 0; i < resourcesD.length; i++){
            var id = resourcesD[i];
            ajax({
                url: `https://www.spigotmc.org/resources/${id}/buyers`,
                success: function(response){

                    var page = document.createElement("div");
                    page.innerHTML = response;
                    var data = getBuyersData(page.querySelectorAll(".memberListItem"))
                    console.log(data);

                    var totalUSD = 0;
                    for(var ex in data.exchanges){
                        var usd = convert(data.exchanges[ex], ex, getSelectedExchange());
                        totalUSD+=usd;
                    }

                    total+=totalUSD;
                    totalSales+=data.pricedSales;
                    resourcesData.push({data: data, name: page.querySelector(".resourceInfo h1").innerText});

                    loadIndex++;
                    console.debug("[Author] Resource", loadIndex, "loaded!")
                    $("#loadingState").innerHTML = `Loading ${loadIndex}/${resourcesD.length}`;
                    if(loadIndex==resourcesD.length){
                       $("#loadingState").remove();
                       requestEnd();
                    }
                }
            });
        }
    }

    function requestEnd(){
       $('.mainContent .section').innerHTML+=`
            <div id="authorStats">
                <p style="font-size:20px;">Summary: </p>
                <br>
                <div id="summary">${getSummary()}</div>
                <span style='font-size:25px;'>Total sales: ${betterNumber(totalSales)}</span>
                <fieldset style='font-size:25px;'>Total money gained converted to <select style="font-size:20px;" id="exchangeTotal">
                    ${options}
                </select>
                <span id="tct">${betterFloat(convert(total, "USD", getSelectedExchange()))}</span>
                </fieldset>
            </div>
        `;
        $("#exchangeTotal").addEventListener('change', () => {
            $("#summary").innerHTML = getSummary();
            $("#tct").innerHTML = betterFloat(convert(total, "USD", getSelectedExchange()));
        });
    }

    function getSummary(){
        var result = "<hr>";
        for(var ddata in resourcesData){
            var rdata = resourcesData[ddata].data;
            result+=`<p style="font-size:20px;">${resourcesData[ddata].name}</p>`;
            var totalInUSD = 0;
            for(var ex in rdata.exchanges){
                result+=`<p style="font-size:15px;">${ex}: ${betterFloat(rdata.exchanges[ex])}</p>`;
                totalInUSD += convert(rdata.exchanges[ex], ex, "USD");
            }
            result+=`<p style="font-size:15px;">Total In USD: ${betterFloat(totalInUSD)}</p>`;
            result+="<hr>";
        }
        return result;
    }

    function getSelectedExchange(){
        if($("#exchangeTotal")==undefined){
            return "USD";
        }
        return $("#exchangeTotal").options[$("#exchangeTotal").selectedIndex].value;
    }
}