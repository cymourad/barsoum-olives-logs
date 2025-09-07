import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PicklingBatch, Tree } from '../types';
import { supabase } from '../lib/supabase';
import { useDebouncedInput } from '../hooks/useDebounce';

const PicklingBatchDetailPage = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<PicklingBatch | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PicklingBatch>>({});

  // Debounced inputs for text fields
  const varietyInput = useDebouncedInput(
    formData.variety || '',
    (value) => setFormData({ ...formData, variety: value }),
    500
  );
  
  const ripenessInput = useDebouncedInput(
    formData.ripeness || '',
    (value) => setFormData({ ...formData, ripeness: value }),
    500
  );
  
  const supplierInput = useDebouncedInput(
    formData.supplier || '',
    (value) => setFormData({ ...formData, supplier: value }),
    500
  );
  
  const notesInput = useDebouncedInput(
    formData.notes || '',
    (value) => setFormData({ ...formData, notes: value }),
    500
  );
  
  const recipeNotesInput = useDebouncedInput(
    formData.recipe_notes || '',
    (value) => setFormData({ ...formData, recipe_notes: value }),
    500
  );

  useEffect(() => {
    if (batchId) {
      loadBatchData();
    }
  }, [batchId]);

  const loadBatchData = async () => {
    if (!batchId) return;

    try {
      // Load batch details
      const { data: batchData, error: batchError } = await supabase
        .from('pickling_batches')
        .select('*')
        .eq('id', batchId)
        .single();

      if (batchError) throw batchError;
      setBatch(batchData);
      setFormData(batchData);

      // Load trees in this batch
      const { data: treesData, error: treesError } = await supabase
        .from('trees')
        .select('*')
        .in('id', batchData.tree_ids);

      if (treesError) throw treesError;
      setTrees(treesData || []);
    } catch (error) {
      console.error('Error loading batch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBatch = async () => {
    if (!batchId || !batch) return;

    try {
      const { error } = await supabase
        .from('pickling_batches')
        .update({
          variety: formData.variety || null,
          ripeness: formData.ripeness || null,
          notes: formData.notes || null,
          supplier: formData.supplier || null,
          salt_percentage: formData.salt_percentage || null,
          bruised: formData.bruised || false,
          recipe_notes: formData.recipe_notes || null,
        })
        .eq('id', batchId);

      if (error) throw error;

      setEditing(false);
      loadBatchData();
    } catch (error) {
      console.error('Error updating batch:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading batch details...</div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Batch Not Found</h1>
        <Link to="/pickling-batches" className="btn-primary">
          Back to Pickling Batches
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/pickling-batches" className="text-olive-600 hover:text-olive-700 mb-2 inline-block">
            ← Back to Pickling Batches
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Pickling Batch - {new Date(batch.date).toLocaleDateString()}
          </h1>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="btn-primary"
        >
          {editing ? 'Cancel' : 'Edit Batch'}
        </button>
      </div>

      {/* Batch Details */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Batch Details</h2>
          {editing && (
            <button onClick={updateBatch} className="btn-primary">
              Save Changes
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Variety</label>
              {editing ? (
                <input
                  type="text"
                  value={varietyInput.displayValue}
                  onChange={(e) => varietyInput.onChange(e.target.value)}
                  className="form-input"
                  placeholder="Olive variety"
                />
              ) : (
                <div className="text-gray-800">{batch.variety || 'Not specified'}</div>
              )}
            </div>

            <div>
              <label className="form-label">Ripeness</label>
              {editing ? (
                <input
                  type="text"
                  value={ripenessInput.displayValue}
                  onChange={(e) => ripenessInput.onChange(e.target.value)}
                  className="form-input"
                  placeholder="e.g., Green, Purple, Black"
                />
              ) : (
                <div className="text-gray-800">{batch.ripeness || 'Not specified'}</div>
              )}
            </div>

            <div>
              <label className="form-label">Supplier</label>
              {editing ? (
                <input
                  type="text"
                  value={supplierInput.displayValue}
                  onChange={(e) => supplierInput.onChange(e.target.value)}
                  className="form-input"
                  placeholder="Supplier name"
                />
              ) : (
                <div className="text-gray-800">{batch.supplier || 'Not specified'}</div>
              )}
            </div>

            <div>
              <label className="form-label">Salt Percentage</label>
              {editing ? (
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.salt_percentage || ''}
                  onChange={(e) => setFormData({ ...formData, salt_percentage: parseFloat(e.target.value) || undefined })}
                  className="form-input"
                  placeholder="0.0"
                />
              ) : (
                <div className="text-gray-800">{batch.salt_percentage ? `${batch.salt_percentage}%` : 'Not specified'}</div>
              )}
            </div>

            <div>
              <label className="form-label">Bruised</label>
              {editing ? (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.bruised || false}
                    onChange={(e) => setFormData({ ...formData, bruised: e.target.checked })}
                    className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
                  />
                  <span className="text-sm text-gray-700">Bruised olives</span>
                </label>
              ) : (
                <div className="text-gray-800">{batch.bruised ? 'Yes' : 'No'}</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Trees in Batch ({trees.length})</label>
              <div className="max-h-32 overflow-y-auto">
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {trees.map((tree) => (
                    <Link
                      key={tree.id}
                      to={`/tree/${tree.id}`}
                      className="text-olive-600 hover:text-olive-700"
                    >
                      Tree {tree.position_row + 1}-{tree.position_col + 1}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Batch Information</label>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Date: {new Date(batch.date).toLocaleDateString()}</div>
                <div>Created: {new Date(batch.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="form-label">Notes</label>
            {editing ? (
              <textarea
                value={notesInput.displayValue}
                onChange={(e) => notesInput.onChange(e.target.value)}
                className="form-input"
                rows={3}
                placeholder="Batch notes"
              />
            ) : (
              <div className="text-gray-800 whitespace-pre-wrap">{batch.notes || 'No notes'}</div>
            )}
          </div>

          <div>
            <label className="form-label">Recipe Notes</label>
            {editing ? (
              <textarea
                value={recipeNotesInput.displayValue}
                onChange={(e) => recipeNotesInput.onChange(e.target.value)}
                className="form-input"
                rows={3}
                placeholder="Recipe and preparation notes"
              />
            ) : (
              <div className="text-gray-800 whitespace-pre-wrap">{batch.recipe_notes || 'No recipe notes'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PicklingBatchDetailPage;
