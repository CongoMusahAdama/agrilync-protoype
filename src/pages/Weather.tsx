
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

  const currentWeather = {
    location: 'Kumasi, Ghana',
    temperature: '28°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    windSpeed: '12 km/h',
    rainfall: '2mm'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hyperlocal Weather Forecast
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get farm-specific weather data with SMS alerts for critical farming decisions. 
            Never miss the perfect planting or harvesting window.
          </p>
        </div>

        {/* Location Input */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your farm location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MapPin className="h-4 w-4 mr-2" />
              Get Weather
            </Button>
          </div>
        </div>

        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Weather</TabsTrigger>
            <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="alerts">Weather Alerts</TabsTrigger>
            <TabsTrigger value="calendar">Farming Calendar</TabsTrigger>
          </TabsList>

          {/* Current Weather */}
          <TabsContent value="current">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-6 w-6" />
                    <span>{currentWeather.location}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-5xl font-bold mb-2">{currentWeather.temperature}</div>
                      <div className="text-blue-100">{currentWeather.condition}</div>
                    </div>
                    <Cloud className="h-20 w-20 text-blue-200" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Droplets className="h-6 w-6 mx-auto mb-1 text-blue-200" />
                      <div className="text-sm text-blue-100">Humidity</div>
                      <div className="font-semibold">{currentWeather.humidity}</div>
                    </div>
                    <div className="text-center">
                      <Wind className="h-6 w-6 mx-auto mb-1 text-blue-200" />
                      <div className="text-sm text-blue-100">Wind</div>
                      <div className="font-semibold">{currentWeather.windSpeed}</div>
                    </div>
                    <div className="text-center">
                      <CloudRain className="h-6 w-6 mx-auto mb-1 text-blue-200" />
                      <div className="text-sm text-blue-100">Rainfall</div>
                      <div className="font-semibold">{currentWeather.rainfall}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="h-6 w-6 text-green-600" />
                    <span>Today's Farming Recommendation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-green-800 mb-2">Perfect Harvesting Conditions</h4>
                    <p className="text-green-700">
                      Today's high temperatures and low humidity make it ideal for harvesting crops. 
                      Ensure your workers stay hydrated and start early to avoid peak heat hours.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Recommended Activity:</span>
                      <span className="font-semibold text-green-600">Harvesting</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Best Time:</span>
                      <span className="font-semibold">6:00 AM - 10:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avoid:</span>
                      <span className="font-semibold text-red-600">Watering (evaporation high)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 7-Day Forecast */}
          <TabsContent value="forecast">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeklyForecast.map((day, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{day.day}</h3>
                      <day.icon className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold">{day.high}</span>
                      <span className="text-gray-500">{day.low}</span>
                    </div>
                    <div className="text-gray-600 mb-3">{day.condition}</div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">{day.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Weather Alerts */}
          <TabsContent value="alerts">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-6 w-6 text-orange-600" />
                    <span>SMS Alert Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Alert Types</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="text-green-600" />
                          <span>Severe Weather Warnings</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="text-green-600" />
                          <span>Rainfall Alerts</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="text-green-600" />
                          <span>Temperature Extremes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="text-green-600" />
                          <span>Wind Speed Warnings</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Contact Information</h4>
                      <Input placeholder="Phone number for SMS alerts" />
                      <Input placeholder="Email for detailed reports" />
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Update Alert Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Alerts</h3>
                {alerts.map((alert, index) => (
                  <Card key={index} className={`border-l-4 ${
                    alert.type === 'warning' ? 'border-orange-500' : 
                    alert.type === 'alert' ? 'border-red-500' : 'border-blue-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`h-5 w-5 mt-1 ${
                          alert.type === 'warning' ? 'text-orange-500' : 
                          alert.type === 'alert' ? 'text-red-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-gray-900">{alert.message}</p>
                          <p className="text-sm text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Farming Calendar */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <span>Personalized Farming Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      month: 'March 2024',
                      activities: [
                        'Land preparation for maize',
                        'Apply organic fertilizer',
                        'Plant early maturing varieties'
                      ],
                      weather: 'Rainy season begins'
                    },
                    {
                      month: 'April 2024',
                      activities: [
                        'Weed control for young crops',
                        'Monitor for pest diseases',
                        'Apply first round of fertilizer'
                      ],
                      weather: 'Moderate rainfall expected'
                    },
                    {
                      month: 'May 2024',
                      activities: [
                        'Continue pest monitoring',
                        'Second fertilizer application',
                        'Prepare for dry season crops'
                      ],
                      weather: 'Decreasing rainfall'
                    }
                  ].map((period, index) => (
                    <Card key={index} className="bg-green-50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-green-800 mb-3">{period.month}</h4>
                        <div className="space-y-2 mb-4">
                          <h5 className="font-medium text-sm text-gray-700">Recommended Activities:</h5>
                          <ul className="text-sm space-y-1">
                            {period.activities.map((activity, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          Weather: {period.weather}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Weather;
