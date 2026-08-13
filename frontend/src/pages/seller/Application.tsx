import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Clock, AlertCircle, XCircle, FileText, MapPin, Phone, Mail, Building2, User } from 'lucide-react';
import api from '@/lib/api';

const applicationSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  msmeNumber: z.string().optional(),
  giTagged: z.boolean().default(false),
  giProducts: z.array(z.string()).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const CATEGORIES = [
  'Sarees',
  'Dupattas',
  'Fusion Wear',
  'Traditional Wear',
  'Handloom Textiles',
  'Home Decor',
  'Accessories',
  'Other',
];

const STATUS_STEPS = [
  { id: 'SUBMITTED', label: 'Submitted', icon: FileText },
  { id: 'UNDER_REVIEW', label: 'Under Review', icon: Clock },
  { id: 'VERIFICATION', label: 'Verification', icon: CheckCircle },
  { id: 'APPROVED', label: 'Approved', icon: CheckCircle },
];

const Application: React.FC = () => {
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const giTagged = watch('giTagged');
  const selectedCategories = watch('categories', []);

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      const userResponse = await api.get('/auth/me');
      const email = userResponse.data.data.user.email;
      
      const appResponse = await api.get(`/sellers/applications/status?email=${email}`);
      if (appResponse.data.data) {
        setApplicationStatus(appResponse.data.data);
        
        // Store sellerId for other pages
        if (appResponse.data.data.sellerId) {
          localStorage.setItem('sellerIdForProducts', appResponse.data.data.sellerId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch application status:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await api.post('/sellers/register', {
        businessName: data.businessName,
        contactPerson: data.ownerName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        categories: data.categories,
        giTagged: data.giTagged,
        giProducts: data.giProducts,
        msme: !!data.msmeNumber,
        msmeNumber: data.msmeNumber,
      });
      
      // Store sellerId from response if available
      if (response.data.data?.sellerId) {
        localStorage.setItem('sellerIdForProducts', response.data.data.sellerId);
      }
      
      setSuccess(true);
      setTimeout(() => {
        fetchApplicationStatus();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (category: string) => {
    const current = selectedCategories || [];
    if (current.includes(category)) {
      setValue('categories', current.filter(c => c !== category));
    } else {
      setValue('categories', [...current, category]);
    }
  };

  const getCurrentStepIndex = () => {
    if (!applicationStatus) return -1;
    const stepIndex = STATUS_STEPS.findIndex(step => step.id === applicationStatus.status);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#2D2A26] mb-2">Application Submitted</h2>
          <p className="text-[#6B6660]">Your application has been submitted successfully. We will review it shortly.</p>
        </div>
      </div>
    );
  }

  if (applicationStatus && applicationStatus.status !== 'SUBMITTED') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-[#2D2A26] mb-2">Application Status</h1>
          <p className="text-[#6B6660]">Track your seller application progress</p>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            {STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const currentStep = getCurrentStepIndex();
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}>
                      <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-sm mt-2 ${isCurrent ? 'font-semibold text-[#8B7AB8]' : 'text-[#6B6660]'}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Application Details */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6B6660] mb-1">Business Name</p>
                <p className="text-base font-medium text-[#2D2A26]">{applicationStatus.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B6660] mb-1">Contact Person</p>
                <p className="text-base font-medium text-[#2D2A26]">{applicationStatus.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B6660] mb-1">Email</p>
                <p className="text-base font-medium text-[#2D2A26]">{applicationStatus.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B6660] mb-1">Phone</p>
                <p className="text-base font-medium text-[#2D2A26]">{applicationStatus.phone}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B6660] mb-1">Location</p>
                <p className="text-base font-medium text-[#2D2A26]">{applicationStatus.location}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B6660] mb-1">Categories</p>
                <p className="text-base font-medium text-[#2D2A26]">{applicationStatus.categories?.join(', ')}</p>
              </div>
            </div>

            {applicationStatus.status === 'REJECTED' && (
              <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-rose-700 mb-1">Application Rejected</p>
                    <p className="text-sm text-rose-600">{applicationStatus.notes || 'Please contact support for more information.'}</p>
                  </div>
                </div>
              </div>
            )}

            {applicationStatus.reviewedAt && (
              <div className="mt-4 text-sm text-[#6B6660]">
                Last reviewed: {new Date(applicationStatus.reviewedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#2D2A26] mb-2">Seller Application</h1>
        <p className="text-[#6B6660]">Complete your application to start selling on VendSway</p>
      </div>

      {/* Application Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-2">Business Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6660]" />
                  <input
                    {...register('businessName')}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    placeholder="Enter business name"
                  />
                </div>
                {errors.businessName && <p className="text-rose-600 text-sm mt-1">{errors.businessName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-2">Owner Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6660]" />
                  <input
                    {...register('ownerName')}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    placeholder="Enter owner name"
                  />
                </div>
                {errors.ownerName && <p className="text-rose-600 text-sm mt-1">{errors.ownerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6660]" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && <p className="text-rose-600 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-2">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6660]" />
                  <input
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && <p className="text-rose-600 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2D2A26] mb-2">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6660]" />
                  <input
                    {...register('location')}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                    placeholder="Enter your business location"
                  />
                </div>
                {errors.location && <p className="text-rose-600 text-sm mt-1">{errors.location.message}</p>}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-[#2D2A26] mb-2">Product Categories *</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedCategories.includes(category)
                      ? 'bg-[#8B7AB8] text-white border-[#8B7AB8]'
                      : 'bg-white text-[#2D2A26] border-slate-200 hover:border-[#8B7AB8]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.categories && <p className="text-rose-600 text-sm mt-1">{errors.categories.message}</p>}
          </div>

          {/* GI Information */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <input
                {...register('giTagged')}
                type="checkbox"
                id="giTagged"
                className="w-4 h-4 text-[#8B7AB8] border-slate-300 rounded focus:ring-[#8B7AB8]"
              />
              <label htmlFor="giTagged" className="text-sm font-medium text-[#2D2A26]">
                We sell GI-tagged products
              </label>
            </div>

            {giTagged && (
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-2">GI Products</label>
                <input
                  {...register('giProducts')}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                  placeholder="Enter GI products (comma separated)"
                />
              </div>
            )}
          </div>

          {/* MSME Information */}
          <div>
            <label className="block text-sm font-medium text-[#2D2A26] mb-2">MSME Number (Optional)</label>
            <input
              {...register('msmeNumber')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
              placeholder="Enter MSME registration number"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Application;