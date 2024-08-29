import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation) return; // says that if the conversation is null it will return nothing and get out of this function
      setLoading(true);
      setMessages([]);
      try {
        const res = await fetch(`/api/messages/${selectedConversation.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An Error Occured");
        setMessages(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getMessages()
  }, [selectedConversation, setMessages]);
  return {loading,messages}
};

export default useGetMessages;
