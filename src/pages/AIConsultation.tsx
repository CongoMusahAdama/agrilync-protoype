
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      message: 'Hello! I\'m your AI farming assistant. How can I help you today? You can ask about crop diseases, planting schedules, fertilizer recommendations, or upload images for disease detection.',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI & Human Consultation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant AI-powered advice or connect with local extension agents. 
            Upload crop images for 95% accurate disease detection.
          </p>
        </div>

        <Tabs defaultValue="ai-chat" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="image-analysis">Image Analysis</TabsTrigger>
            <TabsTrigger value="human-consultation">Book Consultation</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
          </TabsList>

          {/* AI Chat Interface */}
          <TabsContent value="ai-chat">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-green-50 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-green-600" />
                  <span>AI Farming Assistant</span>
                  <span className="text-sm text-gray-500 ml-auto">Available 24/7</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md flex space-x-2 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'user' ? 'bg-blue-500' : 'bg-green-500'}`}>
                          {msg.type === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                        </div>
                        <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-2 rounded-lg ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask about crops, diseases, planting schedules..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Available in English, Twi, Ewe, and Dagbani
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Analysis */}
          <TabsContent value="image-analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-6 w-6 text-green-600" />
                  <span>Crop Disease Detection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-green-500 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Crop Image
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Take a clear photo of affected leaves or crops for instant analysis
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Choose Image
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">95%</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Accuracy Rate</h4>
                    <p className="text-sm text-gray-600">Disease detection accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">&lt;30s</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Instant Results</h4>
                    <p className="text-sm text-gray-600">Get analysis in seconds</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">24/7</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Always Available</h4>
                    <p className="text-sm text-gray-600">Anytime, anywhere</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Human Consultation */}
          <TabsContent value="human-consultation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-green-600" />
                    <span>In-Person Consultation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Book a visit from a local extension agent for hands-on support.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Your Name" />
                    <Input placeholder="Phone Number" />
                    <Input placeholder="Farm Location" />
                    <Textarea placeholder="Describe your farming challenge..." />
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Request Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                    <span>Virtual Consultation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Schedule a video call with agricultural experts.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Your Name" />
                    <Input placeholder="Email Address" />
                    <Input type="date" />
                    <Input type="time" />
                    <Textarea placeholder="Topics to discuss..." />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Workshops */}
          <TabsContent value="workshops">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-purple-600" />
                    <span>Upcoming Community Workshops</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Organic Pest Control Methods",
                        date: "March 15, 2024",
                        time: "2:00 PM - 4:00 PM",
                        location: "Kumasi Community Center",
                        spots: "12 spots remaining"
                      },
                      {
                        title: "Modern Irrigation Techniques",
                        date: "March 22, 2024",
                        time: "10:00 AM - 12:00 PM",
                        location: "Tamale Agricultural Center",
                        spots: "8 spots remaining"
                      },
                      {
                        title: "Crop Rotation and Soil Health",
                        date: "March 29, 2024",
                        time: "1:00 PM - 3:00 PM",
                        location: "Accra Farming Hub",
                        spots: "15 spots remaining"
                      }
                    ].map((workshop, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:border-green-500 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{workshop.title}</h4>
                          <span className="text-sm text-green-600 font-medium">{workshop.spots}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{workshop.date} • {workshop.time}</p>
                        <p className="text-gray-600 text-sm mb-3">{workshop.location}</p>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Register Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AIConsultation;
