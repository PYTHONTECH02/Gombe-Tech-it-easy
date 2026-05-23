import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex-1 bg-[#0A0A0A] text-white flex flex-col min-h-[calc(100vh-60px)]">
      {/* Hero Section */}
      <div 
        className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#FFE500 2px, transparent 2px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0'
        }}
      >
        <div className="absolute inset-0 bg-[#0A0A0A]/80 z-0"></div>
        
        <div className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-block bg-[#FFE500] text-[#0A0A0A] px-4 py-1 font-bold tracking-widest text-sm mb-6 neubrutalism-box border-[#0A0A0A] border-[3px]">
            EST. 2024
          </div>
          <h1 className="font-display text-[64px] md:text-[120px] lg:text-[176px] leading-[0.8] tracking-tight mb-6 text-white drop-shadow-[4px_4px_0_#FFE500] md:drop-shadow-[8px_8px_0_#FFE500]">
            GOMBE ICT CLUB
          </h1>
          <p className="text-xl md:text-3xl font-bold max-w-2xl text-gray-300 mb-12">
            Three departments. One community. Building the future of tech in Gombe.
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 border-t-[3px] border-b-[3px] border-[#0A0A0A] bg-[#0A0A0A]">
        <div className="bg-[#C44DFF] p-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#0A0A0A] flex flex-col items-center justify-center text-[#0A0A0A]">
          <span className="font-display text-5xl md:text-7xl leading-none">50+</span>
          <span className="font-bold uppercase tracking-wider text-sm mt-2">Active Members</span>
        </div>
        <div className="bg-[#00E676] p-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#0A0A0A] flex flex-col items-center justify-center text-[#0A0A0A]">
          <span className="font-display text-5xl md:text-7xl leading-none">3</span>
          <span className="font-bold uppercase tracking-wider text-sm mt-2">Departments</span>
        </div>
        <div className="bg-[#FFE500] p-6 flex flex-col items-center justify-center text-[#0A0A0A]">
          <span className="font-display text-5xl md:text-7xl leading-none">15</span>
          <span className="font-bold uppercase tracking-wider text-sm mt-2">Bootcamp Lessons</span>
        </div>
      </div>

      {/* Departments */}
      <div className="p-6 md:p-12 lg:p-24 bg-[#F2EDE4]">
        <h2 className="font-display text-5xl md:text-7xl text-[#0A0A0A] mb-12 text-center drop-shadow-[3px_3px_0_#FFFFFF]">CHOOSE YOUR PATH</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Gaming */}
          <Link href="/gaming" className="group block">
            <div className="h-full bg-[#C44DFF] neubrutalism-box p-8 flex flex-col hover:bg-[#b03ee6] transition-colors">
              <h3 className="font-display text-5xl text-[#0A0A0A] mb-4">GAMING</h3>
              <p className="text-[#0A0A0A] font-bold text-lg mb-8 flex-1">
                FIFA, COD, Mortal Kombat and more. Weekly tournaments and leaderboards.
              </p>
              <div className="mt-auto flex items-center justify-between text-[#0A0A0A]">
                <span className="font-bold uppercase">View Sessions</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>

          {/* Cyber */}
          <Link href="/cyber" className="group block">
            <div className="h-full bg-[#00E676] neubrutalism-box p-8 flex flex-col hover:bg-[#00cf6a] transition-colors">
              <h3 className="font-display text-5xl text-[#0A0A0A] mb-4">CYBER</h3>
              <p className="text-[#0A0A0A] font-bold text-lg mb-8 flex-1">
                Learn ethical hacking, defense, and OSINT. Track your progress.
              </p>
              <div className="mt-auto flex items-center justify-between text-[#0A0A0A]">
                <span className="font-bold uppercase">Start Learning</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>

          {/* Coding */}
          <Link href="/coding" className="group block">
            <div className="h-full bg-[#2563FF] neubrutalism-box p-8 flex flex-col hover:bg-[#1a51e5] transition-colors">
              <h3 className="font-display text-5xl text-[#FFFFFF] mb-4">CODING</h3>
              <p className="text-[#FFFFFF] font-bold text-lg mb-8 flex-1">
                HTML, CSS, Python, and React. Build real projects from scratch.
              </p>
              <div className="mt-auto flex items-center justify-between text-[#FFFFFF]">
                <span className="font-bold uppercase">Write Code</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t-[3px] border-[#0A0A0A] py-12 px-6 flex flex-col items-center">
        <h2 className="font-display text-4xl text-[#FFE500] mb-4">GOMBE SS ICT</h2>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">© {new Date().getFullYear()} Gombe Senior Secondary School</p>
      </footer>
    </div>
  );
}
