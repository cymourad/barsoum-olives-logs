import { useState } from 'react';
import { BatchActionType } from '../types';
import { supabase } from '../lib/supabase';

interface BatchLogFormProps {
  batchId: string;
  actionType: BatchActionType;
  onSuccess: () => void;
  onCancel: () => void;
}

const BatchLogForm = ({ batchId, actionType, onSuccess, onCancel }: BatchLogFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create batch log entry
      const { data: logData, error: logError } = await supabase
        .from('oil_processing_batch_logs')
        .insert({
          batch_id: batchId,
          date,
          action_type: actionType,
        })
        .select()
        .single();

      if (logError) throw logError;

      // Create specific action log entry
      await createActionLog(logData.id);
      
      onSuccess();
    } catch (error) {
      console.error('Error creating batch log:', error);
    } finally {
      setLoading(false);
    }
  };

  const createActionLog = async (batchLogId: string) => {
    let tableName = '';
    let data = { batch_log_id: batchLogId, ...formData };

    switch (actionType) {
      case 'transportation_grove_to_plant':
        tableName = 'transportation_grove_to_plant_logs';
        break;
      case 'processing':
        tableName = 'processing_logs';
        break;
      case 'filtering':
        tableName = 'filtering_logs';
        break;
      case 'transportation_plant_to_home':
        tableName = 'transportation_plant_to_home_logs';
        break;
      case 'bottling':
        tableName = 'bottling_logs';
        break;
    }

    const { error } = await supabase
      .from(tableName)
      .insert(data);

    if (error) throw error;
  };

  const renderFormFields = () => {
    switch (actionType) {
      case 'transportation_grove_to_plant':
      case 'transportation_plant_to_home':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Driver Name</label>
              <input
                type="text"
                value={formData.driver_name || ''}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                className="form-input"
                placeholder="Driver name"
              />
            </div>
            <div>
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Plant Name</label>
              <input
                type="text"
                value={formData.plant_name || ''}
                onChange={(e) => setFormData({ ...formData, plant_name: e.target.value })}
                className="form-input"
                placeholder="Processing plant name"
              />
            </div>
            <div>
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight_kgs || ''}
                onChange={(e) => setFormData({ ...formData, weight_kgs: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="form-label">Yield (liters)</label>
              <input
                type="number"
                step="0.1"
                value={formData.yield_liters || ''}
                onChange={(e) => setFormData({ ...formData, yield_liters: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="form-label">Percentage</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.percentage || ''}
                onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="form-label">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-input"
                rows={3}
                placeholder="Processing notes"
              />
            </div>
          </div>
        );

      case 'filtering':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Plant Name</label>
              <input
                type="text"
                value={formData.plant_name || ''}
                onChange={(e) => setFormData({ ...formData, plant_name: e.target.value })}
                className="form-input"
                placeholder="Filtering plant name"
              />
            </div>
            <div>
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="form-label">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-input"
                rows={3}
                placeholder="Filtering notes"
              />
            </div>
          </div>
        );

      case 'bottling':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Container Volume (liters)</label>
              <input
                type="number"
                step="0.1"
                value={formData.container_volume_liters || ''}
                onChange={(e) => setFormData({ ...formData, container_volume_liters: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.0"
              />
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">Form fields for {actionType} not implemented yet.</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-input"
          required
        />
      </div>

      {renderFormFields()}

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Saving...' : 'Save Log'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BatchLogForm;
