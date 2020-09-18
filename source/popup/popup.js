function save() {
    let id = document.getElementById("spigotID");
    let showSalelessDays = document.getElementById("showSalelessDays");
    let showUpdateAnnotations = document.getElementById("showUpdateAnnotations");

    chrome.storage.sync.set({
        id: id.value,
        salelessDays: showSalelessDays.checked,
        showUpdateAnnotations: showUpdateAnnotations.checked,
    });

    update();
}

function update() {
    chrome.storage.sync.get(['key', 'id', 'salelessDays', 'showUpdateAnnotations'], function(result) {
        let id = result.key || result.id;
        document.getElementById("spigotID").value = id==undefined ? "" : id;
        document.getElementById("resources").href = "https://www.spigotmc.org/resources/authors/" + id + "/";

        document.getElementById("showSalelessDays").checked = result.salelessDays;
        document.getElementById("showUpdateAnnotations").checked = result.showUpdateAnnotations==undefined ? true : result.showUpdateAnnotations;
    });
}

update();
document.getElementById("spigotID").addEventListener("keyup", save);
document.getElementById("showSalelessDays").addEventListener("click", save);
document.getElementById("showUpdateAnnotations").addEventListener("click", save);