import { useRef } from 'react';

interface TimeTravelSliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    active: boolean;
}

export default function TimeTravelSlider({ min, max, value, onChange, active }: TimeTravelSliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <div className="flex items-center gap-4 w-full px-4 py-2 bg-gray-900 rounded border border-gray-700">
            <span className="text-xs text-gray-500 uppercase font-bold min-w-[50px]">
                {active ? 'History' : 'Live'}
            </span>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                disabled={!active}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${active ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
            />
            <span className="text-xs font-mono text-gray-400">
                {active ? value : 'NOW'}
            </span>
        </div>
    );
}
