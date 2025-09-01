'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/feed', label: 'Community Feed' },
    { href: '/report', label: 'Report Problem' },
  ];

  return (
    <header className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="font-bold text-xl text-gray-900">StreetReport</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-gray-600 hover:text-gray-900 transition-colors font-medium',
                  pathname === item.href && 'text-blue-600 font-semibold'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/report">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                Report Issue
              </Button>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <details className="dropdown dropdown-end">
                <summary className="btn btn-ghost btn-circle">
                  <div className="flex flex-col space-y-1">
                    <div className="w-5 h-0.5 bg-gray-600"></div>
                    <div className="w-5 h-0.5 bg-gray-600"></div>
                    <div className="w-5 h-0.5 bg-gray-600"></div>
                  </div>
                </summary>
                <div className="dropdown-content mt-2 p-2 shadow-lg bg-white rounded-lg border min-w-[200px]">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors',
                        pathname === item.href && 'text-blue-600 bg-blue-50 font-semibold'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden mt-4 border-t pt-4">
          <div className="flex justify-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm text-gray-600 hover:text-gray-900 transition-colors',
                  pathname === item.href && 'text-blue-600 font-semibold'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;