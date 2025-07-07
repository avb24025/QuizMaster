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

      activeRooms[roomCode].questions = quiz.questions;
      activeRooms[roomCode].quizStarted = true;
      activeRooms[roomCode].currentQuestionIndex = 0;

      sendQuestion(io, roomCode);
    });

    socket.on("submit_answer", ({ roomCode, username, answer }) => {
      const room = activeRooms[roomCode];
      const question = room.questions[room.currentQuestionIndex];
      const user = room.users.find(u => u.username === username);
      if (question.correctAnswer === answer) user.score++;
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
    io.to(roomCode).emit("quiz_ended", room.users);
    return;
  }

  io.to(roomCode).emit("new_question", {
    question: question.question,
    options: question.options
  });

  setTimeout(() => {
    io.to(roomCode).emit("leaderboard", room.users);
    room.currentQuestionIndex++;
    if (room.currentQuestionIndex < room.questions.length) {
      setTimeout(() => sendQuestion(io, roomCode), 5000);
    } else {
      io.to(roomCode).emit("quiz_ended", room.users);
    }
  }, 30000);
}

export default socketHandler;
