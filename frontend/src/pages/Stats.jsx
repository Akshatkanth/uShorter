import { useState } from "react";

function Stats() {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractShortCode = (value) => {
    // If full URL is pasted, extract last part
    try {
      if (value.includes("/")) {
        return value.split("/").pop();
      }
      return value;
    } catch {
      return value;
    }
  };

  const handleGetStats = async () => {
    if (!input) return;

    const shortCode = extractShortCode(input);

    setLoading(true);
    setError("");
    setStats(null);

    try {
      const response = await fetch(
        `http://localhost:3000/shorten/${shortCode}/stats`
      );

      if (!response.ok) {
        throw new Error("Not found");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Short URL not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className={`card ${error ? "shake" : ""}`}>
        <h1 className="title">Link Statistics</h1>

        <input
          type="text"
          placeholder="Enter short code or short URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input"
        />

        <button className="button" onClick={handleGetStats} disabled={loading}>
          {loading ? "LOADING..." : "GET STATS"}
        </button>

        {error && <div className="error">{error}</div>}


        {stats && (
          <div className="result">
            <p><strong>Original URL:</strong> {stats.url}</p>
            <p><strong>Short Code:</strong> {stats.shortCode}</p>
            <p><strong>Access Count:</strong> {stats.accessCount}</p>
            <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(stats.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
