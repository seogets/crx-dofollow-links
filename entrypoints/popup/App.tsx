import { Footer } from "@/components/Footer";
import { useState } from "react";
import { localDofollowEnabled, localNofollowEnabled } from "@/utils/storage";

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

      <p className="text-muted-foreground text-xs border-t mt-2 p-2 text-balance text-center">
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
