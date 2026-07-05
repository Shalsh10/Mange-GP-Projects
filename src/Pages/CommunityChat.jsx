import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import {
  CheckCheck,
  FileText,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { customFetch } from "../apis/apiMain";
import { settings } from "../Config/Settings";
import {
  bindChannelDiagnostics,
  bindRealtimeEvents,
  CHAT_EVENT_NAMES,
  getChatChannelNames,
  getEcho,
  normalizeRealtimeMessage,
} from "../lib/realtime";
import "./CommunityChat.css";

const BASE = settings.backendServer;
const CHAT_DETAIL_POLL_MS = 2500;
const CONVERSATIONS_POLL_MS = 8000;

function resolveImg(url) {
  if (!url) return null;

  if (url.startsWith("http")) {
    return url;
  }

  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

const getCorrectFileUrl = (url) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost") {
      const origin = window.location.origin;
      return `${origin}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // إذا كان الرابط غير صالح كـ URL، نتركه كما هو
  }

  return url;
};

const renderMessageContent = (msg) => {
  const fileUrl = getCorrectFileUrl(msg.file_url);

  if (msg.type === "image" && fileUrl) {
    return (
      <div className="mt-2 max-w-xs overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <img
          src={fileUrl}
          alt="Chat attachment"
          className="h-auto w-full object-cover max-h-60 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(fileUrl, "_blank")}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x200?text=Image+Not+Found";
          }}
        />
      </div>
    );
  }

  if (msg.type === "file" && fileUrl) {
    const fileName = msg.file_url ? msg.file_url.split("/").pop() : "Attachment.pdf";

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-slate-700 transition-colors no-underline block max-w-sm"
      >
        <div className="p-2 bg-red-100 rounded text-red-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-sm font-medium text-gray-800 truncate mb-0">{fileName}</p>
          <span className="text-xs text-blue-600 font-semibold hover:underline">Open & Download</span>
        </div>
      </a>
    );
  }

  return <p className="text-sm mb-0 whitespace-pre-wrap">{msg.message}</p>;
};

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function messageKey(message) {
  return [
    message?.id,
    message?.sender?.id || message?.sender?.user_id || message?.sender_id || message?.user_id,
    message?.created_at || message?.createdAt,
    message?.message || message?.body || message?.content,
  ]
    .filter((part) => part !== null && part !== undefined)
    .join(":");
}

function messagesSignature(messages = []) {
  return messages.map(messageKey).join("|");
}

function conversationListSignature(conversations = []) {
  return conversations
    .map((conv) =>
      [
        conv?.conversation_id,
        conv?.id,
        conv?.team_id,
        conv?.team?.id,
        conv?.last_message,
        conv?.last_message_at,
        conv?.unread_count,
      ].join(":")
    )
    .join("|");
}

function AvatarPlaceholder({ name, size = 36 }) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
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

export default function CommunityChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConvId = searchParams.get("convId") ? Number(searchParams.get("convId")) : null;

  const [conversations, setConversations] = useState([]);
  const [activeConvData, setActiveConvData] = useState(null);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const messagesEndRef = useRef(null);
  const activeConvIdRef = useRef(activeConvId);

  const activeConvMeta = conversations.find((conv) => Number(conv.conversation_id) === activeConvId) || null;
  const messages = useMemo(() => activeConvData?.messages || [], [activeConvData]);
  const participants = activeConvData?.conversation?.participants || activeConvMeta?.participants || [];
  const chatSubscriptions = useMemo(() => {
    const subscriptions = [];

    conversations.forEach((conv) => {
      const fallbackConversationId = conv.conversation_id;
      const channelIds = [
        conv.conversation_id,
        conv.id,
        conv.team_id,
        conv.team?.id,
      ].filter((id, index, arr) => id !== null && id !== undefined && arr.indexOf(id) === index);

      channelIds.forEach((channelId) => {
        subscriptions.push({
          channelId: String(channelId),
          fallbackConversationId,
        });
      });
    });

    return subscriptions;
  }, [conversations]);
  const chatSubscriptionsKey = useMemo(
    () =>
      chatSubscriptions
        .map((item) => `${item.channelId}:${item.fallbackConversationId}`)
        .join("|"),
    [chatSubscriptions]
  );

  const fetchConversations = useCallback(async () => {
    try {
      const res = await customFetch("chat/conversations");
      const data = res?.data || res || [];
      const list = Array.isArray(data) ? data : [];

      setConversations((prev) =>
        conversationListSignature(prev) === conversationListSignature(list) ? prev : list
      );
      if (!activeConvId && list.length > 0) {
        setSearchParams({ convId: String(list[0].conversation_id) });
      }
    } catch {
      setConversations((prev) => prev);
    }
  }, [activeConvId, setSearchParams]);

  const fetchConversationDetail = useCallback(async (convId, options = {}) => {
    if (!convId) return;

    const { silent = false, force = false } = options;

    if (!silent) {
      setLoadingMsgs(true);
      setActiveConvData(null);
    }

    try {
      const res = await customFetch(`chat/${convId}`);
      const nextData = res?.data || res || null;

      setActiveConvData((prev) => {
        if (!nextData) return nextData;
        if (force || !prev) return nextData;

        const previousSignature = messagesSignature(prev.messages || []);
        const nextSignature = messagesSignature(nextData.messages || []);

        if (previousSignature === nextSignature) return prev;

        return {
          ...prev,
          ...nextData,
          messages: nextData.messages || prev.messages || [],
        };
      });
      setConversations((prev) =>
        prev.map((conv) =>
          Number(conv.conversation_id) === Number(convId) ? { ...conv, unread_count: 0 } : conv
        )
      );
    } catch {
      if (!silent) setActiveConvData(null);
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  }, []);

  const handleRealtimeMessage = useCallback((payload, fallbackConversationId) => {
    const incoming = normalizeRealtimeMessage(payload, fallbackConversationId);
    if (!incoming) return;

    const incomingConvId = Number(incoming.conversation_id || fallbackConversationId);
    const isActiveConversation = Number(activeConvIdRef.current) === incomingConvId;

    setConversations((prev) =>
      prev.map((conv) => {
        if (Number(conv.conversation_id) !== incomingConvId) return conv;

        return {
          ...conv,
          last_message: incoming.message || conv.last_message,
          last_message_at: incoming.created_at || conv.last_message_at,
          unread_count: isActiveConversation ? 0 : Number(conv.unread_count || 0) + 1,
        };
      })
    );

    if (!isActiveConversation) {
      if (!incoming.is_mine) {
        const senderName = incoming.sender?.name || "New message";
        toast.success(`${senderName}: ${incoming.message || "Attachment"}`);
      }
      return;
    }

    setActiveConvData((prev) => {
      if (!prev) return prev;

      const currentMessages = prev.messages || [];
      const alreadyExists = currentMessages.some((message) => String(message.id) === String(incoming.id));
      if (alreadyExists) return prev;

      const withoutMatchingOptimistic = currentMessages.filter(
        (message) =>
          !(
            message.isOptimistic &&
            incoming.is_mine &&
            message.message === incoming.message
          )
      );

      return {
        ...prev,
        messages: [...withoutMatchingOptimistic, incoming],
      };
    });
  }, []);

  const handleSendMessage = async (event) => {
    if (event) event.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;

    const text = messageInput.trim();
    setMessageInput("");
    setSendingMsg(true);

    const optimistic = {
      id: `opt-${Date.now()}`,
      message: text,
      type: "text",
      file_url: null,
      sender: { id: null, name: "You", profile_image_url: null },
      created_at: new Date().toISOString(),
      is_mine: true,
      isOptimistic: true,
    };

    setActiveConvData((prev) =>
      prev ? { ...prev, messages: [...(prev.messages || []), optimistic] } : prev
    );

    try {
      await customFetch("chat/messages", {
        method: "POST",
        body: JSON.stringify({
          conversation_id: activeConvId,
          message: text,
        }),
      });

      fetchConversationDetail(activeConvId);
      fetchConversations();
    } catch (error) {
      toast.error(error?.message || "Failed to send message");
      setActiveConvData((prev) =>
        prev
          ? { ...prev, messages: prev.messages.filter((message) => message.id !== optimistic.id) }
          : prev
      );
      setMessageInput(text);
    } finally {
      setSendingMsg(false);
    }
  };

  useEffect(() => {
    activeConvIdRef.current = activeConvId;
  }, [activeConvId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConvId) fetchConversationDetail(activeConvId, { force: true });
  }, [activeConvId, fetchConversationDetail]);

  useEffect(() => {
    if (!activeConvId) return undefined;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchConversationDetail(activeConvId, { silent: true });
      }
    }, CHAT_DETAIL_POLL_MS);

    return () => window.clearInterval(intervalId);
  }, [activeConvId, fetchConversationDetail]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchConversations();
      }
    }, CONVERSATIONS_POLL_MS);

    return () => window.clearInterval(intervalId);
  }, [fetchConversations]);

  useEffect(() => {
    const echo = getEcho();
    const subscriptions = chatSubscriptionsKey ? chatSubscriptions : [];

    if (!echo || subscriptions.length === 0) return undefined;

    const channelNames = [];
    subscriptions.forEach(({ channelId, fallbackConversationId }) => {
      getChatChannelNames(channelId).forEach((channelName) => {
        channelNames.push(channelName);
        const publicChannel = echo.channel(channelName);
        const privateChannel = echo.private(channelName);

        bindChannelDiagnostics(publicChannel, channelName);
        bindChannelDiagnostics(privateChannel, `private-${channelName}`);

        bindRealtimeEvents(publicChannel, CHAT_EVENT_NAMES, (payload) => {
          handleRealtimeMessage(payload, fallbackConversationId);
        });
        bindRealtimeEvents(privateChannel, CHAT_EVENT_NAMES, (payload) => {
          handleRealtimeMessage(payload, fallbackConversationId);
        });
      });
    });

    return () => {
      channelNames.forEach((channelName) => echo.leave(channelName));
    };
  }, [chatSubscriptions, chatSubscriptionsKey, handleRealtimeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <DocHeader />
      <div className="chat-container">
        <DocSidebar />

        <div className="chat-main-wrap">
          <div className="chat-header-bar">
            <div className="chat-header-left">
              {activeConvMeta ? (
                <>
                  <h2>{activeConvMeta.team_name}</h2>
                  <span className="chat-header-sub">
                    Leader: {activeConvMeta.leader_name} &nbsp;-&nbsp; {participants.length} members
                  </span>
                </>
              ) : (
                <h2>Community Chat</h2>
              )}
            </div>
          </div>

          <div className="chat-body-layout">
            <div className="chat-viewport">
              {!activeConvMeta ? (
                <div className="chat-empty-feed">
                  <MessageSquare size={48} opacity={0.3} />
                  <p>Select a conversation from the list</p>
                </div>
              ) : (
                <>
                  <div className="chat-members-row">
                    {participants.map((participant) => {
                      const imgSrc = resolveImg(participant.profile_image_url);
                      return (
                        <div
                          key={participant.user_id || participant.id || participant.name}
                          className="chat-member-avatar-wrapper"
                          title={participant.name}
                        >
                          {imgSrc ? (
                            <img src={imgSrc} alt={participant.name} className="chat-member-avatar" />
                          ) : (
                            <AvatarPlaceholder name={participant.name} size={36} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="chat-messages-scroll">
                    {loadingMsgs ? (
                      <div className="chat-empty-feed">
                        <Loader2 size={28} className="spin-icon" />
                        <p>Loading messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="chat-empty-feed">
                        <MessageSquare size={40} opacity={0.25} />
                        <p>No messages yet. Start the conversation.</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const mine = msg.is_mine || msg.isOptimistic;
                        const sender = msg.sender || {};
                        const senderName = sender.name || "User";
                        const avatarSrc = resolveImg(sender.profile_image_url);

                        return (
                          <div
                            key={msg.id}
                            className={`chat-message-row ${mine ? "doctor-right" : "student-left"}`}
                          >
                            {!mine &&
                              (avatarSrc ? (
                                <img src={avatarSrc} alt={senderName} className="chat-msg-avatar" />
                              ) : (
                                <AvatarPlaceholder name={senderName} size={34} />
                              ))}

                            <div className="chat-msg-bubble-wrap">
                              {!mine && (
                                <span className="chat-msg-sender-meta">
                                  {senderName}
                                  {sender.track && <span className="chat-msg-role"> - {sender.track}</span>}
                                </span>
                              )}
                              <div
                                className={`chat-msg-bubble ${
                                  msg.type === "image" && msg.file_url ? "chat-image-bubble" : ""
                                } ${msg.isOptimistic ? "optimistic" : ""}`}
                              >
                                {renderMessageContent(msg)}
                                <div className="chat-msg-time-status">
                                  <span>{formatTime(msg.created_at)}</span>
                                  {mine && !msg.isOptimistic && (
                                    <CheckCheck size={13} className="chat-double-check" />
                                  )}
                                  {msg.isOptimistic && (
                                    <Loader2
                                      size={11}
                                      className="spin-icon"
                                      style={{ opacity: 0.5 }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="chat-input-bar">
                    <button
                      type="button"
                      className="chat-attach-btn"
                      onClick={() => toast.success("Attachments are coming soon.")}
                    >
                      <Plus size={20} />
                    </button>
                    <input
                      type="text"
                      placeholder="Write your message here..."
                      value={messageInput}
                      onChange={(event) => setMessageInput(event.target.value)}
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

            <div className="chat-right-sidebar">
              <div className="chat-right-card">
                <h3>
                  <Users size={15} style={{ marginRight: 6 }} />
                  Team Members
                </h3>
                {participants.length === 0 ? (
                  <p className="chat-empty-subtext">Select a conversation first</p>
                ) : (
                  <div className="chat-members-detail-list">
                    {participants.map((participant) => {
                      const imgSrc = resolveImg(participant.profile_image_url);
                      const role =
                        participant.role_code ||
                        (participant.role === "admin"
                          ? "TA"
                          : participant.role === "member"
                            ? "Member"
                            : participant.role);
                      return (
                        <div
                          key={participant.user_id || participant.id || participant.name}
                          className="chat-member-detail-row"
                        >
                          <div className="cmd-avatar">
                            {imgSrc ? (
                              <img src={imgSrc} alt={participant.name} />
                            ) : (
                              <AvatarPlaceholder name={participant.name} size={36} />
                            )}
                          </div>
                          <div className="cmd-info">
                            <span className="cmd-name">{participant.name}</span>
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
