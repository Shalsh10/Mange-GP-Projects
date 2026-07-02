const BASE_URL = 'https://1fcb-154-182-18-194.ngrok-free.app/api/';
export const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  // 1. تجهيز الـ Headers الأساسية
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    Accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
    ...options.headers,
  };

  // 2. التحقق الذكي من الـ Content-Type
  // إذا لم يكن الـ body من نوع FormData، نضع JSON تلقائياً
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // حاول تقرأ رسالة الخطأ من الـ body
    let errorMsg = `خطأ في الطلب: ${response.statusText}`;
    try {
      const errBody = await response.json();
      errorMsg = errBody?.message || errBody?.error || errorMsg;
    } catch { /* ignore parse error */ }
    throw new Error(errorMsg);
  }

  // ✅ Handle empty responses (204 No Content أو response فاضية)
  if (response.status === 204) return {};
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
