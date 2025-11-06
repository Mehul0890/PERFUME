
import React from 'react';

export const Loader: React.FC = () => {
    const messages = [
        "Crafting aesthetic shots...",
        "Finding the perfect models...",
        "Designing creative ads...",
        "Polishing the pixels...",
        "Uncorking creativity...",
    ];

    const [message, setMessage] = React.useState(messages[0]);
    
    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            <p className="mt-6 text-xl text-gray-300 font-semibold transition-opacity duration-500">{message}</p>
            <p className="mt-2 text-gray-500">This may take a moment. Please wait.</p>
        </div>
    );
};
