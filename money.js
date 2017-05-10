$.ajax({
    dataType: "json",
    url: MONEY_URL,
    success: function(json){
        console.debug("[Request] Money request ended");
        var base = "USD";
        var rates = json.rates;
        rates["USD"] = 1;

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
            console.debug("[Money-Translator] Translating", amount, "from", from, "to", to, result);
            return result;
        }

        function getExchangesInOptions(){
            var options = "";
            for(var ex in rates){
                options += `<option value="${ex}" ${ex==="USD" ? "selected" : ""}>${ex}</option>`
            }
            return options;
        }

        onReady(convert, getExchangesInOptions(), function(selector){
            return document.querySelector(selector);
        }, $.ajax);
    }
});