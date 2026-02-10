import React, { useState, useEffect } from "react";
import { X, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";

export const FollowUpModal = ({ lead, onClose, onUpdate }) => {
  const [tracking, setTracking] = useState(
    lead.followUpTracking || {
      initialEmail: { sent: false, sentAt: null },
      firstFollowUp: { sent: false, sentAt: null, dueDate: null },
      secondFollowUp: { sent: false, sentAt: null, dueDate: null },
      thirdFollowUp: { sent: false, sentAt: null, dueDate: null },
    },
  );

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkInitialSent = () => {
    // const now = new Date();
    const newTracking = {
      initialEmail: {
        sent: true,
        sentAt: now,
      },
      firstFollowUp: {
        sent: false,
        sentAt: null,
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
      },
      secondFollowUp: {
        sent: false,
        sentAt: null,
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
      },
      thirdFollowUp: {
        sent: false,
        sentAt: null,
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // +14 days
      },
    };

    setTracking(newTracking);
    onUpdate(newTracking);
  };

  const handleMarkFollowUpSent = (followUpType) => {
    const newTracking = { ...tracking };
    newTracking[followUpType] = {
      ...newTracking[followUpType],
      sent: true,
      sentAt: new Date(),
    };

    setTracking(newTracking);
    onUpdate(newTracking);
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return null;

    // const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now; // uses live `now` state

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const isOverdue = diff < 0;

    return {
      days: Math.abs(days),
      hours: Math.abs(hours),
      isOverdue,
      text: isOverdue
        ? `${Math.abs(days)}d ${Math.abs(hours)}h ${Math.abs(minutes)}m overdue`
        : days > 0
          ? `${days}d ${hours}h remaining` // show days/hours for long durations
          : `${Math.abs(minutes)}m ${Math.abs(seconds)}s remaining`, // show mins/secs for short
    };
  };

  const FollowUpItem = ({ title, followUp, followUpType, dayLabel }) => {
    const timeRemaining = getTimeRemaining(followUp.dueDate);
    const isOverdue = timeRemaining?.isOverdue;
    const isSent = followUp.sent;

    return (
      <div
        className={`p-4 rounded-lg border-2 transition-all ${
          isSent
            ? "bg-green-50 border-green-500"
            : isOverdue
              ? "bg-red-50 border-red-500 animate-pulse"
              : "bg-gray-50 border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isSent ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : isOverdue ? (
              <AlertCircle className="text-red-600" size={20} />
            ) : (
              <Clock className="text-gray-600" size={20} />
            )}
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>
          <span className="text-xs bg-white px-2 py-1 rounded font-medium">
            {dayLabel}
          </span>
        </div>

        {isSent ? (
          <div className="text-sm text-green-700">
            ✅ Sent on {new Date(followUp.sentAt).toLocaleString()}
          </div>
        ) : timeRemaining ? (
          <div
            className={`text-sm font-medium ${
              isOverdue ? "text-red-700" : "text-gray-700"
            }`}
          >
            {isOverdue ? "⚠️ " : "⏱️ "}
            {timeRemaining.text}
            {isOverdue && " - Action Required!"}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Waiting for initial email...
          </div>
        )}

        {!isSent && followUp.dueDate && (
          <button
            onClick={() => handleMarkFollowUpSent(followUpType)}
            className={`cursor-pointer mt-3 w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isOverdue
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            <Send size={16} />
            Mark as Sent
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold">Follow-up Tracker</h3>
            <p className="text-sm text-purple-100">
              {lead.businessName || lead.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Initial Email */}
          <div
            className={`p-4 rounded-lg border-2 ${
              tracking.initialEmail.sent
                ? "bg-green-50 border-green-500"
                : "bg-blue-50 border-blue-500"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {tracking.initialEmail.sent ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <Send className="text-blue-600" size={20} />
                )}
                <h4 className="font-semibold text-gray-900">
                  Initial Email Outreach
                </h4>
              </div>
            </div>

            {tracking.initialEmail.sent ? (
              <div className="text-sm text-green-700">
                ✅ Sent on{" "}
                {new Date(tracking.initialEmail.sentAt).toLocaleString()}
              </div>
            ) : (
              <button
                onClick={handleMarkInitialSent}
                className="cursor-pointer mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Mark Initial Email as Sent
              </button>
            )}
          </div>

          {/* Follow-ups */}
          {tracking.initialEmail.sent && (
            <>
              <FollowUpItem
                title="First Follow-up"
                followUp={tracking.firstFollowUp}
                followUpType="firstFollowUp"
                dayLabel="Day 3"
              />

              <FollowUpItem
                title="Second Follow-up"
                followUp={tracking.secondFollowUp}
                followUpType="secondFollowUp"
                dayLabel="Day 7"
              />

              <FollowUpItem
                title="Final Follow-up"
                followUp={tracking.thirdFollowUp}
                followUpType="thirdFollowUp"
                dayLabel="Day 14"
              />
            </>
          )}

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>💡 Pro Tip:</strong> Follow-up emails typically have 2-3x
              higher response rates than initial outreach. Stay persistent!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t rounded-b-xl">
          <button
            onClick={onClose}
            className="cursor-pointer w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
          >
            Close
          </button>

          {tracking.initialEmail.sent && (
            <button
              onClick={() => {
                const reset = {
                  initialEmail: { sent: false, sentAt: null },
                  firstFollowUp: { sent: false, sentAt: null, dueDate: null },
                  secondFollowUp: { sent: false, sentAt: null, dueDate: null },
                  thirdFollowUp: { sent: false, sentAt: null, dueDate: null },
                };
                setTracking(reset);
                onUpdate(reset);
              }}
              className="cursor-pointer w-full bg-red-400 hover:bg-red-500 text-black py-2 px-4 rounded-lg font-medium transition-all mt-1"
            >
              Reset (dev only)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
