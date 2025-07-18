
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
  Shield,
  User,
  Upload,
  Award
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const ExtensionAgentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [agentProfile, setAgentProfile] = useState(null);
  const [managedFarmers, setManagedFarmers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    specialization: '',
    region: '',
    location: '',
    expertise_areas: [] as string[],
  });
  const [updating, setUpdating] = useState(false);
  // Certificate upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [certificates, setCertificates] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchCertificates();
    } else {
      setProfile(null);
      setAgentProfile(null);
      setCertificates([]);
      setLoading(false);
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
        setProfileData(prev => ({
          ...prev,
          specialization: agentData.specialization || '',
          region: agentData.region || '',
          location: agentData.location || '',
          expertise_areas: agentData.expertise_areas || [],
        }));
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

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('extension_agent_profiles')
        .update({
          specialization: profileData.specialization,
          region: profileData.region,
          location: profileData.location,
          expertise_areas: profileData.expertise_areas,
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      await fetchDashboardData();
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleExpertiseChange = (area: string) => {
    setProfileData(prev => ({
      ...prev,
      expertise_areas: prev.expertise_areas.includes(area)
        ? prev.expertise_areas.filter(a => a !== area)
        : [...prev.expertise_areas, area],
    }));
  };

  // Fetch certificates from Supabase storage (or set empty if not configured)
  const fetchCertificates = async () => {
    try {
      // Example: fetch from Supabase storage bucket 'certificates'
      // const { data, error } = await supabase.storage.from('certificates').list(user?.id + '/');
      // if (error) throw error;
      // setCertificates(data || []);
      setCertificates([]); // Placeholder for now
    } catch (error) {
      setCertificates([]);
    }
  };

  // Handle certificate upload
  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      // Example: upload to Supabase storage bucket 'certificates'
      // const { data, error } = await supabase.storage.from('certificates').upload(`${user?.id}/${file.name}`, file);
      // if (error) throw error;
      // await fetchCertificates();
      // toast.success('Certificate uploaded!');
      // For now, just simulate success
      setTimeout(() => {
        setUploading(false);
        toast.success('Certificate uploaded! (Demo)');
      }, 1000);
    } catch (error) {
      setUploadError('Failed to upload certificate');
      setUploading(false);
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Extension Agent Dashboard</h1>
                <p className="text-gray-600 text-xs sm:text-base">Welcome back, {profile?.full_name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Badge className="bg-blue-100 text-blue-800">
                Farmers Managed: {agentProfile?.farmers_managed || 0}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Profile Completion */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xs sm:text-base">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="specialization" className="text-xs sm:text-sm">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Crop Science"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData(prev => ({ ...prev, specialization: e.target.value }))}
                      className="text-xs sm:text-base px-3 py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region" className="text-xs sm:text-sm">Region</Label>
                    <Select value={profileData.region} onValueChange={(value) => setProfileData(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger className="text-xs sm:text-base px-3 py-2">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ashanti">Ashanti</SelectItem>
                        <SelectItem value="northern">Northern</SelectItem>
                        <SelectItem value="eastern">Eastern</SelectItem>
                        <SelectItem value="western">Western</SelectItem>
                        <SelectItem value="central">Central</SelectItem>
                        <SelectItem value="volta">Volta</SelectItem>
                        <SelectItem value="upper_east">Upper East</SelectItem>
                        <SelectItem value="upper_west">Upper West</SelectItem>
                        <SelectItem value="greater_accra">Greater Accra</SelectItem>
                        <SelectItem value="brong_ahafo">Brong Ahafo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Expertise Areas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['Crop Science', 'Soil Science', 'Irrigation', 'Pest Control', 'Agroforestry', 'Extension Training'].map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handleExpertiseChange(area)}
                        className={`p-2 text-xs sm:text-sm rounded-lg border transition-colors flex items-center gap-1 ${
                          profileData.expertise_areas.includes(area)
                            ? 'bg-blue-100 border-blue-300 text-blue-800 font-semibold'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Award className="h-4 w-4" /> {area}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs sm:text-sm">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Tamale, Northern Region"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="text-xs sm:text-base px-3 py-2"
                  />
                </div>
                <Button onClick={handleUpdateProfile} disabled={updating} className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-base py-2 sm:py-3">
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>
            {/* Certification Upload */}
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xs sm:text-base">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Upload Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                  <p className="text-gray-600 text-xs sm:text-base">Drag and drop certificates or click to browse</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Supports: PDF, PNG, JPG (Max 5MB each)</p>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" id="certificate-upload" onChange={handleCertificateUpload} disabled={uploading} />
                  <label htmlFor="certificate-upload">
                    <Button variant="outline" className="mt-3 sm:mt-4 text-xs sm:text-base" disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Certificates'}
                    </Button>
                  </label>
                  {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                  {/* Show uploaded certificates if any */}
                  {certificates.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {certificates.map((cert, idx) => (
                        <a key={idx} href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">{cert.name}</a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">No certificates uploaded yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Dashboard Features */}
          <div className="space-y-4 sm:space-y-6">
            {/* Verification Status */}
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xs sm:text-base">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3 sm:space-y-4">
                  {agentProfile?.is_verified ? (
                    <div className="text-green-600">
                      <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-1 sm:mb-2" />
                      <p className="font-semibold text-xs sm:text-base">Verified Extension Agent</p>
                      <p className="text-xs sm:text-sm text-gray-600">You can now access all features</p>
                    </div>
                  ) : (
                    <div className="text-yellow-600">
                      <Award className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-1 sm:mb-2" />
                      <p className="font-semibold text-xs sm:text-base">Pending Verification</p>
                      <p className="text-xs sm:text-sm text-gray-600">Complete your profile to get verified</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-xs sm:text-sm text-gray-600">Credibility Score</span>
                      <span className="font-bold text-base sm:text-lg">{agentProfile?.credibility_score || 0}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${agentProfile?.credibility_score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Quick Actions */}
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-xs sm:text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/ai-consultation')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Consultation
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/farmer-outreach')}>
                  <Users className="h-4 w-4 mr-2" />
                  Farmer Outreach
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/training-sessions')}>
                  <Award className="h-4 w-4 mr-2" />
                  Training Sessions
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/disease-detection')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Disease Detection
                </Button>
              </CardContent>
            </Card>
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
