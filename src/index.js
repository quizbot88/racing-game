import React from 'react';
import ReactDOM from 'react-dom/client'; // Используем новый метод из React 18

import './index.css';  // Подключаем стили
import App from './App';  // Импортируем компонент игры

const root = ReactDOM.createRoot(document.getElementById('root')); // Создаем корень

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
