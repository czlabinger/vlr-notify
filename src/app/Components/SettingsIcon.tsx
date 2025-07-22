import Image from 'next/image';
import React from 'react';

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
    <Image
        src={`/settings.svg`} 
        alt="Icon description" 
        width={30}
        height={30}
    />
);

export default SettingsIcon;
