import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function Reveal({
    children,
    delay = 0,
    className = "",
}: PropsWithChildren<{ delay?: number; className?: string }>) {
    const ref = useRef<HTMLDivElement>(null);
    const [tampil, setTampil] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!("IntersectionObserver" in window)) {
            setTampil(true);
            return;
        }
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setTampil(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition duration-700 ease-out motion-reduce:transition-none ${
                tampil
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
            } ${className}`}
        >
            {children}
        </div>
    );
}
