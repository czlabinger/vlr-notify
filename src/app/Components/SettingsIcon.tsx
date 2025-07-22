import Image from 'next/image';

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
    <Image
        src={"/settings.png"}
        width={30}
        height={30}
        alt={"Settings Icon"}
    />
);

export default SettingsIcon;
