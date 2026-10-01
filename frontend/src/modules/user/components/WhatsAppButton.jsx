import React from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

const WhatsAppButton = () => {
    const { settings } = useShop();

    // Fallback phone number if none is loaded from settings
    const rawPhone = settings?.phone || '+91 90760 62592';
    
    // Clean phone number to get only digits (with country code)
    const cleanedPhone = rawPhone.replace(/\D/g, '');
    
    // Default message when user opens WhatsApp
    const message = encodeURIComponent("Hello! I'm visiting Harshad Gauri Enterprises website and have a query about your exquisite jewellery collection.");
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${message}`;

    return (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[9999] flex items-center justify-center">
            {/* Pulsing Sonar Wave Radiating Outwards */}
            <motion.div
                className="absolute w-[66px] h-[66px] md:w-[72px] md:h-[72px] rounded-full bg-emerald-500/10 pointer-events-none"
                animate={{
                    scale: [1, 1.4, 1.6],
                    opacity: [0.6, 0.4, 0]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeOut"
                }}
            />
            <motion.div
                className="absolute w-[66px] h-[66px] md:w-[72px] md:h-[72px] rounded-full bg-[#E6D7D9]/25 pointer-events-none"
                animate={{
                    scale: [1, 1.25, 1.5],
                    opacity: [0.8, 0.3, 0]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: 1.5,
                    ease: "easeOut"
                }}
            />

            {/* Main Interactive Button (Solid green WhatsApp button) */}
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with us on WhatsApp"
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                whileHover={{ 
                    scale: 1.08,
                    boxShadow: "0 8px 24px rgba(37, 211, 102, 0.45)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.5,
                    layout: { duration: 0.3 }
                }}
                className="relative flex items-center justify-center w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] cursor-pointer"
            >
                {/* Floating Breathing Pulse Effect directly on the green button */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-[#25D366]/20 -z-10"
                    animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.6, 0.2, 0.6]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut"
                    }}
                />

                {/* SVG Path of the official WhatsApp bubble */}
                <svg 
                    viewBox="0 0 24 24" 
                    className="w-9 h-9 md:w-[40px] md:h-[40px] fill-current"
                >
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.197-1.362a9.932 9.932 0 0 0 4.814 1.237h.005c5.507 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.927-7.067C17.189 2.937 14.683 2 12.012 2zm0 1.711c2.213 0 4.292.862 5.856 2.427a8.232 8.232 0 0 1 2.423 5.851c0 4.561-3.712 8.271-8.277 8.271a8.21 8.21 0 0 1-4.202-1.154l-.302-.18-3.12.818.832-3.044-.198-.314a8.2 8.2 0 0 1-1.258-4.398c0-4.562 3.713-8.272 8.277-8.272zm-3.62 5.093c-.198 0-.422.046-.611.25-.19.206-.723.707-.723 1.724s.74 1.996.84 2.132c.102.137 1.457 2.224 3.53 3.12.493.213.878.34 1.178.435.496.158.948.135 1.305.082.399-.06 1.218-.498 1.389-.98.17-.481.17-.893.12-1.026-.051-.137-.19-.206-.402-.309-.213-.103-1.257-.62-1.452-.69-.196-.07-.339-.103-.482.103-.143.206-.554.707-.678.847-.123.14-.247.155-.46.052-.213-.103-.898-.33-1.711-1.054-.632-.564-1.06-1.26-1.184-1.472-.124-.213-.013-.328.093-.43.096-.093.213-.247.32-.372.106-.123.142-.206.213-.343.072-.137.036-.257-.018-.36-.054-.103-.482-1.161-.66-1.59-.174-.419-.347-.362-.482-.369-.123-.006-.265-.006-.408-.006z"/>
                </svg>
            </motion.a>
        </div>
    );
};

export default WhatsAppButton;
