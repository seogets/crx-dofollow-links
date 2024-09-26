import { localIgnoredHostnames } from "../utils/storage";

let parent: string | number | null = null;
let toggle: number | string | null = null;
let hostname = "";
let ignoredHostnames: string[] = [];
let tabId: number | undefined = undefined;

localIgnoredHostnames.getValue().then((value) => {
  ignoredHostnames = value;

  localIgnoredHostnames.watch((value) => {
    ignoredHostnames = value;
    if (tabId) {
      chrome.tabs.get(tabId, updateToggle);
    }
  });
});

const updateToggle = (tab: chrome.tabs.Tab) => {
  if (tab.active && tab.url && toggle) {
    tabId = tab.id;

    const url = new URL(tab.url);
    hostname = url.hostname;

    const isDiabled = ignoredHostnames.includes(hostname);
    chrome.contextMenus.update(toggle, {
      title: isDiabled ? `Enable on '${hostname}'` : `Disable on '${hostname}'`,
    });
  }
};

export default defineBackground(() => {
  chrome.tabs.onActivated.addListener((info) => {
    chrome.tabs.get(info.tabId, updateToggle);
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updateToggle(tab);
  });

  chrome.runtime.onInstalled.addListener(async () => {
    parent = chrome.contextMenus.create({
      id: "parent",
      title: "Dofollow Links",
      type: "normal",
    });

    chrome.contextMenus.create({
      id: "open-settings",
      parentId: parent,
      title: "Open Settings",
    });

    toggle = chrome.contextMenus.create({
      id: "toggle",
      title: "about:blank",
      type: "normal",
      parentId: parent,
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "open-settings") {
      chrome.action.openPopup();
    } else if (info.menuItemId === "toggle") {
      if (ignoredHostnames.includes(hostname)) {
        localIgnoredHostnames.setValue(
          ignoredHostnames.filter((d) => d !== hostname)
        );
      } else {
        localIgnoredHostnames.setValue([...ignoredHostnames, hostname]);
      }
    }
  });
});
