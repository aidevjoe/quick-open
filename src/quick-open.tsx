import { getSelectedText, open, showHUD, Clipboard } from "@raycast/api";
import * as fs from 'fs';


export default async function Command() {
    try {
        const selectedText = await getQuery();
        const schemeRegex = /^(https?|ftp|file|http?):\/\/[-A-Za-z0-9\\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\\+&@#/%=~_|]\.[-A-Za-z0-9\\+&@#/%?=~_|!:,.;]*[-A-Za-z0-9\\+&@#/%=~_|]$/;
        const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

        try {
            if (isDirectoryOrFilePath(selectedText) || isDeeplink(selectedText)) {
                await open(selectedText);
            } else if (schemeRegex.test(selectedText)) {
                await open(selectedText)
            } else if (regex.test(selectedText)) {
                await open(`https://${selectedText}`)
            } else {
                const encodedQueryText = encodeURIComponent(selectedText);
                await open(`https://www.google.com/search?q=${encodedQueryText}`);
            }
        } catch (error) {
            console.error(error);
            await showHUD("⚠️ Failed to quick Open");
        }

    } catch (error) {
        console.log(error)
        await showHUD("Cannot Quick Open, message: " + error);
    }
}
async function getQuery() {
    let selectedText = (await getSelectedText()).trim();
    if (selectedText.length === 0) {
        selectedText = await Clipboard.readText() || "";
        console.log(selectedText)
    }
    return selectedText.trim()
}

function isDirectoryOrFilePath(path: string): boolean {
    try {
        const stat = fs.statSync(path);
        return stat.isDirectory() || stat.isFile();
    } catch (error) {
        return false;
    }
}
function isDeeplink(url: string): boolean {
    const regex = /^[a-z]+:\/\/[a-z0-9]+/i;
    return regex.test(url);
  }
export { Command }

