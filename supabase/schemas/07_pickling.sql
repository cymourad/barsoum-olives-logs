-- Pickling batches (independent table)
CREATE TABLE pickling_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    tree_ids UUID[] NOT NULL,
    variety TEXT,
    ripeness TEXT,
    notes TEXT,
    supplier TEXT,
    salt_percentage DECIMAL,
    bruised BOOLEAN DEFAULT FALSE,
    recipe_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_pickling_batches_date ON pickling_batches(date);
