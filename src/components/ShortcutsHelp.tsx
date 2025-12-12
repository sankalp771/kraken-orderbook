export default function ShortcutsHelp() {
    return (
        <div className="text-[10px] text-gray-500 mt-4 border-t border-gray-800 pt-2">
            <h4 className="font-bold mb-1 border-b border-gray-800 inline-block pb-0.5">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <div className="flex justify-between"><span>Space</span> <span className="text-gray-300">Play/Pause</span></div>
                <div className="flex justify-between"><span>← / →</span> <span className="text-gray-300">Seek History</span></div>
                <div className="flex justify-between"><span>R</span> <span className="text-gray-300">Reset Live</span></div>
            </div>
        </div>
    );
}
