
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Calendar,
  MapPin,
  Crop,
  BarChart3,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [investorProfile, setInvestorProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [verifiedFarmers, setVerifiedFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch basic profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch investor profile
      const { data: investorData, error: investorError } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (investorData) {
        setInvestorProfile(investorData);
      }

      // Fetch farm partner opportunities
      const { data: opportunitiesData, error: opportunitiesError } = await supabase
        .from('farm_partner_opportunities')
        .select(`
          *,
          profiles!farmer_id (
            full_name,
            location,
            region
          )
        `)
        .eq('status', 'open')
        .limit(10);

      if (opportunitiesError) throw opportunitiesError;
      setOpportunities(opportunitiesData || []);

      // Fetch verified farmers
      const { data: farmersData, error: farmersError } = await supabase
        .from('farmer_profiles')
        .select(`
          *,
          profiles!user_id (
            full_name,
            location,
            region
          )
        `)
        .eq('is_verified', true)
        .limit(8);

      if (farmersError) throw farmersError;
      setVerifiedFarmers(farmersData || []);

    } catch (error) {
      toast.error('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">
                Active Investments: {investorProfile?.active_partnerships || 0}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Investments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    GH₵{investorProfile?.total_investments?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Partners</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {investorProfile?.active_partnerships || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ROI Average</p>
                  <p className="text-2xl font-bold text-gray-900">12.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FarmPartner Opportunities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  FarmPartner Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                          <p className="text-sm text-gray-600">
                            by {opportunity.profiles?.full_name} • {opportunity.profiles?.location}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {opportunity.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Funding: GH₵{opportunity.funding_needed?.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Crop className="h-4 w-4 mr-1" />
                          Crop: {opportunity.crop_type}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          Size: {opportunity.farm_size}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Expected: {opportunity.expected_yield}kg
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{opportunity.description}</p>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Invest Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verified Farmers & Quick Actions */}
          <div className="space-y-6">
            {/* Verified Farmers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verified Farmers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verifiedFarmers.slice(0, 5).map((farmer) => (
                    <div key={farmer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{farmer.profiles?.full_name}</p>
                        <p className="text-sm text-gray-600">{farmer.profiles?.location}</p>
                        <div className="flex items-center mt-1">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-xs text-green-600">Score: {farmer.credibility_score}/100</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Farmers
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Opportunities
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Investment Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Farm Progress Reports
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">New opportunity posted</p>
                      <p className="text-xs text-gray-600">Maize farming in Ashanti • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Progress update received</p>
                      <p className="text-xs text-gray-600">Cocoa harvest update • 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Investment completed</p>
                      <p className="text-xs text-gray-600">Tomato farming project • 3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
