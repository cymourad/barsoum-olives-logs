import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PicklingBatch, Tree } from '../types';
import { supabase } from '../lib/supabase';
import { useDebouncedInput } from '../hooks/useDebounce';
import TreeMap from '../components/TreeMap';

const PicklingBatchesPage = () => {
  const [batches, setBatches] = useState<PicklingBatch[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tree_ids: [] as string[],
    variety: '',
    ripeness: '',
    notes: '',
    supplier: '',
    salt_percentage: '',
    bruised: false,
    recipe_notes: '',
  });

  // Debounced inputs for text fields
  const varietyInput = useDebouncedInput(
    formData.variety,
    (value) => setFormData({ ...formData, variety: value }),
    500
  );
  
  const ripenessInput = useDebouncedInput(
    formData.ripeness,
    (value) => setFormData({ ...formData, ripeness: value }),
    500
  );
  
  const supplierInput = useDebouncedInput(
    formData.supplier,
    (value) => setFormData({ ...formData, supplier: value }),
    500
  );
  
  const notesInput = useDebouncedInput(
    formData.notes,
    (value) => setFormData({ ...formData, notes: value }),
    500
  );
  
  const recipeNotesInput = useDebouncedInput(
    formData.recipe_notes,
    (value) => setFormData({ ...formData, recipe_notes: value }),
    500
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [batchesResponse, treesResponse] = await Promise.all([
        supabase
          .from('pickling_batches')
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
    if (formData.tree_ids.length === 0) return;

    try {
      const { error } = await supabase
        .from('pickling_batches')
        .insert({
          date: formData.date,
          tree_ids: formData.tree_ids,
          variety: formData.variety || null,
          ripeness: formData.ripeness || null,
          notes: formData.notes || null,
          supplier: formData.supplier || null,
          salt_percentage: formData.salt_percentage ? parseFloat(formData.salt_percentage) : null,
          bruised: formData.bruised,
          recipe_notes: formData.recipe_notes || null,
        });

      if (error) throw error;

      setShowCreateForm(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      tree_ids: [],
      variety: '',
      ripeness: '',
      notes: '',
      supplier: '',
      salt_percentage: '',
      bruised: false,
      recipe_notes: '',
    });
  };

  const toggleTreeSelection = (treeId: string) => {
    setFormData(prev => ({
      ...prev,
      tree_ids: prev.tree_ids.includes(treeId) 
        ? prev.tree_ids.filter(id => id !== treeId)
        : [...prev.tree_ids, treeId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading pickling batches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Pickling Batches</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Create New Batch
        </button>
      </div>

      {batches.length === 0 ? (
        <div className="card text-center py-8">
          <div className="text-gray-500 mb-4">No pickling batches created yet.</div>
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
              to={`/pickling-batch/${batch.id}`}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Batch {new Date(batch.date).toLocaleDateString()}
                </h3>
                <span className="text-2xl">🥒</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Trees: {batch.tree_ids.length}</div>
                {batch.variety && <div>Variety: {batch.variety}</div>}
                {batch.ripeness && <div>Ripeness: {batch.ripeness}</div>}
                {batch.salt_percentage && <div>Salt: {batch.salt_percentage}%</div>}
              </div>
              <div className="text-xs text-gray-500 mt-2">
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
                <h3 className="text-lg font-semibold text-gray-800">Create Pickling Batch</h3>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Batch Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Variety</label>
                    <input
                      type="text"
                      value={varietyInput.displayValue}
                      onChange={(e) => varietyInput.onChange(e.target.value)}
                      className="form-input"
                      placeholder="Olive variety"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Ripeness</label>
                    <input
                      type="text"
                      value={ripenessInput.displayValue}
                      onChange={(e) => ripenessInput.onChange(e.target.value)}
                      className="form-input"
                      placeholder="e.g., Green, Purple, Black"
                    />
                  </div>
                  <div>
                    <label className="form-label">Supplier</label>
                    <input
                      type="text"
                      value={supplierInput.displayValue}
                      onChange={(e) => supplierInput.onChange(e.target.value)}
                      className="form-input"
                      placeholder="Supplier name"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Notes</label>
                  <textarea
                    value={notesInput.displayValue}
                    onChange={(e) => notesInput.onChange(e.target.value)}
                    className="form-input"
                    rows={2}
                    placeholder="Batch notes"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Salt Percentage</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.salt_percentage}
                      onChange={(e) => setFormData({ ...formData, salt_percentage: e.target.value })}
                      className="form-input"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.bruised}
                        onChange={(e) => setFormData({ ...formData, bruised: e.target.checked })}
                        className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
                      />
                      <span className="text-sm text-gray-700">Bruised</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label">Recipe Notes</label>
                  <textarea
                    value={recipeNotesInput.displayValue}
                    onChange={(e) => recipeNotesInput.onChange(e.target.value)}
                    className="form-input"
                    rows={2}
                    placeholder="Recipe and preparation notes"
                  />
                </div>

                <div>
                  <label className="form-label">Select Trees ({formData.tree_ids.length} selected)</label>
                  <div className="border border-gray-300 rounded-md p-3">
                    <TreeMap
                      selectionMode={true}
                      selectedTreeIds={formData.tree_ids}
                      onTreeToggle={toggleTreeSelection}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={createBatch}
                    disabled={formData.tree_ids.length === 0}
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

export default PicklingBatchesPage;
