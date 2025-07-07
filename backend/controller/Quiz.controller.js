import mongoose from 'mongoose';
import Quiz from '../model/Quiz.model.js';

function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const getQuizzes = async () => {
    try {   
        // Fetch all quizzes from the database
        const quizzes = await Quiz.find().sort({ createdAt: -1 }); // Sort by creation date, newest first

        // Check if quizzes exist
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: 'No quizzes found.' });
        }

        // Return the list of quizzes
        res.status(200).json(quizzes);
    }
    catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Controller to handle quiz creation
const createQuiz = async (req, res) => {
    try {
        const { title, questions } = req.body;

        const roomcode= generateRoomCode(); // Generate a unique room code
        const roomCode = roomcode.toUpperCase(); // Convert to uppercase for consistency

    
        // Validate required fields
        if (!title || !questions || questions.length === 0) {
        return res.status(400).json({ error: 'Title, and at least one question are required.' });
        }
    
        // Create new quiz instance
        const newQuiz = new Quiz({
        title,
        questions,
        roomCode,
        createdBy: req.user ? req.user.username : 'Anonymous', // Assuming user info is available in req.user
        });
    
        // Save quiz to database
        await newQuiz.save();
    
        res.status(201).json(newQuiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    }

    export default {
        createQuiz,
        generateRoomCode,
        getQuizzes,
    };



// Controller to handle fetching quizzes

