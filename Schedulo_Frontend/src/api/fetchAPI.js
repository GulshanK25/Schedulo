const BASE_URL = "http://localhost:8000/api/v1";

export const fetchAPI = async (endpoint, method = "GET", body = null, token = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const options = { method, headers };

    // Only attach body for methods that allow it
    if (body && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON response: ${text}`);
    }
    return data;
  } catch (error) {
    console.error("Fetch API error:", error);
    throw error;
  }
};
