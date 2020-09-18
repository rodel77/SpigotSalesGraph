console.debug("[SpigotSales] Sale calculation initilizing!");

var premium = document.querySelector("#ctrl_resource_category_id").value==="20";

console.debug("[SpigotSales] Premium:", premium);

var salePercent, costInput, notice;
var saleData;

if(premium){
    costInput = document.querySelector("#ctrl_bdpaygate_price");
    costInput.addEventListener("change", compute);
    costInput.addEventListener("keydown", compute);
    costInput.addEventListener("keyup", compute);
    costInput.addEventListener("paste", compute);
    
    console.debug("[SpigotSales] Current resource price:", costInput.value);
    var paymentSection = document.querySelectorAll(".mainContent fieldset")[1];
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
    var cp = parseInt(costInput.value);
    var sp = parseInt(salePercent.value);
    notice.innerText = "";
    if(isNaN(sp) || isNaN(cp)){
        notice.style = "color:red;"
        notice.innerText = "Invalid percentage/cost";
        return false;
    }

    if(sp<0 || sp>100){
        notice.style = "color:red;"
        notice.innerText = "Sale cannot be greater than 100 or lower than 0!";
        return false;
    }

    saleData = sale(cp, sp);

    notice.style = "color:black;"
    notice.innerText = "-"+sp+"%, buyers will save $"+saleData.save+" and the final price will be $"+saleData.sale;
    return true;
}

function updatePrice(){
    if(compute()){
        costInput.value = saleData.sale;
    }
}

function sale(price, off){
    var save = (off/100)*price;
    var sale = price-save;

    console.debug("[SpigotSales] Price:", price, ", Off:", off, ", Save: ", save, ", Final Price: ", sale);

    return {
        save: save,
        sale: sale,
    };
}