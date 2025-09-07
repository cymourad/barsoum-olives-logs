import { useState } from 'react';
import { ActionType } from '../types';
import { supabase } from '../lib/supabase';

interface TreeLogFormProps {
  treeId: string;
  actionType: ActionType;
  onSuccess: () => void;
  onCancel: () => void;
}

const TreeLogForm = ({ treeId, actionType, onSuccess, onCancel }: TreeLogFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create tree log entry
      const { data: logData, error: logError } = await supabase
        .from('tree_logs')
        .insert({
          tree_id: treeId,
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
      console.error('Error creating log:', error);
    } finally {
      setLoading(false);
    }
  };

  const createActionLog = async (treeLogId: string) => {
    let tableName = '';
    let data = { tree_log_id: treeLogId, ...formData };

    switch (actionType) {
      case 'pruning':
        tableName = 'pruning_logs';
        break;
      case 'irrigation':
        tableName = 'irrigation_logs';
        break;
      case 'harvesting':
        tableName = 'harvesting_logs';
        break;
      case 'fertilizing':
        tableName = 'fertilizing_logs';
        break;
      case 'treatment':
        tableName = 'treatment_logs';
        break;
      case 'flowering':
        tableName = 'flowering_logs';
        break;
      case 'weather':
        tableName = 'weather_logs';
        break;
    }

    const { error } = await supabase
      .from(tableName)
      .insert(data);

    if (error) throw error;
  };

  const renderFormFields = () => {
    switch (actionType) {
      case 'pruning':
        return (
          <div className="space-y-4">
            {['vase_shape', 'bushy_shape', 'clear_trunk', 'skirt', 'high_growing_ends', 'wild_shoots'].map((field) => (
              <label key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field] || false}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.checked })}
                  className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {field.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        );

      case 'irrigation':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Number of Drippers</label>
              <input
                type="number"
                value={formData.number_of_drippers || ''}
                onChange={(e) => setFormData({ ...formData, number_of_drippers: parseInt(e.target.value) || undefined })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Number of Hours</label>
              <input
                type="number"
                step="0.1"
                value={formData.number_of_hours || ''}
                onChange={(e) => setFormData({ ...formData, number_of_hours: parseFloat(e.target.value) || undefined })}
                className="form-input"
              />
            </div>
          </div>
        );

      case 'harvesting':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Amount (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.amount_kgs || ''}
                onChange={(e) => setFormData({ ...formData, amount_kgs: parseFloat(e.target.value) || undefined })}
                className="form-input"
              />
            </div>
          </div>
        );

      case 'treatment':
        return (
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.white_oil || false}
                onChange={(e) => setFormData({ ...formData, white_oil: e.target.checked })}
                className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
              />
              <span className="text-sm text-gray-700">White Oil</span>
            </label>
            <div>
              <label className="form-label">Other Treatment</label>
              <input
                type="text"
                value={formData.other || ''}
                onChange={(e) => setFormData({ ...formData, other: e.target.value })}
                className="form-input"
                placeholder="Describe other treatment"
              />
            </div>
          </div>
        );

      case 'flowering':
        return (
          <div className="space-y-4">
            <div>
              <label className="form-label">Initial Percentage</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.percentage_initial || ''}
                onChange={(e) => setFormData({ ...formData, percentage_initial: parseFloat(e.target.value) || undefined })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Remaining Percentage</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.percentage_remaining || ''}
                onChange={(e) => setFormData({ ...formData, percentage_remaining: parseFloat(e.target.value) || undefined })}
                className="form-input"
              />
            </div>
          </div>
        );

      case 'fertilizing':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['nitrogen', 'potassium', 'phosphore', 'borron', 'chicken_manure', 'lime', 'gypsum'].map((field) => (
                <label key={field} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData[field] || false}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.checked })}
                    className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {field.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.frost || false}
                  onChange={(e) => setFormData({ ...formData, frost: e.target.checked })}
                  className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
                />
                <span className="text-sm text-gray-700">Frost</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.rain || false}
                  onChange={(e) => setFormData({ ...formData, rain: e.target.checked })}
                  className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
                />
                <span className="text-sm text-gray-700">Rain</span>
              </label>
            </div>
            <div>
              <label className="form-label">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature || ''}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="Temperature in Celsius"
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

export default TreeLogForm;
