import { useState } from "react";

export default function Create() {
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", ""], correct: 0 }
  ]);

  const handleQuizNameChange = (e) => setQuizName(e.target.value);

  const handleQuestionChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIdx, oIdx) => {
    const updated = [...questions];
    updated[qIdx].correct = oIdx;
    setQuestions(updated);
  };

  const addOption = (qIdx) => {
    const updated = [...questions];
    updated[qIdx].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIdx, oIdx) => {
    const updated = [...questions];
    updated[qIdx].options.splice(oIdx, 1);
    if (updated[qIdx].correct >= updated[qIdx].options.length) {
      updated[qIdx].correct = 0;
    }
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", ""], correct: 0 }]);
  };

  const removeQuestion = (idx) => {
    const updated = [...questions];
    updated.splice(idx, 1);
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit quiz logic
    console.log({ quizName, questions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12">
      <div className="max-w-2xl mx-auto bg-black/90 border border-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Create a New Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Name */}
          <div>
            <label className="block text-white font-medium mb-2" htmlFor="quiz-name">
              Quiz Name
            </label>
            <input
              id="quiz-name"
              type="text"
              value={quizName}
              onChange={handleQuizNameChange}
              placeholder="Enter quiz name"
              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
              required
            />
          </div>
          {/* Questions */}
          <div className="space-y-10">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-6 rounded-lg bg-gray-900/80 border border-gray-800 relative">
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
                    title="Remove question"
                  >
                    &times;
                  </button>
                )}
                <label className="block text-white font-medium mb-2">
                  Question {qIdx + 1}
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={e => handleQuestionChange(qIdx, e.target.value)}
                  placeholder="Enter question"
                  className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder:text-gray-500 mb-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
                  required
                />
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correct === oIdx}
                        onChange={() => handleCorrectChange(qIdx, oIdx)}
                        className="accent-white"
                        required
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                        placeholder={`Option ${oIdx + 1}`}
                        className="flex-1 rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
                        required
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIdx, oIdx)}
                          className="text-gray-400 hover:text-red-400 px-2"
                          title="Remove option"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIdx)}
                    className="mt-2 text-sm text-white bg-gray-800 hover:bg-gray-700 rounded px-3 py-1 transition"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="w-full text-white bg-gray-800 hover:bg-gray-700 rounded-md py-2 font-semibold transition"
            >
              + Add Question
            </button>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-md text-white"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
