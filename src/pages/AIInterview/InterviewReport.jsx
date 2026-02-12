import { useNavigate, useParams } from 'react-router-dom';
import { Download, Home, RotateCcw, TrendingUp, TrendingDown, Award, MessageCircle, Code, Zap, Loader2, AlertCircle, Share2, CheckCircle, XCircle, User, Briefcase, Clock, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Layout } from '../../components';
import interviewService from '../../services/interviewService';
import jsPDF from 'jspdf';
import { QACard, RoundAnalysis, SkippedRoundBanner } from '../../components/ReportComponents';

const InterviewReport = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [activeRound, setActiveRound] = useState(0); // For round tabs

  // Fetch report on mount
  useEffect(() => {
    const fetchReport = async () => {
      // Use sessionId from URL
      const savedData = localStorage.getItem('interviewSessionData');

      if (savedData) {
        try {
          setSessionData(JSON.parse(savedData));
        } catch (e) {
          console.error('Failed to parse session data');
        }
      }

      if (!sessionId) {
        setError('No active interview session found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await interviewService.generateReport(sessionId);

        if (response.success) {
          setReportData(response.data.report);
          // Clear session data after report is generated
          localStorage.removeItem('interviewSessionId');
          localStorage.removeItem('interviewSessionData');
        } else {
          throw new Error(response.message || 'Failed to generate report');
        }
      } catch (err) {
        console.error('Report generation error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to generate report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]); // Re-fetch when sessionId changes

  // Animate score on data load
  useEffect(() => {
    if (!reportData?.overallScore) return;

    let current = 0;
    const interval = setInterval(() => {
      if (current < reportData.overallScore) {
        current += 2;
        setAnimatedScore(Math.min(current, reportData.overallScore));
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [reportData?.overallScore]);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-blue-500 to-cyan-500';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getHiringBadge = (hiringRecommendation) => {
    const decisionRaw = hiringRecommendation?.decision || '';
    const decision = decisionRaw.toLowerCase().replace(/[_-]+/g, ' ').trim();
    if (decision.includes('no hire') || decision.includes('not hire')) {
      return { color: 'red', icon: XCircle, text: 'No Hire' };
    }
    if (decision.includes('strong hire') || decision.includes('strongly recommend')) {
      return { color: 'green', icon: CheckCircle, text: 'Strong Hire' };
    }
    if (decision.includes('hire') || decision.includes('recommend')) {
      return { color: 'blue', icon: CheckCircle, text: 'Hire' };
    }
    if (decision.includes('maybe') || decision.includes('consider')) {
      return { color: 'yellow', icon: AlertCircle, text: 'Maybe' };
    }
    return { color: 'red', icon: XCircle, text: 'No Hire' };
  };

  // Download PDF function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 18;

    const today = new Date().toLocaleDateString();
    const hiringBadge = getHiringBadge(reportData.hiringRecommendation);
    const roundList = reportData.rounds || reportData.roundPerformance || [];
    const improvements = reportData.improvementsNeeded || reportData.weaknesses || [];

    const checkPageBreak = (requiredSpace = 20) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage();
        drawPageFrame();
        yPos = 18;
        return true;
      }
      return false;
    };

    const drawPageFrame = () => {
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.6);
      doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 4, 4);
    };

    const sectionTitle = (title, color = [37, 99, 235]) => {
      checkPageBreak(12);
      doc.setFontSize(12);
      doc.setTextColor(...color);
      doc.text(title, margin, yPos);
      yPos += 6;
    };

    const card = (height, x = margin, width = contentWidth) => {
      checkPageBreak(height + 8);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.roundedRect(x, yPos, width, height, 3, 3, 'FD');
    };

    drawPageFrame();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, yPos, contentWidth, 22, 3, 3, 'F');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('XALORA', margin + 8, yPos + 14);
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text('AI Interview Report', pageWidth - margin - 8, yPos + 14, { align: 'right' });
    // Simple logo mark
    doc.setDrawColor(99, 102, 241);
    doc.setFillColor(99, 102, 241);
    doc.circle(pageWidth - margin - 60, yPos + 11, 3, 'F');
    doc.setFillColor(16, 185, 129);
    doc.circle(pageWidth - margin - 50, yPos + 11, 3, 'F');
    // Watermark
    doc.setTextColor(230, 235, 241);
    doc.setFontSize(40);
    doc.text('XALORA', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 30 });
    yPos += 30;

    // Candidate summary card
    card(36);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Candidate Summary', margin + 8, yPos + 11);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Name: ${displayCandidateName || 'N/A'}`, margin + 8, yPos + 21);
    doc.text(`Position: ${displayPosition || 'N/A'}`, margin + 8, yPos + 29);
    doc.text(`Date: ${today}`, pageWidth - margin - 8, yPos + 21, { align: 'right' });
    yPos += 44;

    // Score and Decision row
    checkPageBreak(34);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, 30, 3, 3, 'FD');
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text('Overall Score', margin + 8, yPos + 11);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129);
    doc.text(`${reportData.overallScore || 0}/100`, margin + 8, yPos + 23);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text('Decision', pageWidth - margin - 60, yPos + 11);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(
      hiringBadge.color === 'green' ? 16 : hiringBadge.color === 'blue' ? 37 : hiringBadge.color === 'yellow' ? 234 : 239,
      hiringBadge.color === 'green' ? 185 : hiringBadge.color === 'blue' ? 99 : hiringBadge.color === 'yellow' ? 179 : 68,
      hiringBadge.color === 'green' ? 129 : hiringBadge.color === 'blue' ? 235 : hiringBadge.color === 'yellow' ? 8 : 68
    );
    doc.text(hiringBadge.text, pageWidth - margin - 8, yPos + 23, { align: 'right' });
    yPos += 40;

    // Hiring recommendation
    sectionTitle('Hiring Recommendation');
    card(36);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const hiringReason = reportData.hiringRecommendation?.reason || reportData.hiringRecommendation?.reasoning || 'No recommendation notes available.';
    const reasonLines = doc.splitTextToSize(hiringReason, contentWidth - 16);
    doc.text(reasonLines, margin + 8, yPos + 12);
    yPos += 44;

    // Round-wise performance
    sectionTitle('Round-wise Performance');
    if (roundList.length > 0) {
      roundList.forEach((round) => {
        card(16);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        const label = round.roundName || round.roundType || 'Round';
        doc.text(label, margin + 8, yPos + 11);
        doc.setTextColor(71, 85, 105);
        doc.text(`${round.score || 0}/100`, pageWidth - margin - 8, yPos + 11, { align: 'right' });
        yPos += 22;
      });
    } else {
      card(16);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('No round data available.', margin + 8, yPos + 11);
      yPos += 22;
    }

    // Two-column: Strengths and Areas for Improvement
    sectionTitle('Strengths and Improvements');
    const columnGap = 6;
    const columnWidth = (contentWidth - columnGap) / 2;
    card(38, margin, columnWidth);
    card(38, margin + columnWidth + columnGap, columnWidth);

    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text('Strengths', margin + 6, yPos + 10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(30, 41, 59);
    if (reportData.strengths && reportData.strengths.length > 0) {
      reportData.strengths.slice(0, 4).forEach((strength, index) => {
        const line = `${index + 1}. ${strength}`;
        const lines = doc.splitTextToSize(line, columnWidth - 12);
        doc.text(lines, margin + 6, yPos + 18 + index * 6);
      });
    } else {
      doc.text('No strengths recorded.', margin + 6, yPos + 20);
    }

    doc.setFont(undefined, 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('Improvements', margin + columnWidth + columnGap + 6, yPos + 10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(30, 41, 59);
    if (improvements.length > 0) {
      improvements.slice(0, 4).forEach((weakness, index) => {
        const line = `${index + 1}. ${weakness}`;
        const lines = doc.splitTextToSize(line, columnWidth - 12);
        doc.text(lines, margin + columnWidth + columnGap + 6, yPos + 18 + index * 6);
      });
    } else {
      doc.text('No improvement areas recorded.', margin + columnWidth + columnGap + 6, yPos + 20);
    }
    yPos += 46;

    // Recommendations
    sectionTitle('Recommendations');
    card(32);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    if (reportData.recommendations && reportData.recommendations.length > 0) {
      reportData.recommendations.slice(0, 6).forEach((rec, index) => {
        const line = `${index + 1}. ${rec}`;
        const lines = doc.splitTextToSize(line, contentWidth - 16);
        doc.text(lines, margin + 8, yPos + 10 + index * 6);
      });
    } else {
      doc.text('No recommendations available.', margin + 8, yPos + 12);
    }
    yPos += 40;

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${i} of ${totalPages} | Generated by Xalora AI Interview`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    const fileName = `Interview_Report_${sessionData?.candidateInfo?.name || 'Candidate'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // Radar Chart Component
  const RadarChart = ({ skills }) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) return null;

    const maxScore = 100;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Grid circles */}
          {[1, 2, 3, 4, 5].map((i) => (
            <circle
              key={`grid-${i}`}
              cx="100"
              cy="100"
              r={(i * 100) / 5}
              fill="none"
              stroke="rgba(100, 200, 255, 0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Skill polygons */}
          <polygon
            points={skills
              .map((skill, i) => {
                const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
                const value = skill.confidence || 0;
                const radius = (value / maxScore) * 80;
                const x = 100 + radius * Math.cos(angle);
                const y = 100 + radius * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(' ')}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
          />

          {/* Skill labels */}
          {skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
            const x = 100 + 95 * Math.cos(angle);
            const y = 100 + 95 * Math.sin(angle);
            const shortName = (skill.skill || 'Unknown').split(' ')[0].substring(0, 8);
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-slate-400"
              >
                {shortName}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Generating Your Report...</h2>
            <p className="text-sm sm:text-base text-gray-400">Our AI is analyzing your interview performance</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Error Generating Report</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/ai-interview/setup')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // No data state
  if (!reportData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No Report Available</h2>
            <p className="text-gray-400 mb-6">Please complete an interview first to view your report.</p>
            <button
              onClick={() => navigate('/ai-interview/setup')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
            >
              Start Interview
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const hiringBadge = getHiringBadge(reportData.hiringRecommendation);
  const HiringIcon = hiringBadge.icon;
  const displayCandidateName =
    reportData?.candidateInfo?.name || sessionData?.candidateInfo?.name || 'Candidate';
  const displayPosition =
    reportData?.position || sessionData?.position || 'Position';

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Interview Report 📊</h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400 text-sm sm:text-base">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{displayCandidateName}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{displayPosition}</span>
                  </span>
                </div>
              </div>
              <div className="w-full lg:w-auto lg:text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-white font-semibold text-sm sm:text-base">{new Date().toLocaleDateString()}</span>
                </div>

                {/* Hiring Recommendation Badge */}
                <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-${hiringBadge.color}-500/20 border border-${hiringBadge.color}-500/30`}>
                  <HiringIcon className={`w-4 h-4 sm:w-5 sm:h-5 text-${hiringBadge.color}-400`} />
                  <span className={`font-bold text-sm sm:text-base text-${hiringBadge.color}-400`}>{hiringBadge.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Score Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Score Circle */}
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="rgba(100, 116, 139, 0.2)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(animatedScore / 100) * 565.48} 565.48`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 0.5s ease' }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-white">{animatedScore}</div>
                    <div className="text-slate-400 text-sm">/100</div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Overall Performance</h2>
                  <p className="text-slate-300">
                    {reportData.overallScore >= 85
                      ? '🎉 Excellent! You demonstrated outstanding technical skills and communication abilities.'
                      : reportData.overallScore >= 70
                        ? '👍 Good performance! You showed solid skills with room for improvement.'
                        : reportData.overallScore >= 50
                          ? '💪 Decent effort. Focus on the improvement areas to enhance your skills.'
                          : '📚 Keep practicing. Review the recommendations to improve.'}
                  </p>
                </div>

                {/* Round Scores */}
                {reportData.roundAnalysis && (
                  <div className="space-y-3">
                    {reportData.roundAnalysis.map((round, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-slate-300 capitalize">{round.roundType?.replace('_', ' ')}</span>
                        <span className={`font-semibold ${getScoreColor(round.score)}`}>
                          {round.score || 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Analysis & Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Radar Chart */}
            {reportData.skillAssessment && Array.isArray(reportData.skillAssessment) && reportData.skillAssessment.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Skills Analysis</h2>
                <RadarChart skills={reportData.skillAssessment} />
              </div>
            )}

            {/* Skill Bars */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Detailed Breakdown</h2>
              <div className="space-y-4">
                {reportData.skillAssessment && Array.isArray(reportData.skillAssessment) && reportData.skillAssessment.map((skillItem, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 font-medium">{skillItem.skill}</span>
                      <span className={`font-bold ${getScoreColor(skillItem.confidence || 0)}`}>{skillItem.confidence || 0}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getScoreBg(skillItem.confidence || 0)} rounded-full transition-all duration-1000`}
                        style={{ width: `${skillItem.confidence || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skipped Rounds Banner */}
          <SkippedRoundBanner skippedRounds={reportData.skippedRounds} />

          {/* Round-wise Performance */}
          {reportData.rounds && reportData.rounds.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Round-wise Performance</h2>

              {/* Round Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {reportData.rounds.map((round, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveRound(idx)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeRound === idx
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                  >
                    {round.roundName}
                    <span className="ml-2 text-sm opacity-75">({round.score}/100)</span>
                  </button>
                ))}
              </div>

              {/* Active Round Content */}
              {reportData.rounds[activeRound] && (
                <div>
                  {/* Round Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                    <div>
                      <h3 className="text-xl font-bold text-white">{reportData.rounds[activeRound].roundName}</h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {reportData.rounds[activeRound].questionsAnswered} / {reportData.rounds[activeRound].questionsAsked} questions answered
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Round Score</p>
                      <p className="text-3xl font-bold text-blue-400">{reportData.rounds[activeRound].score}/100</p>
                    </div>
                  </div>

                  {/* Q&A Cards */}
                  {reportData.rounds[activeRound].qaDetails && reportData.rounds[activeRound].qaDetails.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Questions & Answers</h4>
                      {reportData.rounds[activeRound].qaDetails.map((qa, idx) => (
                        <QACard key={idx} qa={qa} index={idx} />
                      ))}
                    </div>
                  )}

                  {/* Round Analysis */}
                  {reportData.rounds[activeRound].roundAnalysis && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Round Analysis</h4>
                      <RoundAnalysis analysis={reportData.rounds[activeRound].roundAnalysis} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Overall Analysis */}
          {reportData.overallAnalysis && (
            <div className="bg-slate-800/50 rounded-2xl p-8 mb-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Overall Analysis</h2>
              <RoundAnalysis analysis={reportData.overallAnalysis} />
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl shadow-2xl p-8 border border-green-700/30">
              <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Strengths
              </h2>
              <ul className="space-y-3">
                {reportData.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-400 text-xl mt-1">✓</span>
                    <span className="text-slate-300">{strength}</span>
                  </li>
                )) || <li className="text-slate-400">No strengths identified yet</li>}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 rounded-2xl shadow-2xl p-8 border border-orange-700/30">
              <h2 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-2">
                <TrendingDown className="w-6 h-6" />
                Areas to Improve
              </h2>
              <ul className="space-y-3">
                {reportData.improvementsNeeded?.map((weakness, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-orange-400 text-xl mt-1">⚠</span>
                    <span className="text-slate-300">{weakness}</span>
                  </li>
                )) || <li className="text-slate-400">No improvements identified yet</li>}
              </ul>
            </div>
          </div>

          {/* AI Feedback & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* AI Feedback */}
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-2xl shadow-2xl p-8 border border-blue-700/30">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                AI Feedback
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {reportData.overallFeedback || 'No feedback available'}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl shadow-2xl p-8 border border-purple-700/30">
              <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Recommendations
              </h2>
              <ul className="space-y-3">
                {reportData.recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-purple-400 text-lg">→</span>
                    <span className="text-slate-300">{rec}</span>
                  </li>
                )) || <li className="text-slate-400">No recommendations available</li>}
              </ul>
            </div>
          </div>

          {/* Round Details */}
          {reportData.roundAnalysis && reportData.roundAnalysis.length > 0 && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 mb-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Round-by-Round Analysis
              </h2>
              <div className="space-y-6">
                {reportData.roundAnalysis.map((round, idx) => (
                  <div key={idx} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white capitalize">
                        Round {idx + 1}: {round.roundType?.replace('_', ' ')}
                      </h3>
                      <span className={`px-3 py-1 rounded-full font-bold ${round.score >= 80 ? 'bg-green-500/20 text-green-400' :
                        round.score >= 60 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                        {round.score || 0}/100
                      </span>
                    </div>
                    <p className="text-slate-300">{round.feedback || 'No feedback for this round'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => navigate('/ai-interview/setup')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Interview
            </button>
            <button
              onClick={() => {
                // TODO: Implement share functionality
                alert('Share feature coming soon!');
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <Share2 className="w-5 h-5" />
              Share Report
            </button>
            <button
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewReport;
