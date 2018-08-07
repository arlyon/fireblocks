const regex_input = document.querySelector("#regexes");

function inputHandler() {
    const lines = regex_input.value.split('\n');
    try {
        lines.map(string => new RegExp(string));
        regex_input.classList.remove("invalid");
    } catch (e) {
        regex_input.classList.add("invalid")
    }
}

function storeSettings() {
    browser.storage.local.set({
        regexes: regex_input.value.split("\n")
    })
}

function updateUI(settings) {
    regex_input.value = settings.regexes.join("\n");
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI);

regex_input.addEventListener('input', inputHandler);
regex_input.addEventListener('blur', storeSettings);