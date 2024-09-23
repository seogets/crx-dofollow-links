export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
      id: "counter",
      title: "Website Page Counter",
      type: "normal",
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "counter") {
      chrome.action.openPopup();
    }
  });
});
