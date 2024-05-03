import React from 'react';
import ReactDOM from 'react-dom/client';
import StarRating from './StarRating';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating /> */}
    {/* <StarRating color='red' size={30} setMovieRating={(rate) => console.log(rate)}/> */}
  </React.StrictMode>
);

