-- Oil processing batches (independent table)
CREATE TABLE oil_processing_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    tree_ids UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oil processing batch logs (depends on oil_processing_batches)
CREATE TABLE oil_processing_batch_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES oil_processing_batches(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    action_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transportation from grove to plant (depends on oil_processing_batch_logs)
CREATE TABLE transportation_grove_to_plant_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_log_id UUID REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE,
    driver_name TEXT,
    price DECIMAL
);

-- Processing logs (depends on oil_processing_batch_logs)
CREATE TABLE processing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_log_id UUID REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE,
    plant_name TEXT,
    notes TEXT,
    price DECIMAL,
    weight_kgs DECIMAL,
    yield_liters DECIMAL,
    percentage DECIMAL
);

-- Filtering logs (depends on oil_processing_batch_logs)
CREATE TABLE filtering_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_log_id UUID REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE,
    plant_name TEXT,
    price DECIMAL,
    notes TEXT
);

-- Transportation from plant to home (depends on oil_processing_batch_logs)
CREATE TABLE transportation_plant_to_home_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_log_id UUID REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE,
    driver_name TEXT,
    price DECIMAL
);

-- Bottling logs (depends on oil_processing_batch_logs)
CREATE TABLE bottling_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_log_id UUID REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE,
    container_volume_liters DECIMAL
);

-- Create index for better performance
CREATE INDEX idx_oil_processing_batches_date ON oil_processing_batches(date);
