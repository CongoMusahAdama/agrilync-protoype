
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  MapPin, 
  Crop, 
  Camera, 
  Award, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Users,
  DollarSign,
  Upload,
  Eye,
  CheckCircle
} from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [profileData, setProfileData] = useState({
    farm_size: '',
    crop_type: [],
    current_growth_stage: '',
    previous_harvest: '',
    location: '',
    region: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      // Fetch basic profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch farmer-specific profile
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (farmerData) {
        setFarmerProfile(farmerData);
        setProfileData({
          farm_size: farmerData.farm_size || '',
          crop_type: farmerData.crop_type || [],
          current_growth_stage: farmerData.current_growth_stage || '',
          previous_harvest: farmerData.previous_harvest ? JSON.stringify(farmerData.previous_harvest) : '',
          location: profileData.location || '',
          region: profileData.region || ''
        });
      }
    } catch (error) {
      toast.error('Error fetching profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      // Update basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          location: profileData.location,
          region: profileData.region
        })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      // Update or create farmer profile
      const farmerUpdateData = {
        user_id: user?.id,
        farm_size: profileData.farm_size,
        crop_type: profileData.crop_type,
        current_growth_stage: profileData.current_growth_stage,
        previous_harvest: profileData.previous_harvest ? JSON.parse(profileData.previous_harvest) : null
      };

      if (farmerProfile) {
        const { error: farmerError } = await supabase
          .from('farmer_profiles')
          .update(farmerUpdateData)
          .eq('user_id', user?.id);
        if (farmerError) throw farmerError;
      } else {
        const { error: farmerError } = await supabase
          .from('farmer_profiles')
          .insert(farmerUpdateData);
        if (farmerError) throw farmerError;
      }

      toast.success('Profile updated successfully!');
      await fetchUserProfile();
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCropTypeChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      crop_type: prev.crop_type.includes(value) 
        ? prev.crop_type.filter(crop => crop !== value)
        : [...prev.crop_type, value]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
              <div className="bg-green-100 p-2 rounded-full">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {farmerProfile?.is_verified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified Farmer
                </Badge>
              )}
              <Badge variant="outline">
                Credibility Score: {farmerProfile?.credibility_score || 0}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Completion */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farm_size">Farm Size</Label>
                    <Input
                      id="farm_size"
                      placeholder="e.g., 5 acres"
                      value={profileData.farm_size}
                      onChange={(e) => setProfileData(prev => ({ ...prev, farm_size: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select value={profileData.region} onValueChange={(value) => setProfileData(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger>
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
                  <Label>Crop Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['Cocoa', 'Maize', 'Cassava', 'Yam', 'Plantain', 'Rice', 'Tomato', 'Pepper'].map(crop => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => handleCropTypeChange(crop)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          profileData.crop_type.includes(crop)
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Kumasi, Ashanti Region"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="growth_stage">Current Growth Stage</Label>
                  <Select value={profileData.current_growth_stage} onValueChange={(value) => setProfileData(prev => ({ ...prev, current_growth_stage: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select growth stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="land_preparation">Land Preparation</SelectItem>
                      <SelectItem value="planting">Planting</SelectItem>
                      <SelectItem value="germination">Germination</SelectItem>
                      <SelectItem value="vegetative">Vegetative Growth</SelectItem>
                      <SelectItem value="flowering">Flowering</SelectItem>
                      <SelectItem value="fruiting">Fruiting</SelectItem>
                      <SelectItem value="harvesting">Harvesting</SelectItem>
                      <SelectItem value="post_harvest">Post-Harvest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="previous_harvest">Previous Harvest Details (JSON format)</Label>
                  <Textarea
                    id="previous_harvest"
                    placeholder='{"year": 2023, "yield": "500kg", "crops": ["Maize", "Cassava"]}'
                    value={profileData.previous_harvest}
                    onChange={(e) => setProfileData(prev => ({ ...prev, previous_harvest: e.target.value }))}
                  />
                </div>

                <Button onClick={handleUpdateProfile} disabled={updating} className="w-full">
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Farm Photos Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Upload Farm Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Drag and drop photos or click to browse</p>
                  <p className="text-sm text-gray-500 mt-2">Supports: JPG, PNG, WebP (Max 5MB each)</p>
                  <Button variant="outline" className="mt-4">
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Features */}
          <div className="space-y-6">
            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  {farmerProfile?.is_verified ? (
                    <div className="text-green-600">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-semibold">Verified Farmer</p>
                      <p className="text-sm text-gray-600">You can now access all features</p>
                    </div>
                  ) : (
                    <div className="text-yellow-600">
                      <Award className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-semibold">Pending Verification</p>
                      <p className="text-sm text-gray-600">Complete your profile to get verified</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Credibility Score</span>
                      <span className="font-bold text-lg">{farmerProfile?.credibility_score || 0}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${farmerProfile?.credibility_score || 0}%` }}
                      ></div>
                    </div>
                  </div>
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
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Consultation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Join Association
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  FarmPartner Opportunities
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Disease Detection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
