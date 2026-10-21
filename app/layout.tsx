import type { Metadata } from 'next';
import './globals.css';

const name=process.env.NEXT_PUBLIC_TOKEN_NAME?.trim() || 'Trollbelle';
const ticker=process.env.NEXT_PUBLIC_TOKEN_TICKER?.trim() || '$TROLLBELLE';
export const metadata: Metadata = {
  title: `${name} — Problem, darling?`,
  description: 'A punk troll girl escaped a deleted file. Now the whole internet is her playground. TROLLBELLE is a fictional meme character.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://jackmiller825.github.io/TROLLBELLE'),
  openGraph: { title: `${name} — the last laugh belongs to her`, description: 'A doodle. A grin. A whole lot of chaos.', images: ['/images/trollbelle-banner-1500x500.png'] },
  twitter: {card:'summary_large_image',title:`${name} / ${ticker}`, images:['/images/trollbelle-banner-1500x500.png']},
  icons: {icon:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/trollbelle-favicon.png`}
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k='tb_chunk_retry';function retry(){try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');location.reload()}catch(e){location.reload()}}window.addEventListener('error',function(e){var m=(e&&e.message)||'';if(/Loading chunk|ChunkLoadError|failed to fetch dynamically imported module/i.test(m))retry()});window.addEventListener('unhandledrejection',function(e){var r=e&&e.reason;var m=(r&&(r.message||r.name))||String(r||'');if(/Loading chunk|ChunkLoadError|failed to fetch dynamically imported module/i.test(m))retry()})})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="is-loading">{children}</body>
    </html>
  );
}
