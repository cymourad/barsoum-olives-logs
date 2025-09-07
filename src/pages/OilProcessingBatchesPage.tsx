import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OilProcessingBatch, Tree } from '../types';
import { supabase } from '../lib/supabase';
import TreeMap from '../components/TreeMap';

const OilProcessingBatchesPage = () => {
  const [batches, setBatches] = useState<OilProcessingBatch[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTrees, setSelectedTrees] = useState<string[]>([]);
  const [batchDate, setBatchDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [batchesResponse, treesResponse] = await Promise.all([
        supabase
          .from('oil_processing_batches')
          .select('*')
          .order('date', { ascending: false }),
        supabase
          .from('trees')
          .select('*')
          .order('position_row', { ascending: true })
          .order('position_col', { ascending: true })
      ]);

      if (batchesResponse.error) throw batchesResponse.error;
      if (treesResponse.error) throw treesResponse.error;

      setBatches(batchesResponse.data || []);
      setTrees(treesResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async () => {
    if (selectedTrees.length === 0) return;

    try {
      const { error } = await supabase
        .from('oil_processing_batches')
        .insert({
          date: batchDate,
          tree_ids: selectedTrees,
        });

      if (error) throw error;

      setShowCreateForm(false);
      setSelectedTrees([]);
      setBatchDate(new Date().toISOString().split('T')[0]);
      loadData();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const toggleTreeSelection = (treeId: string) => {
    setSelectedTrees(prev => 
      prev.includes(treeId) 
        ? prev.filter(id => id !== treeId)
        : [...prev, treeId]
    );
  };

  const getTreeLabel = (treeId: string) => {
    const tree = trees.find(t => t.id === treeId);
    return tree ? `Tree ${tree.position_row + 1}-${tree.position_col + 1}` : treeId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading oil processing batches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Oil Processing Batches</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Create New Batch
        </button>
      </div>

      {batches.length === 0 ? (
        <div className="card text-center py-8">
          <div className="text-gray-500 mb-4">No oil processing batches created yet.</div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Your First Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Link
              key={batch.id}
              to={`/oil-processing-batch/${batch.id}`}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Batch {new Date(batch.date).toLocaleDateString()}
                </h3>
                <span className="text-2xl">🫒</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Trees: {batch.tree_ids.length}
              </div>
              <div className="text-xs text-gray-500">
                Created: {new Date(batch.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Create Oil Processing Batch</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Batch Date</label>
                  <input
                    type="date"
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Select Trees ({selectedTrees.length} selected)</label>
                  <div className="border border-gray-300 rounded-md p-3">
                    <TreeMap
                      selectionMode={true}
                      selectedTreeIds={selectedTrees}
                      onTreeToggle={toggleTreeSelection}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={createBatch}
                    disabled={selectedTrees.length === 0}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Batch
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OilProcessingBatchesPage;
