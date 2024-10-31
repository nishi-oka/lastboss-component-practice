import React from 'react';
import "../styles/styles.css"; // Import your CSS file globally

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
