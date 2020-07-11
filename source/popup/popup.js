function save() {
    var id = document.getElementById("spigotID");
    var showSalelessDays = document.getElementById("showSalelessDays");

  	chrome.storage.sync.set({
      id: id.value,
      salelessDays: showSalelessDays.checked
    });

    update();
}

function update() {

  chrome.storage.sync.get(['key', 'id', 'salelessDays'], function(result) {
    var id = result.key || result.id;
    document.getElementById("spigotID").value = id;
    document.getElementById("resources").href = "https://www.spigotmc.org/resources/authors/" + id + "/";

    document.getElementById("showSalelessDays").checked = result.salelessDays;
  });

}

update();
document.getElementById("spigotID").addEventListener("keyup", save);
document.getElementById("showSalelessDays").addEventListener("click", save);
