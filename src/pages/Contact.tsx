import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const BRAND_TEAL = '#002F37';
const BRAND_GREEN = '#7ede56';
const BRAND_MAGENTA = '#921573';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Scroll-triggered animation hooks
  const [heroRef, heroVisible] = useScrollReveal();
  const [formRef, formVisible] = useScrollReveal();
  const [infoRef, infoVisible] = useScrollReveal();
  const [communityRef, communityVisible] = useScrollReveal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className={"py-16 sm:py-20 md:py-24 bg-white transition-all duration-700 ease-in-out " + (heroVisible ? " animate-fade-in-up" : " opacity-0")}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className={"text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (heroVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
            Get in Touch
          </h1>
          <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about AgriLync? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <div ref={formRef} className={"transition-all duration-700 ease-in-out " + (formVisible ? " animate-fade-in-up" : " opacity-0")}>
              <h2 className={"text-2xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (formVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
                Send us a Message
              </h2>
              <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3"></div>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-lg font-semibold mb-2">Message Sent Successfully!</div>
                  <p className="text-green-700">Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What is this about?"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div ref={infoRef} className={"transition-all duration-700 ease-in-out " + (infoVisible ? " animate-fade-in-up" : " opacity-0")}>
              <h2 className={"text-2xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (infoVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
                Contact Information
              </h2>
              <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3"></div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">agrilync@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+233 50 662 6068</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">Accra, Ghana</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.facebook.com/share/16SkoNJAsW/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://x.com/agri_lync" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://instagram.com/agri_lync" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/agrilync/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Community Section */}
      <section ref={communityRef} className={"py-12 sm:py-16 md:py-20 bg-white transition-all duration-700 ease-in-out " + (communityVisible ? " animate-fade-in-up" : " opacity-0")}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className={"text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (communityVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
            Join Our WhatsApp Community
          </h2>
          <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with fellow farmers, get real-time updates, and be part of the AgriLync community. Join our WhatsApp group for exclusive content and direct support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://linktr.ee/AgriLync" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {/* WhatsApp SVG Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 32 32" 
                fill="currentColor" 
                className="w-6 h-6 mr-3"
              >
                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.828-2.205C13.416 27.168 14.684 27.5 16 27.5c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.18 0-2.336-.207-3.428-.613l-.244-.09-4.652 1.31 1.244-4.41-.16-.253C7.23 18.13 6.5 16.6 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm5.09-6.41c-.277-.139-1.637-.807-1.89-.899-.253-.093-.437-.139-.62.139-.184.277-.713.899-.874 1.084-.16.184-.32.208-.597.07-.277-.139-1.17-.431-2.23-1.374-.824-.735-1.38-1.64-1.542-1.917-.16-.277-.017-.427.122-.565.126-.125.277-.32.416-.48.139-.16.184-.277.277-.462.093-.184.046-.347-.023-.486-.07-.139-.62-1.497-.85-2.05-.224-.539-.453-.466-.62-.475l-.527-.009c-.17 0-.446.064-.68.298-.233.233-.89.87-.89 2.122s.911 2.465 1.038 2.637c.126.17 1.793 2.736 4.35 3.73.608.209 1.082.334 1.452.427.61.155 1.165.133 1.604.081.489-.058 1.637-.668 1.87-1.312.232-.645.232-1.197.162-1.312-.07-.116-.253-.184-.53-.323z"/>
              </svg>
              Join WhatsApp Community
            </a>
            
            <a 
              href="https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Direct WhatsApp Link
            </a>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Choose your preferred way to join our community
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact; 