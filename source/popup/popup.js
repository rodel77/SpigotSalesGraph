function save() {
    let id = document.getElementById("spigotID");
    let showSalelessDays = document.getElementById("showSalelessDays");
    let showUpdateAnnotations = document.getElementById("showUpdateAnnotations");
    let currency = document.getElementById("currency");

    chrome.storage.sync.set({
        id: id.value,
        salelessDays: showSalelessDays.checked,
        showUpdateAnnotations: showUpdateAnnotations.checked,
        defaultCurrency: currency.options[currency.selectedIndex].value,
    });

    console.log("Saving", currency.options, currency.selectedIndex, currency.options[currency.selectedIndex].value)

    update();
}

var exchanges = ["CAD","HKD","ISK","PHP","DKK","HUF","CZK","GBP","RON","SEK","IDR","INR","BRL","RUB","HRK","JPY","THB","CHF","EUR","MYR","BGN","TRY","CNY","NOK","NZD","ZAR","USD","MXN","SGD","AUD","ILS","KRW","PLN"];

function update() {
    chrome.storage.sync.get(['key', 'id', 'salelessDays', 'showUpdateAnnotations', 'defaultCurrency'], function(result) {
        let id = result.key || result.id;
        document.getElementById("spigotID").value = id==undefined ? "" : id;
        document.getElementById("resources").href = "https://www.spigotmc.org/resources/authors/" + id + "/";

        console.log("Currency:", result.defaultCurrency)

        document.getElementById("showSalelessDays").checked = result.salelessDays;
        document.getElementById("showUpdateAnnotations").checked = result.showUpdateAnnotations==undefined ? true : result.showUpdateAnnotations;

        exchanges.forEach((exchange)=>{
            let option = document.createElement("option");
            option.value = exchange;
            option.innerText = exchange;
            if((result.defaultCurrency==undefined && exchange=="USD") || exchange==result.defaultCurrency) option.selected = true;
            document.getElementById("currency").appendChild(option);
        })
    });
}

update();
document.getElementById("spigotID").addEventListener("keyup", save);
document.getElementById("showSalelessDays").addEventListener("click", save);
document.getElementById("showUpdateAnnotations").addEventListener("click", save);
document.getElementById("currency").addEventListener("change", save);

