import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FractionObject, Operator } from './types';
import { FractionType, Tab } from './types';
import { getFractionType, toImproper, toMixed, simplify, lcm } from './utils/fractionUtils';
import FractionVisualizer from './components/FractionVisualizer';
import FractionInput from './components/FractionInput';

const Header: React.FC = () => (
  <header className="bg-gradient-to-r from-amber-400 to-orange-500 p-5 shadow-lg relative overflow-hidden">
     <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 rounded-full"></div>
     <div className="absolute -bottom-8 -right-2 w-32 h-32 bg-white/20 rounded-full"></div>
    <div className="flex items-center justify-center gap-4 relative">
        <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg">explore</span>
        <h1 className="text-5xl font-bold text-white text-center drop-shadow-lg tracking-wider">
        알쏭달쏭 분수 탐험대
        </h1>
    </div>
  </header>
);

interface TabButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-3xl font-bold rounded-t-2xl transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
      isActive
        ? 'bg-white text-amber-600 scale-110 shadow-2xl z-10'
        : 'bg-amber-200 text-amber-800 hover:bg-amber-300 hover:-translate-y-1'
    }`}
  >
    <span className="material-symbols-outlined text-4xl">{icon}</span>
    {label}
  </button>
);

const LearnFractions: React.FC = () => {
    const [fraction, setFraction] = useState<FractionObject>({ whole: 0, num: 1, den: 4 });

    const improperFraction = useMemo(() => toImproper(fraction), [fraction]);
    const fractionType = useMemo(() => getFractionType(improperFraction.num, improperFraction.den), [improperFraction]);

    const mixedVersion = useMemo(() => {
        if (fractionType === FractionType.Improper || fractionType === FractionType.Integer) {
            return toMixed(improperFraction.num, improperFraction.den);
        }
        return null;
    }, [fractionType, improperFraction]);
    
    const isInputValid = fraction.den > 0;

    return (
        <div className="p-8 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-slate-700 mb-2">분수랑 친해지기 🧐</h2>
            <p className="mb-8 text-2xl text-slate-500">분수를 만들면 어떤 분수인지 알려줄게!</p>
            <div className="flex flex-col items-center gap-6 w-full">
                <FractionInput value={fraction} onChange={setFraction} />
                {isInputValid ? (
                     <div className="text-center p-6 bg-green-100 border-4 border-green-300 rounded-2xl shadow-lg w-full max-w-md">
                        <p className="text-4xl font-bold text-green-800">
                            이 분수는 <span className="text-blue-600 drop-shadow-sm">{fractionType}</span>!!
                        </p>
                        {mixedVersion && (
                           <p className="mt-2 text-3xl text-slate-700">
                             대분수로 바꾸면 <span className="font-bold text-orange-600">{mixedVersion.whole}와 {mixedVersion.num}/{mixedVersion.den}</span> 이야.
                           </p>
                        )}
                     </div>
                ) : (
                    <div className="text-center p-6 bg-red-100 border-4 border-red-300 rounded-2xl shadow-lg w-full max-w-md">
                        <p className="text-3xl font-bold text-red-700">앗! 분모는 0이 될 수 없어!</p>
                    </div>
                )}
                <FractionVisualizer numerator={improperFraction.num} denominator={improperFraction.den} />
            </div>
        </div>
    );
};

const ConvertFractions: React.FC = () => {
    const [problem, setProblem] = useState({ from: {num: 7, den: 3}, type: 'improperToMixed' as 'improperToMixed' | 'mixedToImproper' });
    const [answer, setAnswer] = useState<FractionObject>({ whole: 0, num: 0, den: 3 });
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
    
    const generateProblem = useCallback(() => {
        setFeedback('');
        if (Math.random() > 0.5) { // Improper to Mixed
            const den = Math.floor(Math.random() * 8) + 2;
            const num = den + Math.floor(Math.random() * (den * 2)) + 1;
            setProblem({ from: { num, den }, type: 'improperToMixed' });
            setAnswer({ whole: 0, num: 0, den: den });
        } else { // Mixed to Improper
            const den = Math.floor(Math.random() * 8) + 2;
            const numInMixed = Math.floor(Math.random() * (den - 1)) + 1;
            const whole = Math.floor(Math.random() * 4) + 1;
            const numInImproper = whole * den + numInMixed;
            setProblem({ from: { num: numInImproper, den }, type: 'mixedToImproper' });
            setAnswer({ whole: 0, num: numInImproper, den: den });
        }
    }, []);

    useEffect(() => {
      generateProblem();
    }, [generateProblem]);

    const checkAnswer = () => {
        if (problem.type === 'improperToMixed') {
            const correct = toMixed(problem.from.num, problem.from.den);
            const simpleAnswer = toMixed(toImproper(answer).num, toImproper(answer).den);
            if (answer.den !== correct.den) {
                setFeedback('incorrect'); // Denominator must match
                return;
            }
            if (simpleAnswer.whole === correct.whole && simpleAnswer.num === correct.num && simpleAnswer.den === correct.den) {
                setFeedback('correct');
            } else {
                setFeedback('incorrect');
            }
        } else { // mixedToImproper
            const correctNum = problem.from.num;
            const {num: answerNum, den: answerDen} = toImproper(answer);
            if(answerDen !== problem.from.den) {
                 setFeedback('incorrect'); // Denominator must match
                return;
            }
            if (answerNum === correctNum) {
                setFeedback('correct');
            } else {
                setFeedback('incorrect');
            }
        }
    };
    
    const problemAsMixed = toMixed(problem.from.num, problem.from.den);
    
    const ActionButton = ({onClick, children, icon, color}: any) => (
        <button onClick={onClick} className={`flex items-center justify-center gap-3 px-8 py-4 text-3xl text-white font-bold rounded-2xl shadow-lg hover:scale-105 transform transition-transform duration-200 ${color}`}>
            <span className="material-symbols-outlined text-4xl">{icon}</span>
            {children}
        </button>
    )

    return (
         <div className="p-8 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-slate-700 mb-2">분수 변신시키기 🔁</h2>
            <p className="mb-8 text-2xl text-slate-500">문제를 보고 분수를 알맞게 바꿔봐!</p>
            <div className="flex flex-col items-center gap-8 p-8 bg-blue-50/70 rounded-2xl shadow-inner w-full">
                <div className="flex items-center justify-center gap-6 text-5xl font-bold text-slate-700">
                    {problem.type === 'improperToMixed' ? (
                        <>
                           <div className="flex flex-col items-center">
                                <span className="border-b-4 border-slate-700 px-4">{problem.from.num}</span>
                                <span>{problem.from.den}</span>
                           </div>
                           <span className="material-symbols-outlined text-6xl text-blue-500">arrow_right_alt</span>
                           <FractionInput value={answer} onChange={setAnswer} showWhole={true} />
                        </>
                    ) : (
                         <>
                           <div className="flex items-center gap-3">
                               <span>{problemAsMixed.whole}</span>
                               <div className="flex flex-col items-center">
                                    <span className="border-b-4 border-slate-700 px-4">{problemAsMixed.num}</span>
                                    <span>{problemAsMixed.den}</span>
                               </div>
                           </div>
                           <span className="material-symbols-outlined text-6xl text-blue-500">arrow_right_alt</span>
                           <FractionInput value={answer} onChange={setAnswer} showWhole={false}/>
                        </>
                    )}
                </div>
                <div className="flex gap-6">
                    <ActionButton onClick={checkAnswer} icon="check_circle" color="bg-green-500 hover:bg-green-600">정답 확인!</ActionButton>
                    <ActionButton onClick={generateProblem} icon="refresh" color="bg-sky-500 hover:bg-sky-600">새 문제</ActionButton>
                </div>
                 {feedback && (
                    <div className={`mt-4 text-4xl font-bold p-6 rounded-2xl flex items-center gap-4 animate-bounce ${feedback === 'correct' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        <span className="text-6xl">{feedback === 'correct' ? '🎉' : '🤔'}</span>
                        {feedback === 'correct' ? '참 잘했어요!' : '아쉬워요, 다시 해볼까요?'}
                    </div>
                )}
                <FractionVisualizer numerator={problem.from.num} denominator={problem.from.den} />
            </div>
        </div>
    );
};

