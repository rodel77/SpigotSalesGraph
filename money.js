// (function(){$.ajax({
//     url: MONEY_URL,
//     dataType: "json",
//     success: function(json){
        
        console.debug("[Request] Money request ended");
        var base = "USD";
        var rates = {"AUD":1.357,"BGN":1.8009,"BRL":3.1642,"CAD":1.3726,"CHF":1.0085,"CNY":6.9021,"CZK":24.492,"DKK":6.8509,"GBP":0.77795,"HKD":7.7895,"HRK":6.8435,"HUF":285.98,"IDR":13343.0,"ILS":3.6114,"INR":64.37,"JPY":113.9,"KRW":1128.5,"MXN":18.973,"MYR":4.3485,"NOK":8.5939,"NZD":1.4606,"PHP":49.886,"PLN":3.8897,"RON":4.1888,"RUB":57.15,"SEK":8.8838,"SGD":1.4081,"THB":34.751,"TRY":3.5839,"ZAR":13.366,"EUR":0.92081}
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

        setTimeout(function(){
            onReady(convert, getExchangesInOptions(), function(selector){
                return document.querySelector(selector);
            }, $.ajax)
        }, 1000);
    // },
    // error: function(err){
    //     console.log(err)
    // }
// })})();