import { localDofollowEnabled } from "@/utils/storage";

function domain(u: URL | string): string {
  return new URL(u).host.split(".").slice(-2).join(".");
}

const isExternal = (link: HTMLAnchorElement) => {
  try {
    return domain(link.href) !== domain(location.href);
  } catch {
    return false;
  }
};

const isDofollow = (link: HTMLAnchorElement) => {
  const rel = link.getAttribute("rel");
  return !rel || !rel.includes("nofollow");
};

export default defineContentScript({
  matches: ["*://*/*"],

  async main() {
    let [isDofollowEnabled, isNofollowEnabled] = await Promise.all([
      localDofollowEnabled.getValue(),
      localNofollowEnabled.getValue(),
    ]);

    localDofollowEnabled.watch((value) => {
      isDofollowEnabled = value;
      searchAndHighlight();
    });

    localNofollowEnabled.watch((value) => {
      isNofollowEnabled = value;
      searchAndHighlight();
    });

    function searchAndHighlight() {
      const links = document.querySelectorAll("a");

      for (const link of links) {
        link.style.outline = "";
        link.style.outlineOffset = "";

        if (!isExternal(link)) {
          continue;
        }

        if (isDofollowEnabled && isDofollow(link)) {
          link.style.outline = "2px dashed #22c55e";
          link.style.outlineOffset = "1px";
        } else if (isNofollowEnabled && !isDofollow(link)) {
          link.style.outline = "2px dashed #ef4444";
          link.style.outlineOffset = "1px";
        }
      }
    }

    const opts = {
      attributes: false,
      childList: true,
      subtree: true,
    };

    const callback = () => {
      observer.disconnect();
      searchAndHighlight();
      observer.observe(document, opts);
    };

    const observer = new MutationObserver(callback);
    observer.observe(document, opts);
    searchAndHighlight();
  },
});
