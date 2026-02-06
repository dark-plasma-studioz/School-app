import React, { useState, useEffect, useRef } from 'react';
import { Calendar, BookOpen, CheckSquare, HelpCircle, Settings, Plus, Home, ChevronRight, Clock, AlertCircle, Camera, Send, X, Edit, Trash2, Bell, BellOff, MessageSquare, Upload, FileText, Image as ImageIcon, Repeat } from 'lucide-react';

const NorthernSchoolApp = () => {
  const [currentView, setCurrentView] = useState('grade-select');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  
  // Data states
  const [assignments, setAssignments] = useState({});
  const [questions, setQuestions] = useState({});
  const [lessons, setLessons] = useState({});
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showGlobalChatModal, setShowGlobalChatModal] = useState(false);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState({});
  const [globalChatMessages, setGlobalChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // OpenAI API key from environment
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Subject colors
  const subjectColors = {
    'English': { bg: 'bg-blue-900', border: 'border-blue-600', text: 'text-blue-400', light: 'bg-blue-800' },
    'Mathematics': { bg: 'bg-purple-900', border: 'border-purple-600', text: 'text-purple-400', light: 'bg-purple-800' },
    'Science': { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-400', light: 'bg-green-800' },
    'Physics': { bg: 'bg-cyan-900', border: 'border-cyan-600', text: 'text-cyan-400', light: 'bg-cyan-800' },
    'Chemistry': { bg: 'bg-teal-900', border: 'border-teal-600', text: 'text-teal-400', light: 'bg-teal-800' },
    'Biology': { bg: 'bg-emerald-900', border: 'border-emerald-600', text: 'text-emerald-400', light: 'bg-emerald-800' },
    'History': { bg: 'bg-amber-900', border: 'border-amber-600', text: 'text-amber-400', light: 'bg-amber-800' },
    'Geography': { bg: 'bg-lime-900', border: 'border-lime-600', text: 'text-lime-400', light: 'bg-lime-800' },
    'French': { bg: 'bg-rose-900', border: 'border-rose-600', text: 'text-rose-400', light: 'bg-rose-800' },
    'Spanish': { bg: 'bg-orange-900', border: 'border-orange-600', text: 'text-orange-400', light: 'bg-orange-800' },
    'Art': { bg: 'bg-pink-900', border: 'border-pink-600', text: 'text-pink-400', light: 'bg-pink-800' },
    'Music': { bg: 'bg-fuchsia-900', border: 'border-fuchsia-600', text: 'text-fuchsia-400', light: 'bg-fuchsia-800' },
    'Drama': { bg: 'bg-violet-900', border: 'border-violet-600', text: 'text-violet-400', light: 'bg-violet-800' },
    'Physical Education': { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-400', light: 'bg-red-800' },
    'Computer Science': { bg: 'bg-indigo-900', border: 'border-indigo-600', text: 'text-indigo-400', light: 'bg-indigo-800' },
    'Business': { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-400', light: 'bg-yellow-800' },
    'Civics': { bg: 'bg-slate-900', border: 'border-slate-600', text: 'text-slate-400', light: 'bg-slate-800' },
    'Careers': { bg: 'bg-zinc-900', border: 'border-zinc-600', text: 'text-zinc-400', light: 'bg-zinc-800' },
  };

  const gradeSubjects = {
    9: ['English', 'Mathematics', 'Science', 'Geography', 'French', 'Art', 'Music', 'Drama', 'Physical Education', 'Computer Science'],
    10: ['English', 'Mathematics', 'Science', 'History', 'French', 'Spanish', 'Art', 'Music', 'Drama', 'Physical Education', 'Computer Science', 'Business', 'Civics', 'Careers'],
    11: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'French', 'Spanish', 'Art', 'Music', 'Drama', 'Physical Education', 'Computer Science', 'Business'],
    12: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'French', 'Spanish', 'Art', 'Music', 'Drama', 'Physical Education', 'Computer Science', 'Business']
  };

  // Load saved data
  useEffect(() => {
    const savedGrade = localStorage.getItem('selectedGrade');
    const savedSubjects = localStorage.getItem('selectedSubjects');
    const savedAssignments = localStorage.getItem('assignments');
    const savedQuestions = localStorage.getItem('questions');
    const savedLessons = localStorage.getItem('lessons');
    const savedEvents = localStorage.getItem('calendarEvents');
    const savedChatMessages = localStorage.getItem('chatMessages');
    const savedGlobalChat = localStorage.getItem('globalChatMessages');
    
    if (savedGrade && savedSubjects) {
      setSelectedGrade(parseInt(savedGrade));
      setSelectedSubjects(JSON.parse(savedSubjects));
      setIsFirstLaunch(false);
      setCurrentView('home');
    }
    
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    if (savedLessons) setLessons(JSON.parse(savedLessons));
    if (savedEvents) setCalendarEvents(JSON.parse(savedEvents));
    if (savedChatMessages) setChatMessages(JSON.parse(savedChatMessages));
    if (savedGlobalChat) setGlobalChatMessages(JSON.parse(savedGlobalChat));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (assignments && Object.keys(assignments).length > 0) {
      localStorage.setItem('assignments', JSON.stringify(assignments));
    }
  }, [assignments]);

  useEffect(() => {
    if (questions && Object.keys(questions).length > 0) {
      localStorage.setItem('questions', JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    if (lessons && Object.keys(lessons).length > 0) {
      localStorage.setItem('lessons', JSON.stringify(lessons));
    }
  }, [lessons]);

  useEffect(() => {
    if (calendarEvents.length > 0) {
      localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    }
  }, [calendarEvents]);

  useEffect(() => {
    if (chatMessages && Object.keys(chatMessages).length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  useEffect(() => {
    if (globalChatMessages.length > 0) {
      localStorage.setItem('globalChatMessages', JSON.stringify(globalChatMessages));
    }
  }, [globalChatMessages]);

  // OpenAI API call
  const callOpenAI = async (messages, systemPrompt) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  };

  // Vision API for image analysis
  const analyzeImage = async (imageBase64) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Please analyze this lesson content and provide a detailed summary of the key concepts, topics covered, and important information.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Vision API Error:', error);
      return 'Error analyzing image. Please try again.';
    }
  };

  // Subject chatbot handler
  const handleSubjectChat = async (subject, message) => {
    const subjectContext = lessons[subject] || [];
    const lessonContext = subjectContext.map(l => l.content).join('\n\n');
    
    const systemPrompt = `You are a helpful tutor for ${subject} at the Grade ${selectedGrade} level. 
    You have access to the following lesson materials: ${lessonContext}
    Help the student understand concepts, answer questions, and provide explanations in a clear, educational manner.`;

    const currentMessages = chatMessages[subject] || [];
    const allMessages = [
      ...currentMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const response = await callOpenAI(allMessages, systemPrompt);

    const updatedMessages = [
      ...currentMessages,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: response, timestamp: new Date().toISOString() }
    ];

    setChatMessages(prev => ({
      ...prev,
      [subject]: updatedMessages
    }));

    return response;
  };

  // Global chatbot handler
  const handleGlobalChat = async (message) => {
    const assignmentContext = Object.entries(assignments).map(([subject, items]) => 
      `${subject}: ${items.map(a => `${a.title} (due: ${a.dueDate})`).join(', ')}`
    ).join('\n');

    const eventContext = calendarEvents.map(e => 
      `${e.title} on ${e.startDate}${e.recurring ? ` (${e.recurring})` : ''}`
    ).join('\n');

    const systemPrompt = `You are a personal assistant helping a Grade ${selectedGrade} student manage their school work at Northern Secondary School.
    Their subjects are: ${selectedSubjects.join(', ')}
    Current assignments: ${assignmentContext}
    Upcoming events: ${eventContext}
    Help them manage their time, organize assignments, set priorities, and stay on track with their studies.`;

    const allMessages = [
      ...globalChatMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const response = await callOpenAI(allMessages, systemPrompt);

    const updatedMessages = [
      ...globalChatMessages,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: response, timestamp: new Date().toISOString() }
    ];

    setGlobalChatMessages(updatedMessages);
    return response;
  };

  // Generate practice questions
  const generatePracticeQuestions = async (subject) => {
    const lessonContext = (lessons[subject] || []).map(l => l.content).join('\n\n');
    
    const systemPrompt = `Generate 5 practice questions for ${subject} at Grade ${selectedGrade} level based on the following lesson content: ${lessonContext}. 
    Make the questions challenging but appropriate for the grade level. Include a mix of multiple choice, short answer, and concept-based questions.`;

    const response = await callOpenAI([], systemPrompt);
    
    const newQuestion = {
      id: Date.now(),
      type: 'generated',
      content: response,
      timestamp: new Date().toISOString()
    };

    setQuestions(prev => ({
      ...prev,
      [subject]: [...(prev[subject] || []), newQuestion]
    }));

    return response;
  };

  // Assignment Modal Component
  const AssignmentModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
      status: 'pending'
    });

    const handleSubmit = () => {
      const newAssignment = {
        id: Date.now(),
        ...formData,
        subject: currentSubject,
        createdAt: new Date().toISOString()
      };

      setAssignments(prev => ({
        ...prev,
        [currentSubject]: [...(prev[currentSubject] || []), newAssignment]
      }));

      setShowAssignmentModal(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        status: 'pending'
      });
    };

    const colors = subjectColors[currentSubject];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className={`${colors.bg} ${colors.border} border-b p-4 flex justify-between items-center`}>
            <h2 className="text-xl font-bold text-white">New Assignment</h2>
            <button onClick={() => setShowAssignmentModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                placeholder="Assignment title"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-24"
                placeholder="Assignment details"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Due Time</label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.dueDate}
              className={`w-full py-3 rounded-lg font-semibold ${
                formData.title && formData.dueDate
                  ? `${colors.bg} ${colors.border} border hover:opacity-90`
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Assignment
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Lesson Upload Modal Component
  const LessonModal = () => {
    const [uploadMethod, setUploadMethod] = useState('camera');
    const [lessonText, setLessonText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsProcessing(true);
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];
        const analysis = await analyzeImage(base64);
        
        const newLesson = {
          id: Date.now(),
          type: 'image',
          content: analysis,
          imageData: event.target.result,
          timestamp: new Date().toISOString()
        };

        setLessons(prev => ({
          ...prev,
          [currentSubject]: [...(prev[currentSubject] || []), newLesson]
        }));

        setIsProcessing(false);
        setShowLessonModal(false);
      };
      reader.readAsDataURL(file);
    };

    const handleTextSubmit = () => {
      const newLesson = {
        id: Date.now(),
        type: 'text',
        content: lessonText,
        timestamp: new Date().toISOString()
      };

      setLessons(prev => ({
        ...prev,
        [currentSubject]: [...(prev[currentSubject] || []), newLesson]
      }));

      setLessonText('');
      setShowLessonModal(false);
    };

    const colors = subjectColors[currentSubject];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full">
          <div className={`${colors.bg} ${colors.border} border-b p-4 flex justify-between items-center`}>
            <h2 className="text-xl font-bold text-white">Upload Lesson</h2>
            <button onClick={() => setShowLessonModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setUploadMethod('camera')}
                className={`flex-1 py-2 rounded ${uploadMethod === 'camera' ? `${colors.bg} ${colors.border} border` : 'bg-gray-700'}`}
              >
                <Camera className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Camera/Upload</span>
              </button>
              <button
                onClick={() => setUploadMethod('text')}
                className={`flex-1 py-2 rounded ${uploadMethod === 'text' ? `${colors.bg} ${colors.border} border` : 'bg-gray-700'}`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Describe</span>
              </button>
            </div>

            {uploadMethod === 'camera' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isProcessing}
                  className={`w-full py-12 border-2 border-dashed rounded-lg ${colors.border} hover:bg-gray-700 transition-colors`}
                >
                  {isProcessing ? (
                    <div className="text-center">
                      <div className="animate-spin mx-auto mb-2 w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                      <div className="text-sm text-gray-400">Analyzing image...</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm text-gray-400">Click to upload or take photo</div>
                    </div>
                  )}
                </button>
              </div>
            )}

            {uploadMethod === 'text' && (
              <div>
                <textarea
                  value={lessonText}
                  onChange={(e) => setLessonText(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white h-48"
                  placeholder="Describe the lesson content, key concepts, or notes..."
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!lessonText.trim()}
                  className={`w-full mt-3 py-3 rounded-lg font-semibold ${
                    lessonText.trim()
                      ? `${colors.bg} ${colors.border} border hover:opacity-90`
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Event Modal Component
  const EventModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      type: 'academic',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      recurring: 'none',
      notification: true,
      notificationMinutes: 30
    });

    const handleSubmit = () => {
      const newEvent = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };

      setCalendarEvents(prev => [...prev, newEvent]);
      
      // Set notification if enabled
      if (formData.notification) {
        scheduleNotification(newEvent);
      }

      setShowEventModal(false);
      setFormData({
        title: '',
        description: '',
        type: 'academic',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        recurring: 'none',
        notification: true,
        notificationMinutes: 30
      });
    };

    const scheduleNotification = (event) => {
      // In a real app, you'd use the Notifications API
      console.log(`Notification scheduled for ${event.title} ${event.notificationMinutes} minutes before`);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-blue-900 border-b border-blue-600 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">New Event</h2>
            <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                placeholder="Event name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-20"
                placeholder="Event details"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Event Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              >
                <option value="academic">Academic</option>
                <option value="extracurricular">Extracurricular</option>
                <option value="sports">Sports</option>
                <option value="club">Club Activity</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Recurring</label>
              <select
                value={formData.recurring}
                onChange={(e) => setFormData({...formData, recurring: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly (Every 2 weeks)</option>
                <option value="monthly">Monthly</option>
                <option value="friday">Every Friday</option>
              </select>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400">Enable Notification</label>
                <button
                  onClick={() => setFormData({...formData, notification: !formData.notification})}
                  className={`p-2 rounded ${formData.notification ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  {formData.notification ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
              </div>

              {formData.notification && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notify me before</label>
                  <select
                    value={formData.notificationMinutes}
                    onChange={(e) => setFormData({...formData, notificationMinutes: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={1440}>1 day</option>
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.startDate}
              className={`w-full py-3 rounded-lg font-semibold ${
                formData.title && formData.startDate
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Subject Chat Modal Component
  const SubjectChatModal = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const currentMessages = chatMessages[currentSubject] || [];
    const colors = subjectColors[currentSubject];

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [currentMessages]);

    const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      setIsLoading(true);
      await handleSubjectChat(currentSubject, input);
      setInput('');
      setIsLoading(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full h-[600px] flex flex-col">
          <div className={`${colors.bg} ${colors.border} border-b p-4 flex justify-between items-center`}>
            <div>
              <h2 className="text-xl font-bold text-white">{currentSubject} Tutor</h2>
              <p className="text-xs text-gray-400">Ask questions about {currentSubject}</p>
            </div>
            <button onClick={() => setShowChatModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Start a conversation with your {currentSubject} tutor</p>
              </div>
            )}
            
            {currentMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? `${colors.bg} ${colors.border} border` 
                    : 'bg-gray-700'
                }`}>
                  <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-lg ${
                  input.trim() && !isLoading
                    ? `${colors.bg} ${colors.border} border hover:opacity-90`
                    : 'bg-gray-700 text-gray-500'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Global Chat Modal Component
  const GlobalChatModal = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [globalChatMessages]);

    const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      setIsLoading(true);
      await handleGlobalChat(input);
      setInput('');
      setIsLoading(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full h-[600px] flex flex-col">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-blue-600 p-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">School Assistant</h2>
              <p className="text-xs text-gray-400">Help with assignments & planning</p>
            </div>
            <button onClick={() => setShowGlobalChatModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {globalChatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Ask me about managing your assignments, deadlines, or study planning</p>
              </div>
            )}
            
            {globalChatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-700'
                }`}>
                  <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for help with your schedule..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-lg ${
                  input.trim() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 text-gray-500'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Grade Selection Screen
  const GradeSelectScreen = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Northern Secondary School</h1>
          <p className="text-gray-400">Select your grade</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[9, 10, 11, 12].map(grade => (
            <button
              key={grade}
              onClick={() => {
                setSelectedGrade(grade);
                setCurrentView('subject-select');
              }}
              className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-blue-600 p-8 rounded-lg transition-all"
            >
              <div className="text-4xl font-bold mb-2">Grade {grade}</div>
              <div className="text-sm text-gray-400">{gradeSubjects[grade].length} subjects available</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Subject Selection Screen
  const SubjectSelectScreen = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6">
      <div className="mb-6">
        <button 
          onClick={() => setCurrentView('grade-select')}
          className="text-blue-400 text-sm mb-4"
        >
          ← Change Grade
        </button>
        <h1 className="text-2xl font-bold mb-1">Grade {selectedGrade} Subjects</h1>
        <p className="text-gray-400">Select your courses for this semester</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3 pb-6">
          {gradeSubjects[selectedGrade].map(subject => {
            const colors = subjectColors[subject];
            const isSelected = selectedSubjects.includes(subject);
            
            return (
              <button
                key={subject}
                onClick={() => setSelectedSubjects(prev => 
                  prev.includes(subject)
                    ? prev.filter(s => s !== subject)
                    : [...prev, subject]
                )}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? `${colors.bg} ${colors.border}`
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-semibold ${isSelected ? colors.text : 'text-white'}`}>
                      {subject}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {isSelected ? 'Selected' : 'Tap to select'}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded border-2 ${
                    isSelected 
                      ? `${colors.border} ${colors.light}` 
                      : 'border-gray-600'
                  }`}>
                    {isSelected && <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <div className="text-sm text-gray-500 mb-3 text-center">
          {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
        </div>
        <button
          onClick={() => {
            if (selectedSubjects.length > 0) {
              localStorage.setItem('selectedGrade', selectedGrade);
              localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
              setIsFirstLaunch(false);
              setCurrentView('home');
            }
          }}
          disabled={selectedSubjects.length === 0}
          className={`w-full py-4 rounded-lg font-semibold transition-all ${
            selectedSubjects.length > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );

  // Home Dashboard
  const HomeScreen = () => {
    const upcomingAssignments = Object.values(assignments).flat().filter(a => {
      const dueDate = new Date(a.dueDate);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return dueDate <= weekFromNow && a.status !== 'completed';
    }).length;

    const totalQuestions = Object.values(questions).flat().length;

    return (
      <div className="bg-gray-900 text-white p-6 pb-24">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-400">Grade {selectedGrade} • Northern Secondary</p>
          </div>
          <button
            onClick={() => setShowGlobalChatModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg hover:opacity-90"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-700">
            <div className="text-blue-300 text-sm mb-1">Due This Week</div>
            <div className="text-3xl font-bold">{upcomingAssignments}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-4 rounded-lg border border-purple-700">
            <div className="text-purple-300 text-sm mb-1">Study Questions</div>
            <div className="text-3xl font-bold">{totalQuestions}</div>
          </div>
        </div>

        {/* My Subjects */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">My Subjects</h2>
          <div className="space-y-3">
            {selectedSubjects.map(subject => {
              const colors = subjectColors[subject];
              const subjectAssignments = (assignments[subject] || []).length;
              const subjectQuestions = (questions[subject] || []).length;
              
              return (
                <button
                  key={subject}
                  onClick={() => {
                    setCurrentSubject(subject);
                    setCurrentView('subject-detail');
                  }}
                  className={`w-full ${colors.bg} border ${colors.border} p-4 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className={`w-5 h-5 ${colors.text}`} />
                      <div className="text-left">
                        <div className="font-semibold">{subject}</div>
                        <div className="text-xs text-gray-400">{subjectAssignments} assignments • {subjectQuestions} questions</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${colors.text}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Upcoming Deadlines</h2>
          {upcomingAssignments > 0 ? (
            <div className="space-y-2">
              {Object.entries(assignments).map(([subject, items]) => 
                items.filter(a => {
                  const dueDate = new Date(a.dueDate);
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return dueDate <= weekFromNow && a.status !== 'completed';
                }).map(assignment => {
                  const colors = subjectColors[subject];
                  return (
                    <div key={assignment.id} className={`${colors.light} border ${colors.border} p-3 rounded-lg`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{assignment.title}</div>
                          <div className="text-xs text-gray-400">{subject}</div>
                        </div>
                        <div className="text-xs text-gray-400">{new Date(assignment.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div>No upcoming deadlines</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Subject Detail View
  const SubjectDetailScreen = () => {
    const colors = subjectColors[currentSubject];
    const [activeTab, setActiveTab] = useState('assignments');
    const [generatingQuestions, setGeneratingQuestions] = useState(false);

    const subjectAssignments = assignments[currentSubject] || [];
    const subjectQuestions = questions[currentSubject] || [];
    const subjectLessons = lessons[currentSubject] || [];

    const completedCount = subjectAssignments.filter(a => a.status === 'completed').length;
    const inProgressCount = subjectAssignments.filter(a => a.status === 'in-progress').length;
    const overdueCount = subjectAssignments.filter(a => {
      if (a.status === 'completed') return false;
      return new Date(a.dueDate) < new Date();
    }).length;

    const handleGenerateQuestions = async () => {
      setGeneratingQuestions(true);
      await generatePracticeQuestions(currentSubject);
      setGeneratingQuestions(false);
    };

    const deleteAssignment = (id) => {
      setAssignments(prev => ({
        ...prev,
        [currentSubject]: prev[currentSubject].filter(a => a.id !== id)
      }));
    };

    const toggleAssignmentStatus = (id) => {
      setAssignments(prev => ({
        ...prev,
        [currentSubject]: prev[currentSubject].map(a => 
          a.id === id 
            ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' }
            : a
        )
      }));
    };

    return (
      <div className="bg-gray-900 text-white pb-24">
        {/* Header */}
        <div className={`${colors.bg} border-b ${colors.border} p-6`}>
          <button 
            onClick={() => setCurrentView('home')}
            className={`${colors.text} text-sm mb-4 flex items-center gap-1`}
          >
            ← Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-1">{currentSubject}</h1>
              <p className="text-gray-400">Grade {selectedGrade}</p>
            </div>
            <button
              onClick={() => {
                setShowChatModal(true);
              }}
              className={`${colors.light} border ${colors.border} p-2 rounded-lg hover:opacity-90`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 flex gap-6">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-4 border-b-2 transition-colors ${
              activeTab === 'assignments'
                ? `${colors.border} ${colors.text}`
                : 'border-transparent text-gray-400'
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`py-4 border-b-2 transition-colors ${
              activeTab === 'learning'
                ? `${colors.border} ${colors.text}`
                : 'border-transparent text-gray-400'
            }`}
          >
            Learning Support
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Assignment Tracker</h2>
                <button 
                  onClick={() => setShowAssignmentModal(true)}
                  className={`${colors.bg} ${colors.border} border px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Assignment</span>
                </button>
              </div>

              {/* Assignment List */}
              <div className="space-y-3 mb-6">
                {subjectAssignments.length === 0 ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center text-gray-500">
                    <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div>No assignments yet</div>
                    <div className="text-sm mt-1">Add your first assignment to start tracking</div>
                  </div>
                ) : (
                  subjectAssignments.map(assignment => (
                    <div key={assignment.id} className={`${colors.light} border ${colors.border} rounded-lg p-4`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleAssignmentStatus(assignment.id)}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                              assignment.status === 'completed'
                                ? `${colors.border} ${colors.bg}`
                                : 'border-gray-500'
                            }`}
                          >
                            {assignment.status === 'completed' && <span className="text-white text-xs">✓</span>}
                          </button>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${assignment.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                              {assignment.title}
                            </h3>
                            {assignment.description && (
                              <p className="text-sm text-gray-400 mt-1">{assignment.description}</p>
                            )}
                            <div className="flex gap-3 mt-2 text-xs text-gray-400">
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              {assignment.dueTime && <span>{assignment.dueTime}</span>}
                              <span className={`px-2 py-0.5 rounded ${
                                assignment.priority === 'high' ? 'bg-red-900 text-red-400' :
                                assignment.priority === 'medium' ? 'bg-yellow-900 text-yellow-400' :
                                'bg-green-900 text-green-400'
                              }`}>
                                {assignment.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteAssignment(assignment.id)}
                          className="text-gray-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Assignment Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{completedCount}</div>
                  <div className="text-xs text-gray-400 mt-1">Completed</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{inProgressCount}</div>
                  <div className="text-xs text-gray-400 mt-1">In Progress</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{overdueCount}</div>
                  <div className="text-xs text-gray-400 mt-1">Overdue</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div>
              {/* Upload Lessons */}
              <div className={`${colors.light} border ${colors.border} rounded-lg p-4 mb-6`}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Lesson Content
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Take a photo or describe lesson content for AI-powered study support
                </p>
                <button 
                  onClick={() => setShowLessonModal(true)}
                  className={`${colors.bg} ${colors.border} border px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 w-full justify-center`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Lesson</span>
                </button>
              </div>

              {/* Lessons List */}
              {subjectLessons.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">My Lessons ({subjectLessons.length})</h3>
                  <div className="space-y-2">
                    {subjectLessons.map(lesson => (
                      <div key={lesson.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          {lesson.type === 'image' ? (
                            <ImageIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 line-clamp-2">{lesson.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lesson.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Practice Questions */}
              <div className={`${colors.light} border ${colors.border} rounded-lg p-4 mb-6`}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Generate Practice Questions
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Get AI-generated questions based on your lesson content
                </p>
                <button 
                  onClick={handleGenerateQuestions}
                  disabled={generatingQuestions || subjectLessons.length === 0}
                  className={`${colors.bg} ${colors.border} border px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 w-full justify-center ${
                    subjectLessons.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {generatingQuestions ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="text-sm">Generating...</span>
                    </>
                  ) : (
                    <span className="text-sm">Generate Questions</span>
                  )}
                </button>
                {subjectLessons.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">Add lesson content first to generate questions</p>
                )}
              </div>

              {/* Questions List */}
              <div>
                <h3 className="font-semibold mb-3">Study Questions ({subjectQuestions.length})</h3>
                {subjectQuestions.length === 0 ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center text-gray-500">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div>No questions saved yet</div>
                    <div className="text-sm mt-1">Generate questions to start studying</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subjectQuestions.map(question => (
                      <div key={question.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                            {question.type === 'generated' ? 'AI Generated' : 'Manual'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(question.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{question.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calendar Screen
  const CalendarScreen = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    const getEventsForDate = (day) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return calendarEvents.filter(event => event.startDate === dateStr);
    };

    return (
      <div className="bg-gray-900 text-white p-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <button
            onClick={() => setShowEventModal(true)}
            className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
          <div className="text-center text-gray-400 mb-4 font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-gray-500 font-semibold p-2">{day}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = day === today.getDate();
              
              return (
                <div key={day} className="relative">
                  <div className={`p-2 hover:bg-gray-700 rounded cursor-pointer aspect-square flex items-center justify-center ${
                    isToday ? 'bg-blue-600 font-bold' : ''
                  }`}>
                    {day}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((_, idx) => (
                        <div key={idx} className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">All Events ({calendarEvents.length})</h2>
          {calendarEvents.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div>No events scheduled</div>
              <div className="text-sm mt-1">Add your first event to get started</div>
            </div>
          ) : (
            <div className="space-y-2">
              {calendarEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map(event => {
                const eventColor = event.type === 'academic' ? 'blue' :
                                 event.type === 'extracurricular' ? 'purple' :
                                 event.type === 'sports' ? 'red' :
                                 event.type === 'club' ? 'green' : 'gray';
                
                return (
                  <div key={event.id} className={`bg-${eventColor}-900 border border-${eventColor}-600 rounded-lg p-3`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          {event.recurring !== 'none' && (
                            <Repeat className="w-3 h-3 text-gray-400" />
                          )}
                          {event.notification && (
                            <Bell className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-400 mb-1">{event.description}</p>
                        )}
                        <div className="text-xs text-gray-400">
                          {new Date(event.startDate).toLocaleDateString()}
                          {event.startTime && ` at ${event.startTime}`}
                          {event.endDate && event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                        </div>
                        {event.recurring !== 'none' && (
                          <div className="text-xs text-gray-500 mt-1">
                            Repeats: {event.recurring}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 bg-${eventColor}-800 rounded`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Settings Screen
  const SettingsScreen = () => (
    <div className="bg-gray-900 text-white p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="font-semibold mb-1">Grade Level</h3>
          <p className="text-sm text-gray-400 mb-2">Currently: Grade {selectedGrade}</p>
          <button 
            onClick={() => setCurrentView('grade-select')}
            className="text-blue-400 text-sm hover:text-blue-300"
          >
            Change Grade →
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="font-semibold mb-1">My Subjects</h3>
          <p className="text-sm text-gray-400 mb-2">{selectedSubjects.length} subjects selected</p>
          <button 
            onClick={() => setCurrentView('subject-select')}
            className="text-blue-400 text-sm hover:text-blue-300"
          >
            Edit Subjects →
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="font-semibold mb-1">Data Summary</h3>
          <div className="text-sm text-gray-400 space-y-1 mt-2">
            <div>Total Assignments: {Object.values(assignments).flat().length}</div>
            <div>Total Questions: {Object.values(questions).flat().length}</div>
            <div>Total Lessons: {Object.values(lessons).flat().length}</div>
            <div>Total Events: {calendarEvents.length}</div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="font-semibold mb-1">School Information</h3>
          <p className="text-sm text-gray-400">Northern Secondary School</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="font-semibold mb-1">App Version</h3>
          <p className="text-sm text-gray-400">Version 2.0.0</p>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'calendar', icon: Calendar, label: 'Calendar' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setCurrentSubject(null);
              setCurrentView(id);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Main render
  return (
    <div className="h-screen bg-gray-900 overflow-hidden max-w-md mx-auto">
      <div className="h-full overflow-y-auto">
        {currentView === 'grade-select' && <GradeSelectScreen />}
        {currentView === 'subject-select' && <SubjectSelectScreen />}
        {currentView === 'home' && <HomeScreen />}
        {currentView === 'subject-detail' && currentSubject && <SubjectDetailScreen />}
        {currentView === 'calendar' && <CalendarScreen />}
        {currentView === 'settings' && <SettingsScreen />}
      </div>
      
      {!isFirstLaunch && currentView !== 'grade-select' && currentView !== 'subject-select' && currentView !== 'subject-detail' && <BottomNav />}
      
      {/* Modals */}
      {showAssignmentModal && <AssignmentModal />}
      {showLessonModal && <LessonModal />}
      {showEventModal && <EventModal />}
      {showChatModal && <SubjectChatModal />}
      {showGlobalChatModal && <GlobalChatModal />}
    </div>
  );
};

export default NorthernSchoolApp;