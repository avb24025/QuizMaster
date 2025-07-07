// models/Quiz.js
import mongoose from 'mongoose';
// This file defines the schema for a Quiz model in MongoDB using Mongoose.

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index of correct option
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  createdBy: { type: String }, // optional: host's ID or name
  roomCode: { type: String, required: true },       // ✅ added field
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Quiz', quizSchema);
