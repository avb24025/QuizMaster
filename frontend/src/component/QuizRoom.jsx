import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { socket } from "../socket";

const QuizRoom = () => {
  const { state } = useLocation();
  const { username } = state || {};
  const { roomCode } = useParams();

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(30);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const leaderboardTimeout = useRef(null);

  useEffect(() => {
    socket.emit("join_room", { roomCode, username });

    socket.on("new_question", (q) => {
      setQuestion(q);
      setSelected(null);
      setTimer(30);
      setShowLeaderboard(false);
      if (leaderboardTimeout.current) clearTimeout(leaderboardTimeout.current);
    });

    socket.on("leaderboard", (users) => {
      setLeaderboard(users);
      setShowLeaderboard(true);
      leaderboardTimeout.current = setTimeout(() => {
        setShowLeaderboard(false);
      }, 5000);
    });

    socket.on("quiz_ended", (users) => {
      setLeaderboard(users);
      setShowLeaderboard(true);
      alert("Quiz Ended!");
      console.log("Final Scores:", users);
    });

    return () => {
      socket.off("new_question");
      socket.off("leaderboard");
      socket.off("quiz_ended");
      if (leaderboardTimeout.current) clearTimeout(leaderboardTimeout.current);
    };
  }, [roomCode, username]);

  useEffect(() => {
    if (!showLeaderboard && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, showLeaderboard]);

  const submitAnswer = (i) => {
    if (selected !== null || showLeaderboard) return;
    setSelected(i);
    socket.emit("submit_answer", { roomCode, username, answer: i });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-10 px-2">
      <div className="max-w-2xl mx-auto bg-black/90 border border-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-2">
          <div>
            <h2 className="text-xl font-bold text-white">Room: <span className="font-mono">{roomCode}</span></h2>
            <h3 className="text-md text-gray-400">User: <span className="font-mono">{username}</span></h3>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="text-gray-400">Time left:</span>
            <span className={`text-2xl font-bold ${timer <= 5 ? "text-red-400" : "text-white"}`}>{timer}s</span>
          </div>
        </div>

        {/* Question or Leaderboard */}
        <div>
          {showLeaderboard ? (
            <div className="animate-fade-in">
              <h4 className="text-2xl font-bold text-white mb-4 text-center">Leaderboard</h4>
              <ul className="divide-y divide-gray-800 bg-gray-900/80 rounded-lg overflow-hidden">
                {leaderboard.map((user, i) => (
                  <li
                    key={i}
                    className={`flex justify-between px-4 py-3 ${i === 0 ? "bg-gradient-to-r from-gray-700 to-gray-800" : ""}`}
                  >
                    <span className={`font-semibold ${i === 0 ? "text-yellow-300" : "text-white"}`}>{user.username}</span>
                    <span className="text-white">{user.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : question ? (
            <div>
              <h4 className="text-xl font-semibold text-white mb-6">{question.question}</h4>
              <ul className="space-y-4">
                {question.options.map((opt, i) => (
                  <li
                    key={i}
                    onClick={() => submitAnswer(i)}
                    className={`
                      cursor-pointer px-5 py-3 rounded-lg border border-gray-700 bg-gray-950 text-white
                      transition-all duration-150
                      ${selected === i ? "bg-gradient-to-r from-gray-700 to-gray-800 border-white ring-2 ring-white" : "hover:bg-gray-800"}
                      ${selected !== null && selected !== i ? "opacity-60" : ""}
                    `}
                    style={{ pointerEvents: selected !== null ? "none" : "auto" }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              {selected !== null && (
                <div className="mt-4 text-center text-green-400 font-semibold">
                  Answer submitted!
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Waiting for host to start quiz...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizRoom;