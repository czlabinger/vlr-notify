import Link from 'next/link';
import ClientHome from './Components/ClientHome';

export const metadata = {
  title: "Valorant Game Schedule",
  description: "Stay up-to-date with upcoming Valorant matches and tournaments.",
  openGraph: {
    title: "Valorant Game Schedule",
    description: "Stay up-to-date with upcoming Valorant matches and tournaments.",
    url: "https://czlabinger.github.io/vlr-notify/",
    siteName: "VLR Notify",
    images: [
      {
        url: "https://czlabinger.github.io/vlr-notify/images/favicon.png",
        width: 800,
        height: 600,
        alt: "Valorant Schedule Preview",
      },
    ],
    type: "website",
  },
  icons: [
    { url: "/favicon.ico" },
    { url: "/vlr-notify/favicon.ico" },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <ClientHome />
      <footer className="mt-auto text-center py-4">
        <span className="text-gray-600 text-sm">
                The source code is available on{" "}
                <Link
                    href="https://www.github.com/czlabinger/vlr-notify"
                    className="text-blue-600 underline"
                    target="_blank"
                >
                    GitHub
                </Link>
            </span>
      </footer>
    </div>
  );
}
