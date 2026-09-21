-- ==============================================================================
-- Migration: Wat Snay Douch Official Location & Settings Schema
-- Table Definitions, Indexes, Row Level Security (RLS), and Safe Seed Records
-- ==============================================================================

-- ==============================================================================
-- Migration: Wat Snay Douch Official Location & Settings Schema
-- Database: Supabase (PostgreSQL)
-- Application: វត្តវារីបាការាម (ស្នាយដួច) - Wat Snay Douch Location PWA
-- ==============================================================================

-- 1. Create temple_settings table
CREATE TABLE IF NOT EXISTS public.temple_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    temple_name_km TEXT NOT NULL DEFAULT 'វត្តវារីបាការាម (ស្នាយដួច)',
    temple_name_en TEXT NOT NULL DEFAULT 'Wat Vari Bakaram (Snay Douch)',
    short_name TEXT NOT NULL DEFAULT 'WSD Location',
    description_km TEXT DEFAULT 'គេហទំព័រផ្លូវការសម្រាប់បង្ហាញទីតាំងពិតប្រាកដ និងទិសដៅធ្វើដំណើរទៅកាន់វត្តវារីបាការាម (ស្នាយដួច)',
    address_km TEXT DEFAULT '',
    address_en TEXT DEFAULT '',
    village_km TEXT DEFAULT '', -- ភូមិ
    commune_km TEXT DEFAULT '', -- ឃុំ
    district_km TEXT DEFAULT '', -- ស្រុក
    province_km TEXT DEFAULT '', -- ខេត្ត
    phone TEXT DEFAULT '',
    telegram_url TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    google_maps_url TEXT DEFAULT '',
    -- Official GPS Coordinates (Default NULL until verified by administrator)
    latitude DOUBLE PRECISION DEFAULT NULL,
    longitude DOUBLE PRECISION DEFAULT NULL,
    location_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ DEFAULT NULL,
    verified_by TEXT DEFAULT NULL,
    location_note TEXT DEFAULT NULL,
    -- Road & Entrance Information
    entrance_note_km TEXT DEFAULT '',
    landmark_note_km TEXT DEFAULT '',
    parking_note_km TEXT DEFAULT '',
    road_condition_km TEXT DEFAULT '',
    visitor_note_km TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create temple_gallery table
CREATE TABLE IF NOT EXISTS public.temple_gallery (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    image_url TEXT NOT NULL,
    title_km TEXT NOT NULL DEFAULT '',
    description_km TEXT DEFAULT '',
    category TEXT NOT NULL DEFAULT 'general', -- 'gate' | 'building' | 'landmark' | 'entrance' | 'general'
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create admin_profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.temple_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temple_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for temple_settings
-- Anyone (anonymous public) can view official temple settings
CREATE POLICY "Allow public read access on temple_settings"
    ON public.temple_settings FOR SELECT
    USING (true);

-- Authenticated admins can update temple settings
CREATE POLICY "Allow authenticated users to update temple_settings"
    ON public.temple_settings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert temple_settings"
    ON public.temple_settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- RLS Policies for temple_gallery
-- Anyone can view gallery photos
CREATE POLICY "Allow public read access on temple_gallery"
    ON public.temple_gallery FOR SELECT
    USING (true);

-- Authenticated admins can manage gallery
CREATE POLICY "Allow authenticated users to manage temple_gallery"
    ON public.temple_gallery FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for admin_profiles
CREATE POLICY "Allow authenticated users to read admin_profiles"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_temple_settings_updated_at ON public.temple_settings;
CREATE TRIGGER set_temple_settings_updated_at
    BEFORE UPDATE ON public.temple_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_temple_gallery_updated_at ON public.temple_gallery;
CREATE TRIGGER set_temple_gallery_updated_at
    BEFORE UPDATE ON public.temple_gallery
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Safe Seed Data:
-- DO NOT seed fake GPS coordinates. Latitude and Longitude are left NULL with location_verified = false.
INSERT INTO public.temple_settings (
    id,
    temple_name_km,
    temple_name_en,
    short_name,
    description_km,
    address_km,
    address_en,
    village_km,
    commune_km,
    district_km,
    province_km,
    phone,
    telegram_url,
    facebook_url,
    google_maps_url,
    latitude,
    longitude,
    location_verified,
    entrance_note_km,
    landmark_note_km,
    parking_note_km,
    road_condition_km,
    visitor_note_km
) VALUES (
    'a1111111-2222-3333-4444-555555555555',
    'វត្តវារីបាការាម (ស្នាយដួច)',
    'Wat Vari Bakaram (Snay Douch)',
    'WSD Location',
    'គេហទំព័រផ្លូវការបង្ហាញទីតាំងពិតប្រាកដ និងទិសដៅធ្វើដំណើរទៅកាន់វត្តវារីបាការាម (ស្នាយដួច)',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    NULL, -- GPS Latitude (Awaiting administrator verification)
    NULL, -- GPS Longitude (Awaiting administrator verification)
    FALSE, -- Not verified until administrator confirms
    '',
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Seed Initial Gallery Photos
INSERT INTO public.temple_gallery (
    id,
    image_url,
    title_km,
    description_km,
    category,
    is_cover,
    display_order
) VALUES
(
    'g-gate-1',
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    'ក្លោងទ្វារមុខវត្ត (ផ្លូវចូលធំ)',
    'ក្លោងទ្វារចូលវត្តដែលមានរចនាបថក្បូរក្បាច់បែបខ្មែរ',
    'gate',
    TRUE,
    1
),
(
    'g-bld-1',
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    'ព្រះវិហារវត្តវារីបាការាម (ស្នាយដួច)',
    'តួព្រះវិហារកណ្តាលសម្រាប់ពិធីបុណ្យ និងការថ្វាយបង្គំព្រះ',
    'building',
    FALSE,
    2
),
(
    'g-entrance-1',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    'ផ្លូវចូល និងបរិវេណវត្ត',
    'ទិដ្ឋភាពផ្លូវចូលពីផ្លូវធំចូលមកកាន់ទីធ្លាវត្ត',
    'entrance',
    FALSE,
    3
)
ON CONFLICT (id) DO NOTHING;

