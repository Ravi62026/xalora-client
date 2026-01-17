import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewLayout from '../../components/AIInterview/InterviewLayout';
import InterviewHeader from '../../components/AIInterview/InterviewHeader';
import ProgressSection from '../../components/AIInterview/ProgressSection';
import VideoSection from '../../components/AIInterview/VideoSection';
import QuestionSection from '../../components/AIInterview/QuestionSection';
import EvaluationInsights from '../../components/AIInterview/EvaluationInsights';
import RoleEvaluation from '../../components/AIInterview/RoleEvaluation';
import FinalSummary from '../../components/AIInterview/FinalSummary';
import InterruptionBanner from '../../components/AIInterview/InterruptionBanner';
import FeedbackMessage from '../../components/AIInterview/FeedbackMessage';
import { getRandomQuestion } from '../../utils/mockInterviewData';

// Suppress unused variable warnings
const _ = []; // placeholder

const InterviewSession = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiStatus, setAiStatus] = useState('speaking');
  const [showInterruption, setShowInterruption] = useState(false);
  const [interruptionMessage, setInterruptionMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [questionData, setQuestionData] = useState(() => getRandomQuestion('technical'));
  const [confidenceScore, setConfidenceScore] = useState(85);
  const [duration, setDuration] = useState('00:00:00');

  const rounds = ['Resume', 'Formal', 'Technical', 'Behavioral', 'System Design'];

  const insights = [
    'Good understanding of sensors and data flow.',
    'Solid knowledge of embedded programming logic for microcontrollers.',
    'Effective data ingestion strategies, but needs more cloud connectivity examples.'
  ];

  const chatTranscript = [
    { role: 'Interviewer', message: 'How would you design a scalable IoT system for smart city streetlights using ESP32, MQTT, and Cloud for data aggregation?', time: '08:00:15' },
    { role: 'Candidate', message: 'I would use ESP32 as the edge device with MQTT protocol for lightweight communication...', time: '08:01:30' },
    { role: 'Interviewer', message: 'Great! What about scalability?', time: '08:03:45' },
    { role: 'Candidate', message: 'Each device can be scaled independently based on demand...', time: '08:05:20' }
  ];

  const roleSkills = [
    { name: 'Sensors & Protocols', score: 88 },
    { name: 'Practical Reasoning', score: 82 },
    { name: 'Problem Solving', score: 85 }
  ];

  const codeAnalysis = `// ESP32 IoT Implementation
void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Read sensor data
  int sensorValue = analogRead(SENSOR_PIN);
  publishData(sensorValue);
}`;

  const summary = 'Overall candidate is a strong fit for a Full Stack IoT Engineer role with a strong foundation in embedded systems and cloud connectivity. Excellent practical reasoning and problem-solving skills. Focus on improving algorithmic problem-solving skills and cloud architecture patterns.';

  useEffect(() => {
    loadQuestion();
    // Update duration every second
    const durationInterval = setInterval(() => {
      setDuration(prev => {
        const [h, m, s] = prev.split(':').map(Number);
        let newS = s + 1;
        let newM = m;
        let newH = h;
        if (newS === 60) {
          newS = 0;
          newM += 1;
        }
        if (newM === 60) {
          newM = 0;
          newH += 1;
        }
        return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(durationInterval);
  }, []);

  const loadQuestion = () => {
    const question = getRandomQuestion('technical');
    setQuestionData(question);
    setTranscript('');
    setAiStatus('speaking');
    setConfidenceScore(Math.floor(Math.random() * 30) + 70);
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleAutoSubmit();
    }
  }, [timeRemaining]);

  const handleAutoSubmit = () => {
    setShowInterruption(true);
    setInterruptionMessage("⏰ Time's up! Moving to next question...");
    setTimeout(() => {
      setShowInterruption(false);
      moveToNextQuestion();
    }, 2000);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setAiStatus('listening');
    setTranscript('');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setAiStatus('thinking');
    
    setTimeout(() => {
      setAiStatus('analyzing');
      simulateTranscript();
    }, 2000);
  };

  // Use the variables to suppress warnings
  const _ = [transcript, aiStatus, confidenceScore, handleStopRecording];

  const simulateTranscript = () => {
    const sampleTranscript = "I would use ESP32 as the edge device with MQTT protocol for lightweight communication. Each device can be scaled independently based on demand...";
    let currentText = '';
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < sampleTranscript.length) {
        currentText += sampleTranscript[index];
        setTranscript(currentText);
        index++;
      } else {
        clearInterval(interval);
        setAiStatus('idle');
        showFeedbackMessage();
      }
    }, 30);
  };

  const showFeedbackMessage = () => {
    setFeedback({
      type: 'excellent',
      message: '✨ Excellent explanation! Great technical depth.'
    });
    
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      setTimeRemaining(300);
      setTranscript('');
      setAiStatus('speaking');
      loadQuestion();
    } else {
      navigate('/ai-interview/report');
    }
  };

  return (
    <InterviewLayout>
      {/* Header */}
      <InterviewHeader
        title="Live Interview: IoT Engineer"
        duration={duration}
        round="Technical Round"
        questionNumber={currentQuestion}
        totalQuestions={totalQuestions}
      />

      {/* Interruption Banner */}
      {showInterruption && (
        <InterruptionBanner message={interruptionMessage} />
      )}

      {/* Feedback Message */}
      {feedback && (
        <FeedbackMessage type={feedback.type} message={feedback.message} />
      )}

      {/* Progress Section */}
      <ProgressSection
        current={currentQuestion}
        total={totalQuestions}
        rounds={rounds}
      />

      {/* Video Section */}
      <VideoSection
        candidateName="John Doe"
        candidateAge="30s"
        duration={duration}
        isRecording={isRecording}
      />

      {/* Question Section */}
      <QuestionSection
        questionNumber={currentQuestion}
        totalQuestions={totalQuestions}
        question={questionData?.question}
        timeRemaining={timeRemaining}
        onStartRecording={handleStartRecording}
        isRecording={isRecording}
      />

      {/* Evaluation Insights */}
      <EvaluationInsights
        insights={insights}
        chatTranscript={chatTranscript}
      />

      {/* Role Evaluation */}
      <RoleEvaluation
        roleSkills={roleSkills}
        codeAnalysis={codeAnalysis}
      />

      {/* Final Summary */}
      <FinalSummary summary={summary} />

      {/* Bottom Padding */}
      <div className="h-6"></div>
    </InterviewLayout>
  );
};

export default InterviewSession;
