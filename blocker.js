const styles = {
    body: `
        margin: 0;
    `,
    dialog: `
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        position: absolute;
        padding: 5em;
        box-sizing: border-box;
        width: 100vw;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: white;
        z-index: 9999;
    `,
    logo: `
        height: 20em;
    `,
    message: `
        text-align: center;
    `,
    listItem: `
        margin: 0.5em;
        text-align: center;
    `,
    unorderedList: `
        font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace;
        font-size: 1.5em;
        padding: 0;
        list-style: none;
        margin: 0;
    `,
    a: `
        text-decoration: underline;
        color: black;
        position: absolute;
        bottom: 1em;
    `
};

/**
 * Creates the elements of the block dialog.
 * @param matchedRegexes A list of regular expressions to display.
 * @returns {HTMLDivElement}
 */
function createBlockDialog(matchedRegexes) {
    const dialog = document.createElement("div");
    dialog.style = styles.dialog;

    const logo = document.createElement("img");
    logo.src = browser.extension.getURL("images/logo.svg");
    logo.style = styles.logo;
    dialog.appendChild(logo);

    const message = document.createElement("h1");
    message.innerText = `this page matches the following regular
                         expression${matchedRegexes.length > 1 ? 's' : ''} and has been blocked`;
    message.style = styles.message;
    dialog.appendChild(message);

    const regexList = document.createElement("ul");
    for (let match of matchedRegexes) {
        const regexItem = document.createElement("li");
        regexItem.innerText = match;
        regexItem.style = styles.listItem;
        regexList.appendChild(regexItem)
    }
    regexList.style = styles.unorderedList;
    dialog.appendChild(regexList);

    const settings = document.createElement("a");
    settings.innerText = "settings";
    settings.style = styles.a;
    settings.href = "#";
    settings.addEventListener('click', () => {
        browser.runtime.sendMessage({
            openSettings: true
        })
    });
    dialog.appendChild(settings);

    return dialog;
}

/**
 * Checks the current url against a list of regular expressions
 * and conditionally replaces the UI with the block message.
 */
function testRegexes(regexStrings) {
    const matchedRegexes = regexStrings
        .map(string => new RegExp(string))
        .filter((regex) => regex.test(window.location.href));
    if (matchedRegexes.length === 0) return;

    document.documentElement.innerHTML = '';
    document.body.style = styles.body;
    document.body.appendChild(createBlockDialog(matchedRegexes));
}

const settingsPromise = browser.storage.local.get();
settingsPromise.then((settings) => testRegexes(settings.regexStrings));