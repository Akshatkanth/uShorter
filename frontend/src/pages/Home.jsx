import { useState } from "react";

function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        setError("URL must start with http:// or https://");
        return;
    }

   

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();

      const fullShortUrl = `http://localhost:3000/${data.shortCode}`;
      setShortUrl(fullShortUrl);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className={`card ${error ? "shake" : ""}`}>
        <h1 className="title">Shorten Your Links!</h1>
            <p className="subtitle">
                Simple. Fast. Brutal.
                </p>

        <input
          type="text"
          placeholder="Enter long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`input ${error ? "error-input" : ""}`}
        />

        <button className="button" onClick={handleShorten} disabled={loading}>
          {loading ? "SHORTENING..." : "SHORTEN"}
        </button>

        {error && <div className="error">{error}</div>}


        {shortUrl && (
  <div className="result">
    <p className="result-label">YOUR SHORT LINK</p>

    <div className="result-row">
      <a
        href={shortUrl}
        target="_blank"
        rel="noreferrer"
        className="short-link"
      >
        {shortUrl}
      </a>
        

    

      <button
        className="copy-btn"
        onClick={() => {
            navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }}

      >
        {copied ? "COPIED!" : "COPY"}
      </button>
    </div>

    <a href="/stats" className="stats-link">
      View statistics →
    </a>
  </div>
)}
      </div>
    </div>
  );
}

export default Home;
