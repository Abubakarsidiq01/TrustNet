"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClientCard } from "@/components/client-card";
import { WorkerCard } from "@/components/worker-card";
import type {
  ClientSideJobOffer,
  UserRole,
  WorkerSideJobOffer,
} from "@/lib/types";

interface JobOffersPanelProps {
  userId: string;
  role: UserRole;
}

type JobOffersResponse =
  | { role: "WORKER"; offers: WorkerSideJobOffer[] }
  | { role: "CLIENT"; offers: ClientSideJobOffer[] };

export function JobOffersPanel({ userId, role }: JobOffersPanelProps) {
  const [data, setData] = useState<JobOffersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeChatJobId, setActiveChatJobId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      jobId: string;
      senderId: string;
      senderName: string;
      text: string;
      createdAt: string;
    }>
  >([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    async function fetchOffers() {
      try {
        const response = await fetch(
          `/api/job-offers?userId=${userId}&role=${role}`,
        );
        const payload = (await response.json()) as JobOffersResponse & {
          message?: string;
        };
        if (!response.ok) {
          throw new Error(payload?.message ?? "Unable to load job offers.");
        }
        if (!active) return;
        setData(payload);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load job offers.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchOffers();

    return () => {
      active = false;
    };
  }, [userId, role, refreshKey]);

  useEffect(() => {
    if (!activeChatJobId) {
      setChatMessages([]);
      setChatError(null);
      setChatInput("");
      return;
    }

    let active = true;
    setChatLoading(true);
    setChatError(null);

    async function fetchMessages() {
      try {
        const response = await fetch(
          `/api/job-offers/chat?jobId=${encodeURIComponent(activeChatJobId)}`,
        );
        const payload = (await response.json()) as {
          messages?: typeof chatMessages;
          message?: string;
        };
        if (!response.ok) {
          throw new Error(payload?.message ?? "Unable to load chat messages.");
        }
        if (!active) return;
        setChatMessages(
          (payload.messages ?? []).map((message) => ({
            ...message,
            createdAt:
              typeof message.createdAt === "string"
                ? message.createdAt
                : new Date(message.createdAt as unknown as string).toISOString(),
          })),
        );
      } catch (err) {
        if (!active) return;
        setChatError(
          err instanceof Error ? err.message : "Unable to load chat messages.",
        );
      } finally {
        if (active) {
          setChatLoading(false);
        }
      }
    }

    fetchMessages();

    return () => {
      active = false;
    };
  }, [activeChatJobId]);

  async function handleSendMessage() {
    if (!activeChatJobId || !chatInput.trim()) return;

    setChatSending(true);
    setChatError(null);

    try {
      const response = await fetch("/api/job-offers/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: activeChatJobId,
          senderUserId: userId,
          text: chatInput.trim(),
        }),
      });
      const payload = (await response.json()) as {
        message?: {
          id: string;
          jobId: string;
          senderId: string;
          senderName: string;
          text: string;
          createdAt: string;
        };
        messageText?: string;
      };

      if (!response.ok) {
        throw new Error(
          (payload as unknown as { message?: string })?.message ??
            "Unable to send this message right now.",
        );
      }

      if (payload.message) {
        setChatMessages((prev) => [
          ...prev,
          {
            ...payload.message,
            createdAt:
              typeof payload.message.createdAt === "string"
                ? payload.message.createdAt
                : new Date(
                    payload.message.createdAt as unknown as string,
                  ).toISOString(),
          },
        ]);
      }
      setChatInput("");
    } catch (err) {
      setChatError(
        err instanceof Error ? err.message : "Unable to send this message right now.",
      );
    } finally {
      setChatSending(false);
    }
  }

  async function handleAction(jobId: string, action: "accept" | "decline") {
    if (role !== "WORKER") return;

    setProcessingId(jobId);
    setError(null);

    try {
      const response = await fetch(`/api/job-offers/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId, userId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload?.message ?? `Unable to ${action} this job offer right now.`,
        );
      }
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to ${action} this job offer right now.`,
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/90 p-6 shadow-lg border-2 border-slate-200">
        <div className="text-sm text-slate-600">Loading job offers...</div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-white/90 p-6 shadow-lg border-2 border-slate-200">
        <div className="text-sm text-slate-600">
          No job offers to show right now.
        </div>
      </Card>
    );
  }

  if (data.role === "WORKER") {
    const offers = data.offers;

    return (
      <Card className="bg-white/90 p-6 shadow-lg border-2 border-slate-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Job offers</h3>
            <p className="text-sm text-slate-600">
              See new clients who want to hire you. Accept to confirm the job or
              decline if you are unavailable.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {offers.length === 0 ? (
            <Card className="border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
              No pending job offers yet.
            </Card>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <ClientCard
                  key={offer.jobId}
                  name={offer.client.name}
                  city={offer.client.city}
                  area={offer.client.area}
                  state={offer.client.state}
                  country={offer.client.country}
                  stats={offer.client.stats}
                  footer={
                    offer.status === "PENDING" ? (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs font-medium text-slate-600">
                          New job offer
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                            onClick={() => setActiveChatJobId(offer.jobId)}
                          >
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-2 border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => handleAction(offer.jobId, "decline")}
                            disabled={processingId === offer.jobId}
                          >
                            {processingId === offer.jobId &&
                            data.role === "WORKER"
                              ? "Declining..."
                              : "Decline"}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                            onClick={() => handleAction(offer.jobId, "accept")}
                            disabled={processingId === offer.jobId}
                          >
                            {processingId === offer.jobId &&
                            data.role === "WORKER"
                              ? "Accepting..."
                              : "Accept"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-500">
                        {offer.status === "ACCEPTED"
                          ? "Accepted job"
                          : "Offer declined"}
                      </div>
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>

        {activeChatJobId && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Job chat
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    Quick messages about this offer
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveChatJobId(null)}
                >
                  Close
                </Button>
              </div>

              <div className="mb-3 h-52 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                {chatLoading ? (
                  <div className="text-slate-500">Loading messages...</div>
                ) : chatMessages.length === 0 ? (
                  <div className="text-slate-500">
                    No messages yet. Say hello to get started.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chatMessages.map((message) => {
                      const isMine = message.senderId === userId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-3 py-2 text-[11px] ${
                              isMine
                                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                                : "bg-white text-slate-800 border border-slate-200"
                            }`}
                          >
                            {!isMine && (
                              <div className="mb-0.5 text-[10px] font-semibold text-slate-500">
                                {message.senderName}
                              </div>
                            )}
                            <div>{message.text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {chatError && (
                <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700">
                  {chatError}
                </div>
              )}

              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!chatSending) {
                    void handleSendMessage();
                  }
                }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                  disabled={chatSending || !chatInput.trim()}
                >
                  {chatSending ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </Card>
    );
  }

  const offers = data.offers;

  return (
    <Card className="bg-white/90 p-6 shadow-lg border-2 border-slate-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Job offers</h3>
          <p className="text-sm text-slate-600">
            Track the workers you have requested to hire. We’ll show the status
            here.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {offers.length === 0 ? (
          <Card className="border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
            You haven’t sent any job offers yet.
          </Card>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <WorkerCard
                key={offer.jobId}
                worker={offer.worker}
                footerContent={
                  offer.status === "PENDING" ? (
                    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                      <span>Pending...</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-2 border-slate-200 text-slate-700 hover:bg-slate-100"
                        onClick={() => setActiveChatJobId(offer.jobId)}
                      >
                        Chat
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-600">
                      {offer.status === "ACCEPTED"
                        ? "Accepted"
                        : "Declined"}
                    </div>
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
      {activeChatJobId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Job chat
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Quick messages about this offer
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveChatJobId(null)}
              >
                Close
              </Button>
            </div>

            <div className="mb-3 h-52 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
              {chatLoading ? (
                <div className="text-slate-500">Loading messages...</div>
              ) : chatMessages.length === 0 ? (
                <div className="text-slate-500">
                  No messages yet. Say hello to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {chatMessages.map((message) => {
                    const isMine = message.senderId === userId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-[11px] ${
                            isMine
                              ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                              : "bg-white text-slate-800 border border-slate-200"
                          }`}
                        >
                          {!isMine && (
                            <div className="mb-0.5 text-[10px] font-semibold text-slate-500">
                              {message.senderName}
                            </div>
                          )}
                          <div>{message.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {chatError && (
              <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-medium text-red-700">
                {chatError}
              </div>
            )}

            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!chatSending) {
                  void handleSendMessage();
                }
              }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                disabled={chatSending || !chatInput.trim()}
              >
                {chatSending ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}


