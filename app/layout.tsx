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
  icons: {icon:'/images/trollbelle-favicon.png'}
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
