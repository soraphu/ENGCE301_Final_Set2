CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed some profiles for demo
INSERT INTO profiles (user_id, full_name, bio) VALUES
('user-001', 'Alice Wonderland', 'I love tasks!'),
('user-002', 'Bob Builder', 'Can we fix it?'),
('user-admin', 'System Admin', 'Master of tasks')
ON CONFLICT (user_id) DO NOTHING;
