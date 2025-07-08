import Quiz from "./model/Quiz.model.js";

const activeRooms = {};

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_room", ({ roomCode, username }) => {
      socket.join(roomCode);
      if (!activeRooms[roomCode]) {
        activeRooms[roomCode] = {
          users: [],
          quizStarted: false,
          questions: [],
          currentQuestionIndex: 0
        };
      }

      activeRooms[roomCode].users.push({ socketId: socket.id, username, score: 0 });
      io.to(roomCode).emit("room_users", activeRooms[roomCode].users);
    });

    socket.on("start_quiz", async ({ roomCode }) => {
      const quiz = await Quiz.findOne({ roomCode });
      if (!quiz) return;

      // Reset scores for all users except host
      if (activeRooms[roomCode]) {
        activeRooms[roomCode].users = activeRooms[roomCode].users.map(u =>
          u.username === "Host" ? u : { ...u, score: 0 }
        );
      }

      activeRooms[roomCode].questions = quiz.questions;
      activeRooms[roomCode].quizStarted = true;
      activeRooms[roomCode].currentQuestionIndex = 0;

      sendQuestion(io, roomCode);
    });

    socket.on("submit_answer", ({ roomCode, username, answer }) => {
      const room = activeRooms[roomCode];
      if (!room) return;
      const question = room.questions[room.currentQuestionIndex];
      if (!question) return;
      const user = room.users.find(u => u.username === username);
      if (!user) return;

      // Only allow one submission per user per question
      if (!room.answers) room.answers = {};
      if (!room.answers[room.currentQuestionIndex]) room.answers[room.currentQuestionIndex] = {};
      // If already answered, do not update score again
      if (room.answers[room.currentQuestionIndex][username] !== undefined) return;

      room.answers[room.currentQuestionIndex][username] = answer;

      // Compare as number for index-based answers
      if (Number(question.correct) === Number(answer)) {
        user.score++;
      }
    });

    socket.on("disconnect", () => {
      for (const roomCode in activeRooms) {
        const room = activeRooms[roomCode];
        room.users = room.users.filter(u => u.socketId !== socket.id);
        io.to(roomCode).emit("room_users", room.users);
      }
    });
  });
}

function sendQuestion(io, roomCode) {
  const room = activeRooms[roomCode];
  const question = room.questions[room.currentQuestionIndex];

  if (!question) {
    // No more questions, end the quiz
    const leaderboard = room.users.filter(u => u.username !== "Host");
    io.to(roomCode).emit("quiz_ended", leaderboard);
    // Clean up answers for next quiz
    room.answers = {};
    return;
  }

  // Reset answers for this question
  if (!room.answers) room.answers = {};
  room.answers[room.currentQuestionIndex] = {};

  io.to(roomCode).emit("new_question", {
    question: question.question,
    options: question.options
  });

  setTimeout(() => {
    const leaderboard = room.users.filter(u => u.username !== "Host");
    io.to(roomCode).emit("leaderboard", leaderboard);
    room.currentQuestionIndex++;
    if (room.currentQuestionIndex < room.questions.length) {
      setTimeout(() => sendQuestion(io, roomCode), 5000);
    } else {
      io.to(roomCode).emit("quiz_ended", leaderboard);
      // Clean up answers for next quiz
      room.answers = {};
    }
  }, 30000);
}

export default socketHandler;
