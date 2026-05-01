-- =========================================================================
-- SAFARAI - DATABASE SCHEMA UPDATES (MIGRATION SCRIPT)
-- =========================================================================
-- This script applies the contextual changes to the existing base schema:
-- 1. Adds OpenTripMap support to saved_places & itinerary_activities.
-- 2. Adds chat history tables for the AI Concierge with intent tracking.
-- =========================================================================

-- ==========================================
-- 1. UPDATE: SAVED PLACES
-- ==========================================
-- Make foursquare_venue_id nullable, add opentripmap_id, and enforce at least one
ALTER TABLE saved_places 
    ALTER COLUMN foursquare_venue_id DROP NOT NULL,
    ADD COLUMN opentripmap_id VARCHAR(255),
    ADD CONSTRAINT saved_places_user_id_opentripmap_id_key UNIQUE(user_id, opentripmap_id),
    ADD CONSTRAINT has_venue_id CHECK (foursquare_venue_id IS NOT NULL OR opentripmap_id IS NOT NULL);

-- ==========================================
-- 2. UPDATE: ITINERARY ACTIVITIES
-- ==========================================
-- Make foursquare_venue_id nullable, add opentripmap_id, and enforce at least one
ALTER TABLE itinerary_activities 
    ALTER COLUMN foursquare_venue_id DROP NOT NULL,
    ADD COLUMN opentripmap_id VARCHAR(255),
    ADD CONSTRAINT has_activity_venue_id CHECK (foursquare_venue_id IS NOT NULL OR opentripmap_id IS NOT NULL);

-- ==========================================
-- 3. NEW: CHAT SESSIONS (AI Concierge)
-- ==========================================
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own chat sessions" ON chat_sessions
    FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 4. NEW: CHAT MESSAGES
-- ==========================================
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    intent VARCHAR(50), -- e.g., 'EXPLORE', 'WEATHER', 'CULTURE', 'CHAT'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own chat messages" ON chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid()
        )
    );

-- ==========================================
-- 5. NEW: INDEXES FOR CHAT
-- ==========================================
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);

-- ==========================================
-- 6. NEW: TRIGGER FOR CHAT SESSIONS
-- ==========================================
CREATE TRIGGER update_chat_sessions_modtime
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
