
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
      <div className="relative flex flex-col items-center justify-center min-h-[220px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[480px] w-full overflow-hidden mb-4 sm:mb-8 bg-white">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 animate-fade-in-down" style={{ color: BRAND_MAGENTA }}>
            Weather Forecast
          </h1>
          <p className="text-sm sm:text-lg text-gray-700 max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
            Get hyperlocal weather updates for your farm. Enter your location to see the latest forecast and personalized farming insights.
          </p>
        </div>
        {/* Location Input */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8 w-full max-w-xl justify-center">
          <Input
            className="flex-1 text-base px-4 py-3 border-2 border-[#921573] focus:border-[#7ede56] rounded-lg shadow-sm"
            placeholder="Enter location (e.g., Kumasi)"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <Button className="text-base px-6 py-3 font-semibold rounded-lg shadow-md" style={{ background: BRAND_MAGENTA, color: BRAND_WHITE }}>
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
            <Card className="mt-4 sm:mt-8 shadow-lg border-2 border-[#7ede56] bg-white">
              <CardHeader className="flex flex-row items-center gap-2">
                <MapPin color={BRAND_MAGENTA} size={22} />
                <CardTitle className="text-lg font-bold" style={{ color: BRAND_MAGENTA }}>
                  Forecast for {forecast.location}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4 text-base">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">Temperature: <span className="font-normal">{forecast.temperature}°C</span></p>
                    <p className="font-semibold">Condition: <span className="font-normal">{forecast.condition}</span></p>
                    <p className="font-semibold">Humidity: <span className="font-normal">{forecast.humidity}%</span></p>
                    <p className="font-semibold">Wind: <span className="font-normal">{forecast.wind} km/h</span></p>
                  </div>
                  <div className="flex-shrink-0">
                    <img src={forecast.icon} alt="Weather Icon" className="w-20 h-20 sm:w-28 sm:h-28 mx-auto" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-4">
                  <p className="text-sm text-gray-600">Last updated: {forecast.lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-base text-gray-500 mt-8">No forecast data available.</div>
          )}
        </div>
      </div>

      {/* Forecast Tracking Section */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_PURPLE }}>7-Day Forecast & Recommendations</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {weeklyForecast.map((day, idx) => (
            <div
              key={day.day}
              className="min-w-[180px] bg-white rounded-xl shadow-md border-2 flex flex-col items-center p-4 animate-fade-in-up"
              style={{ borderColor: idx % 2 === 0 ? BRAND_MAGENTA : BRAND_PURPLE, animationDelay: `${idx * 120}ms` }}
            >
              <day.icon color={BRAND_GREEN} size={32} />
              <div className="font-bold text-lg mt-2" style={{ color: BRAND_MAGENTA }}>{day.day}</div>
              <div className="text-base font-semibold">{day.high} / {day.low}</div>
              <div className="text-sm text-gray-600 mb-2">{day.condition}</div>
              <div className="text-xs text-center text-gray-700 italic">{day.recommendation}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Weather Alerts Section */}
      <section className="w-full max-w-3xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_MAGENTA }}>Weather Alerts</h2>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 rounded-lg shadow border-l-8"
              style={{ background: '#fdf6fa', borderColor: getAlertColor(alert.type) }}
            >
              {alert.type === 'warning' && <AlertTriangle color={BRAND_MAGENTA} size={24} />}
              {alert.type === 'info' && <Bell color={BRAND_GREEN} size={24} />}
              {alert.type === 'alert' && <AlertTriangle color={BRAND_PURPLE} size={24} />}
              <div className="flex-1">
                <div className="font-semibold" style={{ color: getAlertColor(alert.type) }}>{alert.message}</div>
                <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
              </div>
            </div>
          ))}
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
