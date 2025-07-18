
import React, { useState } from 'react';
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
  Calendar, 
  Users, 
  Mic, 
  MicOff,
  Camera,
  Bot,
  User,
  Send
} from 'lucide-react';

const AIConsultation = () => {
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      message: 'Hello! I\'m your AI farming assistant. How can I help you today? You can ask about crop diseases, planting schedules, fertilizer recommendations, or upload images for disease detection.',
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
      // Simulate image analysis
      const analysisMessage = {
        type: 'ai',
        message: 'Image uploaded successfully! Analyzing... Based on the image, I can see signs of leaf spot disease. Here are my recommendations: 1) Remove affected leaves immediately, 2) Apply organic fungicide, 3) Ensure proper spacing for air circulation.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, analysisMessage]);
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

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Hero Section */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">AI & Human Consultation</h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
            Get instant AI-powered advice or connect with local extension agents. 
            Upload crop images for 95% accurate disease detection.
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
                <Button className="text-xs sm:text-base px-3 py-2" onClick={handleSendMessage}>Send</Button>
              </div>
            </Card>
          </TabsContent>
          {/* Image Analysis */}
          <TabsContent value="image-analysis">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xs sm:text-base">
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
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
                      <Button className="bg-green-600 hover:bg-green-700 text-xs sm:text-base px-4 py-2 mt-2">Choose Image</Button>
                    </label>
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
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-5">
                <form onSubmit={handleVisitRequest} className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <Input className="text-xs sm:text-base px-2 py-2" placeholder="Full Name" value={visitForm.name} onChange={e => setVisitForm(v => ({ ...v, name: e.target.value }))} />
                    <Input className="text-xs sm:text-base px-2 py-2" placeholder="Phone Number" value={visitForm.phone} onChange={e => setVisitForm(v => ({ ...v, phone: e.target.value }))} />
                  </div>
                  <Input className="text-xs sm:text-base px-2 py-2" placeholder="Location" value={visitForm.location} onChange={e => setVisitForm(v => ({ ...v, location: e.target.value }))} />
                  <Textarea className="text-xs sm:text-base px-2 py-2" placeholder="Describe your challenge" value={visitForm.challenge} onChange={e => setVisitForm(v => ({ ...v, challenge: e.target.value }))} />
                  <Input className="text-xs sm:text-base px-2 py-2" placeholder="Preferred Date" value={visitForm.preferredDate} onChange={e => setVisitForm(v => ({ ...v, preferredDate: e.target.value }))} />
                  <Button className="w-full text-xs sm:text-base py-2">Request Visit</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Workshops */}
          <TabsContent value="workshops">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xs sm:text-base">Workshops</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-5">
                <form className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <Input className="text-xs sm:text-base px-2 py-2" placeholder="Full Name" value={workshopRegistration.name} onChange={e => setWorkshopRegistration(v => ({ ...v, name: e.target.value }))} />
                    <Input className="text-xs sm:text-base px-2 py-2" placeholder="Email" value={workshopRegistration.email} onChange={e => setWorkshopRegistration(v => ({ ...v, email: e.target.value }))} />
                  </div>
                  <Input className="text-xs sm:text-base px-2 py-2" placeholder="Phone Number" value={workshopRegistration.phone} onChange={e => setWorkshopRegistration(v => ({ ...v, phone: e.target.value }))} />
                  <Input className="text-xs sm:text-base px-2 py-2" placeholder="Workshop ID" value={workshopRegistration.workshopId} onChange={e => setWorkshopRegistration(v => ({ ...v, workshopId: e.target.value }))} />
                  <Button className="w-full text-xs sm:text-base py-2">Register</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AIConsultation;
