import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import TreesPage from './pages/TreesPage';
import TreeDetailPage from './pages/TreeDetailPage';
import OilProcessingBatchesPage from './pages/OilProcessingBatchesPage';
import OilProcessingBatchDetailPage from './pages/OilProcessingBatchDetailPage';
import PicklingBatchesPage from './pages/PicklingBatchesPage';
import PicklingBatchDetailPage from './pages/PicklingBatchDetailPage';

function App() {
  return (
    <Router basename="/barsoum-olives-logs">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TreesPage />} />
            <Route path="/trees" element={<TreesPage />} />
            <Route path="/tree/:treeId" element={<TreeDetailPage />} />
            <Route path="/oil-processing-batches" element={<OilProcessingBatchesPage />} />
            <Route path="/oil-processing-batch/:batchId" element={<OilProcessingBatchDetailPage />} />
            <Route path="/pickling-batches" element={<PicklingBatchesPage />} />
            <Route path="/pickling-batch/:batchId" element={<PicklingBatchDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
