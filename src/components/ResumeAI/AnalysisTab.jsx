import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const AnalysisTab = ({ analysisResult, onNavigateToTab }) => {
  const [activeChart, setActiveChart] = useState("overview");

  if (!analysisResult) return null;

  // Calculate metrics from skill scores if not provided
  const skillScoresArray = analysisResult.skillScores
    ? Object.entries(analysisResult.skillScores)
    : [];

  const totalSkills = skillScoresArray.length;
  const averageScore =
    totalSkills > 0
      ? (
          skillScoresArray.reduce((sum, [, score]) => sum + score, 0) /
          totalSkills
        ).toFixed(1)
      : 0;

  // Calculate skill distribution
  const skillDistribution = {
    excellent: skillScoresArray.filter(([, score]) => score >= 8).length,
    good: skillScoresArray.filter(([, score]) => score >= 6 && score < 8)
      .length,
    average: skillScoresArray.filter(([, score]) => score >= 4 && score < 6)
      .length,
    needsImprovement: skillScoresArray.filter(([, score]) => score < 4).length,
  };

  // Prepare data for charts with enhanced colors
  const skillDistributionData = [
    {
      name: "Excellent (8-10)",
      value: skillDistribution.excellent,
      color: "#10B981",
    },
    { name: "Good (6-7)", value: skillDistribution.good, color: "#3B82F6" },
    {
      name: "Average (4-5)",
      value: skillDistribution.average,
      color: "#F59E0B",
    },
    {
      name: "Needs Work (<4)",
      value: skillDistribution.needsImprovement,
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0);

  // Create category scores from skills (group by technology type)
  const categoryMapping = {
    "Programming Languages": [
      "Python",
      "JavaScript",
      "Java",
      "C++",
      "TypeScript",
      "Go",
      "Rust",
      "PHP",
      "Ruby",
      "Swift",
      "Kotlin",
    ],
    "Frontend Technologies": [
      "React",
      "Vue",
      "Angular",
      "HTML5",
      "CSS3",
      "Next.js",
      "Svelte",
      "Bootstrap",
      "Tailwind CSS",
    ],
    "Backend Technologies": [
      "Node.js",
      "Express",
      "Flask",
      "FastAPI",
      "Spring Boot",
      "Django",
      "REST APIs",
      "GraphQL",
    ],
    Databases: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Elasticsearch",
      "SQL",
      "NoSQL",
    ],
    "Cloud & DevOps": [
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Terraform",
      "Jenkins",
    ],
    "AI/ML": [
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "Scikit-Learn",
      "NLP",
      "Computer Vision",
    ],
    "Tools & Others": [
      "Git",
      "Linux",
      "Agile",
      "Scrum",
      "Testing",
      "Monitoring",
    ],
  };

  const categoryScores = {};
  Object.entries(categoryMapping).forEach(([category, skills]) => {
    const categorySkills = skillScoresArray.filter(([skill]) =>
      skills.some((catSkill) =>
        skill.toLowerCase().includes(catSkill.toLowerCase())
      )
    );
    if (categorySkills.length > 0) {
      const avgScore =
        categorySkills.reduce((sum, [, score]) => sum + score, 0) /
        categorySkills.length;
      categoryScores[category] = avgScore;
    }
  });

  // Enhanced color palette for categories
  const categoryColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
  ];

  const categoryScoresData = Object.entries(categoryScores).map(
    ([category, score], index) => ({
      category:
        category.length > 12 ? category.substring(0, 12) + "..." : category,
      fullCategory: category,
      score: Number(score.toFixed(1)),
      fill: categoryColors[index % categoryColors.length],
    })
  );

  // Create competency radar data
  const competencyAreas = {
    "Technical Skills":
      categoryScores["Programming Languages"] ||
      categoryScores["Frontend Technologies"] ||
      0,
    "Backend Development":
      categoryScores["Backend Technologies"] ||
      categoryScores["Databases"] ||
      0,
    "Cloud & Infrastructure": categoryScores["Cloud & DevOps"] || 0,
    "AI/ML Expertise": categoryScores["AI/ML"] || 0,
    "Tools & Processes": categoryScores["Tools & Others"] || 0,
    "Overall Experience": averageScore || 0,
  };

  const competencyRadarData = Object.entries(competencyAreas)
    .filter(([, score]) => score > 0)
    .map(([area, score]) => ({
      area: area.length > 15 ? area.substring(0, 15) + "..." : area,
      fullArea: area,
      score: Number(score),
      fullMark: 10,
    }));

  // Enhanced color palette for top skills
  const skillColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];

  const topSkillsData = skillScoresArray
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill, score], index) => ({
      skill: skill.length > 12 ? skill.substring(0, 12) + "..." : skill,
      fullSkill: skill,
      score,
      fill: skillColors[index % skillColors.length],
    }));

  return (
    <div className="space-y-8">
      {/* Header with Overall Score */}
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <div
            className={`text-8xl font-bold mb-6 ${
              analysisResult.overallScore >= 75
                ? "text-green-500"
                : analysisResult.overallScore >= 50
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {analysisResult.overallScore}%
          </div>
          <div className="absolute -top-4 -right-12">
            <div
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                analysisResult.selected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {analysisResult.selected ? "✅ SELECTED" : "❌ REJECTED"}
            </div>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-4">
          {analysisResult.reasoning}
        </p>
      </div>

      {/* Chart Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          { key: "overview", label: "📊 Overview", icon: "📊" },
          { key: "skills", label: "🎯 Top Skills", icon: "🎯" },
          { key: "categories", label: "📈 Categories", icon: "📈" },
          { key: "competency", label: "🎪 Competency Radar", icon: "🎪" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveChart(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeChart === tab.key
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Charts */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        {activeChart === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skill Distribution Pie Chart */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                🎯 Skill Distribution
              </h3>
              {skillDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <defs>
                      {skillDistributionData.map((entry, index) => (
                        <linearGradient
                          key={index}
                          id={`pie-gradient-${index}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={entry.color}
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor={entry.color}
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={skillDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        value > 0
                          ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                          : ""
                      }
                      outerRadius={100}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={3}
                    >
                      {skillDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#pie-gradient-${index})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-600">No skill distribution data</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                📈 Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">
                      Total Skills Analyzed
                    </span>
                    <span className="text-2xl font-bold text-blue-900">
                      {totalSkills}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">
                      Average Score
                    </span>
                    <span className="text-2xl font-bold text-green-900">
                      {averageScore}/10
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">
                      Strengths Found
                    </span>
                    <span className="text-2xl font-bold text-purple-900">
                      {analysisResult.strengths?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700 font-medium">
                      Areas to Improve
                    </span>
                    <span className="text-2xl font-bold text-orange-900">
                      {analysisResult.missingSkills?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeChart === "skills" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              🎯 Top 10 Skills Performance
            </h3>
            {topSkillsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={topSkillsData}
                  margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                >
                  <defs>
                    {topSkillsData.map((entry, index) => (
                      <linearGradient
                        key={index}
                        id={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={entry.fill}
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor={entry.fill}
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    strokeOpacity={0.7}
                  />
                  <XAxis
                    dataKey="skill"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    stroke="#666"
                    fontWeight="500"
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#666"
                    fontSize={11}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}/10`, "Score"]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullSkill || label;
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[8, 8, 0, 0]}
                    stroke="none"
                    fill={(entry, index) => `url(#gradient-${index})`}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-600">No skill data available</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeChart === "categories" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              📈 Category-wise Performance
            </h3>
            {categoryScoresData.length > 0 ? (
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={categoryScoresData}
                  margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                >
                  <defs>
                    {categoryScoresData.map((entry, index) => (
                      <linearGradient
                        key={index}
                        id={`cat-gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={entry.fill}
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor={entry.fill}
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    strokeOpacity={0.7}
                  />
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    stroke="#666"
                    fontWeight="500"
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#666"
                    fontSize={11}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}/10`, "Average Score"]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullCategory || label;
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[8, 8, 0, 0]}
                    stroke="none"
                    fill={(entry, index) => `url(#cat-gradient-${index})`}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <p className="text-gray-600">No category data available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Categories are generated from your skills
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeChart === "competency" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              🎪 Competency Radar Analysis
            </h3>
            {competencyRadarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart data={competencyRadarData}>
                  <defs>
                    <linearGradient
                      id="radarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                      <stop
                        offset="100%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <PolarGrid
                    stroke="#e5e7eb"
                    strokeWidth={1}
                    gridType="polygon"
                  />
                  <PolarAngleAxis
                    dataKey="area"
                    tick={{ fontSize: 12, fill: "#666", fontWeight: "500" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 10]}
                    tick={{ fontSize: 10, fill: "#666" }}
                    tickCount={6}
                    axisLine={false}
                  />
                  <Radar
                    name="Competency"
                    dataKey="score"
                    stroke="#8B5CF6"
                    fill="url(#radarGradient)"
                    strokeWidth={3}
                    dot={{
                      fill: "#8B5CF6",
                      strokeWidth: 2,
                      r: 5,
                      stroke: "#fff",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(1)}/10`, "Score"]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullArea || label;
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎪</div>
                  <p className="text-gray-600">No competency data available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Competency radar is generated from your skill categories
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            💪 Key Strengths
            <span className="ml-2 bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
              {analysisResult.strengths?.length || 0}
            </span>
          </h3>
          <div className="space-y-3">
            {analysisResult.strengths?.slice(0, 6).map((strength, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-800 font-medium">{strength}</span>
              </div>
            )) || (
              <p className="text-green-700">No specific strengths identified</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
          <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
            🎯 Improvement Areas
            <span className="ml-2 bg-red-200 text-red-800 px-2 py-1 rounded-full text-sm">
              {analysisResult.missingSkills?.length || 0}
            </span>
          </h3>
          <div className="space-y-3">
            {analysisResult.missingSkills?.slice(0, 6).map((skill, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-800 font-medium">{skill}</span>
              </div>
            )) || <p className="text-red-700">No missing skills identified</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTab;
