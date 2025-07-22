'use client';

import React, { useState } from 'react';
import SettingsModal from './SettingsModal';
import SettingsIcon from './SettingsIcon';

const SettingsButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleEnableNotifications = async () => {
        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                alert('Notifications enabled!');
            }
        } else {
            alert('Notifications are already enabled.');
        }

        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open settings"
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
