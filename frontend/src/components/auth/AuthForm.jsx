import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../zustand/authStore';
import { notify } from '../../lib/notifyHelper';
import toast from 'react-hot-toast';
export default function AuthForm() {
    const { login, register, authLoading } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    })
    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const key in formData) {
            if(key=="fullName" && isLogin)continue;
            if (!formData[key] || formData[key].trim().length === 0) {
                notify("Enter all fields");
                return;
            }
        }
        if (!isLogin && formData.password.length < 6) {
            notify("Password too short. Minimum length 6");
            return;
        }
        let res;

        if (isLogin) {
            res = await login(formData);
        } else {
            res = await register(formData);
        }
        if (!res.success) {
            notify(res.message, "error");
            return;
        }
        notify(
            isLogin
                ? `Welcome back ${res.user.fullName}`
                : `Welcome to CodeSync ${res.user.fullName}`,
            "success"
        );
    };

    const handleGoogleLogin = () => {
        console.log("Google Auth Triggered!");
    };

    return (
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/5 relative">

            <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-extrabold mb-2 text-ghost-white">
                    {isLogin ? "Welcome back" : "Create an account"}
                </h2>
                <p className="text-ghost-white/60">
                    {isLogin ? "Enter your details to access your workspaces." : "Start collaborating in seconds."}
                </p>
            </div>

            {/* Google SSO Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-ghost-white py-3 rounded-xl flex items-center justify-center gap-3 transition-all font-semibold shadow-sm mb-6 group"
            >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <span className="text-xs text-ghost-white/40 uppercase tracking-widest font-bold">Or</span>
                <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            {/* Dynamic Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="block text-xs font-bold text-ghost-white/50 mb-1 uppercase tracking-wider">Display Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Gaurav Developer"
                                className="w-full bg-navy/50 border border-brand-purple/30 rounded-xl px-4 py-3 text-ghost-white outline-none focus:border-brand-pink transition-colors placeholder-ghost-white/20"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                    <label className="block text-xs font-bold text-ghost-white/50 mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full bg-navy/50 border border-brand-purple/30 rounded-xl px-4 py-3 text-ghost-white outline-none focus:border-brand-pink transition-colors placeholder-ghost-white/20"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-ghost-white/50 uppercase tracking-wider">Password</label>
                        {isLogin && (
                            <a href="#" className="text-xs text-brand-pink hover:text-brand-purple transition-colors font-medium">Forgot?</a>
                        )}
                    </div>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-navy/50 border border-brand-purple/30 rounded-xl px-4 py-3 text-ghost-white outline-none focus:border-brand-pink transition-colors placeholder-ghost-white/20"
                    />
                </div>

                <button
                    disabled={authLoading}
                    className="w-full bg-brand-purple hover:bg-brand-pink text-ghost-white hover:text-navy py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-purple/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {authLoading && (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}

                    {authLoading
                        ? isLogin
                            ? "Signing In..."
                            : "Creating Account..."
                        : isLogin
                            ? "Sign In"
                            : "Create Account"}
                </button>
            </form>

            {/* Toggle Button */}
            <p className="mt-8 text-center text-sm text-ghost-white/50">
                {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}

                <button
                    type="button"
                    disabled={authLoading}
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-brand-pink hover:text-brand-purple font-bold transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLogin ? "Sign up" : "Log in"}
                </button>
            </p>

        </div>
    );
}