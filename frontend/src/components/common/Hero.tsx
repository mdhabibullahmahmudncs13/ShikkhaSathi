import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, PenTool, ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  // Animation variants for floating icons
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants2 = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, -8, 8, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }
    }
  };

  const floatingVariants3 = {
    animate: {
      y: [0, -25, 0],
      rotate: [0, 12, -12, 0],
      transition: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4
      }
    }
  };

  // Fade-in-up animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">
      {/* Soft Radial Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-blue-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-32 w-80 h-80 bg-gradient-radial from-purple-100/30 via-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-radial from-blue-50/50 via-slate-100/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Floating Decorative Icons */}
      <motion.div
        className="absolute top-32 left-16 text-blue-400/20"
        variants={floatingVariants}
        animate="animate"
      >
        <GraduationCap size={40} />
      </motion.div>
      
      <motion.div
        className="absolute top-48 right-24 text-purple-400/25"
        variants={floatingVariants2}
        animate="animate"
      >
        <BookOpen size={36} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-48 left-24 text-blue-500/20"
        variants={floatingVariants3}
        animate="animate"
      >
        <PenTool size={32} />
      </motion.div>
      
      <motion.div
        className="absolute top-80 left-1/4 text-indigo-400/20"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '1s' }}
      >
        <BookOpen size={28} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-64 right-1/4 text-purple-500/25"
        variants={floatingVariants2}
        animate="animate"
        style={{ animationDelay: '3s' }}
      >
        <GraduationCap size={34} />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh]"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          
          {/* Left Side - Content */}
          <div className="space-y-8 order-2 lg:order-1">
            
            {/* Main Title */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-['Hind_Siliguri']">
                  শিক্ষাসাথী
                </span>
              </h1>
            </motion.div>

            {/* Sub-header */}
            <motion.div variants={fadeInUp}>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-['Hind_Siliguri'] max-w-2xl">
                বাংলাদেশের ৬ষ্ঠ থেকে ১২শ শ্রেণীর শিক্ষার্থীদের জন্য বিশেষভাবে ডিজাইন করা কৃত্রিম বুদ্ধিমত্তা চালিত অভিযোজিত শিক্ষা প্ল্যাটফর্ম।
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              {/* Primary CTA */}
              <motion.button
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 font-['Hind_Siliguri'] flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                বিনামূল্যে শুরু করুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              {/* Secondary CTA */}
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold text-lg rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md font-['Hind_Siliguri']"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                বৈশিষ্ট্য দেখুন
              </motion.button>
            </motion.div>

            {/* Statistics Bar - Glassmorphism Cards */}
            <motion.div 
              className="grid grid-cols-3 gap-4 pt-8"
              variants={fadeInUp}
            >
              <motion.div 
                className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg text-center"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-900 font-['Hind_Siliguri']">10K+</div>
                <div className="text-sm text-gray-600 mt-1 font-['Hind_Siliguri']">শিক্ষার্থী</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg text-center"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-900 font-['Hind_Siliguri']">500+</div>
                <div className="text-sm text-gray-600 mt-1 font-['Hind_Siliguri']">শিক্ষক</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg text-center"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-900 font-['Hind_Siliguri']">50K+</div>
                <div className="text-sm text-gray-600 mt-1 font-['Hind_Siliguri']">কুইজ সম্পন্ন</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Student Image */}
          <motion.div 
            className="relative order-1 lg:order-2"
            variants={fadeInUp}
          >
            <div className="relative">
              {/* Main Image with Outer Glow */}
              <motion.div
                className="relative z-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  {/* Outer Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl scale-105 -z-10"></div>
                  
                  {/* Main Image */}
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                    alt="Student learning with ShikkhaSathi"
                    className="relative w-full h-auto max-w-lg mx-auto rounded-3xl shadow-2xl object-cover z-0"
                  />
                </div>
              </motion.div>

              {/* Decorative Floating Elements */}
              <motion.div
                className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-2xl blur-xl -z-20"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <motion.div
                className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-xl -z-20"
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Success Badge */}
              <motion.div
                className="absolute top-8 -right-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/50 z-20"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 font-['Hind_Siliguri']">৯৮%</div>
                    <div className="text-xs text-gray-600 font-['Hind_Siliguri']">সফলতার হার</div>
                  </div>
                </div>
              </motion.div>

              {/* AI Support Badge */}
              <motion.div
                className="absolute bottom-16 -left-8 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/50 z-20"
                animate={{
                  y: [0, -6, 0],
                  rotate: [0, -1, 1, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 font-['Hind_Siliguri']">২৪/৭</div>
                    <div className="text-xs text-gray-600 font-['Hind_Siliguri']">AI সাপোর্ট</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;