const CalculateFractions: React.FC = () => {
    const [f1, setF1] = useState<FractionObject>({ whole: 0, num: 1, den: 2 });
    const [f2, setF2] = useState<FractionObject>({ whole: 0, num: 1, den: 3 });
    const [op, setOp] = useState<Operator>('+');
    const [answer, setAnswer] = useState<FractionObject>({ whole: 0, num: 0, den: 1 });
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');
    const [calcSteps, setCalcSteps] = useState<string[]>([]);

    const operators: Operator[] = ['+', '-', '×', '÷'];
    
    const checkAnswer = () => {
        const imp1 = toImproper(f1);
        const imp2 = toImproper(f2);
        let resNum, resDen;
        const steps: string[] = [];

        if (f1.den === 0 || f2.den === 0 || answer.den === 0) {
            setFeedback('incorrect');
            setCalcSteps(["앗! 분모는 0이 될 수 없어요!"]);
            return;
        }

        if (f1.whole > 0 || f2.whole > 0) {
            const f1Str = f1.whole > 0 ? `${f1.whole}와 ${f1.num}/${f1.den}` : `${f1.num}/${f1.den}`;
            const f2Str = f2.whole > 0 ? `${f2.whole}과 ${f2.num}/${f2.den}` : `${f2.num}/${f2.den}`;
            steps.push(`${steps.length + 1}. 대분수를 가분수로 바꿔요: ${f1Str} → ${imp1.num}/${imp1.den}, ${f2Str} → ${imp2.num}/${imp2.den}`);
        }

        switch (op) {
            case '+':
            case '-': {
                const commonDen = lcm(imp1.den, imp2.den);
                const newNum1 = imp1.num * (commonDen / imp1.den);
                const newNum2 = imp2.num * (commonDen / imp2.den);

                if (imp1.den !== imp2.den) {
                    steps.push(`${steps.length + 1}. 분모를 같게 만들어요 (통분): ${imp1.num}/${imp1.den} → ${newNum1}/${commonDen}, ${imp2.num}/${imp2.den} → ${newNum2}/${commonDen}`);
                }
                
                resNum = (op === '+') ? newNum1 + newNum2 : newNum1 - newNum2;
                steps.push(`${steps.length + 1}. 분자를 계산해요: ${newNum1} ${op} ${newNum2} = ${resNum}`);
                resDen = commonDen;
                steps.push(`${steps.length + 1}. 계산 결과: ${resNum}/${resDen}`);
                break;
            }
            case '×':
                resNum = imp1.num * imp2.num;
                resDen = imp1.den * imp2.den;
                steps.push(`${steps.length + 1}. 분모는 분모끼리, 분자는 분자끼리 곱해요: (${imp1.num}×${imp2.num}) / (${imp1.den}×${imp2.den})`);
                steps.push(`${steps.length + 1}. 곱셈 결과를 구해요: ${resNum}/${resDen}`);
                break;
            case '÷':
                resNum = imp1.num * imp2.den;
                resDen = imp1.den * imp2.num;
                steps.push(`${steps.length + 1}. 나누는 분수의 분자와 분모를 바꿔서 곱해요: ${imp1.num}/${imp1.den} × ${imp2.den}/${imp2.num}`);
                steps.push(`${steps.length + 1}. 곱셈 결과를 구해요: ${resNum}/${resDen}`);
                break;
            default:
                resNum = 0; resDen = 1;
        }

        const simplified = simplify(resNum, resDen);
        if (resNum !== simplified.num || resDen !== simplified.den) {
             steps.push(`${steps.length + 1}. 분수를 간단하게 만들어요 (약분): ${resNum}/${resDen} → ${simplified.num}/${simplified.den}`);
        }

        const result = toMixed(simplified.num, simplified.den);
        if (simplified.num !== 0 && simplified.den !== 0 && simplified.num % simplified.den === 0) {
             steps.push(`${steps.length + 1}. 정수로 바꿔요: ${simplified.num}/${simplified.den} → ${result.whole}`);
        } else if (result.whole > 0) {
            steps.push(`${steps.length + 1}. 가분수를 대분수로 바꿔요: ${simplified.num}/${simplified.den} → ${result.whole}과 ${result.num}/${result.den}`);
        }
        setCalcSteps(steps);
        
        const correctImproper = simplify(resNum, resDen);
        const userAnswerImproper = toImproper(answer);
        const simplifiedUserAnswer = simplify(userAnswerImproper.num, userAnswerImproper.den);

        if (correctImproper.num === simplifiedUserAnswer.num && correctImproper.den === simplifiedUserAnswer.den) {
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
    }
    
    const reset = () => {
       setF1({ whole: 0, num: 1, den: 2 });
       setF2({ whole: 0, num: 1, den: 3 });
       setAnswer({ whole: 0, num: 0, den: 1 });
       setFeedback('');
       setCalcSteps([]);
    }

    return (
        <div className="p-8 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-slate-700 mb-2">척척박사 분수 계산 🧮</h2>
            <p className="mb-8 text-2xl text-slate-500">두 분수를 계산하고 정답을 확인해봐!</p>
            <div className="flex flex-col items-center gap-8 p-8 bg-purple-50/70 rounded-2xl shadow-inner w-full">
                 <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-8 text-5xl font-bold">
                    <FractionInput value={f1} onChange={setF1} />
                    <div className="flex flex-col gap-2">
                        {operators.map(o => (
                            <button key={o} onClick={() => setOp(o)} className={`w-16 h-16 text-4xl rounded-full transition-transform flex items-center justify-center shadow-md ${op === o ? 'bg-amber-500 text-white scale-110 ring-4 ring-white' : 'bg-white hover:bg-amber-100'}`}>{o}</button>
                        ))}
                    </div>
                    <FractionInput value={f2} onChange={setF2} />
                    <span className="text-slate-600">=</span>
                    <FractionInput value={answer} onChange={setAnswer} />
                </div>
                 <div className="flex gap-6">
                    <button onClick={checkAnswer} className="flex items-center justify-center gap-3 px-8 py-4 text-3xl text-white font-bold rounded-2xl shadow-lg bg-green-500 hover:bg-green-600 hover:scale-105 transform transition-transform duration-200">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                        정답 확인!
                    </button>
                    <button onClick={reset} className="flex items-center justify-center gap-3 px-8 py-4 text-3xl text-white font-bold rounded-2xl shadow-lg bg-sky-500 hover:bg-sky-600 hover:scale-105 transform transition-transform duration-200">
                        <span className="material-symbols-outlined text-4xl">restart_alt</span>
                        초기화
                    </button>
                </div>
                 {feedback && (
                    <div className={`mt-4 text-4xl font-bold p-6 rounded-2xl flex items-center gap-4 animate-bounce ${feedback === 'correct' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        <span className="text-6xl">{feedback === 'correct' ? '🧠' : '😵'}</span>
                        {feedback === 'correct' ? '정답! 정말 똑똑하구나!' : '앗, 계산이 다른 것 같아!'}
                    </div>
                )}
                 {feedback && calcSteps.length > 0 && (
                    <div className="mt-6 w-full max-w-3xl p-6 bg-yellow-50 border-4 border-yellow-200 rounded-2xl text-left">
                        <h4 className="text-3xl font-bold text-yellow-800 mb-4 text-center">풀이 과정 짠! ✨</h4>
                        <ul className="space-y-3 text-2xl text-slate-700 list-none">
                        {calcSteps.map((step, index) => (
                            <li key={index} className="p-3 bg-white rounded-lg shadow-sm flex items-start">
                                <span className="text-yellow-600 font-bold mr-3">▶</span>
                                <span>{step}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Learn);

  const tabBackgrounds = {
    [Tab.Learn]: 'bg-red-50',
    [Tab.Convert]: 'bg-blue-50',
    [Tab.Calculate]: 'bg-purple-50',
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto mt-[-20px] relative z-10 pb-12">
        <nav className="flex justify-center gap-2">
          <TabButton label="알아보기" icon="auto_stories" isActive={activeTab === Tab.Learn} onClick={() => setActiveTab(Tab.Learn)} />
          <TabButton label="바꾸기" icon="swap_horiz" isActive={activeTab === Tab.Convert} onClick={() => setActiveTab(Tab.Convert)} />
          <TabButton label="계산하기" icon="calculate" isActive={activeTab === Tab.Calculate} onClick={() => setActiveTab(Tab.Calculate)} />
        </nav>
        <div className={`rounded-b-2xl shadow-2xl min-h-[600px] transition-colors duration-300 ${tabBackgrounds[activeTab]}`}>
          {activeTab === Tab.Learn && <LearnFractions />}
          {activeTab === Tab.Convert && <ConvertFractions />}
          {activeTab === Tab.Calculate && <CalculateFractions />}
        </div>
      </main>
      <footer className="text-center p-6 text-slate-500 text-2xl">
        <p>&copy; 2024 알쏭달쏭 분수 탐험대와 함께 즐겁게 배워요!</p>
      </footer>
    </div>
  );
};

export default App;