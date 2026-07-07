'use client';

import { type ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Brain, Zap, Trophy } from "lucide-react";
import { Logo } from "../../../shared/ui/Logo";
import { useLanguage } from "../../../core/context/LanguageContext";

interface AuthLayoutProps {
  children?: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const navigate = useRouter();
  const { t, isRTL } = useLanguage();
  const [isLogin, setIsLogin] = useState(pathname === "/login");

  // Sync state with URL
  useEffect(() => {
    setIsLogin(pathname === "/login");
  }, [pathname]);

  const toggleMode = () => {
    const newPath = isLogin ? "/signup" : "/login";
    navigate.push(newPath);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 font-sans overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Back to Home Button */}
      <Link
        href="/"
        className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} z-50 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 transition-all group`}
      >
        <div className="p-2 rounded-xl bg-white dark:bg-gray-900 shadow-sm group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </div>
        <span className="hidden sm:block">{t('auth.backToHome')}</span>
      </Link>

      {/* Main Container */}
      <div className={`relative w-full max-w-5xl aspect-[16/10] min-h-[600px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-brand-500/10 border border-gray-100 dark:border-gray-800 flex overflow-hidden ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* ── Background Forms ── */}
        <div className={`flex w-full h-full relative ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* Side: Login Form Area */}
          <div className="w-1/2 h-full flex items-center justify-center p-12 overflow-y-auto">
            <motion.div 
              animate={{ opacity: isLogin ? 1 : 0, x: isLogin ? 0 : (isRTL ? 20 : -20), filter: isLogin ? "blur(0px)" : "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm space-y-8 pointer-events-auto"
              style={{ pointerEvents: isLogin ? "auto" : "none" }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('auth.welcomeBack')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('auth.loginSub')}</p>
              </div>
              {isLogin && children}
            </motion.div>
          </div>

          {/* Side: Signup Form Area */}
          <div className="w-1/2 h-full flex items-center justify-center p-12 overflow-y-auto">
            <motion.div 
              animate={{ opacity: !isLogin ? 1 : 0, x: !isLogin ? 0 : (isRTL ? -20 : 20), filter: !isLogin ? "blur(0px)" : "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm space-y-8"
              style={{ pointerEvents: !isLogin ? "auto" : "none" }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('auth.createAccount')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('auth.signupSub')}</p>
              </div>
              {!isLogin && children}
            </motion.div>
          </div>

        </div>

        {/* ── Sliding Legend Panel (The Square) ── */}
        <motion.div
          animate={{ 
            x: isLogin ? (isRTL ? "-100%" : "100%") : "0%",
            borderRadius: isLogin 
              ? (isRTL ? "0 2.5rem 2.5rem 0" : "2.5rem 0 0 2.5rem") 
              : (isRTL ? "2.5rem 0 0 2.5rem" : "0 2.5rem 2.5rem 0")
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
          className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-1/2 h-full bg-gradient-to-br from-brand-600 to-brand-800 z-40 p-12 text-white flex flex-col items-center justify-center overflow-hidden shadow-2xl`}
        >
          {/* Floating pixels */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-sm bg-white opacity-10"
              style={{
                width: `${8 + (i % 3) * 8}px`,
                height: `${8 + (i % 3) * 8}px`,
                left: `${(i * 17 + 10) % 90}%`,
                top: `${(i * 23 + 15) % 90}%`,
              }}
              animate={{ 
                y: [0, -40, 0], 
                rotate: [0, 90, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          <motion.div 
            className="relative z-10 text-center space-y-12 w-full max-w-xs"
          >
            <div className="flex justify-center">
               <Logo size="lg" className="[&_span]:!text-white [&_.text-brand-600]:!text-white" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-msg" : "signup-msg"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-4xl font-black leading-tight tracking-tight">
                  {isLogin ? t('auth.newHere') : t('auth.oneOfUs')}
                </h2>
                <p className="text-brand-100 text-lg leading-relaxed opacity-90 font-medium">
                  {isLogin ? t('auth.signupMsg') : t('auth.signinMsg')}
                </p>
                <button
                  onClick={toggleMode}
                  className="mt-8 px-10 py-4 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md font-black text-sm uppercase tracking-widest hover:bg-white hover:text-brand-700 transition-all active:scale-95 shadow-xl"
                >
                  {isLogin ? t('auth.signUp') : t('auth.signIn')}
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3 pt-6 opacity-40">
              {[Brain, Zap, Trophy, Sparkles].map((Icon, i) => (
                <div key={i} className="flex items-center justify-center p-3 rounded-2xl bg-white/10 border border-white/10">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Decorative gradients */}
          <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-brand-400/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

      </div>
    </div>
  );
};
