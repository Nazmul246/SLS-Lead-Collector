import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, ArrowUp } from "lucide-react";
import bgVideo from "../assets/bg2.mp4";
import messageTemplates from "../data/MessageFormats.json";

const MessageFormat = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messageRefs = useRef({});
  const topRef = useRef(null);

  const leadData = [
    {
      number: 1,
      note: "Only a not-designed page. A full store design email needs to be sent.",
    },
    {
      number: 2,
      note: "They don't have any website. A full store design email needs to be sent.\nThey don't have any website, now using ebay. A full store design email needs to be sent.",
    },
    {
      number: 3,
      note: "The website is a portfolio website. A full store design email needs to be sent.",
    },
    {
      number: 4,
      note: "Website is designed on wordpress, but doesn't look decent. Need to send redesign + ongoing website support email.\nWebsite is designed, but doesn't look decent. Need to send redesign + ongoing website support email\nWebsite is designed, but doesn't look decent. Only one page design without any proper products. Need to send redesign + ongoing website support email.\nWebsite is designed with custom code, but doesn't look decent. Need to send redesign + ongoing website support email.\nWebsite is designed on squarespace, but doesn't look decent. Need to send redesign + ongoing website support email.",
    },
    {
      number: 5,
      note: "The website is designed properly. Need to send ongoing website support email.",
    },
    {
      number: 6,
      note: "We can send collaboration types email with redesign of her website.\nWe can send collaboration types email for any future projects that the team has on their minds.",
    },
    {
      number: 7,
      note: "We can send collaboration types email for any future projects that he has on his minds. Note: Client name: Reza Ahmadi.",
    },
    {
      number: 8,
      note: "The website is designed with WordPress woo-commerce, we can check back later, and also can send a website migration",
    },
  ];

  // Convert imported JSON messages to array format
  const messagesArray = leadData.map((lead) => ({
    leadNumber: lead.number,
    email:
      messageTemplates[lead.number]?.email ||
      "Template not available for this lead note.",
    social:
      messageTemplates[lead.number]?.social ||
      "Template not available for this lead note.",
  }));

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const scrollToMessage = (leadNumber) => {
    const element = messageRefs.current[leadNumber];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.classList.add("ring-4", "ring-yellow-400");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-yellow-400");
      }, 2000);
    }
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 pointer-events-none md:object-center object-[70%_center]"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better readability */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black/60 via-purple-900/40 to-black/50 -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div ref={topRef} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Lead Messages Dashboard
          </h1>
          <p className="text-white">
            Manage your lead communications efficiently with customized
            templates
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 w-32">
                    Lead #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Lead Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leadData.map((lead, index) => (
                  <tr
                    key={`${lead.number}-${index}`}
                    className="hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => scrollToMessage(lead.number)}
                  >
                    <td className="px-6 py-4 text-blue-400 font-medium hover:text-blue-300 transition-colors">
                      #{lead.number}
                    </td>
                    <td className="px-6 py-4 text-gray-300 whitespace-pre-wrap">
                      {lead.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {messagesArray.map((message, index) => (
            <div
              key={`${message.leadNumber}-${index}`}
              ref={(el) => (messageRefs.current[message.leadNumber] = el)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-300 rounded-lg"
            >
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg shadow-xl border border-blue-700/50 overflow-hidden">
                <div className="bg-blue-900/40 px-6 py-4 flex items-center justify-between border-b border-blue-700/50">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Email Message Format
                    </h3>
                    <p className="text-sm text-blue-300">
                      For Lead Note #{message.leadNumber}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        message.email,
                        `email-${message.leadNumber}-${index}`
                      )
                    }
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedId === `email-${message.leadNumber}-${index}` ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  <pre className="text-white whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {message.email}
                  </pre>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg shadow-xl border border-purple-700/50 overflow-hidden">
                <div className="bg-purple-900/40 px-6 py-4 flex items-center justify-between border-b border-purple-700/50">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Social Media Message Format
                    </h3>
                    <p className="text-sm text-purple-300">
                      For Lead Note #{message.leadNumber}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        message.social,
                        `social-${message.leadNumber}-${index}`
                      )
                    }
                    className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedId === `social-${message.leadNumber}-${index}` ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  <pre className="text-white whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {message.social}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="cursor-pointer fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
            title="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageFormat;
