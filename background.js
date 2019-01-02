let blockRegexes = [];

/**
 * Get messages from options.js and blocked.js.
 * Open settings or update blockRegexes with fresh rules
 */
browser.runtime.onMessage.addListener(
    (message, sender, callback) => {
        if (message.openSettings) browser.runtime.openOptionsPage();
        if (message.updateSettings) {
            browser.storage.local.get().then(
                settings => {
                    blockRegexes = settings.regexStrings || [];
                }
            );
        }
    }
);

browser.storage.local.get().then(
    settings => {
        blockRegexes = settings.regexStrings || [];
    }
);
/*
 * Listen for every request and block it if match is found
 * We are interesting only in "main_frame" requests
 * so all other scripts/styles/ajax requests can be skipped.
 */
browser.webRequest.onBeforeRequest.addListener(
    (requestDetails) => {
        const matchedRegexes = blockRegexes
            .map(string => new RegExp(string))
            .filter((regex) => regex.test(requestDetails.url));
        if (matchedRegexes.length === 0) return;

        let redirectUrl = browser.extension.getURL('blocked.html') 
            +'?matches='
            + matchedRegexes.join(',');

        return {
            redirectUrl
        };
    },
    {
        urls: ['<all_urls>'], 
        types: ['main_frame'],
    },
    ["blocking"]
);

