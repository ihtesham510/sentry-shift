CREATE TABLE IF NOT EXISTS address  (
    id SERIAL PRIMARY KEY,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    zip TEXT NOT NULL,
    country TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site  (
    id SERIAL PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    address_id SERIAL NOT NULL REFERENCES address(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    phone_no TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_picture  (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    site_id SERIAL NOT NULL REFERENCES site(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE incident_severity AS ENUM ('low','medium','high','critical');

CREATE TABLE IF NOT EXISTS incident  (
    id SERIAL PRIMARY KEY,
    site_id SERIAL NOT NULL REFERENCES site(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity incident_severity DEFAULT 'medium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incident_media  (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    incident_id SERIAL NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
