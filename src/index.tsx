import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store, persistor } from './state';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import EditorNew from './pages/EditorNew';
import { Viewer } from './pages/Viewer';
import { Auth } from './pages/Auth';
import { Editor } from './pages/Editor';
import { PersistGate } from 'redux-persist/integration/react';
import '@fontsource/inter'; // Defaults to weight 400
import '@fontsource/inter/400.css'; // Specify weight
import '@fontsource/inter/400-italic.css'; // Specify weight and style

const router = createBrowserRouter([
  {
    path: '/',
    element: <Viewer />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/editor',
    element: <EditorNew />,
  },
  {
    path: '/editor2',
    element: <Editor />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// persistor.pause();
// persistor.flush().then(() => {
//   return persistor.purge();
// });

root.render(
  //<React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
    {/* <App /> */}
  </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
