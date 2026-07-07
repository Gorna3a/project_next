import { motion } from "framer-motion";
import { Sparkles, Code2, Users, Rocket, Heart, Brain, Zap, Trophy, ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "../../../shared/ui/Logo";
import { useLanguage } from "../../../core/context/LanguageContext";
import Link from "next/link";

export default function AboutPage() {
  const { t, isRTL } = useLanguage();

  const stats = [
    { label: t('about.stats.learners'), value: "10,000+", icon: Users },
    { label: t('about.stats.loc'), value: "2.4M", icon: Code2 },
    { label: t('about.stats.challenges'), value: "500+", icon: Trophy },
    { label: t('about.stats.success'), value: "98%", icon: Rocket },
  ];

  const whyItems = [
    { title: t('about.aiLearning.title'), desc: t('about.aiLearning.desc'), icon: Brain },
    { title: t('about.gamified.title'), desc: t('about.gamified.desc'), icon: Trophy },
    { title: t('about.realTools.title'), desc: t('about.realTools.desc'), icon: Zap },
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* ── Hero Section ── */}
      <section className="relative py-24 overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          <Link 
            href="/" 
            className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-600 transition-colors group`}
          >
            {isRTL ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
            {t('auth.backToHome')}
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-widest border border-brand-100 dark:border-brand-800"
          >
            <Sparkles className="w-3 h-3" />
            {t('about.ourVision')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-tight"
          >
            {t('about.heroTitle').split('pixel')[0]}
            <span className="text-brand-600">{isRTL ? 'بكسل بكسل' : 'pixel by pixel'}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t('about.heroSub')}
          </motion.p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center mx-auto mb-4">
                   <stat.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why PixelCode? ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-16 items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              {t('about.whyTitle')}
            </h2>
            <div className="space-y-6">
              {whyItems.map((item) => (
                <div key={item.title} className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex-shrink-0 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-brand-500 to-brand-800 p-1">
               <div className="w-full h-full rounded-[2.9rem] bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden relative">
                  <Logo size="lg" />
                  <div className="absolute inset-0 bg-brand-500/5 backdrop-blur-2xl" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <section className="py-24 bg-brand-600 text-white text-center space-y-8">
        <Heart className="w-12 h-12 mx-auto animate-pulse" />
        <h2 className="text-3xl md:text-5xl font-black">{t('about.joinRevolution')}</h2>
        <p className="text-brand-100 max-w-md mx-auto font-medium text-lg leading-relaxed">
          {t('about.footerSub')}
        </p>
        <Link 
          href="/signup"
          className="inline-block bg-white text-brand-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-50 transition-all active:scale-95 shadow-2xl shadow-brand-900/20"
        >
          {t('about.getStarted')}
        </Link>
      </section>
    </div>
  );
}
