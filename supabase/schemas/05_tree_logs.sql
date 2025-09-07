-- Tree logs base table (depends on trees)
CREATE TABLE tree_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    action_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pruning logs (depends on tree_logs)
CREATE TABLE pruning_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_log_id UUID REFERENCES tree_logs(id) ON DELETE CASCADE,
    vase_shape BOOLEAN DEFAULT FALSE,
    bushy_shape BOOLEAN DEFAULT FALSE,
    clear_trunk BOOLEAN DEFAULT FALSE,
    skirt BOOLEAN DEFAULT FALSE,
    high_growing_ends BOOLEAN DEFAULT FALSE,
    wild_shoots BOOLEAN DEFAULT FALSE
);

-- Irrigation logs (depends on tree_logs)
CREATE TABLE irrigation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_log_id UUID REFERENCES tree_logs(id) ON DELETE CASCADE,
    number_of_drippers INTEGER,
    number_of_hours DECIMAL
);

-- Harvesting logs (depends on tree_logs and harvesting_profiles)
CREATE TABLE harvesting_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_log_id UUID REFERENCES tree_logs(id) ON DELETE CASCADE,
    amount_kgs DECIMAL,
    harvesting_profile_id UUID REFERENCES harvesting_profiles(id)
);

-- Fertilizing logs (depends on tree_logs and fertilizing_profiles)
CREATE TABLE fertilizing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_log_id UUID REFERENCES tree_logs(id) ON DELETE CASCADE,
    fertilizing_profile_id UUID REFERENCES fertilizing_profiles(id)
);

-- Treatment logs (depends on tree_logs)
CREATE TABLE treatment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_log_id UUID REFERENCES tree_logs(id) ON DELETE CASCADE,
    white_oil BOOLEAN DEFAULT FALSE,
    other TEXT
);

-- Flowering logs (depends on tree_logs)
CREATE TABLE flowering_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_log_id UUID REFERENCES tree_logs(id) ON DELETE CASCADE,
    percentage_initial DECIMAL,
    percentage_remaining DECIMAL
);

-- Weather logs (depends on tree_logs and weather_profiles)
CREATE TABLE weather_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_log_id UUID REFERENCES tree_logs(id) ON DELETE CASCADE,
    weather_profile_id UUID REFERENCES weather_profiles(id)
);

-- Create indexes for better performance
CREATE INDEX idx_tree_logs_tree_id ON tree_logs(tree_id);
CREATE INDEX idx_tree_logs_date ON tree_logs(date);
