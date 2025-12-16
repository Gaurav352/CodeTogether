// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../zustand/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [fullName, setfullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {register,loading} = useAuthStore();
    const navigate = useNavigate();
    const validateData=()=>{
        if(!fullName || !email || !password){
            toast("Please enter all credentials!");
            return false;
        }
        if(!email.includes('@')){
            toast("Enter a valid email!");
            return false;
        }
        if(password.length < 8){
            toast("Password length should be above 8");
            return false;
        }
        return true;
        
    }
    const submitRegister = async (e) => {
        
        e.preventDefault();
        if(!validateData())return ;
        const data = {
            fullName,
            email,
            password,
        };
        
            const res=register(data);
            if(res){
                navigate("/");
            }
        
        
    }
    return (
        <div className="flex min-h-screen w-full bg-background font-sans text-white overflow-hidden">

            {/* --- CSS FOR FLOATING ANIMATION --- */}
            <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>

            {/* --- LEFT SIDE: FORM SECTION --- */}
            
            <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-20 z-10">
                <div className="mx-auto w-full max-w-sm sm:max-w-md">

                    {/* Logo */}


                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Create account.
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Start building remotely with your team today.
                    </p>

                    {/* Form */}
                    <form 
                        onSubmit={submitRegister}
                        className="mt-8 space-y-5">

                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e)=>setfullName(e.target.value)}
                                    required
                                    className="block w-full rounded-xl bg-surface border border-muted/20 pl-10 pr-3 py-3 text-white placeholder-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                    placeholder="Gaurav Yadav"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    required
                                    className="block w-full rounded-xl bg-surface border border-muted/20 pl-10 pr-3 py-3 text-white placeholder-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                    placeholder="name@work.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-xl bg-surface border border-muted/20 pl-10 pr-3 py-3 text-white placeholder-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="text-[10px] text-muted text-right">Must be at least 8 characters</p>
                        </div>

                        <button 
                            type='submit'
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-6">
                            
                            {loading ? "Registering...":"Get Started"}
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted">
                        Already have an account?{' '}
                        {/* <Link to="/login" className="font-semibold text-white hover:text-secondary transition-colors border-b border-transparent hover:border-secondary">
              Log in
            </Link> */}
                    </p>
                </div>
            </div>
            
            {/* --- RIGHT SIDE: THE FLOATING "BOX" --- */}
            <div className="hidden md:flex w-1/2 items-center justify-center p-6 lg:p-12 relative">

                {/* Animated Floating Container */}
                <div className="animate-float relative w-full max-w-lg aspect-[3/4] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-muted/20">

                    {/* The Image */}
                    <img
                        src="image.png"
                        alt="Register Visual"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"></div>

                    {/* Content Inside Box */}
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                        <div className="h-1 w-12 bg-secondary rounded-full mb-4"></div>
                        <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
                            Join the <br />
                            <span className="text-secondary">Community.</span>
                        </h3>
                        <p className="text-sm text-muted/80 leading-relaxed">
                            Connect with thousands of developers building the future of software.
                        </p>
                    </div>
                </div>

                {/* Decorative elements behind the box */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-secondary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

            </div>

        </div>
    );
};

export default RegisterPage;