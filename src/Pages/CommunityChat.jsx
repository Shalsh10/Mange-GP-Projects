import React, { useState, useEffect, useRef, useCallback } from "react";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import {
  Send,
  Plus,
  Users,
  CheckCheck,
  Loader2,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { customFetch } from "../apis/apiMain";
import "./CommunityChat.css";

// ─── helper: resolve image URL ───────────────────────────────────────────────
const BASE = "https://d97c-154-183-132-96.ngrok-free.app";
function resolveImg(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

// ─── helper: format ISO timestamp ────────────────────────────────────────────
function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Avatar placeholder (initials) ───────────────────────────────────────────
function AvatarPlaceholder({ name, size = 36 }) {
  const initials = name
    ? name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#3b82f6", "#10b981"];
  const bg = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <div
      className="avatar-placeholder"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

// ─── Token helper ─────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");
const BASE_HEADERS = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
  "ngrok-skip-browser-warning": "69420",
});

export default function CommunityChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConvId = searchParams.get("convId") ? Number(searchParams.get("convId")) : null;

  // ── State ────────────────────────────────────────────────────────────────────
  const [conversations, setConversations]   = useState([]);
  const [activeConvData, setActiveConvData] = useState(null); // { conversation, messages, pagination }
  const [loadingMsgs, setLoadingMsgs]       = useState(false);
  const [messageInput, setMessageInput]     = useState("");
  const [sendingMsg, setSendingMsg]         = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const activeConvMeta = conversations.find((c) => c.conversation_id === activeConvId) || null;
  // eslint-disable-next-line no-unused-vars
  const messages       = activeConvData?.messages || [];
  const participants   = activeConvData?.conversation?.participants || activeConvMeta?.participants || [];

  // ── Fetch conversations list (for meta/header info only) ─────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const res  = await customFetch("chat/conversations");
      const data = res?.data || res || [];
      const list = Array.isArray(data) ? data : [];
      setConversations(list);
      if (!activeConvId && list.length > 0) {
        setSearchParams({ convId: list[0].conversation_id });
      }
    } catch { /* silent */ }
  }, []);

  // ── Fetch conversation detail + messages: GET /api/chat/{id} ─────────────────
  const fetchConversationDetail = useCallback(async (convId) => {
    if (!convId) return;
    setLoadingMsgs(true);
    setActiveConvData(null);
    try {
      const response = await fetch(`/api/chat/${convId}`, {
        headers: BASE_HEADERS(),
      });
      if (!response.ok) { setActiveConvData(null); return; }
      const text = await response.text();
      if (!text) { setActiveConvData(null); return; }
      const res = JSON.parse(text);
      setActiveConvData(res?.data || null);
    } catch {
      setActiveConvData(null);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  // ── Send message: POST /api/chat/messages (FormData) ─────────────────────────
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;

    const text = messageInput.trim();
    setMessageInput("");
    setSendingMsg(true);

    // Optimistic UI
    const optimistic = {
      id: `opt-${Date.now()}`,
      message: text,
      type: "text",
      file_url: null,
      sender: { id: null, name: "أنت", profile_image_url: null },
      created_at: new Date().toISOString(),
      is_mine: true,
      isOptimistic: true,
    };
    setActiveConvData((prev) =>
      prev ? { ...prev, messages: [...(prev.messages || []), optimistic] } : prev
    );

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          conversation_id: activeConvId,
          message: text,
        }),
      });

      if (res.ok) {
        // حدّث القائمة والرسائل
        fetchConversationDetail(activeConvId);
        fetchConversations();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.message || "فشل إرسال الرسالة");
        // Rollback optimistic
        setActiveConvData((prev) =>
          prev
            ? { ...prev, messages: prev.messages.filter((m) => m.id !== optimistic.id) }
            : prev
        );
        setMessageInput(text);
      }
    } catch {
      toast.error("خطأ في الاتصال بالخادم");
      setActiveConvData((prev) =>
        prev
          ? { ...prev, messages: prev.messages.filter((m) => m.id !== optimistic.id) }
          : prev
      );
      setMessageInput(text);
    } finally {
      setSendingMsg(false);
    }
  };

  // ── Effects ───────────────────────────────────────────────────────────────────
  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => { if (activeConvId) fetchConversationDetail(activeConvId); }, [activeConvId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);



  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <DocHeader />
      <div className="chat-container">
        <DocSidebar />

        <div className="chat-main-wrap">
          {/* Header */}
          <div className="chat-header-bar">
            <div className="chat-header-left">
              {activeConvMeta ? (
                <>
                  <h2>{activeConvMeta.team_name}</h2>
                  <span className="chat-header-sub">
                    Leader: {activeConvMeta.leader_name} &nbsp;·&nbsp; {participants.length} members
                  </span>
                </>
              ) : (
                <h2>Community Chat</h2>
              )}
            </div>
          </div>

          <div className="chat-body-layout">

            {/* ── Chat Viewport ── */}
            <div className="chat-viewport">
              {!activeConvMeta ? (
                <div className="chat-empty-feed">
                  <MessageSquare size={48} opacity={0.3} />
                  <p>اختر محادثة من القائمة</p>
                </div>
              ) : (
                <>
                  {/* Members row */}
                  <div className="chat-members-row">
                    {participants.map((p) => {
                      const imgSrc = resolveImg(p.profile_image_url);
                      return (
                        <div key={p.user_id} className="chat-member-avatar-wrapper" title={p.name}>
                          {imgSrc
                            ? <img src={imgSrc} alt={p.name} className="chat-member-avatar" />
                            : <AvatarPlaceholder name={p.name} size={36} />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Messages */}
                  <div className="chat-messages-scroll">
                    {loadingMsgs ? (
                      <div className="chat-empty-feed">
                        <Loader2 size={28} className="spin-icon" />
                        <p>جاري تحميل الرسائل...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="chat-empty-feed">
                        <MessageSquare size={40} opacity={0.25} />
                        <p>لا توجد رسائل بعد. ابدأ المحادثة! 👋</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const mine       = msg.is_mine || msg.isOptimistic;
                        const sender     = msg.sender || {};
                        const senderName = sender.name || "مستخدم";
                        const avatarSrc  = resolveImg(sender.profile_image_url);

                        return (
                          <div
                            key={msg.id}
                            className={`chat-message-row ${mine ? "doctor-right" : "student-left"}`}
                          >
                            {!mine && (
                              avatarSrc
                                ? <img src={avatarSrc} alt={senderName} className="chat-msg-avatar" />
                                : <AvatarPlaceholder name={senderName} size={34} />
                            )}

                            <div className="chat-msg-bubble-wrap">
                              {!mine && (
                                <span className="chat-msg-sender-meta">
                                  {senderName}
                                  {sender.track && <span className="chat-msg-role"> · {sender.track}</span>}
                                </span>
                              )}
                              <div className={`chat-msg-bubble ${msg.isOptimistic ? "optimistic" : ""}`}>
                                {/* نوع الرسالة: image أو text */}
                                {msg.type === "image" && msg.file_url ? (
                                  <a href={resolveImg(msg.file_url)} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={resolveImg(msg.file_url)}
                                      alt="attachment"
                                      className="chat-msg-img"
                                    />
                                  </a>
                                ) : null}
                                {msg.message && <p>{msg.message}</p>}
                                <div className="chat-msg-time-status">
                                  <span>{formatTime(msg.created_at)}</span>
                                  {mine && !msg.isOptimistic && <CheckCheck size={13} className="chat-double-check" />}
                                  {msg.isOptimistic && <Loader2 size={11} className="spin-icon" style={{ opacity: 0.5 }} />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <form onSubmit={handleSendMessage} className="chat-input-bar">
                    <button type="button" className="chat-attach-btn" onClick={() => toast.success("المرفقات قادمة قريباً!")}>
                      <Plus size={20} />
                    </button>
                    <input
                      type="text"
                      placeholder="اكتب رسالتك هنا..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="chat-input-field"
                      disabled={sendingMsg}
                    />
                    <button type="submit" className="chat-send-btn" disabled={sendingMsg || !messageInput.trim()}>
                      {sendingMsg ? <Loader2 size={16} className="spin-icon" /> : <Send size={16} />}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* ── RIGHT: Members detail ── */}
            <div className="chat-right-sidebar">
              <div className="chat-right-card">
                <h3>
                  <Users size={15} style={{ marginRight: 6 }} />
                  أعضاء الفريق
                </h3>
                {participants.length === 0 ? (
                  <p className="chat-empty-subtext">اختر محادثة أولاً</p>
                ) : (
                  <div className="chat-members-detail-list">
                    {participants.map((p) => {
                      const imgSrc = resolveImg(p.profile_image_url);
                      const role   = p.role_code || (p.role === "admin" ? "TA" : p.role === "member" ? "Member" : p.role);
                      return (
                        <div key={p.user_id} className="chat-member-detail-row">
                          <div className="cmd-avatar">
                            {imgSrc
                              ? <img src={imgSrc} alt={p.name} />
                              : <AvatarPlaceholder name={p.name} size={36} />}
                          </div>
                          <div className="cmd-info">
                            <span className="cmd-name">{p.name}</span>
                            <span className={`cmd-badge role-${role?.toLowerCase()}`}>{role}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
