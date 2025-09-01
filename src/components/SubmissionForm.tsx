'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from './ImageUpload';
import { Problem, ProblemFormData, PROBLEM_CATEGORIES } from '@/lib/types';
import { convertImageToBase64, generateId } from '@/lib/storage';
import { useProblems } from '@/hooks/use-problems';

const SubmissionForm = () => {
  const router = useRouter();
  const { submitProblem } = useProblems();
  
  const [formData, setFormData] = useState<ProblemFormData>({
    title: '',
    description: '',
    category: 'pothole',
    location: '',
    reporterName: '',
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.reporterName.trim()) {
      newErrors.reporterName = 'Your name is required';
    }

    if (!selectedImage) {
      newErrors.image = 'Please upload a photo of the problem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageData = '';
      if (selectedImage) {
        imageData = await convertImageToBase64(selectedImage);
      }

      const newProblem: Problem = {
        id: generateId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location.trim(),
        image: imageData,
        votes: 0,
        votedBy: [],
        timestamp: Date.now(),
        status: 'reported',
        reporterName: formData.reporterName.trim(),
      };

      submitProblem(newProblem);
      
      // Success feedback
      alert('Problem reported successfully! Thank you for helping improve our community.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'pothole',
        location: '',
        reporterName: '',
      });
      setSelectedImage(null);
      
      // Navigate to feed
      router.push('/feed');
      
    } catch (error) {
      console.error('Error submitting problem:', error);
      alert('Failed to submit problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ProblemFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Report a Street Problem</CardTitle>
        <p className="text-gray-600 text-center">
          Help make your community better by reporting issues that need attention
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="reporterName">Your Name</Label>
            <Input
              id="reporterName"
              type="text"
              placeholder="Enter your name or 'Anonymous'"
              value={formData.reporterName}
              onChange={(e) => handleInputChange('reporterName', e.target.value)}
              className={errors.reporterName ? 'border-red-500' : ''}
            />
            {errors.reporterName && (
              <p className="text-red-500 text-sm">{errors.reporterName}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Problem Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Brief description of the problem"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Problem Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select problem category" />
              </SelectTrigger>
              <SelectContent>
                {PROBLEM_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              type="text"
              placeholder="Street address, intersection, or landmark"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide details about the problem, its impact, and any safety concerns..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
            />
            <div className="text-sm text-gray-500">
              {formData.description.length}/500 characters
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Problem Photo *</Label>
            <ImageUpload 
              onImageSelect={setSelectedImage}
              className={errors.image ? 'border-red-500 rounded-lg' : ''}
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting Problem...
                </div>
              ) : (
                'Report Problem'
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            By submitting this report, you agree to make this information publicly available 
            to help improve community infrastructure.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubmissionForm;