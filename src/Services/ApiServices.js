import { settings } from "../Config/Settings";

const token = {
  // يجلب التوكين ديناميكياً من اللوكال ستوريج في كل مرة يُستدعى فيها
  getUserToken: () => localStorage.getItem("token"),
  
  clearUserTokenData: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

function getBaseUrl() {
  return '/api';
}

function extractResponseData(res) {
  if (res && typeof res === "object" && "data" in res) return res.data;
  if (Array.isArray(res)) return res;
  return res || [];
}

export async function submitRequestAsync(endpoint, method = "GET", body = null, addHeaders = {}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${endpoint}`.replace(/\/+/g, "/").replace(":/", "://");
  const isFormData = body instanceof FormData;
  
  const headers = {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
    // الربط الديناميكي هنا
    Authorization: `Bearer ${token.getUserToken()}`,
    ...(!isFormData && { "Content-Type": "application/json; charset=utf-8" }),
    ...addHeaders,
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method !== "GET" ? (isFormData ? body : JSON.stringify(body || {})) : undefined,
    });

    let res;
    if (response.status !== 204) {
      const text = await response.text();
      try { res = JSON.parse(text); } catch { res = text; }
    } else { res = {}; }

    if (!response.ok) {
      if (response.status === 401) {
        token.clearUserTokenData();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      const errorMsg = res?.message || `Error ${response.status}: Request failed`;
      throw new Error(errorMsg);
    }

    return extractResponseData(res);
  } catch (error) {
    let errorMsg = error.message || "Unexpected error occurred";
    if (error.message.includes("401")) {
      token.clearUserTokenData();
      errorMsg = "Session expired, please login again.";
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw new Error(errorMsg);
  }
}