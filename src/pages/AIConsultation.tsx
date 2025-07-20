
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare,
  Upload,
  Calendar as LucideCalendar,
  Users,
  Mic,
  MicOff,
  Camera,
  Bot,
  User,
  Send
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';

const AI_BUTTON_COLOR = '#921573';
const BRAND_MAGENTA = '#921573';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';
const BRAND_WHITE = '#FFFFFF';

const mockWorkshops = [
  { id: 'w1', title: 'AI for Crop Disease Detection', date: '2024-08-10', location: 'Accra', spots: 20, image: '/lovable-uploads/webinar.jpg', type: 'webinar' },
  { id: 'w2', title: 'Modern Fish Farming', date: '2024-08-15', location: 'Kumasi', spots: 15, image: '/lovable-uploads/webinar1.jpg', type: 'workshop' },
  { id: 'w3', title: 'Financing Your Farm', date: '2024-08-20', location: 'Tamale', spots: 25, image: '/lovable-uploads/webinar2.jpg', type: 'webinar' },
];

const AIConsultation = () => {
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      message: "Hey, how is it going, how can I assist you. Feel free and let’s have a conversation",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // Form states
  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    location: '',
    challenge: '',
    preferredDate: ''
  });
  
  const [callForm, setCallForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    topics: ''
  });
  
  const [workshopRegistration, setWorkshopRegistration] = useState({
    name: '',
    email: '',
    phone: '',
    workshopId: ''
  });

  const [bookingTab, setBookingTab] = useState<'inperson' | 'virtual'>('inperson');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  // For image analysis upload
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [callDate, setCallDate] = useState<Date | undefined>();

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        message: 'Thank you for your question! Based on your query, I recommend checking for common signs of the issue you mentioned. Could you provide more details about the symptoms you\'re observing?',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Simulate image analysis
        const analysisMessage = {
          type: 'ai',
          message: 'Image uploaded successfully! Analyzing... Based on the image, I can see signs of leaf spot disease. Here are my recommendations: 1) Remove affected leaves immediately, 2) Apply organic fungicide, 3) Ensure proper spacing for air circulation.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, analysisMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVisitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitForm.name || !visitForm.phone || !visitForm.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Visit Requested Successfully!",
      description: "An extension agent will contact you within 24 hours to confirm your visit.",
    });
    
    setVisitForm({ name: '', phone: '', location: '', challenge: '', preferredDate: '' });
  };

  const handleScheduleCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callForm.name || !callForm.email || !callForm.date || !callForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Call Scheduled Successfully!",
      description: `Your virtual consultation is scheduled for ${callForm.date} at ${callForm.time}. Check your email for the meeting link.`,
    });
    
    setCallForm({ name: '', email: '', date: '', time: '', topics: '' });
  };

  const handleWorkshopRegistration = (workshopTitle: string, workshopId: string) => {
    if (!workshopRegistration.name || !workshopRegistration.email || !workshopRegistration.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Registration Successful!",
      description: `You've been registered for "${workshopTitle}". You'll receive a confirmation email shortly.`,
    });
    
    setWorkshopRegistration({ name: '', email: '', phone: '', workshopId: '' });
  };

  // Voice input handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({ title: 'Voice not supported', description: 'Your browser does not support voice input.' });
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    if (!isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-down transition-all duration-700 ease-in-out">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 animate-slide-in-left" style={{ color: BRAND_MAGENTA }}>
              AI Consultation
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
              Get expert advice powered by AI for your farm. Book a session or join a workshop to boost your productivity.
            </p>
          </div>
          <Tabs defaultValue="ai-chat" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-base">
              <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
              <TabsTrigger value="image-analysis">Image Analysis</TabsTrigger>
              <TabsTrigger value="human-consultation">Book Consultation</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
            </TabsList>
            {/* AI Chat Interface */}
            <TabsContent value="ai-chat">
              <Card className="h-[400px] sm:h-[600px] flex flex-col">
                <CardContent className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 sm:py-4 space-y-2 sm:space-y-3 text-xs sm:text-base">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}> 
                      <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.type === 'ai' ? 'bg-green-100 text-gray-900' : 'bg-blue-100 text-gray-900'} text-xs sm:text-base`}>{msg.message}</div>
                    </div>
                  ))}
                </CardContent>
                <div className="flex items-center gap-2 px-2 sm:px-4 py-2 border-t bg-white">
                  <Input
                    className="flex-1 text-xs sm:text-base px-2 py-2"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    type="button"
                    style={{ backgroundColor: AI_BUTTON_COLOR, color: '#fff' }}
                    className={`text-xs sm:text-base px-3 py-2 flex items-center justify-center ${isListening ? 'animate-pulse' : ''}`}
                    onClick={handleVoiceInput}
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className="w-4 h-4 mr-1" /> : <Mic className="w-4 h-4 mr-1" />}
                    {isListening ? 'Listening...' : 'Voice'}
                  </Button>
                  <Button
                    className="text-xs sm:text-base px-3 py-2"
                    style={{ backgroundColor: AI_BUTTON_COLOR, color: '#fff' }}
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4 mr-1" />Send
                  </Button>
                </div>
              </Card>
            </TabsContent>
            {/* Image Analysis */}
            <TabsContent value="image-analysis">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xs sm:text-base">
                    <LucideCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    <span>Crop Disease Detection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 hover:border-green-500 transition-colors">
                      <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                      <h3 className="text-xs sm:text-lg font-medium text-gray-900 mb-2">Upload Crop Image</h3>
                      <p className="text-xs sm:text-base text-gray-600 mb-2 sm:mb-4">Take a clear photo of affected leaves or crops for instant analysis</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button style={{ backgroundColor: AI_BUTTON_COLOR, color: '#fff' }} className="text-xs sm:text-base px-4 py-2 mt-2">Choose Image</Button>
                      </label>
                      {uploadedImage && (
                        <div className="mt-4 flex flex-col items-center">
                          <img src={uploadedImage} alt="Uploaded crop" className="max-h-48 rounded-lg border" />
                          <Button style={{ backgroundColor: AI_BUTTON_COLOR, color: '#fff' }} className="mt-2 text-xs sm:text-base px-3 py-1" onClick={() => setUploadedImage(null)}>Upload New Image</Button>
                        </div>
                      )}
                    </div>
                    {/* Remedy suggestion visually highlighted */}
                    <div className="mt-6 bg-purple-50 border-l-4 border-[#921573] p-4 rounded-lg text-left max-w-xl mx-auto">
                      <div className="font-semibold text-[#921573] mb-1">AI Remedy Suggestion:</div>
                      <div className="text-xs sm:text-base text-gray-700">After analysis, the AI will suggest remedies here (e.g., Remove affected leaves, apply organic fungicide, ensure proper spacing).</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Human Consultation */}
            <TabsContent value="human-consultation">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xs sm:text-base">Book a Consultation</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      style={{ backgroundColor: bookingTab === 'inperson' ? AI_BUTTON_COLOR : '#e5e7eb', color: bookingTab === 'inperson' ? '#fff' : '#333' }}
                      className="text-xs sm:text-base px-3 py-2 rounded-full"
                      onClick={() => setBookingTab('inperson')}
                    >In-Person</Button>
                    <Button
                      type="button"
                      style={{ backgroundColor: bookingTab === 'virtual' ? AI_BUTTON_COLOR : '#e5e7eb', color: bookingTab === 'virtual' ? '#fff' : '#333' }}
                      className="text-xs sm:text-base px-3 py-2 rounded-full"
                      onClick={() => setBookingTab('virtual')}
                    >Virtual</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-5">
                  {bookingTab === 'inperson' ? (
                    <form onSubmit={handleVisitRequest} className="space-y-2 sm:space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <Input className="text-xs sm:text-base px-2 py-2" placeholder="Full Name" value={visitForm.name} onChange={e => setVisitForm(v => ({ ...v, name: e.target.value }))} />
                        <Input className="text-xs sm:text-base px-2 py-2" placeholder="Phone Number" value={visitForm.phone} onChange={e => setVisitForm(v => ({ ...v, phone: e.target.value }))} />
                      </div>
                      <Input className="text-xs sm:text-base px-2 py-2" placeholder="Location" value={visitForm.location} onChange={e => setVisitForm(v => ({ ...v, location: e.target.value }))} />
                      <Textarea className="text-xs sm:text-base px-2 py-2" placeholder="Describe your challenge" value={visitForm.challenge} onChange={e => setVisitForm(v => ({ ...v, challenge: e.target.value }))} />
                      {/* Date Picker Field with Label for In-Person */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Choose date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Input
                              className="text-xs sm:text-base px-2 py-2 cursor-pointer bg-white"
                              placeholder="Choose date"
                              value={visitDate ? format(visitDate, 'yyyy-MM-dd') : ''}
                              readOnly
                            />
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <Calendar
                              mode="single"
                              selected={visitDate}
                              onSelect={setVisitDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button style={{ backgroundColor: AI_BUTTON_COLOR, color: '#fff' }} className="w-full text-xs sm:text-base py-2">Request Visit</Button>
                    </form>
                  ) : (
                    <form onSubmit={handleScheduleCall} className="space-y-2 sm:space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <Input className="text-xs sm:text-base px-2 py-2" placeholder="Full Name" value={callForm.name} onChange={e => setCallForm(v => ({ ...v, name: e.target.value }))} />
                        <Input className="text-xs sm:text-base px-2 py-2" placeholder="Email" value={callForm.email} onChange={e => setCallForm(v => ({ ...v, email: e.target.value }))} />
                      </div>
                      {/* Date Picker Field with Label for Virtual */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Choose date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Input
                              className="text-xs sm:text-base px-2 py-2 cursor-pointer bg-white"
                              placeholder="Choose date"
                              value={callDate ? format(callDate, 'yyyy-MM-dd') : ''}
                              readOnly
                            />
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <Calendar
                              mode="single"
                              selected={callDate}
                              onSelect={setCallDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Input className="text-xs sm:text-base px-2 py-2" placeholder="Preferred Time" value={callForm.time} onChange={e => setCallForm(v => ({ ...v, time: e.target.value }))} />
                      <Textarea className="text-xs sm:text-base px-2 py-2" placeholder="Topics to discuss" value={callForm.topics} onChange={e => setCallForm(v => ({ ...v, topics: e.target.value }))} />
                      <Button style={{ backgroundColor: AI_BUTTON_COLOR, color: '#fff' }} className="w-full text-xs sm:text-base py-2">Schedule Virtual Call</Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Workshops */}
            <TabsContent value="workshops">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xs sm:text-base">Upcoming Workshops & Webinars</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockWorkshops.map(w => (
                      <div key={w.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
                        <div>
                          <img
                            src={w.image}
                            alt={w.title + ' image'}
                            className="w-full h-40 object-cover rounded-md mb-3 bg-gray-100 cursor-pointer"
                            onClick={() => setModalImage(w.image)}
                          />
                          <div className="font-bold text-[#921573] text-base mb-1">{w.title} <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: w.type === 'webinar' ? '#f3e8ff' : '#e0f2fe', color: w.type === 'webinar' ? '#921573' : '#0369a1' }}>{w.type.charAt(0).toUpperCase() + w.type.slice(1)}</span></div>
                          <div className="text-xs sm:text-sm text-gray-700 mb-2">{w.date} &bull; {w.location}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">Spots left: {w.spots}</div>
                        </div>
                        <form onSubmit={e => { e.preventDefault(); handleWorkshopRegistration(w.title, w.id); }} className="mt-2 flex flex-col gap-2">
                          <Input className="text-xs sm:text-base px-2 py-2" placeholder="Full Name" value={workshopRegistration.name} onChange={e => setWorkshopRegistration(v => ({ ...v, name: e.target.value }))} />
                          <Input className="text-xs sm:text-base px-2 py-2" placeholder="Email" value={workshopRegistration.email} onChange={e => setWorkshopRegistration(v => ({ ...v, email: e.target.value }))} />
                          <Input className="text-xs sm:text-base px-2 py-2" placeholder="Phone Number" value={workshopRegistration.phone} onChange={e => setWorkshopRegistration(v => ({ ...v, phone: e.target.value }))} />
                          <Button style={{ backgroundColor: AI_BUTTON_COLOR, color: '#fff' }} className="w-full text-xs sm:text-base py-2">Register</Button>
                        </form>
                      </div>
                    ))}
                  </div>
                  {/* Modal for full image view */}
                  <Dialog open={!!modalImage} onOpenChange={() => setModalImage(null)}>
                    <DialogContent className="max-w-2xl w-full flex flex-col items-center bg-white">
                      {modalImage && (
                        <img
                          src={modalImage}
                          alt="Full flyer"
                          className="w-full max-h-[80vh] object-contain rounded-lg transition-all duration-500 ease-in-out transform scale-95 opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100"
                          data-state={modalImage ? 'open' : 'closed'}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AIConsultation;
