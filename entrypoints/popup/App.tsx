import { Footer } from "@/components/Footer";
import { PageCounter } from "@/components/PageCounter";
import { useState } from "react";

function useCurrentDomain(): string | null | undefined {
  const [domain, setDomain] = useState<string | null | undefined>(undefined);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabUrl = tabs[0].url;
    if (!tabUrl) {
      return;
    }

    const url = new URL(tabUrl);
    url.pathname = "/";

    if (url.protocol === "http:" || url.protocol === "https:") {
      setDomain(url.toString());
    } else {
      setDomain(null);
    }
  });

  return domain;
}

function App() {
  const domain = useCurrentDomain();

  return (
    <div className="min-w-[30rem]">
      <div className="px-2">
        <h1 className="text-lg font-title text-center my-2">
          Website Page Counter
        </h1>

        {domain !== undefined && <PageCounter domain={domain} />}
      </div>

      <Footer />
    </div>
  );
}

export default App;
