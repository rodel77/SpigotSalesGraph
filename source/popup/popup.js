function save() {
    var id = document.getElementById("spigotID");
  	chrome.storage.sync.set({id: id.value});

    update();
}

function update() {

  chrome.storage.sync.get(['key', 'id'], function(result) {
    var id = result.key || result.id;
    document.getElementById("spigotID").value = id;
    document.getElementById("resources").href = "https://www.spigotmc.org/resources/authors/" + id + "/";
  });

}

update();
document.getElementById("spigotID").addEventListener("keyup", save);
