'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useProblems } from '@/hooks/use-problems';
import { PROBLEM_CATEGORIES } from '@/lib/types';

export default function Home() {
  const { problems, getTopProblems, loading } = useProblems();

  const topProblems = getTopProblems(3);
  const totalProblems = problems.length;
  const totalVotes = problems.reduce((sum, p) => sum + p.votes, 0);

  const stats = [
    { label: 'Problems Reported', value: totalProblems },
    { label: 'Community Votes', value: totalVotes },
    { label: 'Categories', value: PROBLEM_CATEGORIES.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Make Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Community </span>
            Better
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Report street problems, vote on community priorities, and help local authorities 
            focus on what matters most to your neighborhood.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Report a Problem
              </Button>
            </Link>
            
            <Link href="/feed">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-400 px-8 py-4 text-lg">
                View Community Feed
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-white/70 backdrop-blur border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {loading ? '...' : stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">📸</span>
                </div>
                <CardTitle className="text-xl">1. Report Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Take a photo and describe street problems in your area. Add location details 
                  to help authorities locate the issue quickly.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">👍</span>
                </div>
                <CardTitle className="text-xl">2. Community Votes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Community members vote on reported problems to show which issues 
                  need the most urgent attention from local authorities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">🔧</span>
                </div>
                <CardTitle className="text-xl">3. Priority Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The most voted problems appear at the top, helping authorities 
                  prioritize fixes based on community needs and concerns.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Problems Section */}
      {topProblems.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Top Community Concerns
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topProblems.map((problem, index) => (
                <Card key={problem.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1} Most Voted
                      </Badge>
                      <Badge variant="outline">
                        {problem.votes} votes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={problem.image} 
                      alt={problem.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {problem.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {problem.description}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>📍</span>
                      <span className="line-clamp-1">{problem.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link href="/feed">
                <Button variant="outline" size="lg">
                  View All Problems →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Problem Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PROBLEM_CATEGORIES.filter(cat => cat.value !== 'other').map((category) => (
              <Card key={category.value} className="text-center bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-sm mb-2">{category.label}</h3>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join your community in reporting and prioritizing street problems that need attention.
              </p>
              <Link href="/report">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Report Your First Problem
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-white/70">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-600">
            © 2024 StreetReport. Empowering communities to improve their neighborhoods.
          </p>
        </div>
      </footer>
    </div>
  );
}