import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export default function WeatherCoach({ weather, cityName }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const payload = {
        question: question.trim(),
        city: cityName || weather?.city || "unknown",
        weather: weather
          ? {
              condition: weather.current?.label || "",
              temperature: weather.current?.temp ?? null,
              humidity: weather.current?.humidity ?? null,
              wind: weather.current?.wind ?? null,
            }
          : null,
      };

      const response = await fetch(`${API_BASE_URL}/rag/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to get a weather answer right now.");
      }

      setAnswer(data.answer || "No answer was returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        marginTop: "1rem",
        padding: "1rem",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <h3 style={{ marginBottom: "0.35rem" }}>Weather Coach</h3>
      <p className="subtitle" style={{ marginBottom: "0.75rem" }}>
        Ask for outfit, umbrella, or outdoor planning advice.
      </p>

      <form onSubmit={onSubmit}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What should I bring for a rainy day?"
          style={{
            width: "100%",
            minHeight: "76px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.16)",
            padding: "0.75rem",
            background: "rgba(9, 12, 19, 0.7)",
            color: "#f7f7f7",
            marginBottom: "0.6rem",
          }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Thinking..." : "Ask Coach"}
        </button>
      </form>

      {error ? <p className="error-box" style={{ marginTop: "0.75rem" }}>{error}</p> : null}

      {answer ? (
        <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <strong>Answer:</strong>
          <p style={{ marginTop: "0.3rem" }}>{answer}</p>
        </div>
      ) : null}
    </section>
  );
}
