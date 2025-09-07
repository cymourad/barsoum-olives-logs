-- Trees table (base table for all tree-related operations)
CREATE TABLE trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position_row INTEGER NOT NULL,
    position_col INTEGER NOT NULL,
    variety TEXT CHECK (variety IN ('frontoyo', 'kalamata', 'jumbo kalamata', 'spanish queen', 'burnia')),
    year_planted INTEGER,
    supplier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_trees_updated_at BEFORE UPDATE ON trees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_trees_position ON trees(position_row, position_col);
