
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
import { useNavigate } from 'react-router-dom';

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

  // Farm photo upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [farmPhotos, setFarmPhotos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchFarmPhotos();
    } else {
      setProfile(null);
      setFarmerProfile(null);
      setFarmPhotos([]);
      setLoading(false);
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

  // Fetch farm photos from Supabase storage
  const fetchFarmPhotos = async () => {
    if (!user) return setFarmPhotos([]);
    try {
      const { data, error } = await supabase.storage.from('farm-photos').list(`${user.id}/`);
      if (error) throw error;
      if (!data) return setFarmPhotos([]);
      // Get public URLs for each photo
      const urls = data
        .filter(item => item.name && !item.name.endsWith('/'))
        .map(item => ({
          url: supabase.storage.from('farm-photos').getPublicUrl(`${user.id}/${item.name}`).data.publicUrl,
          name: item.name
        }));
      setFarmPhotos(urls);
    } catch (error) {
      setFarmPhotos([]);
    }
  };

  // Handle farm photo upload
  const handleFarmPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setUploadError('');
    try {
      const { data, error } = await supabase.storage.from('farm-photos').upload(`${user.id}/${file.name}`, file, { upsert: true });
      if (error) throw error;
      await fetchFarmPhotos();
      toast.success('Photo uploaded!');
    } catch (error) {
      setUploadError('Failed to upload photo');
    } finally {
      setUploading(false);
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <User className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-gray-600 text-xs sm:text-base">Welcome back, {profile?.full_name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
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
                    <Label htmlFor="farm_size" className="text-xs sm:text-sm">Farm Size</Label>
                    <Input
                      id="farm_size"
                      placeholder="e.g., 5 acres"
                      value={profileData.farm_size}
                      onChange={(e) => setProfileData(prev => ({ ...prev, farm_size: e.target.value }))}
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
                  <Label className="text-xs sm:text-sm">Crop Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['Cocoa', 'Maize', 'Cassava', 'Yam', 'Plantain', 'Rice', 'Tomato', 'Pepper'].map(crop => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => handleCropTypeChange(crop)}
                        className={`p-2 text-xs sm:text-sm rounded-lg border transition-colors flex items-center gap-1 ${
                          profileData.crop_type.includes(crop)
                            ? 'bg-green-100 border-green-300 text-green-800 font-semibold'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Crop className="h-4 w-4" /> {crop}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs sm:text-sm">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Kumasi, Ashanti Region"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="text-xs sm:text-base px-3 py-2"
                  />
                </div>
                <div>
                  <Label htmlFor="growth_stage" className="text-xs sm:text-sm">Current Growth Stage</Label>
                  <Select value={profileData.current_growth_stage} onValueChange={(value) => setProfileData(prev => ({ ...prev, current_growth_stage: value }))}>
                    <SelectTrigger className="text-xs sm:text-base px-3 py-2">
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
                  <Label htmlFor="previous_harvest" className="text-xs sm:text-sm">Previous Harvest Details (JSON format)</Label>
                  <Textarea
                    id="previous_harvest"
                    placeholder='{"year": 2023, "yield": "500kg", "crops": ["Maize", "Cassava"]}'
                    value={profileData.previous_harvest}
                    onChange={(e) => setProfileData(prev => ({ ...prev, previous_harvest: e.target.value }))}
                    className="text-xs sm:text-base px-3 py-2"
                  />
                </div>
                <Button onClick={handleUpdateProfile} disabled={updating} className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-base py-2 sm:py-3">
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>
            {/* Farm Photos Upload */}
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xs sm:text-base">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Upload Farm Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                  <p className="text-gray-600 text-xs sm:text-base">Drag and drop photos or click to browse</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Supports: JPG, PNG, WebP (Max 5MB each)</p>
                  <input type="file" accept="image/*" className="hidden" id="farm-photo-upload" onChange={handleFarmPhotoUpload} disabled={uploading} />
                  <label htmlFor="farm-photo-upload">
                    <Button variant="outline" className="mt-3 sm:mt-4 text-xs sm:text-base" disabled={uploading}>
                      <Camera className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Photos'}
                    </Button>
                  </label>
                  {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                  {/* Show uploaded photos if any */}
                  {farmPhotos.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {farmPhotos.map((photo, idx) => (
                        <img key={idx} src={photo.url} alt="Farm" className="w-20 h-20 object-cover rounded-lg border" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">No farm photos uploaded yet.</p>
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
                  {farmerProfile?.is_verified ? (
                    <div className="text-green-600">
                      <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-1 sm:mb-2" />
                      <p className="font-semibold text-xs sm:text-base">Verified Farmer</p>
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
                      <span className="font-bold text-base sm:text-lg">{farmerProfile?.credibility_score || 0}/100</span>
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
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-xs sm:text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/ai-consultation')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Consultation
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/ai-consultation?tab=human-consultation')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/association')}>
                  <Users className="h-4 w-4 mr-2" />
                  Join Association
                </Button>
                <Button className="w-full justify-start text-xs sm:text-base py-2 sm:py-3" variant="outline" onClick={() => navigate('/farm-partner')}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  FarmPartner Opportunities
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
    </div>
  );
};

export default FarmerDashboard;
