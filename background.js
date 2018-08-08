function openSettings() {
    const optionsOpen = browser.runtime.openOptionsPage();
}

browser.runtime.onMessage.addListener((message, sender, callback) => {
    if (message.openSettings) openSettings();
});