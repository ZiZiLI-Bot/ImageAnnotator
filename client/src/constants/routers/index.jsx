import App from 'containers/App';
import DatasetPage from 'containers/DatasetPage';
import DetectPage from 'containers/DetectPage';
import HomePage from 'containers/HomePage';
import LandingPage from 'containers/LandingPage';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/dataset/:id',
        element: <DatasetPage />,
      },
      {
        path: '/detect',
        element: <DetectPage />,
      },
    ],
  },
]);

export default router;
