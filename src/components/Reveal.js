import { motion, MotionConfig } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const itemVariants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }
};

export const Reveal = ({ children, className, as = 'div', stagger = 0.12, amount = 0.15 }) => {
    const Tag = motion[as];

    return (
        <MotionConfig reducedMotion="user">
            <Tag
                className={className}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: stagger } }
                }}
            >
                {children}
            </Tag>
        </MotionConfig>
    );
};

export const RevealItem = ({ children, className, as = 'div', ...rest }) => {
    const Tag = motion[as];

    return (
        <Tag className={className} variants={itemVariants} {...rest}>
            {children}
        </Tag>
    );
};