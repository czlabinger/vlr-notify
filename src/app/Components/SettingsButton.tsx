'use client';

import React, { useState } from 'react';
import SettingsModal from './SettingsModal';
import SettingsIcon from './SettingsIcon';

const SettingsButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleEnableNotifications = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            alert('This browser does not support notifications.');
            setIsOpen(false);
            return;
        }

        if (Notification.permission === 'granted') {
            alert('Notifications are already enabled.');
            setIsOpen(false);
            return;
        }

        if (Notification.permission === 'denied') {
            alert('Notifications are blocked. Enable them in your browser settings.');
            setIsOpen(false);
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            alert('Notifications enabled!');
        } else if (permission === 'denied') {
            alert('Notifications were blocked. You can enable them in browser settings.');
        }

        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                title='Open Settings'
            >
                <SettingsIcon />
                
                </button>

            <SettingsModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onEnableNotifications={handleEnableNotifications}
            />
        </>
    );
};

export default SettingsButton;
