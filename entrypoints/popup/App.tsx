import { Footer } from "@/components/Footer";
import {
  localDofollowEnabled,
  localNofollowEnabled,
  localIgnoredHostnames,
} from "@/utils/storage";

function useHostname(): string | null | undefined {
  const [hostname, setHostname] = useState<string | null | undefined>(
    undefined
  );

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabUrl = tabs[0].url;
    if (!tabUrl) {
      return;
    }

    const url = new URL(tabUrl);
    setHostname(url.hostname);
  });

  return hostname;
}

function IgnoredDomainsSetting() {
  const hostname = useHostname();
  const [ignored, setIgnored] = useStorageValue(localIgnoredHostnames, []);
  const [dirtyList, setDirtyList] = useState<string[] | undefined>();

  const hasChanged = dirtyList && dirtyList.join("\n") !== ignored.join("\n");

  if (!hostname) return null;

  return (
    <div className="w-full p-2">
      <div className="grid grid-cols-1 gap-2 mb-2">
        <button
          className="bg-clicks text-background text-sm py-1 rounded"
          onClick={() => {
            if (ignored.includes(hostname)) {
              setIgnored(ignored.filter((h) => h !== hostname));
            } else {
              setIgnored([...ignored, hostname]);
            }
          }}
        >
          {ignored.includes(hostname)
            ? `Enable on ${hostname}`
            : `Disable on ${hostname}`}
        </button>
      </div>

      <div>
        <span className="font-medium">Ignored Domains</span>
        <textarea
          value={(dirtyList ? dirtyList : ignored).join("\n")}
          rows={10}
          onChange={(e) => setDirtyList(e.target.value.split("\n"))}
          className="w-full border p-1"
        ></textarea>

        {hasChanged && (
          <button
            onClick={() => {
              setIgnored(dirtyList);
            }}
            className="bg-clicks text-background hover:opacity-80 text-sm w-full py-1 rounded"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  const [dofollow, setDofollow] = useStorageValue(localDofollowEnabled, false);
  const [nofollow, setNofollow] = useStorageValue(localNofollowEnabled, false);

  const toggleDofollow = () => setDofollow(!dofollow);
  const toggleNofollow = () => setNofollow(!nofollow);

  return (
    <div className="min-w-[24rem]">
      <div className="px-2">
        <h1 className="text-lg font-title text-center my-2">Dofollow Links</h1>

        <div className="flex items-center justify-between mx-auto mt-2 w-[14rem]">
          <div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="size-4"
                checked={dofollow}
                id="Dofollow"
                onChange={toggleDofollow}
              />
              <label
                htmlFor="Dofollow"
                className="text-base tracking-tighter select-none leading-none"
                style={{ outline: "2px dashed #22c55e", outlineOffset: "0px" }}
              >
                Dofollow
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="size-4"
                checked={nofollow}
                id="Nofollow"
                onChange={toggleNofollow}
              />
              <label
                htmlFor="Nofollow"
                className="text-base tracking-tighter select-none leading-none"
                style={{ outline: "2px dashed #ef4444", outlineOffset: "0px" }}
              >
                Nofollow
              </label>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-xs text-balance text-center mt-2">
        Only external links are highlighted.
      </p>

      <IgnoredDomainsSetting />

      <p className="text-muted-foreground text-xs border-t p-2 text-balance text-center">
        Any suggestions or feedback? Reach out so we can make this extension
        better {"→ "}
        <a
          href="mailto:extensions@seogets.com"
          className="link hover:underline"
        >
          extensions@seogets.com
        </a>
      </p>

      <Footer />
    </div>
  );
}

export default App;
