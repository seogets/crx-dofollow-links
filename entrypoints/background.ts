export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
      id: "dofollow",
      title: "Dofollow Links",
      type: "normal",
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "dofollow") {
      chrome.action.openPopup();
    }
  });
});
