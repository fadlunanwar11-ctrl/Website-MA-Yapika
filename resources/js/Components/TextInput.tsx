import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    error?: string;
}

export interface TextInputRef {
    focus: () => void;
}

export default forwardRef<TextInputRef, TextInputProps>(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        error,
        ...props
    },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    // Meneruskan metode focus ke komponen induk via ref
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    // Otomatis fokus jika prop isFocused bernilai true
    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out ${
                error ? "border-red-500" : "border-gray-300"
            } ${className}`}
            ref={localRef}
        />
    );
});