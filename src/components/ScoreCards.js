import './ScoreCards.css';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const cardNumber = (index) => `[${String(index + 1).padStart(2, '0')}]`;

const CardFront = ({ category, index }) => (
    <>
        <span className="score-num">{cardNumber(index)}</span>
        <div className="score-card-header">
            <h3>{category.name}</h3>
            <span className="score-value">
                {category.score}<span>/10</span>
            </span>
        </div>
        <div className="score-bar-bg">
            <div
                className="score-bar-fill"
                style={{ width: `${category.score * 10}%` }}
            ></div>
        </div>
        <p className="score-card-verdict">{category.verdict}</p>
        <dl className="score-points">
            <div className="score-point">
                <dt>Strength</dt>
                <dd>{category.strength}</dd>
            </div>
            <div className="score-point">
                <dt>Gap</dt>
                <dd>{category.gap}</dd>
            </div>
        </dl>
    </>
);

const CardBack = ({ category, index, onClose }) => {
    const evidence = category.evidence;

    return (
        <>
            <div className="evidence-top">
                <span className="score-num">{cardNumber(index)} Evidence</span>
                <button type="button" className="evidence-close" onClick={onClose} autoFocus>
                    Close
                </button>
            </div>
            <div className="score-card-header">
                <h3>{category.name}</h3>
                <span className="score-value">
                    {category.score}<span>/10</span>
                </span>
            </div>
            <p className="evidence-intro">What this score is based on, pulled straight from GitHub.</p>

            {!evidence ? (
                <p className="evidence-empty">No evidence available for this category.</p>
            ) : (
                <>
                    <div className="evidence-stats">
                        {evidence.stats.map(stat => (
                            <div className="evidence-stat" key={stat.label}>
                                <span className="evidence-stat-value">{stat.value}</span>
                                <span className="evidence-stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {evidence.rows.length > 0 ? (
                        <ul className="evidence-rows">
                            {evidence.rows.map(row => (
                                <li className="evidence-row" key={row.name}>
                                    <span className="evidence-row-name">{row.name}</span>
                                    <span className="evidence-row-detail">{row.detail}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="evidence-empty">No repos matched this category.</p>
                    )}
                </>
            )}
        </>
    );
};

const ScoreCards = ({ categories }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const [flipped, setFlipped] = useState(false);
    const cardRefs = useRef([]);

    const openCard = (index) => {
        setOpenIndex(index);
        setFlipped(true);
    };

    const closeCard = () => {
        setFlipped(false);
    };

    const handleFlipDone = () => {
        if (!flipped && openIndex !== null) {
            const index = openIndex;
            setOpenIndex(null);
            setTimeout(() => cardRefs.current[index]?.querySelector('.score-card-open')?.focus(), 500);
        }
    };

    useEffect(() => {
        if (openIndex === null) return;

        const handleKey = (e) => {
            if (e.key === 'Escape') closeCard();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openIndex]);

    const openCategory = openIndex !== null ? categories[openIndex] : null;

    return (
        <MotionConfig reducedMotion="user">
            <div className="score-grid">
                {categories.map((category, index) => (
                    <div
                        className="score-card-slot"
                        key={category.name}
                        ref={el => (cardRefs.current[index] = el)}
                    >
                        {openIndex === index ? (
                            <div className="score-card score-card-placeholder" aria-hidden="true">
                                <CardFront category={category} index={index} />
                            </div>
                        ) : (
                            <motion.div
                                layoutId={`score-card-${index}`}
                                className="score-card score-card-clickable"
                                onClick={() => openCard(index)}
                                transition={{ duration: 0.5, ease: EASE }}
                            >
                                <motion.div layout="position" className="score-card-inner">
                                    <CardFront category={category} index={index} />
                                    <button type="button" className="score-card-open">
                                        See the evidence <span aria-hidden="true">↻</span>
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {openCategory && (
                    <motion.div className="evidence-overlay" key="overlay">
                        <motion.div
                            className="evidence-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeCard}
                        />
                        <motion.div
                            layoutId={`score-card-${openIndex}`}
                            className="evidence-card"
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${openCategory.name} evidence`}
                            transition={{ duration: 0.5, ease: EASE }}
                        >
                            <motion.div
                                className="flipper"
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                onAnimationComplete={handleFlipDone}
                            >
                                <div className="card-face card-face-front score-card">
                                    <CardFront category={openCategory} index={openIndex} />
                                </div>
                                <div className="card-face card-face-back">
                                    <CardBack category={openCategory} index={openIndex} onClose={closeCard} />
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MotionConfig>
    );
};

export default ScoreCards;