
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
  Target,
  User,
  Upload,
  Award,
  BarChart2,
  MessageSquare
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [investorProfile, setInvestorProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [verifiedFarmers, setVerifiedFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    investment_amount: '',
    region: '',
    investment_interests: [],
    location: '',
  });
  const [updating, setUpdating] = useState(false);
  // Investment document upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [investmentDocs, setInvestmentDocs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchInvestmentDocs();
    } else {
      setProfile(null);
      setInvestorProfile(null);
      setInvestmentDocs([]);
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

      // Fetch investor profile
      const { data: investorData, error: investorError } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (investorData) {
        setInvestorProfile(investorData);
        setProfileData(prev => ({
          ...prev,
          investment_amount: investorData.investment_amount || '',
          region: investorData.region || '',
          investment_interests: investorData.investment_interests || [],
          location: investorData.location || '',
        }));
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

  // Fetch investment docs from Supabase storage
  const fetchInvestmentDocs = async () => {
    if (!user) return setInvestmentDocs([]);
    try {
      const { data, error } = await supabase.storage.from('investment-docs').list(`${user.id}/`);
      if (error) throw error;
      if (!data) return setInvestmentDocs([]);
      // Get public URLs for each doc
      const urls = data
        .filter(item => item.name && !item.name.endsWith('/'))
        .map(item => ({
          url: supabase.storage.from('investment-docs').getPublicUrl(`${user.id}/${item.name}`).data.publicUrl,
          name: item.name
        }));
      setInvestmentDocs(urls);
    } catch (error) {
      setInvestmentDocs([]);
    }
  };

  // Handle investment doc upload
  const handleInvestmentDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setUploadError('');
    try {
      const { data, error } = await supabase.storage.from('investment-docs').upload(`${user.id}/${file.name}`, file, { upsert: true });
      if (error) throw error;
      await fetchInvestmentDocs();
      toast.success('Document uploaded!');
    } catch (error) {
      setUploadError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleInterestChange = (crop) => {
    setProfileData(prev => {
      const interests = [...prev.investment_interests];
      if (interests.includes(crop)) {
        return { ...prev, investment_interests: interests.filter(i => i !== crop) };
      } else {
        return { ...prev, investment_interests: [...interests, crop] };
      }
    });
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('investor_profiles')
        .update({
          investment_amount: profileData.investment_amount,
          region: profileData.region,
          investment_interests: profileData.investment_interests,
          location: profileData.location,
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      setInvestorProfile(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setUpdating(false);
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Investor Dashboard</h1>
                <p className="text-gray-600 text-xs sm:text-base">Welcome back, {profile?.full_name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Badge className="bg-purple-100 text-purple-800">
                Active Investments: {investorProfile?.active_partnerships || 0}
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
                    <Label htmlFor="investment_amount" className="text-xs sm:text-sm">Investment Amount</Label>
                    <Input
                      id="investment_amount"
                      placeholder="e.g., 1000 GHS"
                      value={profileData.investment_amount}
                      onChange={(e) => setProfileData(prev => ({ ...prev, investment_amount: e.target.value }))}
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
                  <Label className="text-xs sm:text-sm">Investment Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['Cocoa', 'Maize', 'Cassava', 'Yam', 'Plantain', 'Rice', 'Tomato', 'Pepper'].map(crop => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => handleInterestChange(crop)}
                        className={`p-2 text-xs sm:text-sm rounded-lg border transition-colors flex items-center gap-1 ${
                          profileData.investment_interests.includes(crop)
                            ? 'bg-purple-100 border-purple-300 text-purple-800 font-semibold'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <DollarSign className="h-4 w-4" /> {crop}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs sm:text-sm">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Accra, Greater Accra Region"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="text-xs sm:text-base px-3 py-2"
                  />
                </div>
                <Button onClick={handleUpdateProfile} disabled={updating} className="w-full bg-purple-600 hover:bg-purple-700 text-xs sm:text-base py-2 sm:py-3">
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>
            {/* Investment Documents Upload */}
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xs sm:text-base">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Upload Investment Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                  <p className="text-gray-600 text-xs sm:text-base">Drag and drop documents or click to browse</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Supports: PDF, DOCX (Max 5MB each)</p>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="investment-doc-upload" onChange={handleInvestmentDocUpload} disabled={uploading} />
                  <label htmlFor="investment-doc-upload">
                    <Button variant="outline" className="mt-3 sm:mt-4 text-xs sm:text-base" disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Documents'}
                    </Button>
                  </label>
                  {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                  {/* Show uploaded docs if any */}
                  {investmentDocs.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {investmentDocs.map((doc, idx) => (
                        <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">{doc.name}</a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">No investment documents uploaded yet.</p>
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
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3 sm:space-y-4">
                  {investorProfile?.is_verified ? (
                    <div className="text-green-600">
                      <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-1 sm:mb-2" />
                      <p className="font-semibold text-xs sm:text-base">Verified Investor</p>
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
                      <span className="font-bold text-base sm:text-lg">{investorProfile?.credibility_score || 0}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${investorProfile?.credibility_score || 0}%` }}
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
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/farm-partner')}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Invest in FarmPartner
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/portfolio')}>
                  <BarChart2 className="h-4 w-4 mr-2" />
                  View Portfolio
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/ai-consultation')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Consultation
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/investor-group')}>
                  <Users className="h-4 w-4 mr-2" />
                  Join Investor Group
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
