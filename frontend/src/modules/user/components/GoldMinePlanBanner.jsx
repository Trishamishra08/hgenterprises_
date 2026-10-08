import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ringImg from '../assets/diamond_ring.png';

const GoldMinePlanBanner = () => {
    return (
        <section className="goldmine-banner-section" aria-label="Gold Mine 10+1 Monthly Installment Plan">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="goldmine-banner-inner"
            >
                <Link to="/shop?category=Jewellery" className="goldmine-banner-link group">
                    <div className="goldmine-banner-row">
                        <div className="goldmine-banner-content">
                            <div className="goldmine-brand">
                                <span className="goldmine-brand-corner goldmine-brand-corner--tl" />
                                <span className="goldmine-brand-corner goldmine-brand-corner--br" />
                                <span className="goldmine-brand-text">Gold Mine</span>
                            </div>

                            <div className="goldmine-offer">10+1</div>

                            <div className="goldmine-divider" aria-hidden="true" />

                            <p className="goldmine-plan-label">
                                MONTHLY
                                <br />
                                INSTALLMENT
                                <br />
                                PLAN
                            </p>

                            <div className="goldmine-divider goldmine-divider--wide" aria-hidden="true" />

                            <p className="goldmine-desc">
                                Pay 10 installments and enjoy 100% savings on the 11<sup>th</sup> Month !
                            </p>
                        </div>

                        <div className="goldmine-banner-image">
                            <img
                                src={ringImg}
                                alt="Gold Mine monthly plan jewellery"
                                className="goldmine-ring-img"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </Link>
            </motion.div>
        </section>
    );
};

export default GoldMinePlanBanner;
