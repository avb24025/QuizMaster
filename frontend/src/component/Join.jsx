import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Trophy, Zap, Brain, Target } from "lucide-react";

export default function Join() {
  const [joinForm, setJoinForm] = useState({ username: "", roomCode: "" });
  const [hostForm, setHostForm] = useState({ username: "", quizTitle: "" });
  const navigate = useNavigate();

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    if (joinForm.username && joinForm.roomCode) {
      console.log("Joining quiz:", joinForm);
      // TODO: Add join quiz logic
    }
  };

  const handleCreateQuiz = (e) => {
    // Redirect to quiz creation page
    navigate("/create");

    e.preventDefault();
    if (hostForm.username && hostForm.quizTitle) {
      console.log("Creating quiz:", hostForm);
      // TODO: Add create quiz logic
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              QuizMaster
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create engaging quizzes or join live competitions. Test your
            knowledge, challenge friends, and have fun learning together.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-xl mx-auto mb-20 px-4 sm:px-6 flex flex-col gap-10">
          {/* Join Quiz Card */}
          <div className="group hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-white/20 relative overflow-hidden rounded-xl bg-black/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Join a Quiz
                </h3>
              </div>
              <p className="text-gray-400 text-lg mb-6">
                Enter a room code to join an existing quiz and compete with others
              </p>
              <form onSubmit={handleJoinQuiz} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="join-username"
                    className="text-sm sm:text-base font-medium leading-none text-white"
                  >
                    Your Name
                  </label>
                  <input
                    id="join-username"
                    type="text"
                    placeholder="Enter your username"
                    value={joinForm.username}
                    onChange={(e) =>
                      setJoinForm({ ...joinForm, username: e.target.value })
                    }
                    className="flex h-11 sm:h-12 w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm sm:text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="room-code"
                    className="text-sm sm:text-base font-medium leading-none text-white"
                  >
                    Room Code
                  </label>
                  <input
                    id="room-code"
                    type="text"
                    placeholder="Enter 6-digit room code"
                    value={joinForm.roomCode}
                    onChange={(e) =>
                      setJoinForm({
                        ...joinForm,
                        roomCode: e.target.value.toUpperCase(),
                      })
                    }
                    className="flex h-11 sm:h-12 w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm sm:text-base font-mono tracking-wider text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-md text-white inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!joinForm.username || !joinForm.roomCode}
                >
                  <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Join Quiz
                </button>
              </form>
            </div>
          </div>

          {/* Create Quiz Card */}
          <div className="group hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-white/20 relative overflow-hidden rounded-xl bg-black/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Plus className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Create Quiz
                </h3>
              </div>
              <p className="text-gray-400 text-lg mb-6">
                Host your own quiz and invite others to participate
              </p>
              <button
                onClick={handleCreateQuiz}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg text-white inline-flex items-center justify-center gap-3"
              >
                <Plus className="h-6 w-6" />
                Create New Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-12 text-white">
            Why Choose QuizMaster?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">Real-time Play</h3>
              <p className="text-gray-400 text-sm">
                Instant updates and live competition with friends
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">Competitive Fun</h3>
              <p className="text-gray-400 text-sm">
                Leaderboards and scoring to keep things exciting
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">Easy to Use</h3>
              <p className="text-gray-400 text-sm">
                Simple interface that anyone can navigate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
