-- =========================================================================
-- SAFARAI - COMMUNITY FEED SCHEMA MIGRATION
-- =========================================================================
-- This script adds the necessary tables for the Community Feed feature:
-- 1. community_posts: Stores user posts (text, images, location).
-- 2. post_likes: Tracks likes on posts (one like per user per post).
-- 3. post_comments: Stores comments on posts.
-- Includes Row Level Security (RLS) policies for secure access.
-- =========================================================================

-- ==========================================
-- 1. NEW: COMMUNITY POSTS
-- ==========================================
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    location_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view community posts
CREATE POLICY "Anyone can view community posts" ON community_posts
    FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "Users can create their own posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update and delete their own posts
CREATE POLICY "Users can update their own posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);


-- ==========================================
-- 2. NEW: POST LIKES
-- ==========================================
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id) -- Prevent multiple likes by the same user on one post
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes
CREATE POLICY "Anyone can view post likes" ON post_likes
    FOR SELECT USING (true);

-- Users can like and unlike (delete their like)
CREATE POLICY "Users can manage their own likes" ON post_likes
    FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- 3. NEW: POST COMMENTS
-- ==========================================
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments
CREATE POLICY "Anyone can view post comments" ON post_comments
    FOR SELECT USING (true);

-- Users can create comments
CREATE POLICY "Users can create their own comments" ON post_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update and delete their own comments
CREATE POLICY "Users can manage their own comments" ON post_comments
    FOR UPDATE USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete their own comments" ON post_comments
    FOR DELETE USING (auth.uid() = user_id);


-- ==========================================
-- 4. NEW: INDEXES FOR COMMUNITY FEED PERFORMANCE ⚡
-- ==========================================
CREATE INDEX idx_community_posts_user ON community_posts(user_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_comments_post ON post_comments(post_id);


-- ==========================================
-- 5. NEW: TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ==========================================
CREATE TRIGGER update_community_posts_modtime
    BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_modtime
    BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
