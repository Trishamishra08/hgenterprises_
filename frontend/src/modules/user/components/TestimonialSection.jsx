import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../utils/api';
import { TESTIMONIALS } from '../data/testimonialData';

const ROTATIONS = [-4, 3, -2.5, 4, -3, 2, -1.5, 3.5];

const BinderClip = () => (
    <div className="testimonial-clip" aria-hidden="true">
        <div className="testimonial-clip-handle" />
        <div className="testimonial-clip-jaws">
            <span />
            <span />
        </div>
    </div>
);

const PolaroidCard = ({ item }) => {
    const body = (
        <article
            className="testimonial-polaroid"
            style={{ '--card-rotate': `${item.rotate}deg` }}
        >
            <BinderClip />
            <div className="testimonial-polaroid-body">
                <div className="testimonial-polaroid-photo">
                    <img
                        src={item.image}
                        alt={item.productName
                            ? `${item.name} — ${item.productName}`
                            : `${item.name} with HG Enterprises`}
                        loading="lazy"
                        className="testimonial-polaroid-img"
                    />
                </div>
                <div className="testimonial-polaroid-caption">
                    <h3 className="testimonial-polaroid-name">
                        {item.age ? `${item.name}, ${item.age}` : item.name}
                    </h3>
                    <p className="testimonial-polaroid-text">{item.text}</p>
                    {item.productName && (
                        <p className="testimonial-polaroid-product">
                            <span className="testimonial-polaroid-product-label">Purchased</span>
                            <span className="testimonial-polaroid-product-name">{item.productName}</span>
                        </p>
                    )}
                </div>
            </div>
        </article>
    );

    if (item.productId) {
        return (
            <Link
                to={`/product/${item.productId}`}
                className="testimonial-polaroid-link"
                title={`View ${item.productName}`}
            >
                {body}
            </Link>
        );
    }

    return body;
};

const mapReviewToCard = (review, index) => {
    const product = review.productId || {};
    const productId = product._id || product.id || null;
    const productImage = product.image;
    const reviewImage = Array.isArray(review.images) && review.images[0] ? review.images[0] : null;

    return {
        id: review._id || `review-${index}`,
        name: review.userId?.name || 'Verified Buyer',
        age: null,
        image: reviewImage || productImage || TESTIMONIALS[index % TESTIMONIALS.length]?.image,
        text: review.comment,
        productId: productId ? String(productId) : null,
        productName: product.name || null,
        rotate: ROTATIONS[index % ROTATIONS.length],
    };
};

const TestimonialSection = () => {
    const [cards, setCards] = useState(TESTIMONIALS);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get('/products/reviews/featured?limit=24');
                if (cancelled) return;
                const mapped = (data || [])
                    .filter((r) => r?.comment)
                    .map(mapReviewToCard);
                if (mapped.length > 0) {
                    setCards(mapped);
                }
            } catch (err) {
                console.warn('Testimonials feed unavailable, using defaults', err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const loopItems = cards.length > 0
        ? (cards.length < 4 ? [...cards, ...cards, ...cards] : [...cards, ...cards])
        : TESTIMONIALS;

    return (
        <section className="testimonial-clothesline-section" aria-label="Customer testimonials">
            <div className="testimonial-clothesline-inner">
                <motion.header
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="testimonial-header"
                >
                    <h2 className="testimonial-title">Customer Testimonials</h2>
                    <p className="testimonial-hashtag">#HGAndMe</p>
                </motion.header>

                <div className="testimonial-clothesline-stage">
                    <svg
                        className="testimonial-wire"
                        viewBox="0 0 1200 40"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M0,22 C150,8 300,34 450,20 C600,6 750,32 900,18 C1050,4 1150,26 1200,20"
                            fill="none"
                            stroke="#c8c8c8"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="testimonial-autoscroll-viewport">
                        <div className="testimonial-autoscroll-track">
                            {loopItems.map((item, index) => (
                                <PolaroidCard key={`${item.id}-${index}`} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
