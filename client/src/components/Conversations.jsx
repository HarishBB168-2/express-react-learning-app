import { ListGroup } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationsProvider";

const Conversations = () => {
  const { conversations, selectConversationIndex } = useConversations();
  return (
    <ListGroup variant="flush">
      {conversations.map((conv, idx) => (
        <ListGroup.Item
          key={idx}
          action
          onClick={() => selectConversationIndex(idx)}
          active={conv.selected}
        >
          {conv.recipients.map((recp) => recp.name).join(", ")}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Conversations;
