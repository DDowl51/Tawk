import { createRoot } from 'react-dom/client';
import { persistStore } from 'redux-persist';

import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './components/Loading';
import SocketInit from 'hooks/useSocket';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistStore(store)}>
      <BrowserRouter>
        <SocketInit />
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
