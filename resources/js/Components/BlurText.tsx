"use client";

import { motion, type Transition, type Easing } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";

type BlurTextProps = {
    text?: string;
    delay?: number;
    className?: string;
    animateBy?: "words" | "letters";
    direction?: "top" | "bottom";
    threshold?: number;
    rootMargin?: string;
    animationFrom?: Record<string, string | number>;
    animationTo?: Array<Record<string, string | number>>;
    easing?: Easing | Easing[];
    onAnimationComplete?: () => void;
    stepDuration?: number;

    // Loop blur
    loop?: boolean;
    loopDuration?: number;
    loopBlur?: number;
};

// ==========================================
// BUILD KEYFRAMES
// ==========================================

const buildKeyframes = (
    from: Record<string, string | number>,
    steps: Array<Record<string, string | number>>,
): Record<string, Array<string | number>> => {
    const keys = new Set<string>([
        ...Object.keys(from),
        ...steps.flatMap((step) => Object.keys(step)),
    ]);

    const keyframes: Record<string, Array<string | number>> = {};

    keys.forEach((key) => {
        keyframes[key] = [from[key], ...steps.map((step) => step[key])];
    });

    return keyframes;
};

// ==========================================
// BLUR TEXT
// ==========================================

const BlurText: React.FC<BlurTextProps> = ({
    text = "",
    delay = 200,
    className = "",
    animateBy = "words",
    direction = "top",
    threshold = 0.1,
    rootMargin = "0px",
    animationFrom,
    animationTo,
    easing = "easeOut",
    onAnimationComplete,
    stepDuration = 0.35,

    loop = true,
    loopDuration = 2,
    loopBlur = 3,
}) => {
    const elements = animateBy === "words" ? text.split(" ") : text.split("");

    const [inView, setInView] = useState(false);
    const [entranceFinished, setEntranceFinished] = useState(false);

    const entranceCompleteRef = useRef(false);
    const ref = useRef<HTMLParagraphElement>(null);

    // ==========================================
    // INTERSECTION OBSERVER
    // ==========================================

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);

                    observer.unobserve(ref.current as Element);
                }
            },
            {
                threshold,
                rootMargin,
            },
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    // ==========================================
    // ANIMASI MASUK
    // ==========================================

    const defaultFrom = useMemo(
        () =>
            direction === "top"
                ? {
                      filter: "blur(10px)",
                      opacity: 0,
                      y: -50,
                  }
                : {
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 50,
                  },
        [direction],
    );

    const defaultTo = useMemo(
        () => [
            {
                filter: "blur(5px)",
                opacity: 0.5,
                y: direction === "top" ? 5 : -5,
            },
            {
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
            },
        ],
        [direction],
    );

    const fromSnapshot = animationFrom ?? defaultFrom;

    const toSnapshots = animationTo ?? defaultTo;

    // ==========================================
    // KEYFRAME ANIMASI MASUK
    // ==========================================

    const entranceKeyframes = useMemo(
        () => buildKeyframes(fromSnapshot, toSnapshots),
        [fromSnapshot, toSnapshots],
    );

    const stepCount = toSnapshots.length + 1;

    const totalDuration = stepDuration * (stepCount - 1);

    const times = Array.from({ length: stepCount }, (_, index) =>
        stepCount === 1 ? 0 : index / (stepCount - 1),
    );

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
            {elements.map((segment, index) => {
                // Delay entrance
                const entranceDelay = (index * delay) / 1000;

                const entranceTransition: Transition = {
                    duration: totalDuration,
                    times,
                    delay: entranceDelay,
                    ease: easing,
                };

                // Delay loop
                // Kata pertama → kedua → ketiga → dst
                const loopDelay = (index * loopDuration) / elements.length;

                return (
                    <motion.span
                        key={index}
                        initial={fromSnapshot}
                        animate={
                            !inView
                                ? fromSnapshot
                                : !entranceFinished
                                  ? entranceKeyframes
                                  : {
                                        filter: [
                                            "blur(0px)",
                                            `blur(${loopBlur}px)`,
                                            "blur(0px)",
                                        ],
                                        opacity: 1,
                                        y: 0,
                                    }
                        }
                        transition={
                            !entranceFinished
                                ? entranceTransition
                                : {
                                      duration: loopDuration,
                                      delay: loopDelay,
                                      repeat: loop ? Infinity : 0,
                                      repeatType: "loop",
                                      ease: "easeInOut",
                                  }
                        }
                        onAnimationComplete={() => {
                            // Hanya cek kata terakhir
                            if (
                                index === elements.length - 1 &&
                                !entranceCompleteRef.current
                            ) {
                                entranceCompleteRef.current = true;

                                setEntranceFinished(true);

                                onAnimationComplete?.();
                            }
                        }}
                        style={{
                            display: "inline-block",
                            willChange: "transform, filter, opacity",
                        }}
                    >
                        {segment}

                        {animateBy === "words" &&
                            index < elements.length - 1 &&
                            "\u00A0"}
                    </motion.span>
                );
            })}
        </p>
    );
};

export default BlurText;
