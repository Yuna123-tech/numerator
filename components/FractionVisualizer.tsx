import React from 'react';

interface PieProps {
  numerator: number;
  denominator: number;
  radius: number;
}

const Pie: React.FC<PieProps> = ({ numerator, denominator, radius }) => {
  if (denominator <= 0) return null;
  const cx = radius;
  const cy = radius;

  const getCoordinatesForPercent = <T,>(percent: T) => {
    const x = cx + radius * Math.cos(2 * Math.PI * (Number(percent) - 0.25));
    const y = cy + radius * Math.sin(2 * Math.PI * (Number(percent) - 0.25));
    return [x, y];
  };

  const slices = Array.from({ length: denominator }).map((_, i) => {
    const startPercent = i / denominator;
    const endPercent = (i + 1) / denominator;
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

    const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} L ${cx} ${cy} Z`;
    
    return (
      <path
        key={i}
        d={pathData}
        fill={i < numerator ? '#fbbf24' : '#e5e7eb'} // amber-400 for filled
        stroke="#ffffff"
        strokeWidth="2"
      />
    );
  });

  return <svg width={radius * 2} height={radius * 2}>{slices}</svg>;
};


interface NumberLineProps {
  numerator: number;
  denominator: number;
}

const NumberLine: React.FC<NumberLineProps> = ({ numerator, denominator }) => {
    if (denominator <= 0) return null;
    const value = numerator / denominator;
    const maxVal = Math.max(2, Math.ceil(value) + 1);
    const width = 500;
    const height = 70;
    const padding = 20;

    const scale = (val: number) => padding + (val / maxVal) * (width - 2 * padding);
    
    const markerX = scale(value);

    return (
        <svg width={width} height={height} className="mt-4">
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />

            {Array.from({ length: maxVal + 1 }).map((_, i) => (
                <g key={i}>
                    <line x1={scale(i)} y1={height/2 - 12} x2={scale(i)} y2={height/2 + 12} stroke="#4b5563" strokeWidth="3" strokeLinecap="round"/>
                    <text x={scale(i)} y={height/2 + 35} textAnchor="middle" fontSize="24" fill="#374151">{i}</text>
                    {i < maxVal && Array.from({ length: denominator - 1 }).map((_, j) => (
                         <line key={j} x1={scale(i + (j+1)/denominator)} y1={height/2 - 6} x2={scale(i + (j+1)/denominator)} y2={height/2 + 6} stroke="gray" strokeWidth="2" strokeLinecap="round"/>
                    ))}
                </g>
            ))}

            <path d={`M ${markerX} ${height/2 - 10} L ${markerX - 8} ${height/2 - 25} L ${markerX + 8} ${height/2 - 25} Z`} fill="#ef4444" />
        </svg>
    );
};


interface FractionVisualizerProps {
  numerator: number;
  denominator: number;
}

const FractionVisualizer: React.FC<FractionVisualizerProps> = ({ numerator, denominator }) => {
  if (denominator <= 0 || numerator < 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-2xl bg-gray-100 rounded-lg">
        분모는 1 이상, 분자는 0 이상이어야 그릴 수 있어요!
      </div>
    );
  }

  const wholeParts = Math.floor(numerator / denominator);
  const fractionalNumerator = numerator % denominator;

  const pies = [];
  for (let i = 0; i < wholeParts; i++) {
    pies.push(<Pie key={`whole-${i}`} numerator={denominator} denominator={denominator} radius={60} />);
  }
  if (fractionalNumerator > 0 || (numerator === 0 && denominator > 0)) {
    pies.push(<Pie key="fractional" numerator={fractionalNumerator} denominator={denominator} radius={60} />);
  }

  return (
    <div className="my-4 p-6 border-4 border-slate-200 rounded-2xl bg-white/50 w-full">
      <h3 className="text-3xl font-bold text-slate-700 mb-4 text-center">한눈에 쏙! 분수 그림</h3>
      <div>
        <h4 className="font-bold text-2xl text-slate-600 text-center">동그란 피자 조각 🍕</h4>
        <div className="flex flex-wrap gap-4 items-center justify-center p-4 min-h-[140px]">
          {pies.length > 0 ? pies : <p className="text-gray-500 text-2xl">표시할 피자가 없어요.</p>}
        </div>
      </div>
       <div className="mt-6">
        <h4 className="font-bold text-2xl text-slate-600 text-center mt-4">길쭉한 자 📏</h4>
        <div className="flex justify-center p-2">
           <NumberLine numerator={numerator} denominator={denominator} />
        </div>
      </div>
    </div>
  );
};

export default FractionVisualizer;