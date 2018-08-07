const styles = {
    body: `
        margin: 0;
    `,
    dialog: `
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        position: absolute;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `,
    logo: `
        max-height: 20em;
    `,
    message: `
        text-align: center;
    `,
    list_item: `
        margin: 0.5em;
        text-align: center;
    `,
    list: `
        font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace;
        font-size: 1.5em;
        padding: 0;
        list-style: none;
        margin: 0;
    `,
};

function createBlockDialog(matched_regexes) {
    const dialog = document.createElement("div");
    dialog.style = styles.dialog;

    const logo = document.createElement("img");
    logo.src = browser.extension.getURL("images/logo.svg");
    logo.style = styles.logo;
    dialog.appendChild(logo);

    const message = document.createElement("h1");
    message.innerText = `this page matches the following regular
                         expression${matched_regexes.length > 1 ? 's' : ''} and has been blocked`;
    message.style = styles.message;
    dialog.appendChild(message);

    const regexes_list = document.createElement("ul");
    for (let match of matched_regexes) {
        const regex_item = document.createElement("li");
        regex_item.innerText = match;
        regex_item.style = styles.list_item;
        regexes_list.appendChild(regex_item)
    }
    regexes_list.style = styles.list;
    dialog.appendChild(regexes_list);

    return dialog;
}

function checkRegexes(settings) {
    const regexes = settings.regexes.map(string => new RegExp(string));
    const matched_regexes = regexes.filter((regex) => regex.test(window.location.href));
    if (matched_regexes.length > 0) {
        document.documentElement.innerHTML = '';
        document.body.style = styles.body;
        const blocked = createBlockDialog(matched_regexes);
        document.body.appendChild(blocked);
    }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkRegexes);