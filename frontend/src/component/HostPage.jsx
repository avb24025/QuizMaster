 import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useParams } from "react-router-dom";

const HostPage = () => {
  const { roomCode } = useParams();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    socket.emit("join_room", { roomCode, username: "Host" });
    socket.on("room_users", setParticipants);
    return () => socket.off("room_users");
  }, [roomCode]);

  const startQuiz = () => {
    socket.emit("start_quiz", { roomCode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-10 px-2">
      <div className="max-w-xl mx-auto bg-black/90 border border-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Hosting Quiz Room: <span className="font-mono">{roomCode}</span>
        </h2>
        <h3 className="text-xl text-gray-400 mb-4 text-center">
          Participants
        </h3>
        <ul className="divide-y divide-gray-800 bg-gray-900/80 rounded-lg overflow-hidden mb-8">
          {participants.length === 0 && (
            <li className="px-4 py-3 text-gray-500 text-center">
              No participants yet
            </li>
          )}
          {participants.map((p, i) => (
            <li key={i} className="px-4 py-3 text-white">
              {p.username}
            </li>
          ))}
        </ul>
        <button
          onClick={startQuiz}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-md text-white"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default HostPage;