export interface Tree {
  id: string;
  position_row: number;
  position_col: number;
  variety?: 'frontoyo' | 'kalamata' | 'jumbo kalamata' | 'spanish queen' | 'burnia';
  year_planted?: number;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

export interface TreeLog {
  id: string;
  tree_id: string;
  date: string;
  action_type: string;
  created_at: string;
}

export interface PruningLog {
  id: string;
  tree_log_id: string;
  vase_shape: boolean;
  bushy_shape: boolean;
  clear_trunk: boolean;
  skirt: boolean;
  high_growing_ends: boolean;
  wild_shoots: boolean;
}

export interface IrrigationLog {
  id: string;
  tree_log_id: string;
  number_of_drippers?: number;
  number_of_hours?: number;
}

export interface HarvestingProfile {
  id: string;
  type: 'mechanical' | 'manual';
  contractor_name?: string;
  price?: number;
  created_at: string;
}

export interface HarvestingLog {
  id: string;
  tree_log_id: string;
  amount_kgs?: number;
  harvesting_profile_id?: string;
}

export interface FertilizingProfile {
  id: string;
  nitrogen: boolean;
  potassium: boolean;
  phosphore: boolean;
  borron: boolean;
  chicken_manure: boolean;
  lime: boolean;
  gypsum: boolean;
  created_at: string;
}

export interface FertilizingLog {
  id: string;
  tree_log_id: string;
  fertilizing_profile_id: string;
}

export interface TreatmentLog {
  id: string;
  tree_log_id: string;
  white_oil: boolean;
  other?: string;
}

export interface FloweringLog {
  id: string;
  tree_log_id: string;
  percentage_initial?: number;
  percentage_remaining?: number;
}

export interface WeatherProfile {
  id: string;
  frost: boolean;
  rain: boolean;
  temperature?: number;
  created_at: string;
}

export interface WeatherLog {
  id: string;
  tree_log_id: string;
  weather_profile_id: string;
}

export interface OilProcessingBatch {
  id: string;
  date: string;
  tree_ids: string[];
  created_at: string;
}

export interface OilProcessingBatchLog {
  id: string;
  batch_id: string;
  date: string;
  action_type: string;
  created_at: string;
}

export interface TransportationGroveToPlantLog {
  id: string;
  batch_log_id: string;
  driver_name?: string;
  price?: number;
}

export interface ProcessingLog {
  id: string;
  batch_log_id: string;
  plant_name?: string;
  notes?: string;
  price?: number;
  weight_kgs?: number;
  yield_liters?: number;
  percentage?: number;
}

export interface FilteringLog {
  id: string;
  batch_log_id: string;
  plant_name?: string;
  price?: number;
  notes?: string;
}

export interface TransportationPlantToHomeLog {
  id: string;
  batch_log_id: string;
  driver_name?: string;
  price?: number;
}

export interface BottlingLog {
  id: string;
  batch_log_id: string;
  container_volume_liters?: number;
}

export interface PicklingBatch {
  id: string;
  date: string;
  tree_ids: string[];
  variety?: string;
  ripeness?: string;
  notes?: string;
  supplier?: string;
  salt_percentage?: number;
  bruised: boolean;
  recipe_notes?: string;
  created_at: string;
}

export type ActionType = 
  | 'pruning'
  | 'irrigation'
  | 'harvesting'
  | 'fertilizing'
  | 'treatment'
  | 'flowering'
  | 'weather';

export type BatchActionType =
  | 'transportation_grove_to_plant'
  | 'processing'
  | 'filtering'
  | 'transportation_plant_to_home'
  | 'bottling';
