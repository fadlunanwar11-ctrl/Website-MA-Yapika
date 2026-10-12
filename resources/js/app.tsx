import Gallery from "./Components/Gallery";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, Root } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const w = window as unknown as { __inertiaRoot?: Root };
        w.__inertiaRoot ??= createRoot(el);
        w.__inertiaRoot.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

export default function App() {
    return (
        <main>
            <Gallery />
        </main>
    );
}
