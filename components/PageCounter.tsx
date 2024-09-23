import { type FormEvent, useEffect, useState } from "react";
import {
  IconCornerDownRight,
  IconDownload,
  IconLoader2,
} from "@tabler/icons-react";

type ResponseBody =
  | { urls: string[]; sitemaps: string[]; error?: string }
  | { urls?: string[]; sitemaps?: string[]; error: string };

function SitemapDisplay(props: {
  url: string;
  level: number;
  onSitemapsFound: (pages: string[]) => void;
  onPagesFound: (pages: string[]) => void;
}) {
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);

    fetch("https://seogets.com/tools/api/sitemap/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: props.url, action: "parse-sitemap" }),
    })
      .then((res) => res.json())
      .then((body: ResponseBody) => {
        setIsLoading(false);
        setError(body.error);
        setUrls(body.urls || []);
        setSitemaps(body.sitemaps || []);

        props.onSitemapsFound(body.sitemaps || []);
        props.onPagesFound(body.urls || []);
      });
  }, [props.url]);

  return (
    <>
      <div className="contents group">
        <div className="flex items-center group-hover:bg-accent pl-0.5 rounded-l">
          {props.level > 0 && (
            <IconCornerDownRight
              className={`w-4 h-4 text-muted-foreground mr-1`}
            />
          )}
          <a href={props.url} className="link" target="_blank">
            {props.url}
          </a>
        </div>
        <div className="text-right group-hover:bg-accent pr-0.5 rounded-r">
          {!isLoading && !error && <span>{urls.length}</span>}
          {isLoading && (
            <IconLoader2 className="w-4 h-4 animate-spin float-right" />
          )}
          {error && <div className="text-destructive">{error}</div>}
        </div>
      </div>

      {sitemaps.map((url) => (
        <SitemapDisplay
          key={url}
          url={url}
          level={props.level + 1}
          onPagesFound={props.onPagesFound}
          onSitemapsFound={props.onSitemapsFound}
        />
      ))}
    </>
  );
}

function useSitemaps(domain: string | null): {
  sitemaps: string[];
  error: string | undefined;
  isLoading: boolean;
} {
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!domain) return;

    setIsLoading(true);
    setError(undefined);

    fetch("https://seogets.com/tools/api/sitemap/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: domain, action: "find-sitemaps" }),
    })
      .then((res) => res.json())
      .then((body: ResponseBody) => {
        setIsLoading(false);
        if (body.error) {
          setError(body.error);
        } else if (body.sitemaps) {
          setSitemaps(body.sitemaps);
        }
      });
  }, [domain]);

  return { sitemaps, error, isLoading };
}

type Props = {
  domain: string | null;
};

export function PageCounter(props: Props) {
  const [domain, setDomain] = useState(props.domain);
  const { sitemaps, isLoading, error } = useSitemaps(domain);

  const [status, setStatus] = useState<{ total: number; processed: number }>({
    total: 0,
    processed: 0,
  });

  const [allPages, setAllPages] = useState<string[]>([]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (event.currentTarget.domain.value !== domain) {
      setAllPages([]);
      setStatus({ total: 0, processed: 0 });
      setDomain(event.currentTarget.domain.value);
    }
  }

  function exportToCSV() {
    const url = window.URL.createObjectURL(
      new Blob([allPages.join("\n")], { type: "text/csv" })
    );
    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", "pages.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const totalSitemaps = sitemaps.length + status.total;

  return (
    <>
      <form onSubmit={submit} className="flex items-center gap-2 my-2">
        <input
          id="domain"
          required
          type="text"
          defaultValue={domain || ""}
          autoFocus
          placeholder="example.com"
          className="w-full border text-base p-2 flex-1 rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-foreground flex items-center justify-center w-24 text-sm text-white rounded h-10"
        >
          {isLoading ? (
            <IconLoader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Submit</>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-destructive/5 p-2 rounded mt-4">
          <div className="text-destructive">{error}</div>
        </div>
      )}

      {!error && !isLoading && sitemaps.length > 0 && (
        <>
          <div className="grid grid-cols-[1fr_2.5rem] max-h-80 overflow-y-auto">
            <div className="font-medium text-left">Sitemaps</div>
            <div className="font-medium text-right">Pages</div>

            {sitemaps.map((url) => (
              <SitemapDisplay
                key={url}
                url={url}
                level={0}
                onPagesFound={(pages) => {
                  setStatus((prev) => ({
                    ...prev,
                    processed: prev.processed + 1,
                  }));
                  setAllPages((prev) => [...prev, ...pages]);
                }}
                onSitemapsFound={(sitemaps) =>
                  setStatus((prev) => ({
                    ...prev,
                    total: prev.total + sitemaps.length,
                  }))
                }
              />
            ))}
          </div>
          <div className="flex gap-2 items-center text-center justify-center text-muted-foreground my-2">
            {status.processed < totalSitemaps && (
              <span>
                Processing{" "}
                <span className="text-foreground">{status.processed}</span> of{" "}
                <span className="text-foreground">{totalSitemaps}</span> (
                {Math.round((status.processed / totalSitemaps) * 100)}%)
              </span>
            )}
            <span>
              Found{" "}
              <span className="text-foreground">
                {new Intl.NumberFormat().format(allPages.length)}
              </span>{" "}
              pages{" "}
              {status.processed >= totalSitemaps && (
                <>
                  in <span className="text-foreground">{status.processed}</span>{" "}
                  sitemaps
                </>
              )}
            </span>

            <button
              onClick={exportToCSV}
              className="flex border px-1.5 py-0.5 rounded-lg ml-2 text-foreground group"
            >
              <IconDownload className="w-4 h-4 mr-1 text-muted-foreground group-hover:text-foreground" />
              Download
            </button>
          </div>
        </>
      )}
    </>
  );
}
