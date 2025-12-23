import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none" style={{
        backgroundColor: 'hsla(270, 100%, 98%, 1)',
        backgroundImage: `
          radial-gradient(at 40% 20%, hsla(280,100%,90%,1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(260,100%,90%,1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(300,100%,92%,1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(250,100%,92%,1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(270,100%,90%,1) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(290,100%,92%,1) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(260,100%,95%,1) 0px, transparent 50%)
        `
      }}></div>

      {/* Navigation Header */}
      <nav className="w-full z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="shrink-0 flex items-center gap-2 cursor-pointer">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-bold text-xl tracking-tight text-gray-900">ShikkhaSathi</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#features">Features</a>
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#about">About</a>
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#pricing">Pricing</a>
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#contact">Contact</a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors" href="/login">Log In</a>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-purple-500/30"
              >
                Get Started
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grow relative z-10">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-neon">
                <svg className="w-12 h-12 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-neutral-900 mb-4 font-bengali">
              শিক্ষাসাথী
            </h1>
            <div className="inline-block mb-6">
              <p className="text-2xl md:text-3xl font-semibold text-neutral-900 bg-primary/20 px-6 py-2 rounded-full border-2 border-primary">
                AI-Powered Adaptive Learning
              </p>
            </div>
            <p className="text-xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              বাংলাদেশের ৬ম থেকে ১২শ শ্রেণীর শিক্ষার্থীদের জন্য বিশেষভাবে ডিজাইন করা<br />
              কৃত্রিম বুদ্ধিমত্তা চালিত অভিযোজিত শিক্ষা প্ল্যাটফর্ম
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-4 bg-primary hover:bg-primary-600 text-neutral-900 font-bold text-lg rounded-xl transition-all shadow-neon hover:shadow-lg transform hover:-translate-y-0.5"
              >
                বিনামূল্যে শুরু করুন →
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-white hover:bg-neutral-50 text-neutral-900 font-semibold text-lg rounded-xl transition-all border-2 border-neutral-300 shadow-sm hover:border-primary"
              >
                বৈশিষ্ট্য দেখুন
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200">
                <div className="text-4xl font-bold text-neutral-900">10K+</div>
                <div className="text-sm text-neutral-600 mt-1">শিক্ষার্থী</div>
              </div>
              <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 border-2 border-primary">
                <div className="text-4xl font-bold text-neutral-900">500+</div>
                <div className="text-sm text-neutral-700 mt-1 font-medium">শিক্ষক</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200">
                <div className="text-4xl font-bold text-neutral-900">50K+</div>
                <div className="text-sm text-neutral-600 mt-1">কুইজ সম্পন্ন</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-bold mb-4 shadow-sm">
              প্ল্যাটফর্ম বৈশিষ্ট্য
            </span>
            <h2 className="text-5xl font-bold text-neutral-900 mb-6 font-bengali">
              কেন শিক্ষাসাথী?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              আধুনিক প্রযুক্তি এবং শিক্ষাবিজ্ঞানের সমন্বয়ে তৈরি শেখার অভিজ্ঞতা
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Tutor */}
            <div className="group bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-600 hover:shadow-2xl hover:shadow-purple-200/50 transition-all">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3 font-bengali">AI টিউটর</h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                ২৪/৭ উপলব্ধ AI টিউটর যা আপনার প্রশ্নের তাৎক্ষণিক উত্তর দেয় এবং ভয়েস সাপোর্ট প্রদান করে
              </p>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex items-center gap-3">
                  <span className="shrink-0 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>তাৎক্ষণিক সাহায্য</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="shrink-0 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>ভয়েস সাপোর্ট</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="shrink-0 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>বাংলা ও ইংরেজি</span>
                </li>
              </ul>
            </div>

            {/* Adaptive Assessments */}
            <div className="group bg-white rounded-2xl p-8 border-2 border-accent-100 hover:border-accent-300 hover:shadow-soft transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3 font-bengali">অভিযোজিত মূল্যায়ন</h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                আপনার দক্ষতা অনুযায়ী স্বয়ংক্রিয়ভাবে সমন্বয়কৃত কুইজ এবং পরীক্ষা
              </p>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs">✓</span>
                  <span>ব্যক্তিগত কঠিনতা</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs">✓</span>
                  <span>তাৎক্ষণিক ফিডব্যাক</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs">✓</span>
                  <span>অগ্রগতি ট্র্যাকিং</span>
                </li>
              </ul>
            </div>

            {/* Offline Access */}
            <div className="group bg-white rounded-2xl p-8 border-2 border-secondary-100 hover:border-secondary-300 hover:shadow-soft transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">অফলাইন অ্যাক্সেস</h3>
              <p className="text-neutral-700 mb-4">
                ইন্টারনেট ছাড়াই শিখুন। সব কন্টেন্ট অফলাইনে উপলব্ধ
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> PWA প্রযুক্তি
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> স্বয়ংক্রিয় সিঙ্ক
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> কম ডেটা ব্যবহার
                </li>
              </ul>
            </div>

            {/* Gamification */}
            <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">গেমিফিকেশন</h3>
              <p className="text-neutral-700 mb-4">
                XP, অর্জন, স্ট্রিক এবং লিডারবোর্ডের মাধ্যমে শেখা আরও মজাদার
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> XP সিস্টেম
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> অর্জন ব্যাজ
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> লিডারবোর্ড
                </li>
              </ul>
            </div>

            {/* Teacher Tools */}
            <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">শিক্ষক সরঞ্জাম</h3>
              <p className="text-neutral-700 mb-4">
                শিক্ষকদের জন্য বিস্তৃত বিশ্লেষণ এবং মূল্যায়ন তৈরির সরঞ্জাম
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> বিশ্লেষণ ড্যাশবোর্ড
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> মূল্যায়ন তৈরি
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> ছাত্র ট্র্যাকিং
                </li>
              </ul>
            </div>

            {/* Parent Portal */}
            <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">অভিভাবক পোর্টাল</h3>
              <p className="text-neutral-700 mb-4">
                অভিভাবকদের জন্য সন্তানের অগ্রগতি ট্র্যাকিং এবং নোটিফিকেশন
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2">
                  <span className="text-pink-600">✓</span> অগ্রগতি রিপোর্ট
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-600">✓</span> নোটিফিকেশন
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-600">✓</span> যোগাযোগ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="py-20 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              কাদের জন্য?
            </h2>
            <p className="text-lg text-neutral-600">
              শিক্ষার্থী, শিক্ষক এবং অভিভাবক - সবার জন্য
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎓</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">শিক্ষার্থী</h3>
              <p className="text-neutral-700 mb-4">
                ৬ম থেকে ১২শ শ্রেণীর বাংলা ও ইংরেজি মাধ্যমের শিক্ষার্থীদের জন্য
              </p>
              <p className="text-sm text-neutral-600">
                ব্যক্তিগত শেখার পথ, AI টিউটর সাহায্য, এবং গেমিফাইড অভিজ্ঞতা
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👨‍🏫</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">শিক্ষক</h3>
              <p className="text-neutral-700 mb-4">
                মূল্যায়ন তৈরি, বিশ্লেষণ এবং শ্রেণীকক্ষ ব্যবস্থাপনার জন্য
              </p>
              <p className="text-sm text-neutral-600">
                শক্তিশালী বিশ্লেষণ সরঞ্জাম, স্বয়ংক্রিয় মূল্যায়ন, এবং ছাত্র ট্র্যাকিং
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👨‍👩‍👧</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">অভিভাবক</h3>
              <p className="text-neutral-700 mb-4">
                সন্তানের অগ্রগতি পর্যবেক্ষণ এবং সম্পৃক্ততা ট্র্যাকিংয়ের জন্য
              </p>
              <p className="text-sm text-neutral-600">
                বিস্তারিত রিপোর্ট, নোটিফিকেশন, এবং শিক্ষকদের সাথে যোগাযোগ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-primary/10 to-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">
            আজই শুরু করুন
          </h2>
          <p className="text-xl text-neutral-700 mb-8">
            বাংলাদেশের শিক্ষার ভবিষ্যতে যোগ দিন। বিনামূল্যে শুরু করুন।
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-primary hover:bg-primary-400 text-neutral-900 font-bold text-xl rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            বিনামূল্যে সাইন আপ করুন
          </button>
        </div>
      </section>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">শিক্ষাসাথী</h3>
              <p className="text-sm">
                AI-powered adaptive learning platform for Bangladesh students
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">প্ল্যাটফর্ম</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">শিক্ষার্থী</a></li>
                <li><a href="#" className="hover:text-primary">শিক্ষক</a></li>
                <li><a href="#" className="hover:text-primary">অভিভাবক</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">সহায়তা</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">সাহায্য কেন্দ্র</a></li>
                <li><a href="#" className="hover:text-primary">যোগাযোগ</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">আইনি</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">গোপনীয়তা নীতি</a></li>
                <li><a href="#" className="hover:text-primary">ব্যবহারের শর্তাবলী</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 ShikkhaSathi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
