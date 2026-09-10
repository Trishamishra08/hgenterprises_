import React, { useState, useEffect } from 'react';
import loginHero from '../assets/login_hero_silver.png';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Crown, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo_final.jpg';
import toast from 'react-hot-toast';

const GENDER_OPTIONS = ['Female', 'Male', 'Other'];

const FieldLabel = ({ children }) => (
    <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {children}
    </label>
);

const UnderlineInput = ({ type = 'text', value, onChange, placeholder, required, inputMode, maxLength }) => (
    <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full border-b border-gray-300 px-0 py-2 text-black placeholder:text-gray-300 focus:outline-none focus:border-[#D39A9F] transition-all bg-transparent text-sm font-medium"
    />
);

const GenderSelector = ({ value, onChange, compact = false }) => (
    <div className={`flex flex-wrap items-center ${compact ? 'gap-3' : 'gap-5'}`}>
        {GENDER_OPTIONS.map((option) => {
            const selected = value === option;
            return (
                <label key={option} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={selected}
                        onChange={() => onChange(option)}
                        className="sr-only"
                    />
                    <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            selected
                                ? 'border-[#D39A9F] bg-[#D39A9F]'
                                : 'border-[#EBCDD0] group-hover:border-[#D39A9F]/70'
                        }`}
                    >
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className={`font-medium text-gray-600 ${compact ? 'text-[11px]' : 'text-xs'}`}>
                        {option}
                    </span>
                </label>
            );
        })}
    </div>
);

const PrimaryButton = ({ children, className = '' }) => (
    <button
        type="submit"
        className={`w-full bg-[#EBCDD0] text-black py-3 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-[#D39A9F] hover:text-white transition-all shadow-md hover:shadow-lg ${className}`}
    >
        {children}
    </button>
);

const Login = () => {
    const { sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isSignup = location.pathname === '/signup';

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loginStep, setLoginStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        setLoginStep(1);
        setPhoneNumber('');
        setOtp(['', '', '', '', '', '']);
        setFullName('');
        setEmail('');
        setGender('');
    }, [isSignup]);

    const validateSignupFields = () => {
        if (!fullName.trim()) {
            toast.error('Please enter your full name');
            return false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (!gender) {
            toast.error('Please select your gender');
            return false;
        }
        return true;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (isSignup && !validateSignupFields()) return;

        if (phoneNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        const res = await sendOTP(phoneNumber);
        if (res.success) {
            if (!isSignup && !res.exists) {
                toast.error('Account not found. Please create an account first.');
                return;
            }
            setLoginStep(2);
            toast.success('OTP sent successfully');
        } else {
            toast.error(res.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            toast.error('Please enter the 6-digit OTP');
            return;
        }

        const res = await verifyOTP({
            phone: phoneNumber,
            otp: enteredOtp,
            name: isSignup ? fullName.trim() : undefined,
            email: isSignup ? email.trim().toLowerCase() : undefined,
            gender: isSignup ? gender : undefined,
        });

        if (res.success) {
            toast.success(isSignup ? 'Account created successfully!' : 'Welcome back!');
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo, { replace: true });
        } else {
            toast.error(res.message);
            setOtp(['', '', '', '', '', '']);
        }
    };


    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const renderSignupFields = (compact = false) => (
        <>
            <div>
                <FieldLabel>Full Name</FieldLabel>
                {compact ? (
                    <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-12 bg-white border border-[#EBCDD0] rounded-xl px-4 text-black font-medium placeholder:text-gray-300 focus:border-[#D39A9F] focus:ring-1 focus:ring-[#D39A9F] outline-none transition-all text-sm"
                        placeholder="Enter your full name"
                    />
                ) : (
                    <UnderlineInput
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                )}
            </div>

            <div>
                <FieldLabel>Email Address</FieldLabel>
                {compact ? (
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 bg-white border border-[#EBCDD0] rounded-xl px-4 text-black font-medium placeholder:text-gray-300 focus:border-[#D39A9F] focus:ring-1 focus:ring-[#D39A9F] outline-none transition-all text-sm"
                        placeholder="Enter your email"
                    />
                ) : (
                    <UnderlineInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                    />
                )}
            </div>

            <div>
                <FieldLabel>Gender</FieldLabel>
                <GenderSelector value={gender} onChange={setGender} compact={compact} />
            </div>
        </>
    );

    const renderPhoneField = (compact = false) => (
        <div>
            <FieldLabel>Mobile Number</FieldLabel>
            <div
                className={`flex items-center focus-within:border-[#D39A9F] transition-all ${
                    compact
                        ? 'bg-white border border-[#EBCDD0] rounded-xl overflow-hidden h-12'
                        : 'border-b border-gray-300'
                }`}
            >
                <div
                        className={`flex items-center text-black font-bold shrink-0 ${
                        compact ? 'h-full px-3 border-r border-[#EBCDD0] text-xs' : 'py-2 pr-3 gap-2'
                    }`}
                >
                    +91
                </div>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={compact ? 'Mobile Number' : 'Enter Mobile Number'}
                    className={`flex-1 bg-transparent border-0 outline-none text-black font-medium placeholder:text-gray-300 ${
                        compact ? 'h-full px-3 text-sm' : 'py-2 tracking-wide text-sm'
                    }`}
                    required
                />
            </div>
        </div>
    );

    const renderOtpStep = (compact = false) => (
        <form onSubmit={handleVerifyOtp} className={compact ? 'space-y-6' : 'space-y-8'}>
            <div className={compact ? '' : 'text-center'}>
                <p className={`text-gray-500 font-serif ${compact ? 'text-[10px] mb-4' : 'mb-6'}`}>
                    Enter the 6-digit code sent to{' '}
                    <span className="font-bold text-black">+91 {phoneNumber}</span>
                </p>
                <div className={`flex ${compact ? 'justify-between gap-2' : 'justify-center gap-3 mb-6'}`}>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            className={
                                compact
                                    ? 'w-10 h-12 bg-transparent border-b-2 border-[#EBCDD0] focus:border-[#D39A9F] text-center text-2xl font-bold text-black outline-none transition-all rounded-none'
                                    : 'w-12 h-14 border border-[#EBCDD0] rounded-xl text-center text-2xl font-bold focus:border-[#D39A9F] focus:ring-2 focus:ring-[#D39A9F]/20 outline-none transition-all text-black bg-[#FAFAFA]'
                            }
                        />
                    ))}
                </div>
            </div>

            <PrimaryButton className={compact ? 'py-2.5 rounded-xl text-[9px]' : ''}>
                Verify & {isSignup ? 'Create Account' : 'Login'}
            </PrimaryButton>

            <button
                type="button"
                onClick={() => setLoginStep(1)}
                className={`w-full text-center font-bold uppercase tracking-widest text-gray-400 hover:text-[#D39A9F] transition-colors ${
                    compact ? 'text-[10px] py-2' : 'text-xs'
                }`}
            >
                Change Mobile Number
            </button>
        </form>
    );

    const renderStepOneForm = (compact = false) => (
        <form onSubmit={handleSendOtp} className={compact ? 'space-y-3' : isSignup ? 'space-y-3.5' : 'space-y-5'}>
            {isSignup && renderSignupFields(compact)}
            {renderPhoneField(compact)}
            <PrimaryButton className={compact ? 'py-2.5 rounded-xl text-[9px] mt-0.5' : 'mt-1'}>
                Get OTP
            </PrimaryButton>
        </form>
    );

    const authSubtitle =
        loginStep === 1
            ? isSignup
                ? 'Join the HG family — quick & secure.'
                : 'Login with your registered mobile number.'
            : `Code sent to +91 ${phoneNumber}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-hidden bg-white">
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 z-[300] text-black p-2 rounded-full transition-all group active:bg-black/5"
                aria-label="Go back"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Mobile */}
            <div className="md:hidden absolute inset-0 z-50 flex flex-col justify-center px-4 bg-gradient-to-b from-[#FFF5F6] to-white">
                <div className="bg-white/95 backdrop-blur-xl px-5 py-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-sm mx-auto border border-[#EBCDD0]/40">
                    <div className="text-center mb-4 flex flex-col items-center">
                        <div className="bg-black p-2 rounded-xl shadow-lg mb-2">
                            <img src={logo} alt="HG" className="w-14 h-auto object-contain" />
                        </div>
                        <span className="text-[#D39A9F] text-[9px] font-bold uppercase tracking-[0.2em]">
                            {isSignup ? 'Discovery Entrance' : 'Welcome Back'}
                        </span>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-xl font-display text-black leading-none">
                            {loginStep === 1 ? (isSignup ? 'Create Account' : 'Login') : 'Verify OTP'}
                        </h2>
                        <p className="text-gray-400 text-[10px] font-serif italic mt-1">{authSubtitle}</p>
                    </div>

                    {loginStep === 1 ? renderStepOneForm(true) : renderOtpStep(true)}

                    <div className="mt-6 text-center pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-serif">
                            {isSignup ? 'Already have an account?' : 'New to HG?'}
                            <Link
                                to={isSignup ? '/login' : '/signup'}
                                className="ml-1.5 text-black font-bold border-b border-black hover:text-[#D39A9F] hover:border-[#D39A9F] transition-colors"
                            >
                                {isSignup ? 'Login' : 'Create Account'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Desktop split — compact signup */}
            <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl hidden md:flex flex-col-reverse lg:flex-row relative z-10 max-h-[92vh]">
                <div className="w-full lg:w-[48%] bg-white flex flex-col justify-center p-5 lg:p-7 relative overflow-y-auto max-h-[92vh]">
                    <div className="max-w-sm w-full mx-auto lg:mx-0">
                        <div className="w-fit bg-black p-2.5 rounded-xl shadow-lg mb-4">
                            <img src={logo} alt="HG Enterprises" className="block w-20 h-auto object-contain" />
                        </div>

                        <span className="text-[#D39A9F] text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5 block">
                            {isSignup ? 'Discovery Entrance' : 'Welcome Back'}
                        </span>
                        <h2 className="text-2xl font-display text-black mb-0.5 leading-tight">
                            {loginStep === 1 ? (isSignup ? 'Create Account' : 'Login') : 'Verify OTP'}
                        </h2>
                        {!isSignup && (
                            <p className="text-gray-400 text-[11px] font-serif italic mb-4">
                                Elegant Craftsmanship, Curated for You.
                            </p>
                        )}
                        <p className="text-gray-500 text-[11px] mb-4">{authSubtitle}</p>

                        {loginStep === 1 ? renderStepOneForm(false) : renderOtpStep(false)}

                        <div className="mt-5 text-center pt-4 border-t border-gray-100">
                            <p className="text-[11px] text-gray-500 font-serif">
                                {isSignup ? 'Already have an account?' : 'New to HG?'}
                                <Link
                                    to={isSignup ? '/login' : '/signup'}
                                    className="ml-1.5 font-bold text-black border-b border-black/20 hover:border-black hover:text-[#D39A9F] transition-all"
                                >
                                    {isSignup ? 'Login' : 'Create Account'}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="w-full lg:w-[52%] p-8 flex flex-col justify-end items-start relative overflow-hidden bg-cover bg-center group min-h-[240px] lg:min-h-[480px]"
                    style={{ backgroundImage: `url(${loginHero})` }}
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="relative z-10 text-left p-4">
                        <Crown className="w-10 h-10 text-white mb-4 opacity-90" />
                        <h3 className="font-serif text-xl text-white/90 mb-1 tracking-wide italic">Discover</h3>
                        <h1 className="font-display text-4xl lg:text-5xl text-white uppercase tracking-wider mb-3 leading-none">
                            Pure <br /> Elegance
                        </h1>
                        <p className="font-sans text-white/70 text-xs tracking-widest uppercase border-l-2 border-white/50 pl-3">
                            Premium Silver Collection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
