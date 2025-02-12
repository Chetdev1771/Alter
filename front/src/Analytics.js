import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const TopicAnalytics = (props) => {
    const {token}=props;
  const [topic, setTopic] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchAnalytics = async () => {
    if (!topic) return toast.error("Enter a topic to fetch analytics");

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/analytics/topic/${topic}`, {
        headers: { Authorization: `Bearer ${token}` }, // Use stored auth token
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setAnalytics(data);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "20px" }}>
      <ToastContainer />
      <h2>Topic-Based Analytics</h2>
      <input
        type="text"
        placeholder="Enter Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ width: "80%", padding: "8px", margin: "10px 0", borderRadius: "5px" }}
      />
      <button onClick={handleFetchAnalytics} disabled={loading} style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
        {loading ? "Fetching..." : "Get Analytics"}
      </button>

      {analytics && (
        <div>
          <h3>Analytics for Topic: {analytics.topic}</h3>
          <p><strong>Total Clicks:</strong> {analytics.totalClicks}</p>
          <p><strong>Unique Users:</strong> {analytics.uniqueUsers}</p>

          <h4>Clicks Over Time</h4>
          <ul>
            {analytics.clicksByDate.map((item) => (
              <li key={item.date}>{item.date}: {item.totalClicks} clicks</li>
            ))}
          </ul>

          <h4>URLs in This Topic</h4>
          <table border="1" style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Total Clicks</th>
                <th>Unique Users</th>
              </tr>
            </thead>
            <tbody>
              {analytics.urls.map((url) => (
                <tr key={url.shortUrl}>
                  <td><a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></td>
                  <td>{url.totalClicks}</td>
                  <td>{url.uniqueUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopicAnalytics;
