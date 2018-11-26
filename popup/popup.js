function save() {
    var id = document.getElementById("spigotID");
	chrome.storage.sync.set({key: id.value});
      
    update();
}

function update() {

    chrome.storage.sync.get(['key'], function(result) {
        document.getElementById("spigotID").value = result.key; 
        document.getElementById("resources").href = "https://www.spigotmc.org/resources/authors/" + result.key + "/"; 
    });
}

update();
document.getElementById("spigotID").addEventListener("keyup", save);
