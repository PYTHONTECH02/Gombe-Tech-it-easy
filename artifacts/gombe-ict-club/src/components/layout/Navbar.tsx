import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [location] = useLocation();
  const { user, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/gaming', label: 'Gaming' },
    { href: '/cyber', label: 'Cyber' },
    { href: '/coding', label: 'Coding' },
    { href: '/members', label: 'Members' },
    { href: '/announcements', label: 'News' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-[60px] bg-[#0A0A0A] border-b-[3px] border-[#FFE500] text-white flex items-center justify-between px-4 md:px-8">
      <Link href="/" className="flex flex-col items-start justify-center group cursor-pointer">
        <span className="font-display text-2xl leading-none text-[#FFE500] tracking-wider group-hover:text-white transition-colors">
          GOMBE SS ICT
        </span>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mt-1">
          Senior Secondary School
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm uppercase font-bold tracking-wider px-3 py-1.5 transition-colors ${
              location === link.href 
                ? 'bg-[#FFE500] text-[#0A0A0A]' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <Link href="/account" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#C44DFF] border-[2px] border-[#0A0A0A] flex items-center justify-center font-bold text-[#0A0A0A] group-hover:shadow-[2px_2px_0_#FFE500] transition-all">
              {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-bold truncate max-w-[100px]">
              {profile?.full_name || profile?.email?.split('@')[0]}
            </span>
          </Link>
        ) : (
          <Link 
            href="/auth"
            className="bg-[#FFE500] text-[#0A0A0A] font-bold uppercase tracking-wider px-4 py-2 border-[2px] border-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#0A0A0A] transition-all"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-[#0A0A0A] border-b-[3px] border-[#0A0A0A] flex flex-col p-4 md:hidden shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg uppercase font-bold tracking-wider py-3 border-b border-gray-800 ${
                location === link.href ? 'text-[#FFE500]' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-2">
            {user ? (
              <Link 
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 w-full p-2 bg-gray-900 border-[2px] border-[#0A0A0A]"
              >
                <div className="w-10 h-10 rounded-full bg-[#C44DFF] flex items-center justify-center font-bold text-[#0A0A0A] text-xl">
                  {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-bold text-white">
                  {profile?.full_name || profile?.email}
                </span>
              </Link>
            ) : (
              <Link 
                href="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-center w-full bg-[#FFE500] text-[#0A0A0A] font-bold uppercase tracking-wider px-4 py-3 border-[3px] border-[#0A0A0A]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
