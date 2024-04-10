import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

const useWebSocket = () => {
  const [ws, setWs] = useState(null);
  const [wsMessage, setWsMessage] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.1.10:8082/ws/group');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      setWsMessage(event.data);
    };

    socket.onerror = (error) => {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi kết nối WebSocket!');
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendWebSocketMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn qua WebSocket!');
    }
  };

  return { sendWebSocketMessage, wsMessage };
};

export { useWebSocket };
