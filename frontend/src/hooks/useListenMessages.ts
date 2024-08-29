import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3"; //importing sound file for notification sound

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play(); // plays the notification sound
      setMessages([...messages, newMessage]);
    });
    return () => {
      socket?.off("newMessage");
    }; // unmounts this function its a clean up function
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
