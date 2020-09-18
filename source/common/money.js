fetch("https://api.exchangeratesapi.io/latest?base=USD").then(function(e){
    return e.json();
}).then(function(e){
    console.debug("[Request] Exchange request successfully");
    e.rates["USD"] = 1;
    ready(e.rates);
}).catch(function(e){
    console.debug("[Request] Error getting exchange json");
    ready(undefined);
});

var base = "USD";
var rates = {"CAD":1.3195727727,"HKD":7.7501059591,"ISK":137.49258286,"PHP":48.4589302365,"DKK":6.3063490718,"HUF":306.145630245,"CZK":22.6727134017,"GBP":0.7758752225,"RON":4.119691447,"SEK":8.8225820124,"IDR":14835.1869119268,"INR":73.6297363737,"BRL":5.2654912266,"RUB":75.1101975078,"HRK":6.3929812664,"JPY":104.5859116725,"THB":31.1952191235,"CHF":0.910570484,"EUR":0.8476731372,"MYR":4.1385097906,"BGN":1.6578791218,"TRY":7.547427312,"CNY":6.7696024413,"NOK":9.0902771891,"NZD":1.4862253115,"ZAR":16.3323726371,"USD":1.0,"MXN":21.0613715351,"SGD":1.3595829448,"AUD":1.3691616513,"ILS":3.4230736628,"KRW":1172.4675765025,"PLN":3.7788420785}
rates["USD"] = 1;

function ready(apiRates){
    console.debug("[Request] Money request ended");

    rates = apiRates!=undefined ? apiRates : rates;

    getOption("defaultCurrency").then((defaultCurrency) => {
        onReady(convert, getExchangesInOptions(defaultCurrency), function(selector){
            return document.querySelector(selector);
        });
    })
}

function getRate(from, to){
    if(from===base){
        return rates[to];
    }

    if(to===base){
        return 1 / rates[from];
    }

    return rates[to] * (1 / rates[from]);
}

function convert(amount, from, to){
    var result = amount * getRate(from, to);
    console.debug("[Money-Translator] Translating", amount, "from", from, "to", to, result, arguments.callee.caller.name);
    return result;
}

function getExchangesInOptions(defaultCurrency){
    var options = "";
	
    for(var ex in rates){
        options += `<option value="${ex}" ${ex===(defaultCurrency==undefined ? "USD" : defaultCurrency) ? "selected" : ""}>${ex}</option>`
    }
    
	return options;
}