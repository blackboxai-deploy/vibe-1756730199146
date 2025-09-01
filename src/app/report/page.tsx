'use client';

import Navigation from '@/components/Navigation';
import SubmissionForm from '@/components/SubmissionForm';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Report a Street Problem
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help improve your community by reporting problems that need attention. 
              Your report will be visible to other community members who can vote to 
              show which issues are most important.
            </p>
          </div>
          
          <SubmissionForm />
          
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Tips for Effective Reporting
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📸 Photo Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Take clear, well-lit photos</li>
                  <li>• Show the full context of the problem</li>
                  <li>• Include surrounding landmarks if helpful</li>
                  <li>• Multiple angles can be helpful</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📍 Location Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be as specific as possible</li>
                  <li>• Include cross streets or landmarks</li>
                  <li>• Mention direction (northbound, etc.)</li>
                  <li>• Add building numbers if available</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📝 Description Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Describe the impact on the community</li>
                  <li>• Mention any safety concerns</li>
                  <li>• Include how long the problem has existed</li>
                  <li>• Be objective and factual</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">⚡ Priority Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Report safety hazards immediately</li>
                  <li>• Emergency situations: call 911 first</li>
                  <li>• Check if someone has already reported it</li>
                  <li>• Vote on existing reports to show support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}