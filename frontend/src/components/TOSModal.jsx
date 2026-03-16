import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function TermsModal({ isOpen, setIsOpen, onAccept, onClose, agreed, setAgreed }) {
    const [hasScrolled, setHasScrolled] = useState(false);
    // const [agreed, setAgreed] = useState(false);
    // const [isOpen, setIsOpen] = useState(true);

    const contentRef = useRef(null);

    const handleScroll = () => {
        const el = contentRef.current;
        if (!el) return;

        const bottomReached =
            el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

        if (bottomReached) setHasScrolled(true);
    };

    const handleAccept = () => {
        if (!agreed || !hasScrolled) return;
        setIsOpen(false);
        onAccept?.();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>

            <div className="relative w-full max-w-2xl bg-gray-950 rounded-xl shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-300">
                        Terms & Conditions
                    </h2>
                    <p className="text-sm text-gray-400">
                        Please read the terms before continuing.
                    </p>
                    <p className="text-sm text-gray-400">
                        You must scroll to the bottom to click 'Accept & Continue'
                    </p>
                </div>
                <button
                    className="absolute top-2 right-2 p-1 rounded-lg text-red-600 hover:text-red-300"
                    onClick={onClose}
                >
                    <X />
                </button>

                {/* Scrollable Terms */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="max-h-[480px] overflow-y-auto px-6 py-5 space-y-4 text-sm text-gray-200"
                >
                    <p><strong>Last Updated:</strong> 15/03/2025</p>

                    <p>
                        By accessing this website, you agree to be bound by the following
                        Terms and Conditions. If you do not agree, you should not use this
                        website.
                    </p>

                    <h3 className="font-semibold">1. Information Collection</h3>
                    <p>
                        To place an order, users are required to provide personal
                        information including:
                    </p>

                    <ul className="list-disc ml-6">
                        <li>Full Name</li>
                        <li>Billing and Shipping Address</li>
                        <li>Phone Number</li>
                        <li>Email Address</li>
                    </ul>

                    <h3 className="font-semibold">2. Use of Information</h3>
                    <p>
                        The information you provide is used to process orders, ship
                        products, provide customer support, and communicate about your
                        purchases.
                    </p>

                    <h3 className="font-semibold">3. Accuracy of Information</h3>
                    <p>
                        Users agree to provide accurate and current information. Providing
                        false information may result in order cancellation or account
                        suspension.
                    </p>

                    <h3 className="font-semibold">4. Orders and Payments</h3>
                    <p>
                        Orders are subject to availability and confirmation. Prices and
                        product availability may change without notice.
                    </p>

                    <h3 className="font-semibold">5. Shipping and Delivery</h3>
                    <p>
                        Delivery times are estimates and may vary depending on location,
                        carrier delays, or other external factors.
                    </p>

                    <h3 className="font-semibold">6. Limitation of Liability</h3>
                    <p>
                        We are not liable for indirect damages, loss of profits, or issues
                        resulting from incorrect information provided by users.
                    </p>

                    <h3 className="font-semibold">7. Changes to Terms</h3>
                    <p>
                        These Terms may be updated periodically. Continued use of the
                        website indicates acceptance of the updated Terms.
                    </p>

                    {!hasScrolled && (
                        <p className="text-xs text-blue-600 font-medium">
                        Please scroll to the bottom to enable acceptance.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4">

                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                        <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        />
                        I agree to the Terms and Conditions
                    </label>

                    <div className="flex justify-end">
                        <button
                            onClick={handleAccept}
                            disabled={!agreed || !hasScrolled}
                            className={`px-5 py-2 rounded-lg text-white font-medium transition
                            ${
                                agreed && hasScrolled
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                        Accept & Continue
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}