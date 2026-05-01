import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'basurasmart',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const initDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('resident', 'collector')),
        address TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_number VARCHAR(20) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(100) NOT NULL,
        description TEXT,
        waste_type VARCHAR(20) NOT NULL CHECK (waste_type IN ('biodegradable', 'non-biodegradable', 'recyclable')),
        collection_date DATE NOT NULL,
        collection_time TIME NOT NULL,
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        collector_id UUID REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS route_stops (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        address TEXT,
        sequence_number INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        route_stop_id UUID REFERENCES route_stops(id) ON DELETE CASCADE,
        collector_id UUID REFERENCES users(id) ON DELETE SET NULL,
        resident_id UUID REFERENCES users(id) ON DELETE SET NULL,
        schedule_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
        collection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        waste_type VARCHAR(20) NOT NULL CHECK (waste_type IN ('biodegradable', 'non-biodegradable', 'recyclable')),
        weight_kg DECIMAL(8, 2),
        notes TEXT,
        status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'missed', 'skipped')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone_number);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(collection_date);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_routes_collector ON routes(collector_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_collections_stop ON collections(route_stop_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_collections_collector ON collections(collector_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);');

    client.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default pool;
