const regexInput = document.querySelector("#regexes");

/**
 * Tests if all the regexes are valid and sets a border if needed.
 */
function inputHandler() {
    const lines = regexInput.value.split('\n');
    try {
        lines.map(string => new RegExp(string));
        regexInput.classList.remove("invalid");
    } catch (e) {
        regexInput.classList.add("invalid")
    }
}

/**
 * Saves the newline separated list of regex strings to storage and normalizes.
 */
function storeSettings() {
    if (regexInput.classList.contains("invalid")) return;
    browser.storage.local.set({regexStrings: regexInput.value.split("\n").filter(string => string.length > 0)});
    loadSettings();
    browser.runtime.sendMessage({
        updateSettings: true
    })
}

function updateUI(settings) {
    regexInput.value = settings.regexStrings.join("\n");
    regexInput.rows = settings.regexStrings.length + 1;
}

function loadSettings() {
    const settingsPromise = browser.storage.local.get();
    settingsPromise.then(updateUI);
}

loadSettings();
regexInput.addEventListener('input', inputHandler);
regexInput.addEventListener('blur', storeSettings);