import React, { useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";

const ConversationsContext = React.createContext();

export const useConversations = () => {
  return useContext(ConversationsContext);
};

export const ConversationsProvider = ({ id, children }) => {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

  const { contacts } = useContacts();

  const createConversation = (recipients) => {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, messages: [] }];
    });
  };

  const addMessageToCoversation = ({ recipients, text, sender }) => {
    setConversations((prevConversations) => {
      let madeChange = false;
      const newMessage = { sender, text };

      const newConversations = prevConversations.map((conv) => {
        if (arrayEquality(conv.recipients, recipients)) {
          madeChange = true;
          return { ...conv, messages: [...conv.messages, newMessage] };
        }
        return conv;
      });

      if (madeChange) {
        return newConversations;
      } else {
        return [...prevConversations, { recipients, messages: [newMessage] }];
      }
    });
  };

  const sendMessage = (recipients, text) => {
    addMessageToCoversation({ recipients, text, sender: id });
  };

  const formattedConversations = conversations.map((conv, idx) => {
    const recipients = conv.recipients.map((recp) => {
      const contact = contacts.find((ctc) => ctc.id === recp);
      const name = (contact && contact.name) || recp;
      return { id: recp, name };
    });

    const messages = conv.messages.map((msg) => {
      const contact = contacts.find((ctc) => {
        return ctc.id === msg.sender;
      });
      const name = (contact && contact.name) || msg.sender;
      const fromMe = id === msg.sender;
      return { ...msg, senderName: name, fromMe };
    });

    const selected = idx === selectedConversationIndex;
    return { ...conv, messages, recipients, selected };
  });

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

function arrayEquality(a, b) {
  if (a.length !== b.length) return false;
  a.sort();
  b.sort();

  return a.every((element, index) => {
    return element === b[index];
  });
}
