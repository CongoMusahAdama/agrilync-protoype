
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  MapPin,
  Bell,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any | null>(null);

  const currentWeather = {
    location: 'Kumasi, Ghana',
    temperature: '28',
    condition: 'Partly Cloudy',
    humidity: '65',
    wind: '12',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
    lastUpdated: 'Just now'
  };

  const weeklyForecast = [
    { day: 'Today', high: '30°', low: '22°', condition: 'Sunny', icon: Sun, recommendation: 'Perfect day for harvesting! High temperatures expected.' },
    { day: 'Tomorrow', high: '28°', low: '20°', condition: 'Cloudy', icon: Cloud, recommendation: 'Good day for planting. Moderate temperatures.' },
    { day: 'Wednesday', high: '25°', low: '18°', condition: 'Rainy', icon: CloudRain, recommendation: 'Avoid fertilizer application. Rain expected.' },
    { day: 'Thursday', high: '27°', low: '19°', condition: 'Partly Cloudy', icon: Cloud, recommendation: 'Ideal for field work and maintenance.' },
    { day: 'Friday', high: '29°', low: '21°', condition: 'Sunny', icon: Sun, recommendation: 'Great day for drying crops. Clear skies.' },
    { day: 'Saturday', high: '26°', low: '18°', condition: 'Rainy', icon: CloudRain, recommendation: 'Indoor activities recommended.' },
    { day: 'Sunday', high: '28°', low: '20°', condition: 'Sunny', icon: Sun, recommendation: 'Perfect for market visits and planning.' }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'Heavy rainfall expected Wednesday-Thursday. Secure your crops.',
      time: '2 hours ago'
    },
    {
      type: 'info',
      message: 'Optimal planting conditions for maize this weekend.',
      time: '1 day ago'
    },
    {
      type: 'alert',
      message: 'Drought alert: Consider water conservation measures.',
      time: '3 days ago'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setForecast({ ...currentWeather, location: location || currentWeather.location });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 overflow-x-hidden">
      <Navbar />
      <div className="relative flex flex-col items-center justify-center min-h-[220px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[480px] w-full overflow-hidden mb-4 sm:mb-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Weather Forecast</h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
            Get hyperlocal weather updates for your farm. Enter your location to see the latest forecast.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8">
          <Input
            className="flex-1 text-xs sm:text-base px-2 py-2"
            placeholder="Enter location (e.g., Kumasi)"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <Button className="text-xs sm:text-base px-3 py-2">Get Forecast</Button>
        </form>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : forecast ? (
          <Card className="mt-4 sm:mt-8">
            <CardHeader>
              <CardTitle className="text-xs sm:text-base">Forecast for {forecast.location}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 text-xs sm:text-base">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                <div className="flex-1">
                  <p className="font-semibold">Temperature: <span className="font-normal">{forecast.temperature}°C</span></p>
                  <p className="font-semibold">Condition: <span className="font-normal">{forecast.condition}</span></p>
                  <p className="font-semibold">Humidity: <span className="font-normal">{forecast.humidity}%</span></p>
                  <p className="font-semibold">Wind: <span className="font-normal">{forecast.wind} km/h</span></p>
                </div>
                <div className="flex-shrink-0">
                  <img src={forecast.icon} alt="Weather Icon" className="w-16 h-16 sm:w-24 sm:h-24 mx-auto" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4">
                <p className="text-xs sm:text-base text-gray-600">Last updated: {forecast.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-xs sm:text-base text-gray-500 mt-8">No forecast data available.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Weather;
