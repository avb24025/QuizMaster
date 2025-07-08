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
  const [quizEnded, setQuizEnded] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const leaderboardTimeout = useRef(null);

  useEffect(() => {
    socket.emit("join_room", { roomCode, username });

    socket.on("new_question", (q) => {
      if (!quizEnded) {
        setQuestion(q);
        setSelected(null);
        setTimer(30);
        setShowLeaderboard(false);
      }
      if (leaderboardTimeout.current) clearTimeout(leaderboardTimeout.current);
    });

    socket.on("leaderboard", (users) => {
      if (!quizEnded) {
        setLeaderboard(users);
        setShowLeaderboard(true);
        leaderboardTimeout.current = setTimeout(() => {
          setShowLeaderboard(false);
        }, 5000);
      }
    });

    socket.on("quiz_ended", (users) => {
      setLeaderboard(users);
      setShowLeaderboard(true);
      setQuizEnded(true);
      setQuestion(null); // Ensure no question is shown after quiz ends
      if (leaderboardTimeout.current) clearTimeout(leaderboardTimeout.current);
    });

    return () => {
      socket.off("new_question");
      socket.off("leaderboard");
      socket.off("quiz_ended");
      if (leaderboardTimeout.current) clearTimeout(leaderboardTimeout.current);
    };
  }, [roomCode, username, quizEnded]);

  useEffect(() => {
    if (!showLeaderboard && timer > 0 && !quizEnded) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
    // Auto-submit answer when timer reaches 0
    if (!showLeaderboard && timer === 0 && !quizEnded && !autoSubmitted) {
      setAutoSubmitted(true);
      socket.emit("submit_answer", { roomCode, username, answer: selected });
    }
  }, [timer, showLeaderboard, quizEnded, selected, roomCode, username, autoSubmitted]);

  useEffect(() => {
    // Reset autoSubmitted flag when new question arrives
    if (question) setAutoSubmitted(false);
  }, [question]);

  const submitAnswer = (i) => {
    if (showLeaderboard || quizEnded || timer === 0) return;
    setSelected(i);
    // Do not emit here, emit only when timer ends
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-10 px-2">
      <div className="max-w-2xl mx-auto bg-black/90 border border-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8 gap-2">
          <div>
            <h2 className="text-xl font-bold text-white">Room: <span className="font-mono">{roomCode}</span></h2>
            <h3 className="text-md text-gray-400">User: <span className="font-mono">{username}</span></h3>
          </div>
          {/* Only show timer if a question is active and quiz is not ended */}
          {!quizEnded && question && (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className="text-gray-400">Time left:</span>
              <span className={`text-2xl font-bold ${timer <= 5 ? "text-red-400" : "text-white"}`}>{timer}s</span>
            </div>
          )}
        </div>

        {/* Question or Leaderboard */}
        <div>
          {(showLeaderboard || quizEnded) ? (
            <div className="animate-fade-in">
              <h4 className="text-2xl font-bold text-white mb-4 text-center">Leaderboard</h4>
              <ul className="divide-y divide-gray-800 bg-gray-900/80 rounded-lg overflow-hidden">
                {leaderboard
                  // Filter to unique usernames only
                  .filter((user, idx, arr) => arr.findIndex(u => u.username === user.username) === idx)
                  .map((user, i) => (
                    <li
                      key={i}
                      className={`flex justify-between px-4 py-3 ${i === 0 ? "bg-gradient-to-r from-gray-700 to-gray-800" : ""}`}
                    >
                      <span className={`font-semibold ${i === 0 ? "text-yellow-300" : "text-white"}`}>{user.username}</span>
                      <span className="text-white">{user.score}</span>
                    </li>
                  ))}
              </ul>
              {quizEnded && (
                <div className="mt-6 text-center text-xl text-white font-semibold">Quiz Ended!</div>
              )}
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
                    style={{ pointerEvents: showLeaderboard || quizEnded || timer === 0 ? "none" : "auto" }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              {selected !== null && timer > 0 && (
                <div className="mt-4 text-center text-green-400 font-semibold">
                  Selected!
                </div>
              )}
              {timer === 0 && (
                <div className="mt-4 text-center text-yellow-400 font-semibold">
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