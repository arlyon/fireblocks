document.getElementById('settings').addEventListener('click', () => {
    browser.runtime.sendMessage({
        openSettings: true
    })
});
const matches = window.location.search
    .slice("?matches=".length)
    .split(',');


const regexList = document.getElementById('matchesList');
for (let match of matches) {
    const regexItem = document.createElement("li");
    regexItem.innerText = match;
    regexItem.className = 'listItem';
    regexList.appendChild(regexItem)
}
