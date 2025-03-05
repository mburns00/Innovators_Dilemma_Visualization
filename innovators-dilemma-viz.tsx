import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const InnovatorsDilemmaViz = () => {
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);

  // Data representing the performance trajectory of technologies over time
  const rawData = [
    { year: 0, incumbent: 20, disruptor: 5, marketNeed: 10 },
    { year: 1, incumbent: 25, disruptor: 7, marketNeed: 12 },
    { year: 2, incumbent: 30, disruptor: 10, marketNeed: 14 },
    { year: 3, incumbent: 35, disruptor: 15, marketNeed: 16 },
    { year: 4, incumbent: 40, disruptor: 21, marketNeed: 18 },
    { year: 5, incumbent: 45, disruptor: 28, marketNeed: 20 },
    { year: 6, incumbent: 50, disruptor: 36, marketNeed: 22 },
    { year: 7, incumbent: 55, disruptor: 46, marketNeed: 24 },
    { year: 8, incumbent: 60, disruptor: 58, marketNeed: 26 },
    { year: 9, incumbent: 65, disruptor: 72, marketNeed: 28 },
    { year: 10, incumbent: 70, disruptor: 88, marketNeed: 30 },
  ];

  // Filter data based on current year for animation
  const data = rawData.filter(item => item.year <= currentYear);

  // Key milestones in the innovator's dilemma story with detailed explanations
  const milestones = [
    { 
      year: 0, 
      event: "Incumbent firm is successful, disruptive technology emerges but underperforms",
      title: "Initial Market Conditions",
      explanation: "Established companies focus on sustaining innovations that improve products for existing customers. Meanwhile, disruptive innovations emerge with simpler, cheaper alternatives that initially underperform in mainstream markets but excel in some other dimension (like cost or convenience)."
    },
    { 
      year: 3, 
      event: "Disruptive technology improves, finds niche markets ignored by incumbent",
      title: "Finding Foothold Markets",
      explanation: "Disruptive technologies find initial success in new or low-end market segments that incumbents view as unprofitable or unimportant. These 'foothold' markets allow the disruptor to improve their technology without direct competition."
    },
    { 
      year: 5, 
      event: "Disruption meets basic market needs, begins threatening incumbent",
      title: "Meeting Mainstream Requirements",
      explanation: "The disruptive technology improves to the point where it satisfies minimum requirements for mainstream customers. This is a critical inflection point, as the disruptor can now begin attracting the incumbent's core customers while maintaining advantages in cost, simplicity, or convenience."
    },
    { 
      year: 8, 
      event: "Disruptive technology surpasses incumbent in performance",
      title: "Disruption Crossover",
      explanation: "The disruptive technology now outperforms the incumbent's offerings even by traditional metrics. Incumbent firms typically struggle to respond effectively at this stage because they've invested heavily in their existing technology trajectory and organizational capabilities."
    },
    { 
      year: 10, 
      event: "Incumbent struggles to catch up, market has shifted",
      title: "Market Transformation",
      explanation: "The market has been redefined around the disruptive technology's value proposition. Incumbents either adapt by acquiring/developing similar capabilities (rare), find specialized niches where their technology still has advantages, or face decline. This pattern has repeated across industries from disk drives to steel mills to digital photography."
    }
  ];

  // Examples of real-world disruptions for tooltips
  const realWorldExamples = [
    { name: "Digital Photography vs. Film", year: 2 },
    { name: "Netflix vs. Blockbuster", year: 4 },
    { name: "Smartphones vs. Feature Phones", year: 6 },
    { name: "Electric Vehicles vs. Combustion Engines", year: 8 }
  ];

  // Strategy insights for incumbents and disruptors
  const strategyInsights = {
    incumbent: [
      "Set up separate organizations for disruptive innovations",
      "Accept initial lower margins in new markets",
      "Find early applications where disruptive tech's weaknesses are strengths",
      "Don't wait for customer demand – it may come too late"
    ],
    disruptor: [
      "Target overlooked or non-consumption markets first",
      "Keep business model lean and accept lower margins",
      "Embrace iterative, discovery-driven planning",
      "Move upmarket only when ready, not prematurely"
    ]
  };

  // Find the current milestone message
  const getCurrentMilestone = () => {
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (currentYear >= milestones[i].year) {
        return milestones[i];
      }
    }
    return "";
  };

  // Animation logic
  React.useEffect(() => {
    let interval;
    // Only play if playing is true AND there's no active popup
    if (playing && currentYear < 10 && !activePopup) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          const newYear = Math.min(prev + 0.25, 10);
          
          // Check if we've just crossed a milestone year
          milestones.forEach(milestone => {
            if (prev < milestone.year && newYear >= milestone.year) {
              setActivePopup(milestone);
              // The animation will pause automatically since activePopup is now set
            }
          });
          
          return newYear;
        });
      }, 500 / speed);
    } else if (currentYear >= 10) {
      setPlaying(false);
    }
    
    return () => clearInterval(interval);
  }, [playing, currentYear, speed, activePopup]);

  // Click outside to close popup
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The point where disruption meets market needs
  const disruptionPoint = rawData.findIndex(item => item.disruptor >= item.marketNeed);
  const crossoverPoint = rawData.findIndex(item => item.disruptor >= item.incumbent);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const example = realWorldExamples.find(ex => ex.year === label);
      
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-lg font-semibold">Year {label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          {example && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="font-medium text-indigo-600">Real-world example:</p>
              <p>{example.name}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom dot component to make certain points interactive
  const CustomDot = (props) => {
    const { cx, cy, dataKey, payload } = props;
    const milestone = milestones.find(m => m.year === payload.year);
    
    if (milestone) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={6} 
          fill={dataKey === "incumbent" ? "#8884d8" : "#82ca9d"} 
          stroke="#fff" 
          strokeWidth={2}
          style={{ cursor: 'pointer' }}
          onClick={() => setActivePopup(milestone)}
        />
      );
    }
    
    return <circle cx={cx} cy={cy} r={4} fill={dataKey === "incumbent" ? "#8884d8" : "#82ca9d"} />;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto relative">
      <h2 className="text-2xl font-bold text-center mb-4">The Innovator's Dilemma Visualization</h2>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This visualization demonstrates Clayton Christensen's Innovator's Dilemma concept:
          how established companies can fail despite doing everything "right" by focusing on
          sustaining innovations while disruptive technologies eventually take over the market.
        </p>
        <p className="text-blue-600 text-sm italic">Click on milestone points or play the animation to see detailed explanations. Hover over points for additional information.</p>
      </div>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Time (Years)', position: 'insideBottomRight', offset: -10 }} 
              domain={[0, 10]}
            />
            <YAxis 
              label={{ value: 'Performance', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            
            <Line 
              type="monotone" 
              dataKey="incumbent" 
              stroke="#8884d8" 
              strokeWidth={3}
              name="Incumbent (Sustaining Innovation)" 
              dot={<CustomDot />}
              activeDot={{ r: 8, onClick: (_, index) => {
                const year = data[index].year;
                const milestone = milestones.find(m => m.year === year);
                if (milestone) setActivePopup(milestone);
              }}}
            />
            <Line 
              type="monotone" 
              dataKey="disruptor" 
              stroke="#82ca9d" 
              strokeWidth={3}
              name="Disruptive Technology" 
              dot={<CustomDot />}
              activeDot={{ r: 8, onClick: (_, index) => {
                const year = data[index].year;
                const milestone = milestones.find(m => m.year === year);
                if (milestone) setActivePopup(milestone);
              }}}
            />
            <Line 
              type="monotone" 
              dataKey="marketNeed" 
              stroke="#ff7300" 
              strokeWidth={3}
              name="Mainstream Market Need" 
              strokeDasharray="5 5"
              dot={{ r: 0 }}
            />
            
            {/* Show annotations for key events */}
            {showAnnotations && disruptionPoint > 0 && currentYear >= disruptionPoint && (
              <ReferenceLine 
                x={disruptionPoint} 
                stroke="red" 
                strokeDasharray="3 3" 
                label={{ value: 'Market Disruption Point', position: 'insideTopRight', fill: 'red' }} 
              />
            )}
            
            {showAnnotations && crossoverPoint > 0 && currentYear >= crossoverPoint && (
              <ReferenceLine 
                x={crossoverPoint} 
                stroke="purple" 
                strokeDasharray="3 3" 
                label={{ value: 'Technology Crossover', position: 'insideBottomRight', fill: 'purple' }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => {
              setPlaying(!playing);
              if (currentYear >= 10) setCurrentYear(0);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {playing ? 'Pause' : currentYear >= 10 ? 'Restart' : 'Play'}
          </button>
          
          <button
            onClick={() => setCurrentYear(0)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reset
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">Speed:</span>
            <select 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="border rounded p-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showAnnotations}
              onChange={() => setShowAnnotations(!showAnnotations)}
              id="show-annotations"
            />
            <label htmlFor="show-annotations" className="text-sm">Show Annotations</label>
          </div>
        </div>
        
        <div className="text-sm">
          Year: <span className="font-bold">{currentYear.toFixed(0)}</span>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Current Phase:</h3>
        <p>{getCurrentMilestone().event}</p>
      </div>
      
      {/* Interactive Case Studies */}
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Select Case Study:</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded border border-blue-300"
            onClick={() => {
              // Would implement case study data switch here
              // For this demo, we'll just use an alert
              alert("This would load the Digital Photography vs Film case study data");
            }}
          >
            Digital Photography
          </button>
          <button 
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded border border-blue-300"
            onClick={() => alert("This would load the Netflix vs Blockbuster case study data")}
          >
            Netflix vs Blockbuster
          </button>
          <button 
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded border border-blue-300"
            onClick={() => alert("This would load the Smartphones vs Nokia case study data")}
          >
            Smartphones
          </button>
          <button 
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded border border-blue-300"
            onClick={() => alert("This would load the Tesla vs Auto Industry case study data")}
          >
            Electric Vehicles
          </button>
        </div>
      </div>

      {/* Manual Year Slider */}
      <div className="mt-4 mb-6">
        <label htmlFor="year-slider" className="block mb-1 font-medium">
          Timeline Position: Year {currentYear.toFixed(1)}
        </label>
        <input
          id="year-slider"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={currentYear}
          onChange={(e) => setCurrentYear(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 mb-2">Incumbent Strategy Insights:</h3>
          <ul className="space-y-1">
            {strategyInsights.incumbent.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">Disruptor Strategy Insights:</h3>
          <ul className="space-y-1">
            {strategyInsights.disruptor.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Resources Section with Key Points and Term Explanations */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-2">Key Concepts Explained:</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="border-b border-gray-200 pb-3">
            <div className="font-medium flex items-center">
              <span className="text-blue-600 mr-2">📖</span>
              <span>The Innovator's Dilemma (1997)</span>
            </div>
            <p className="text-sm ml-6 mb-1">Good companies fail precisely because they follow best practices that worked previously.</p>
            <div className="ml-6 mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
              <span className="font-medium text-xs">Key Terms:</span>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li><span className="font-medium">High-margin customers</span>: Profitable clients willing to pay premium prices for better performance (e.g., enterprise clients).</li>
                <li><span className="font-medium">Low-margin customers</span>: Price-sensitive buyers seeking basic, affordable solutions that established companies often ignore.</li>
              </ul>
            </div>
          </div>
          
          <div className="border-b border-gray-200 pb-3">
            <div className="font-medium flex items-center">
              <span className="text-blue-600 mr-2">📖</span>
              <span>The Innovator's Solution (2003)</span>
            </div>
            <p className="text-sm ml-6 mb-1">Create separate organizations for disruptive innovations with different processes, priorities, and profit expectations.</p>
            <div className="ml-6 mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
              <span className="font-medium text-xs">Key Terms:</span>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li><span className="font-medium">Non-consumption</span>: Markets where people aren't using any solution yet, rather than using competitors' products (e.g., smartphones before 2007).</li>
                <li><span className="font-medium">Jobs-to-be-done</span>: Framework focusing on what customers are trying to accomplish, not their demographics or product categories.</li>
              </ul>
            </div>
          </div>
          
          <div className="border-b border-gray-200 pb-3">
            <div className="font-medium flex items-center">
              <span className="text-blue-600 mr-2">🔗</span>
              <span>HBR: Disruptive Technologies</span>
            </div>
            <p className="text-sm ml-6 mb-1">The S-curve pattern of technology adoption explains why incumbents miss disruptions.</p>
            <div className="ml-6 mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
              <span className="font-medium text-xs">Key Terms:</span>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li><span className="font-medium">S-curve</span>: Pattern where technologies improve slowly initially, then rapidly, then plateau - companies often miss the start of a new S-curve.</li>
                <li><span className="font-medium">Business model innovation</span>: Changing how value is created and captured, often more important than technical features (e.g., iTunes model vs CD sales).</li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="font-medium flex items-center">
              <span className="text-blue-600 mr-2">🔗</span>
              <span>MIT Sloan: Managing Disruption</span>
            </div>
            <p className="text-sm ml-6 mb-1">Success requires balancing improvement of existing products with the development of disruptive innovations.</p>
            <div className="ml-6 mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
              <span className="font-medium text-xs">Key Terms:</span>
              <ul className="text-xs list-disc pl-4 mt-1">
                <li><span className="font-medium">Organizational ambidexterity</span>: The ability of an organization to simultaneously explore new opportunities and exploit existing capabilities - like using different hands for different tasks.</li>
                <li><span className="font-medium">Exploration vs. Exploitation</span>: Exploration involves search, risk-taking, and innovation; exploitation involves refinement, efficiency, and execution.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popup for milestone explanations */}
      {activePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div 
            ref={popupRef}
            className="bg-white rounded-lg p-6 max-w-md m-4 shadow-2xl transform transition-all"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-blue-800">{activePopup.title}</h3>
              <button 
                onClick={() => {
                  setActivePopup(null);
                  // Animation continues automatically when popup closes
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <p className="text-blue-600 font-semibold">Year {activePopup.year}</p>
              <p className="mt-2">{activePopup.explanation}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="italic text-gray-600">
                  Click anywhere outside this popup to close it
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnovatorsDilemmaViz;
