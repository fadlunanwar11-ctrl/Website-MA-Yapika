import { ReactNode } from "react";
import SplitText from "./SplitText";
import TextType from "./TextType";

type Props = {
    judul: string;
    sub?: ReactNode;
    gambar?: string;
    children?: ReactNode;
};

export default function PageHero({ judul, sub, gambar, children }: Props) {
    return (
        <section className="relative isolate overflow-hidden text-white">
            {gambar ? (
                <>
                    <img
                        src={gambar}
                        alt=""
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 -z-10 bg-black/60" />
                </>
            ) : (
                <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand-dark to-brand" />
            )}

            <div className=" mx-auto max-w-6xl px-4 py-14 md:py-20">
                <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                    <SplitText
                        text={judul}
                        className="font-bold leading-tight"
                        delay={50}
                        duration={1.25}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="left"
                        onLetterAnimationComplete={() => {}}
                    />
                </h1>

                {sub && (
                    <div className="hero-naik mt-3 max-w-2xl text-lg text-slate-100">
                        {sub}
                    </div>
                )}
                {children && <div className="mt-6">{children}</div>}
            </div>
        </section>
    );
}
