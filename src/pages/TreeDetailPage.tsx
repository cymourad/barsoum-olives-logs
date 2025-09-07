import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tree, TreeLog, ActionType } from '../types';
import { supabase } from '../lib/supabase';
import TreeLogForm from '../components/TreeLogForm';
import TreeLogsList from '../components/TreeLogsList';
import { useDebouncedInput } from '../hooks/useDebounce';

const TreeDetailPage = () => {
  const { treeId } = useParams<{ treeId: string }>();
  const [tree, setTree] = useState<Tree | null>(null);
  const [logs, setLogs] = useState<TreeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType>('pruning');
  const [editFormData, setEditFormData] = useState<Partial<Tree>>({});

  useEffect(() => {
    if (treeId) {
      loadTreeData();
    }
  }, [treeId]);

  // Initialize edit form data when tree data loads
  useEffect(() => {
    if (tree) {
      setEditFormData({
        variety: tree.variety,
        year_planted: tree.year_planted,
        supplier: tree.supplier,
      });
    }
  }, [tree]);

  // Debounced inputs for edit form
  const supplierInput = useDebouncedInput(
    editFormData.supplier || '',
    (value) => setEditFormData({ ...editFormData, supplier: value }),
    500
  );

  const loadTreeData = async () => {
    if (!treeId) return;

    try {
      // Load tree details
      const { data: treeData, error: treeError } = await supabase
        .from('trees')
        .select('*')
        .eq('id', treeId)
        .single();

      if (treeError) throw treeError;
      setTree(treeData);

      // Load tree logs
      const { data: logsData, error: logsError } = await supabase
        .from('tree_logs')
        .select('*')
        .eq('tree_id', treeId)
        .order('date', { ascending: false });

      if (logsError) throw logsError;
      setLogs(logsData || []);
    } catch (error) {
      console.error('Error loading tree data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogAdded = () => {
    setShowLogForm(false);
    loadTreeData();
  };

  const updateTreeProperties = async () => {
    if (!treeId) return;

    try {
      const { error } = await supabase
        .from('trees')
        .update({
          variety: editFormData.variety || null,
          year_planted: editFormData.year_planted || null,
          supplier: editFormData.supplier || null,
        })
        .eq('id', treeId);

      if (error) throw error;
      setShowEditForm(false);
      loadTreeData();
    } catch (error) {
      console.error('Error updating tree:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading tree details...</div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tree Not Found</h1>
        <Link to="/trees" className="btn-primary">
          Back to Trees
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/trees" className="text-olive-600 hover:text-olive-700 mb-2 inline-block">
            ← Back to Trees
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Tree {tree.position_row + 1}-{tree.position_col + 1}
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowEditForm(true)}
            className="btn-secondary"
          >
            Edit Properties
          </button>
          <button
            onClick={() => setShowLogForm(true)}
            className="btn-primary"
          >
            Add Log Entry
          </button>
        </div>
      </div>

      {/* Tree Properties */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tree Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Variety</label>
            <div className="text-gray-800">{tree.variety || 'Not specified'}</div>
          </div>
          <div>
            <label className="form-label">Year Planted</label>
            <div className="text-gray-800">{tree.year_planted || 'Not specified'}</div>
          </div>
          <div>
            <label className="form-label">Supplier</label>
            <div className="text-gray-800">{tree.supplier || 'Not specified'}</div>
          </div>
        </div>
      </div>

      {/* Tree Logs */}
      <TreeLogsList logs={logs} onRefresh={loadTreeData} />

      {/* Log Form Modal */}
      {showLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Log Entry</h3>
                <button
                  onClick={() => setShowLogForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="form-label">Action Type</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value as ActionType)}
                  className="form-input"
                >
                  <option value="pruning">Pruning</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="fertilizing">Fertilizing</option>
                  <option value="treatment">Treatment</option>
                  <option value="flowering">Flowering</option>
                  <option value="weather">Weather</option>
                </select>
              </div>

              <TreeLogForm
                treeId={treeId!}
                actionType={selectedAction}
                onSuccess={handleLogAdded}
                onCancel={() => setShowLogForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Properties Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Edit Tree Properties</h3>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Variety</label>
                  <select
                    value={editFormData.variety || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, variety: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="">Select variety</option>
                    <option value="frontoyo">Frontoyo</option>
                    <option value="kalamata">Kalamata</option>
                    <option value="jumbo kalamata">Jumbo Kalamata</option>
                    <option value="spanish queen">Spanish Queen</option>
                    <option value="burnia">Burnia</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Year Planted</label>
                  <input
                    type="number"
                    value={editFormData.year_planted || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, year_planted: parseInt(e.target.value) || undefined })}
                    className="form-input"
                    placeholder="e.g. 2020"
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

              <div className="flex space-x-3 pt-6">
                <button
                  onClick={updateTreeProperties}
                  className="btn-primary flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeDetailPage;
