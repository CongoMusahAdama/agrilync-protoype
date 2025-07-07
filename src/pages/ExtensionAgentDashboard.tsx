
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  CheckCircle, 
  Calendar, 
  MessageSquare,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Eye,
  UserPlus,
  Settings,
  BarChart3,
  Clock,
  Shield
} from 'lucide-react';

const ExtensionAgentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [agentProfile, setAgentProfile] = useState(null);
  const [managedFarmers, setManagedFarmers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [associations, setAssociations] = useState([]);
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

      // Fetch extension agent profile
      const { data: agentData, error: agentError } = await supabase
        .from('extension_agent_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (agentData) {
        setAgentProfile(agentData);
      }

      // Fetch consultations
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select(`
          *,
          profiles!farmer_id (
            full_name,
            location,
            region
          )
        `)
        .eq('extension_agent_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (consultationsError) throw consultationsError;
      setConsultations(consultationsData || []);

      // Fetch associations managed by this agent
      const { data: associationsData, error: associationsError } = await supabase
        .from('associations')
        .select('*')
        .eq('extension_agent_id', user?.id)
        .limit(5);

      if (associationsError) throw associationsError;
      setAssociations(associationsData || []);

      // Fetch farmers in the agent's operational areas
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
        .limit(10);

      if (farmersError) throw farmersError;
      setManagedFarmers(farmersData || []);

    } catch (error) {
      toast.error('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFarmer = async (farmerId: string) => {
    try {
      const { error } = await supabase
        .from('farmer_profiles')
        .update({ 
          is_verified: true,
          credibility_score: 75
        })
        .eq('user_id', farmerId);

      if (error) throw error;
      
      toast.success('Farmer verified successfully!');
      await fetchDashboardData();
    } catch (error) {
      toast.error('Error verifying farmer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Extension Agent Dashboard</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">
                Farmers Managed: {agentProfile?.farmers_managed || 0}
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
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Farmers Managed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agentProfile?.farmers_managed || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Consultations</p>
                  <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Associations</p>
                  <p className="text-2xl font-bold text-gray-900">{associations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Farmers Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Farmers Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {managedFarmers.map((farmer) => (
                    <div key={farmer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{farmer.profiles?.full_name}</h4>
                          <p className="text-sm text-gray-600">{farmer.profiles?.location}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-600">{farmer.profiles?.region}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {farmer.is_verified ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Farm Size:</span> {farmer.farm_size || 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Crops:</span> {farmer.crop_type?.join(', ') || 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Growth Stage:</span> {farmer.current_growth_stage || 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Score:</span> {farmer.credibility_score}/100
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        {!farmer.is_verified && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleVerifyFarmer(farmer.user_id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Consult
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Onboard New Farmer
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Association
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Recent Consultations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Recent Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultations.slice(0, 5).map((consultation) => (
                    <div key={consultation.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-900">{consultation.profiles?.full_name}</p>
                        <Badge variant="outline" className="text-xs">
                          {consultation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{consultation.consultation_type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(consultation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Consultations
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Managed Associations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Managed Associations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {associations.map((association) => (
                    <div key={association.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{association.name}</p>
                      <p className="text-sm text-gray-600">{association.region}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {association.member_count} members
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Create New Association
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionAgentDashboard;
