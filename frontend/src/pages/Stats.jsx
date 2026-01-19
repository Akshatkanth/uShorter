import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Stats() {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);


  const extractShortCode = (value) => {
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
        `${BASE_URL}/shorten/${shortCode}/stats`
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

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this short URL? This action cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    const shortCode = extractShortCode(input);

    const response = await fetch(
      `${BASE_URL}/shorten/${shortCode}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    setDeleted(true);
    setStats(null);
    setInput("");
  } catch (err) {
    setError("Failed to delete short URL");
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
          className={`input ${error ? "error-input" : ""}`}
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
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(stats.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(stats.updatedAt).toLocaleString()}
          </p>

          <button className="delete-btn" onClick={handleDelete}>
            DELETE URL
          </button>
        </div>
      )}

      {deleted && (
        <div className="success">
          Short URL deleted successfully.
        </div>
      )}

      </div>
    </div>
  );
}

export default Stats;
