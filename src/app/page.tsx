
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const mockHabitData = [
  { day: 'Mon', sleep: 7, water: 2, screen: 5 },
  { day: 'Tue', sleep: 6, water: 1.5, screen: 6 },
  { day: 'Wed', sleep: 8, water: 2, screen: 4 },
  { day: 'Thu', sleep: 5, water: 1, screen: 7 },
  { day: 'Fri', sleep: 7, water: 2.5, screen: 3 },
  { day: 'Sat', sleep: 9, water: 3, screen: 2 },
  { day: 'Sun', sleep: 8, water: 2.8, screen: 4 },
];

type HabitType = 'sleep' | 'water' | 'screen';

const habits: HabitType[] = ['sleep', 'water', 'screen'];

const screenLimit = 6;
const waterGoal = 3;
const sleepGoal = 8;

const today = new Date().toISOString().slice(0, 10);

export default function HabitTrackerApp() {
  const [sleepGoal, setSleepGoal] = useState(8);
  const [waterGoal, setWaterGoal] = useState(2);
  const [screenLimit, setScreenLimit] = useState(4);
  const [checkIn, setCheckIn] = useState<Record<HabitType, number>>({
    sleep: 0,
    water: 0,
    screen: 0,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [streak, setStreak] = useState(3);
  const [rsvpCount, setRsvpCount] = useState(5);

  useEffect(() => {
    // Mock: Update streak if goals are met
    const metAllGoals = checkIn.sleep >= sleepGoal && checkIn.water >= waterGoal && checkIn.screen <= screenLimit;
    if (metAllGoals) setStreak(prev => prev + 1);
  }, [checkIn]);

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 HabitFlow</h1>
        <button onClick={() => setShowSettings(true)} className="hover:text-blue-500 transition">Settings</button>
      </nav>

      {/* Landing + Analytics */}
      <main className="flex-1 p-4 md:p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Today’s Check-In</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          

          {habits.map((habit) => (
        <div key={habit} className="bg-white rounded-xl shadow p-4">
          <label className="block font-medium capitalize mb-2">
            {habit}{' '}
            {habit === 'screen' ? 'time (hrs)' : habit === 'water' ? '(L)' : '(hrs)'}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={checkIn[habit]}
            onChange={(e) =>
              setCheckIn((prev) => ({
                ...prev,
                [habit]: parseFloat(e.target.value),
              }))
            }
            className="w-full"
          />
          <div className="mt-2 text-sm text-right">
            {checkIn[habit]} /{' '}
            {habit === 'screen'
              ? screenLimit
              : habit === 'water'
              ? waterGoal
              : sleepGoal}
          </div>
        </div>
      ))}



          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockHabitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sleep" stroke="#8884d8" name="Sleep (hrs)" />
              <Line type="monotone" dataKey="water" stroke="#82ca9d" name="Water (L)" />
              <Line type="monotone" dataKey="screen" stroke="#ffc658" name="Screen (hrs)" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="font-semibold mb-2">Your Streak 🔥</h3>
            <p className="text-3xl font-bold text-green-600">{streak} Days</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="font-semibold mb-2">Upcoming Event</h3>
            <p className="mb-2">"Mindful Morning" Meetup - Tomorrow @ 7 AM</p>
            <button onClick={() => setRsvpCount(c => c + 1)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">RSVP</button>
            <p className="text-sm mt-2">{rsvpCount} going</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center p-4 text-sm shadow-inner">
        © 2025 HabitFlow — Build Better Habits, One Day at a Time.
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Set Daily Goals</h3>
              <div className="space-y-3">
                <div>
                  <label className="block">Sleep Goal (hrs)</label>
                  <input type="number" value={sleepGoal} onChange={(e) => setSleepGoal(parseFloat(e.target.value))} className="border w-full px-2 py-1 rounded" />
                </div>
                <div>
                  <label className="block">Water Goal (L)</label>
                  <input type="number" value={waterGoal} onChange={(e) => setWaterGoal(parseFloat(e.target.value))} className="border w-full px-2 py-1 rounded" />
                </div>
                <div>
                  <label className="block">Max Screen Time (hrs)</label>
                  <input type="number" value={screenLimit} onChange={(e) => setScreenLimit(parseFloat(e.target.value))} className="border w-full px-2 py-1 rounded" />
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Save</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
