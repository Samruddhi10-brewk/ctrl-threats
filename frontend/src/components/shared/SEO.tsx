import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { metadata } from '../../config/metadata';

export default function SEO() {
    const location = useLocation();
    const path = location.pathname;
    const meta = metadata[path] || metadata['/'];
    const baseUrl = 'https://ctrlthreats.com';
  
    return (
      <Helmet>
        {/* Basic metadata */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />

        {/* OpenGraph metadata */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}${path}`} />
        <meta property="og:image" content={`${baseUrl}/og-image.png`} />
        <meta property="og:site_name" content="CtrlThreats" />

        {/* Twitter Card metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      </Helmet>
    );
}