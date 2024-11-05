<<<<<<< HEAD
import React from "react";
import PropTypes from "prop-types";
=======
import React from 'react';
import PropTypes from 'prop-types';
>>>>>>> 107dd421447a9ec6702594dad8b926c3a7bb88cc
import "../styles/styles.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
