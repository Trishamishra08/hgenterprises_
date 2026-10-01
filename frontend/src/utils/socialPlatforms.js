import { Facebook, Twitter, Instagram, Youtube, Linkedin, MessageCircle, Send, Globe } from 'lucide-react';

// Add a platform here and it becomes selectable in Admin → Social Media and renders in the footer.
export const SOCIAL_PLATFORMS = {
    instagram: { label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourpage' },
    facebook: { label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
    youtube: { label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@yourchannel' },
    twitter: { label: 'X / Twitter', icon: Twitter, placeholder: 'https://x.com/yourhandle' },
    linkedin: { label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourpage' },
    whatsapp: { label: 'WhatsApp', icon: MessageCircle, placeholder: 'https://wa.me/919876543210' },
    telegram: { label: 'Telegram', icon: Send, placeholder: 'https://t.me/yourchannel' },
    other: { label: 'Other', icon: Globe, placeholder: 'https://...' },
};
