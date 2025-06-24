'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const { theme, toggleTheme } = useTheme();

  // --- Clerk to MongoDB user sync ---
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '',
              name: user.fullName || user.username || user.id
            })
          });
        } catch (err) {
          // Optionally handle error
        }
      }
    };
    syncUser();
  }, [isSignedIn, user]);

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Image Search', href: '/image-search', icon: '🖼️' },
    { name: 'Audio Search', href: '/audio-search', icon: '🎵' },
    { name: 'Birdpedia', href: '/birdpedia', icon: '📚' },
    { name: 'History', href: '/history', icon: '📜' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="bg-background border-b border-border/40 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold gradient-text">
            BirdCLEF
          </Link>
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 hover-lift ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {isSignedIn ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, {user?.firstName || user?.username || user?.emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button
                className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg hover-lift"
              >
                Sign In
              </button>
            </SignInButton>
          )}
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-accent hover:bg-accent/80 transition-all duration-200"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-border/50">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 hover-lift ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
} 