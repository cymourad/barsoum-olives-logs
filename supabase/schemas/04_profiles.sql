-- Harvesting profiles (independent table)
CREATE TABLE harvesting_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('mechanical', 'manual')),
    contractor_name TEXT,
    price DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fertilizing profiles (independent table)
CREATE TABLE fertilizing_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nitrogen BOOLEAN DEFAULT FALSE,
    potassium BOOLEAN DEFAULT FALSE,
    phosphore BOOLEAN DEFAULT FALSE,
    borron BOOLEAN DEFAULT FALSE,
    chicken_manure BOOLEAN DEFAULT FALSE,
    lime BOOLEAN DEFAULT FALSE,
    gypsum BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather profiles (independent table)
CREATE TABLE weather_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    frost BOOLEAN DEFAULT FALSE,
    rain BOOLEAN DEFAULT FALSE,
    temperature DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
