import { useEffect, useCallback } from 'react';

type KeyAction = {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    action: () => void;
    description: string;
};

export function useKeyboardShortcuts(actions: KeyAction[]) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const match = actions.find(a =>
            a.key.toLowerCase() === event.key.toLowerCase() &&
            !!a.ctrl === event.ctrlKey &&
            !!a.shift === event.shiftKey
        );

        if (match) {
            event.preventDefault();
            match.action();
        }
    }, [actions]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
