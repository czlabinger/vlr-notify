import Image from 'next/image';
import { useEffect, useState } from 'react';



function SettingsIcon() {
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUrl(window.location.href);
        }
    }, []);

    return (
        <Image src={url + "/images/settings.png"} width={30} height={30} alt="Settings Icon" />
    );

};

export default SettingsIcon;
