console.debug("[SpigotSales] Sale calculation initilizing!");

var premium = document.querySelector("#ctrl_resource_category_id").value==="20";

console.debug("[SpigotSales] Premium:", premium);

var salePercent, costInput, currencyInput, notice;
var saleData;
var costsBeforeSale; //sale will be calculated by last set price (not with prices in sales)

if(premium){
    costInput = document.querySelector("#ctrl_bdpaygate_price");
    currencyInput = document.querySelector("#ctrl_bdpaygate_currency");
    //Cuz JS!
    costInput.addEventListener("change", compute);
    costInput.addEventListener("keydown", compute);
    costInput.addEventListener("keyup", compute);
    costInput.addEventListener("paste", compute);
    currencyInput.addEventListener("change", compute);
	
    costInput.addEventListener("change", function(e) {
		costsBeforeSale = parseFloat(costInput.value);
	});
	costsBeforeSale = parseFloat(costInput.value);
    
    console.debug("[SpigotSales] Current resource price:", costInput.value);
    console.debug("[SpigotSales] Current resource currency:", currencyInput.value);
    var paymentSection = document.querySelectorAll(".mainContent fieldset")[1];
    // console.log(paymentSection.children.pop())
    paymentSection.insertBefore(createSaleElement(), paymentSection.children[1]);

    compute();
}

function createSaleElement(){
    var sale = document.createElement("dl");
    sale.className = "ctrlUnit";

    var title = document.createElement("dt");
    title.innerText = "Sale: ";

    salePercent = document.createElement("input");
    salePercent.className = "textCtrl";
    salePercent.type = "text";
    salePercent.value = 0;
    salePercent.style = "width:30px; text-align:center;";

    salePercent.addEventListener("change", compute);
    salePercent.addEventListener("keydown", compute);
    salePercent.addEventListener("keyup", compute);
    salePercent.addEventListener("paste", compute);

    var saleApply = document.createElement("button");
    saleApply.style = "width:auto; margin-left:5px;"
    saleApply.textContent = "Apply Sale";
    saleApply.className = "textCtrl";
    saleApply.addEventListener("click", function(e){
        e.preventDefault();
        updatePrice();
    });
    
    notice = document.createElement("span");
    notice.className = "explain";
    
    var content = document.createElement("dd");
    content.appendChild(salePercent);
    content.appendChild(saleApply);
    content.appendChild(document.createElement("br"))
    content.appendChild(notice);
    
    sale.appendChild(title);
    sale.appendChild(content);
    
    return sale;
}

function compute(){
    // Source: http://www.webmath.com/sale.html
    var sp = parseFloat(salePercent.value);
    notice.innerText = "";
    if(isNaN(sp) || isNaN(costsBeforeSale)){
        notice.style = "color:red;"
        notice.innerText = "Invalid percentage/cost";
        return false;
    }

    if(sp<0 || sp>100){
        notice.style = "color:red;"
        notice.innerText = "Sale cannot be greater than 100 or lower than 0!";
        return false;
    }

    saleData = sale(costsBeforeSale, sp);

	//get currency and replace some values with currency symbols
	var cur = getCurrency();

    notice.style = "color:black;"
	if(sp == 0) notice.innerText = "No sale applied.";
    else notice.innerText = "-"+sp+"%, buyers will save "+saleData.save+cur+" and the final price will be "+saleData.sale+cur;
    return true;
}

function getCurrency() {
	var cur = currencyInput.value.toUpperCase();
	if(cur.localeCompare("EUR") == 0) cur = "€";
	else if(cur.localeCompare("USD") == 0) cur = "$";
	else cur = " " + cur;
	
	return cur;
}

function updatePrice(){
    if(compute()){
        costInput.value = saleData.sale;
    }
}

function round(num) {
	return Math.round(num * 100) / 100
}

function sale(price, off){
    var save = round((off/100)*price);
    var sale = round(price-save);

    console.debug("[SpigotSales] Price:", price, ", Off:", off, ", Save: ", save, ", Final Price: ", sale);

    return {
        save: save,
        sale: sale,
    };
}