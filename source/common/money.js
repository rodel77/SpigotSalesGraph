fetch("https://api.exchangerate.host/latest?base=USD&symbols=USD,CAD,AUD,GBP,EUR").then(function(e){
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
var rates = {"AUD":1.376691,"CAD":1.264755,"EUR":0.879665,"GBP":0.739946,"USD":1}
rates["USD"] = 1;

function ready(apiRates){
    console.debug("[Request] Money request ended");

    rates = apiRates!=undefined ? apiRates : rates;

    getOption("defaultCurrency").then((defaultCurrency) => {
        DEFAULT_CURRENCY = defaultCurrency;
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