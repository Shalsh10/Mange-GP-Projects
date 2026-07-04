import React, { useState, useEffect, useRef, useCallback } from "react";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import {
  Send,
  Plus,
  Users,
  Search,
  CheckCheck,
  Loader2,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { customFetch } from "../apis/apiMain";
import "./CommunityChat.css";

// ─── helper: build full URL for profile images ──────────────────────────────
const BASE = "https://d97c-154-183-132-96.ngrok-free.app";
function resolveImg(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

// ─── helper: format ISO timestamp to readable time ──────────────────────────
function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Avatar placeholder (initials) ──────────────────────────────────────────
function AvatarPlaceholder({ name, size = 36 }) {
  const initials = name
    ? name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";
  const colors = ["#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#3b82f6","#10b981"];
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

export default function CommunityChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConvId = searchParams.get("convId")
    ? Number(searchParams.get("convId"))
    : null;

  // ── State ──────────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [messageInput, setMessageInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);

  // current logged-in user (to distinguish my messages)
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  // ── Active conversation object ─────────────────────────────────────────────
  const activeConv = conversations.find((c) => c.conversation_id === activeConvId) || null;

  // ── Fetch conversations list ───────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const res = await customFetch("chat/conversations");
      const data = res?.data || res || [];
      setConversations(Array.isArray(data) ? data : []);

      // auto-select first if none selected
      if (!activeConvId && Array.isArray(data) && data.length > 0) {
        setSearchParams({ convId: data[0].conversation_id });
      }
    } catch (err) {
      toast.error("فشل تحميل المحادثات: " + err.message);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  // ── Fetch messages for a conversation ─────────────────────────────────────
  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return;
    setLoadingMsgs(true);
    setMessages([]);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/conversations/${convId}/messages`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      // 404 = endpoint not ready yet on backend, treat as empty
      if (response.status === 404 || response.status === 405) {
        setMessages([]);
        return;
      }
      if (!response.ok) {
        setMessages([]);
        return;
      }
      const text = await response.text();
      if (!text) { setMessages([]); return; }
      const res = JSON.parse(text);
      const data = res?.data || res || [];
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);


  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (activeConvId) fetchMessages(activeConvId);
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;

    const text = messageInput.trim();
    setMessageInput("");
    setSendingMsg(true);

    // optimistic UI
    const optimistic = {
      id: `opt-${Date.now()}`,
      sender_id: currentUser?.id,
      sender_name: currentUser?.name || "أنت",
      message: text,
      created_at: new Date().toISOString(),
      isOptimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const token = localStorage.getItem("token");
      const sendRes = await fetch(`/api/chat/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ message: text }),
      });
      if (sendRes.ok) {
        fetchMessages(activeConvId);
      }
      // إذا كان الـ endpoint مش موجود لسه، الرسالة الـ optimistic تفضل
    } catch {
      // silent fail - optimistic message stays visible
    } finally {
      setSendingMsg(false);
    }
  };


  // ── Filter conversations by search ────────────────────────────────────────
  const filteredConvs = conversations.filter((c) =>
    c.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.leader_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Check if a message belongs to the current user ────────────────────────
  const isMyMessage = (msg) => {
    if (msg.isOptimistic) return true;
    return msg.sender_id === currentUser?.id || msg.user_id === currentUser?.id;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <DocHeader />
      <div className="chat-container">
        <DocSidebar />

        <div className="chat-main-wrap">
          {/* ── Header Bar ── */}
          <div className="chat-header-bar">
            <div className="chat-header-left">
              {activeConv ? (
                <>
                  <h2>{activeConv.team_name}</h2>
                  <span className="chat-header-sub">
                    Leader: {activeConv.leader_name} &nbsp;·&nbsp; {activeConv.participants?.length || 0} members
                  </span>
                </>
              ) : (
                <h2>Community Chat</h2>
              )}
            </div>
          </div>

          <div className="chat-body-layout">

            {/* ── LEFT SIDEBAR: Conversations List ── */}
            <div className="chat-left-sidebar">
              <div className="chat-search-bar">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="ابحث عن فريق..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loadingConvs ? (
                <div className="chat-loading-state">
                  <Loader2 size={22} className="spin-icon" />
                  <span>جاري تحميل المحادثات...</span>
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="chat-loading-state">
                  <MessageSquare size={22} />
                  <span>لا توجد محادثات</span>
                </div>
              ) : (
                <ul className="chat-conv-list">
                  {filteredConvs.map((conv) => {
                    const isActive = conv.conversation_id === activeConvId;
                    return (
                      <li
                        key={conv.conversation_id}
                        className={`chat-conv-item ${isActive ? "active" : ""}`}
                        onClick={() => setSearchParams({ convId: conv.conversation_id })}
                      >
                        <div className="conv-item-avatar">
                          <AvatarPlaceholder name={conv.team_name} size={40} />
                        </div>
                        <div className="conv-item-info">
                          <span className="conv-item-name">{conv.team_name}</span>
                          <span className="conv-item-sub">
                            {conv.last_message || "لا توجد رسائل بعد"}
                          </span>
                        </div>
                        {conv.last_message_at && (
                          <span className="conv-item-time">
                            {formatTime(conv.last_message_at)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* ── MIDDLE: Chat Viewport ── */}
            <div className="chat-viewport">
              {!activeConv ? (
                <div className="chat-empty-feed">
                  <MessageSquare size={48} opacity={0.3} />
                  <p>اختر محادثة من القائمة</p>
                </div>
              ) : (
                <>
                  {/* Members row */}
                  <div className="chat-members-row">
                    {activeConv.participants?.map((p) => {
                      const imgSrc = resolveImg(p.profile_image_url);
                      return (
                        <div key={p.user_id} className="chat-member-avatar-wrapper" title={`${p.name} (${p.role_code})`}>
                          {imgSrc ? (
                            <img src={imgSrc} alt={p.name} className="chat-member-avatar" />
                          ) : (
                            <AvatarPlaceholder name={p.name} size={36} />
                          )}
                          <span className="member-role-badge">{p.role_code}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Messages scroll */}
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
                        const mine = isMyMessage(msg);
                        const senderName = msg.sender_name || msg.name || "مستخدم";
                        const imgSrc = resolveImg(msg.profile_image_url || msg.avatar);
                        return (
                          <div
                            key={msg.id}
                            className={`chat-message-row ${mine ? "doctor-right" : "student-left"}`}
                          >
                            {!mine && (
                              imgSrc
                                ? <img src={imgSrc} alt={senderName} className="chat-msg-avatar" />
                                : <AvatarPlaceholder name={senderName} size={34} />
                            )}
                            <div className="chat-msg-bubble-wrap">
                              {!mine && (
                                <span className="chat-msg-sender-meta">
                                  {senderName}
                                  {msg.role_code && <span className="chat-msg-role"> {msg.role_code}</span>}
                                </span>
                              )}
                              <div className="chat-msg-bubble">
                                <p>{msg.message || msg.text}</p>
                                <div className="chat-msg-time-status">
                                  <span>{formatTime(msg.created_at || msg.time)}</span>
                                  {mine && <CheckCheck size={13} className="chat-double-check" />}
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

            {/* ── RIGHT SIDEBAR: Members detail ── */}
            <div className="chat-right-sidebar">
              <div className="chat-right-card">
                <h3>
                  <Users size={15} style={{ marginRight: 6 }} />
                  أعضاء الفريق
                </h3>
                {!activeConv ? (
                  <p className="chat-empty-subtext">اختر محادثة أولاً</p>
                ) : (
                  <div className="chat-members-detail-list">
                    {activeConv.participants?.map((p) => {
                      const imgSrc = resolveImg(p.profile_image_url);
                      return (
                        <div key={p.user_id} className="chat-member-detail-row">
                          <div className="cmd-avatar">
                            {imgSrc
                              ? <img src={imgSrc} alt={p.name} />
                              : <AvatarPlaceholder name={p.name} size={36} />
                            }
                          </div>
                          <div className="cmd-info">
                            <span className="cmd-name">{p.name}</span>
                            <span className={`cmd-badge role-${p.role_code?.toLowerCase()}`}>{p.role_code}</span>
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
