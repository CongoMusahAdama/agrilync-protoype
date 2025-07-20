
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  AlertTriangle,
  Smartphone,
  Wifi,
  MessageSquare,
  Map,
  Satellite,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

// Brand colors
const BRAND_MAGENTA = '#921573';
const BRAND_PURPLE = '#6B2D8A'; // Harmonious deep purple
const BRAND_GREEN = '#7ede56';
const BRAND_WHITE = '#FFFFFF';

// Tailwind CSS custom animation for fade-in-up is required in App.css or tailwind.config.js
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
      time: '2 hours ago',
      region: 'Ashanti Region'
    },
    {
      type: 'info',
      message: 'Optimal planting conditions for maize this weekend.',
      time: '1 day ago',
      region: 'Northern Region'
    },
    {
      type: 'alert',
      message: 'Drought alert: Consider water conservation measures.',
      time: '3 days ago',
      region: 'Upper East'
    },
    {
      type: 'fertilizer',
      message: 'Perfect conditions for fertilizer application today!',
      time: '4 hours ago',
      region: 'Central Region'
    }
  ];

  const ghanaRegions = [
    { name: 'Ashanti', weather: 'Partly Cloudy', temp: '28°C', rainfall: '65%' },
    { name: 'Greater Accra', weather: 'Sunny', temp: '30°C', rainfall: '15%' },
    { name: 'Northern', weather: 'Cloudy', temp: '26°C', rainfall: '80%' },
    { name: 'Western', weather: 'Rainy', temp: '24°C', rainfall: '90%' },
    { name: 'Central', weather: 'Partly Cloudy', temp: '27°C', rainfall: '45%' },
    { name: 'Eastern', weather: 'Sunny', temp: '29°C', rainfall: '20%' },
    { name: 'Volta', weather: 'Cloudy', temp: '25°C', rainfall: '70%' },
    { name: 'Upper East', weather: 'Sunny', temp: '32°C', rainfall: '10%' },
    { name: 'Upper West', weather: 'Partly Cloudy', temp: '31°C', rainfall: '25%' },
    { name: 'Brong Ahafo', weather: 'Rainy', temp: '23°C', rainfall: '85%' }
  ];

  const farmRecommendations = [
    {
      activity: 'Fertilizer Application',
      bestTime: 'Today 6:00 AM - 10:00 AM',
      reason: 'Low humidity and no rain expected',
      urgency: 'high'
    },
    {
      activity: 'Planting',
      bestTime: 'Tomorrow after 2:00 PM',
      reason: 'Soil moisture optimal after morning dew',
      urgency: 'medium'
    },
    {
      activity: 'Harvesting',
      bestTime: 'Friday 7:00 AM - 11:00 AM',
      reason: 'Clear skies and low humidity',
      urgency: 'low'
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

  // Helper for alert color
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return BRAND_MAGENTA;
      case 'info':
        return BRAND_GREEN;
      case 'alert':
        return BRAND_PURPLE;
      default:
        return BRAND_PURPLE;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-center min-h-[220px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[480px] w-full overflow-hidden mb-4 sm:mb-8 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 animate-fade-in-down" style={{ color: BRAND_MAGENTA }}>
            Hyperlocal Weather Intelligence
          </h1>
          <p className="text-sm sm:text-lg text-gray-700 max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
            Data-rich, farm-location-based forecasts with AI-powered recommendations for optimal farming decisions.
          </p>
        </div>
        {/* Location Input */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8 w-full max-w-xl justify-center">
          <Input
            className="flex-1 text-base px-4 py-3 border-2 border-[#921573] focus:border-[#7ede56] rounded-lg shadow-sm"
            placeholder="Enter farm location (e.g., Kumasi Central)"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <Button className="text-base px-6 py-3 font-semibold rounded-lg shadow-md" style={{ background: BRAND_MAGENTA, color: BRAND_WHITE }}>
            <Satellite className="mr-2 h-4 w-4" />
            Get Forecast
          </Button>
        </form>
        {/* Current Weather Card */}
        <div className="w-full max-w-xl">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#921573]"></div>
            </div>
          ) : forecast ? (
            <div className="mt-4 sm:mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border-2 border-[#7ede56] p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin color={BRAND_MAGENTA} size={22} />
                <h3 className="text-lg font-bold" style={{ color: BRAND_MAGENTA }}>
                  Live Data: {forecast.location}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <Thermometer size={16} />
                    {forecast.temperature}°C
                  </p>
                  <p className="font-semibold flex items-center gap-2">
                    <Droplets size={16} />
                    {forecast.humidity}% Humidity
                  </p>
                  <p className="font-semibold flex items-center gap-2">
                    <Wind size={16} />
                    {forecast.wind} km/h
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <img src={forecast.icon} alt="Weather Icon" className="w-16 h-16" />
                  <span className="text-sm text-gray-600">{forecast.condition}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Zap size={14} />
                  Last updated: {forecast.lastUpdated}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-base text-gray-500 mt-8">Enter your farm location to get detailed forecasts</div>
          )}
        </div>
      </div>

      {/* Interactive Ghana Map Section */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: BRAND_PURPLE }}>
          <Map size={24} />
          Ghana Regional Weather Patterns
        </h2>
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#921573] p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ghanaRegions.map((region, idx) => (
              <div
                key={region.name}
                className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <h4 className="font-bold text-sm mb-2" style={{ color: BRAND_MAGENTA }}>{region.name}</h4>
                <p className="text-xs text-gray-600 mb-1">{region.weather}</p>
                <p className="text-sm font-semibold">{region.temp}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Droplets size={12} />
                  <span className="text-xs">{region.rainfall}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily & Weekly Recommendations Section */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: BRAND_PURPLE }}>
          <TrendingUp size={24} />
          Daily & Weekly Farming Recommendations
        </h2>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="daily">Daily Alerts</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Forecast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <div className="grid md:grid-cols-3 gap-4">
              {farmRecommendations.map((rec, idx) => (
                <div
                  key={rec.activity}
                  className="bg-white rounded-xl shadow-md border-2 p-6"
                  style={{ borderColor: rec.urgency === 'high' ? BRAND_MAGENTA : rec.urgency === 'medium' ? BRAND_PURPLE : BRAND_GREEN }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={rec.urgency === 'high' ? 'destructive' : 'secondary'}>
                      {rec.urgency.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-lg mb-2" style={{ color: BRAND_MAGENTA }}>{rec.activity}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Best Time:</strong> {rec.bestTime}
                  </p>
                  <p className="text-sm text-gray-700">{rec.reason}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {weeklyForecast.map((day, idx) => (
                <div
                  key={day.day}
                  className="min-w-[200px] bg-white rounded-xl shadow-md border-2 flex flex-col items-center p-4"
                  style={{ borderColor: idx % 2 === 0 ? BRAND_MAGENTA : BRAND_PURPLE }}
                >
                  <day.icon color={BRAND_GREEN} size={32} />
                  <div className="font-bold text-lg mt-2" style={{ color: BRAND_MAGENTA }}>{day.day}</div>
                  <div className="text-base font-semibold">{day.high} / {day.low}</div>
                  <div className="text-sm text-gray-600 mb-2">{day.condition}</div>
                  <div className="text-xs text-center text-gray-700 italic bg-gray-50 p-2 rounded">{day.recommendation}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Smart Alert System Section */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: BRAND_MAGENTA }}>
          <Bell size={24} />
          Smart Alert System
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Push Notifications */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-[#921573] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: BRAND_MAGENTA }}>
              <Smartphone size={20} />
              Push Notifications
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border-l-4"
                  style={{ background: '#fdf6fa', borderColor: getAlertColor(alert.type) }}
                >
                  {alert.type === 'warning' && <AlertTriangle color={BRAND_MAGENTA} size={20} />}
                  {alert.type === 'info' && <Bell color={BRAND_GREEN} size={20} />}
                  {alert.type === 'alert' && <AlertTriangle color={BRAND_PURPLE} size={20} />}
                  {alert.type === 'fertilizer' && <Zap color={BRAND_GREEN} size={20} />}
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: getAlertColor(alert.type) }}>{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{alert.region} • {alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMS & Offline Alerts */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-[#7ede56] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: BRAND_GREEN }}>
              <MessageSquare size={20} />
              SMS & Offline Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Wifi color={BRAND_GREEN} size={20} />
                <div>
                  <div className="font-semibold text-sm">Offline Capability</div>
                  <div className="text-xs text-gray-600">Receive critical alerts even without internet</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MessageSquare color={BRAND_PURPLE} size={20} />
                <div>
                  <div className="font-semibold text-sm">SMS Alerts</div>
                  <div className="text-xs text-gray-600">Critical weather events sent directly to your phone</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Calendar color={BRAND_MAGENTA} size={20} />
                <div>
                  <div className="font-semibold text-sm">Farming Calendar</div>
                  <div className="text-xs text-gray-600">Planting, harvesting & treatment reminders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farming Calendar & AI Suggestions Section */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Farming Calendar */}
          <div className="flex-1 bg-white rounded-xl shadow-md border-2 border-[#7ede56] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar color={BRAND_GREEN} size={22} />
              <h3 className="text-lg font-bold" style={{ color: BRAND_GREEN }}>Farming Calendar</h3>
            </div>
            <div className="text-sm text-gray-700 mb-2">Upcoming optimal farming activities based on weather:</div>
            <ul className="list-disc pl-5 text-base text-gray-800 space-y-1">
              <li><span className="font-semibold" style={{ color: BRAND_MAGENTA }}>July 10:</span> Best day to plant maize (cool, moist soil).</li>
              <li><span className="font-semibold" style={{ color: BRAND_PURPLE }}>July 12:</span> Avoid fertilizer application (rain expected).</li>
              <li><span className="font-semibold" style={{ color: BRAND_GREEN }}>July 14:</span> Great for harvesting and drying crops.</li>
            </ul>
          </div>
          {/* AI Suggestions */}
          <div className="flex-1 bg-gradient-to-br from-[#f8f6ff] via-[#f3e6f7] to-[#e6fbe6] rounded-xl shadow-md border-2 border-[#921573] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sun color={BRAND_MAGENTA} size={22} />
              <h3 className="text-lg font-bold" style={{ color: BRAND_MAGENTA }}>Personalized AI Suggestions</h3>
            </div>
            <div className="text-base text-gray-800 mb-2">AI-powered insights for your farm:</div>
            <ul className="list-disc pl-5 text-base text-gray-800 space-y-1">
              <li>Delay irrigation on <span className="font-semibold" style={{ color: BRAND_PURPLE }}>Wednesday</span> due to expected rainfall.</li>
              <li>Plan market visits for <span className="font-semibold" style={{ color: BRAND_GREEN }}>Sunday</span> (clear skies forecasted).</li>
              <li>Monitor soil moisture on <span className="font-semibold" style={{ color: BRAND_MAGENTA }}>Friday</span> for optimal crop growth.</li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">Set your preferences to get more tailored advice.</div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Weather;
