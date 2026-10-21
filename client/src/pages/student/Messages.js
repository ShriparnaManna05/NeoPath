import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { sessionAPI, messageAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PaperAirplaneIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Messages = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 1. Fetch User's Sessions (to find counsellors they can chat with)
  const { data: sessionsRes, isLoading: sessionsLoading } = useQuery(
    'mySessions',
    sessionAPI.getMySessions
  );
  
  // Clean up data wrapper if needed
  const rawSessions = sessionsRes?.data || sessionsRes || [];
  // Ensure we have an array
  const sessions = Array.isArray(rawSessions) ? rawSessions : (rawSessions.sessions || []);

  // 2. Fetch Messages for Selected Session
  const { data: messagesRes, isLoading: messagesLoading } = useQuery(
    ['messages', selectedSessionId],
    () => messageAPI.getSessionMessages(selectedSessionId),
    {
      enabled: !!selectedSessionId,
      refetchInterval: 5000 // Simple polling fallback if sockets aren't perfectly hooked up
    }
  );
  
  const rawMessages = messagesRes?.data || messagesRes || [];
  const messages = Array.isArray(rawMessages) ? rawMessages : [];

  // Scroll to bottom when messages load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Send Message Mutation
  const sendMessageMutation = useMutation(
    (messageData) => messageAPI.sendMessage(messageData),
    {
      onSuccess: () => {
        setNewMessage('');
        queryClient.invalidateQueries(['messages', selectedSessionId]);
      },
      onError: () => toast.error('Failed to send message')
    }
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSessionId) return;

    // Find the counsellor's user_id from the session to set as receiver
    const session = sessions.find(s => s.session_id === selectedSessionId);
    if (!session) return;
    
    // Determine receiver based on my role
    const receiverId = user.role === 'student' ? session.Counsellor?.User?.user_id : session.Student?.User?.user_id;

    if (!receiverId) {
        toast.error("Cannot find receiver for this session.");
        return;
    }

    sendMessageMutation.mutate({
      sessionId: selectedSessionId,
      receiverId: receiverId,
      messageText: newMessage
    });
  };

  if (sessionsLoading) return <LoadingSpinner text="Loading messages..." />;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Sidebar - List of Sessions/Counsellors */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-indigo-600" />
            Mentor Chat
          </h2>
          <p className="text-sm text-slate-500 mt-1">Connect with your counsellors</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center p-6 text-slate-500 text-sm">
              You don't have any booked sessions yet. Book a session to start chatting with a mentor!
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.session_id}
                onClick={() => setSelectedSessionId(session.session_id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-4 ${
                  selectedSessionId === session.session_id
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm border'
                    : 'bg-white border-transparent hover:bg-gray-100 border'
                }`}
              >
                <UserCircleIcon className={`w-10 h-10 ${selectedSessionId === session.session_id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <h3 className={`font-semibold ${selectedSessionId === session.session_id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {user.role === 'student' ? 
                      `Counsellor ${session.Counsellor?.User?.first_name || 'Assigned'}` : 
                      `Student ${session.Student?.User?.first_name || 'Assigned'}`}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {session.session_type.replace('_', ' ').toUpperCase()} • {session.status}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {!selectedSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <ChatBubbleLeftRightIcon className="w-20 h-20 mb-4 opacity-20" />
            <p className="text-lg">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 shadow-sm z-10 bg-white flex items-center justify-between">
               <h3 className="font-bold text-slate-800 text-lg flex items-center">
                 <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                 Active Conversation
               </h3>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messagesLoading ? (
                <div className="flex justify-center py-10"><LoadingSpinner text="Loading..." /></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                  No messages yet. Send a message to start the conversation!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === user.user_id;
                  return (
                    <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                        isMe 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-slate-700 rounded-bl-none'
                      }`}>
                        <p className="text-[15px] leading-relaxed">{msg.message_text}</p>
                        <span className={`text-[10px] block mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 bg-gray-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                  className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <PaperAirplaneIcon className="w-5 h-5 -rotate-45 ml-1" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
