"use client";
import { useState, useEffect, useRef } from "react";
import AdBox from "../components/AdBox";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<number | null>(null);

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);

  const [roundTransition, setRoundTransition] = useState(false);

  const [roundReady, setRoundReady] = useState(false);
  const [readyTime, setReadyTime] = useState(3);
  const [countdownText, setCountdownText] = useState("3");

  const [isClicking, setIsClicking] = useState(false);
  const [scorePop, setScorePop] = useState(false);

  const [ranking, setRanking] = useState({ 1: 0, 2: 0, 3: 0 });

  const maxRound = 3;

  const scoreRef = useRef(score);
  const bestScoreRef = useRef(bestScore);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { bestScoreRef.current = bestScore; }, [bestScore]);

  const getTimeByDifficulty = (level: number) => {
    if (level === 1) return 10;
    if (level === 2) return 7;
    return 5;
  };

  useEffect(() => {
    const saved = localStorage.getItem("bestScore");
    if (saved) setBestScore(Number(saved));
  }, []);

  const handleClick = () => {
    if (roundReady) return;

    setScore((prev) => prev + 1);

    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);

    setScorePop(true);
    setTimeout(() => setScorePop(false), 200);
  };

  /* 타이머: 라운드 증가 여기서만 */
  useEffect(() => {
    if (!started || gameOver || difficulty === null || roundReady) return;

    if (timeLeft <= 0) {
      if (round < maxRound) {
        setRound((prev) => prev + 1); 

        setRoundReady(true);
        setReadyTime(3);
      } else {
        setGameOver(true);

        const latestScore = scoreRef.current;

        if (
          difficulty &&
          latestScore >
            (Number(localStorage.getItem(`bestScore_${difficulty}`)) || 0)
        ) {
          localStorage.setItem(
            `bestScore_${difficulty}`,
            String(latestScore)
          );
        }

        const latestBestScore = bestScoreRef.current;
        if (latestScore > latestBestScore) {
          localStorage.setItem("bestScore", String(latestScore));
          setBestScore(latestScore);
        }

        setRanking({
          1: Number(localStorage.getItem("bestScore_1") || 0),
          2: Number(localStorage.getItem("bestScore_2") || 0),
          3: Number(localStorage.getItem("bestScore_3") || 0),
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, started, gameOver, round, difficulty, roundReady]);

  /* 카운트다운 */
  useEffect(() => {
    if (!roundReady) return;

    if (readyTime <= 0) {
      setCountdownText(`Round ${round} START`); 

      const startTimer = setTimeout(() => {
        setTimeLeft(getTimeByDifficulty(difficulty!));
        setRoundReady(false);
      }, 700);

      return () => clearTimeout(startTimer);
    }

    setCountdownText(String(readyTime));

    const timer = setTimeout(() => {
      setReadyTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [readyTime, roundReady, difficulty, round]);

  /* 시작 */
  const handleStart = (level: number) => {
    setDifficulty(level);
    setStarted(true);
    setScore(0);
    setRound(1);
    setGameOver(false);

    setRoundReady(true);   
    setReadyTime(3);     
  };

  /* 다시하기 */
  const handleRestart = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);

    setRoundReady(true);  
    setReadyTime(3);       
  };

  const handleShare = () => {
    const text = `내 점수는 ${score}점! 너도 도전해봐 🔥`;

    if (navigator.share) {
      navigator.share({ title: "Speed Game", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("클립보드에 복사됨!");
    }
  };

  /* 이하 UI 전부 기존 그대로 유지 */
  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
        <h1 className="text-2xl font-bold mb-4">난이도 선택</h1>

        <button onClick={() => handleStart(1)} className="px-8 py-3 bg-green-600 rounded-xl">쉬움</button>
        <button onClick={() => handleStart(2)} className="px-8 py-3 bg-yellow-500 rounded-xl">보통</button>
        <button onClick={() => handleStart(3)} className="px-6 py-3 bg-red-600 rounded-xl">어려움</button>
      </div>
    );
  }

  /* 게임 종료 */
  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">게임 종료!</h1>

          <p>최종 점수</p>
          <h2 className="text-4xl font-bold mb-2">{score}</h2>

          <p className="mb-4">최고 점수: {bestScore}</p>

          <div className="mt-4 text-left">
            <h3 className="text-lg font-semibold mb-2">난이도별 최고점</h3>
            <ul className="space-y-1">
              <li>쉬움: {ranking[1]}</li>
              <li>보통: {ranking[2]}</li>
              <li>어려움: {ranking[3]}</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button onClick={handleRestart} className="py-3 bg-indigo-600 rounded-xl">다시하기</button>
            <button onClick={() => setStarted(false)} className="py-3 bg-yellow-500 rounded-xl">난이도 선택</button>
            <button onClick={handleShare} className="py-3 bg-green-600 rounded-xl">공유하기</button>
          </div>
        </div>
      </div>
    );
  }

  /* 게임 화면 */
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-6 relative pb-20">

      {roundReady && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm pointer-events-none">
          <div className="text-6xl font-extrabold text-yellow-400 animate-pulse">
            {countdownText}
          </div>
        </div>
      )}

      <div className="w-full max-w-md flex justify-between mb-4">
        <span>Round {round}/{maxRound}</span>
        <span>⏱ {timeLeft}s</span>
      </div>

      <div className="w-full max-w-md my-4">
        <AdBox slot="8997590677" size="medium" />
      </div>

      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-xl p-6 mt-16 text-center relative z-10">

        <h2 className={`text-5xl font-bold mb-6 transition-transform duration-150 ${
          scorePop ? "scale-125 text-yellow-300" : "scale-100"
        }`}>
          {score}
        </h2>

        <div className="my-4">
          <AdBox slot="8997590677" size="medium" />
        </div>

        <button
          className={`w-full py-6 text-2xl font-semibold rounded-xl transition-all duration-100
          ${isClicking 
            ? "scale-90 bg-indigo-800" 
            : "scale-100 bg-gradient-to-r from-indigo-600 to-indigo-400"
          }`}
          onClick={handleClick}
        >
          클릭!!
        </button>
      </div>
      <div className="w-full max-w-md mt-6">
        <AdBox slot="1390563390" size="medium" />
      </div>
    </div>
  );
}