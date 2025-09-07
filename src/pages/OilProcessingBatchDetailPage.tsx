import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OilProcessingBatch, OilProcessingBatchLog, Tree, BatchActionType } from '../types';
import { supabase } from '../lib/supabase';
import BatchLogForm from '../components/BatchLogForm';
import BatchLogsList from '../components/BatchLogsList';

const OilProcessingBatchDetailPage = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<OilProcessingBatch | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [logs, setLogs] = useState<OilProcessingBatchLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<BatchActionType>('transportation_grove_to_plant');

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
        .from('oil_processing_batches')
        .select('*')
        .eq('id', batchId)
        .single();

      if (batchError) throw batchError;
      setBatch(batchData);

      // Load trees in this batch
      const { data: treesData, error: treesError } = await supabase
        .from('trees')
        .select('*')
        .in('id', batchData.tree_ids);

      if (treesError) throw treesError;
      setTrees(treesData || []);

      // Load batch logs
      const { data: logsData, error: logsError } = await supabase
        .from('oil_processing_batch_logs')
        .select('*')
        .eq('batch_id', batchId)
        .order('date', { ascending: false });

      if (logsError) throw logsError;
      setLogs(logsData || []);
    } catch (error) {
      console.error('Error loading batch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogAdded = () => {
    setShowLogForm(false);
    loadBatchData();
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
        <Link to="/oil-processing-batches" className="btn-primary">
          Back to Oil Processing Batches
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/oil-processing-batches" className="text-olive-600 hover:text-olive-700 mb-2 inline-block">
            ← Back to Oil Processing Batches
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Oil Processing Batch - {new Date(batch.date).toLocaleDateString()}
          </h1>
        </div>
        <button
          onClick={() => setShowLogForm(true)}
          className="btn-primary"
        >
          Add Log Entry
        </button>
      </div>

      {/* Batch Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Batch Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Trees in Batch ({trees.length})</h3>
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
            <h3 className="font-medium text-gray-700 mb-2">Batch Information</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Date: {new Date(batch.date).toLocaleDateString()}</div>
              <div>Created: {new Date(batch.created_at).toLocaleDateString()}</div>
              <div>Total Logs: {logs.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Logs */}
      <BatchLogsList logs={logs} onRefresh={loadBatchData} />

      {/* Log Form Modal */}
      {showLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Batch Log Entry</h3>
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
                  onChange={(e) => setSelectedAction(e.target.value as BatchActionType)}
                  className="form-input"
                >
                  <option value="transportation_grove_to_plant">Transportation (Grove to Plant)</option>
                  <option value="processing">Processing</option>
                  <option value="filtering">Filtering</option>
                  <option value="transportation_plant_to_home">Transportation (Plant to Home)</option>
                  <option value="bottling">Bottling</option>
                </select>
              </div>

              <BatchLogForm
                batchId={batchId!}
                actionType={selectedAction}
                onSuccess={handleLogAdded}
                onCancel={() => setShowLogForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OilProcessingBatchDetailPage;
