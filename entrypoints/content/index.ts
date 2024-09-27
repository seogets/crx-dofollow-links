import { localIgnoredHostnames, localDofollowEnabled } from "@/utils/storage";

const isExternal = (link: HTMLAnchorElement) => {
  try {
    const isHttp =
      link.href.startsWith("http:") || link.href.startsWith("https:");

    if (!isHttp) return false;

    const linkDomain = new URL(link.href).host.split(".").slice(-2).join(".");
    const currentDomain = new URL(location.href).host
      .split(".")
      .slice(-2)
      .join(".");
    return linkDomain !== currentDomain;
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
    let [isDofollowEnabled, isNofollowEnabled, ignoredHostnames] =
      await Promise.all([
        localDofollowEnabled.getValue(),
        localNofollowEnabled.getValue(),
        localIgnoredHostnames.getValue(),
      ]);

    localDofollowEnabled.watch((value) => {
      isDofollowEnabled = value;
      searchAndHighlight();
    });

    localIgnoredHostnames.watch((value) => {
      ignoredHostnames = value;
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

        if (
          !link.href ||
          !isExternal(link) ||
          ignoredHostnames.includes(location.hostname)
        ) {
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
