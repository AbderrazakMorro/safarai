import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Utility for formatting relative time
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export default function Community() {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    fetchUserAndPosts();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserAndPosts = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Fetch posts with author info, likes, and comments
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          users(first_name, last_name, avatar_url),
          post_likes(user_id),
          post_comments(id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching community data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setShowImageInput(true);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setShowImageInput(false);
  };

  const handlePost = async () => {
    if (!postText.trim() && !imageFile) return;
    if (!currentUser) {
        alert("You must be logged in to post.");
        return;
    }
    
    setIsPosting(true);

    try {
      let finalImageUrl = null;

      // 1. Upload to local Vite server if image exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-file-name': fileName
          },
          body: imageFile // Send the raw binary file directly
        });
        
        if (!response.ok) {
            throw new Error("Failed to upload image locally");
        }
        
        const result = await response.json();
        finalImageUrl = result.url; // e.g. /uploads/upload_123.png
      }

      // 2. Insert Post to Database
      const { error } = await supabase
        .from('community_posts')
        .insert([{ 
            user_id: currentUser.id, 
            content: postText.trim(),
            image_url: finalImageUrl
        }]);

      if (error) throw error;
      
      setPostText('');
      clearImage();
      await fetchUserAndPosts(); // Refetch to show new post
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post: " + (err.message || "Unknown error"));
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId, hasLiked) => {
    if (!currentUser) {
        alert("Please sign in to like posts!");
        return;
    }

    try {
        // Optimistic UI update
        setPosts(currentPosts => currentPosts.map(p => {
            if (p.id === postId) {
                const newLikes = hasLiked 
                    ? p.post_likes.filter(l => l.user_id !== currentUser.id)
                    : [...(p.post_likes || []), { user_id: currentUser.id }];
                return { ...p, post_likes: newLikes };
            }
            return p;
        }));

        if (hasLiked) {
            await supabase
                .from('post_likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);
        } else {
            await supabase
                .from('post_likes')
                .insert([{ post_id: postId, user_id: currentUser.id }]);
        }
    } catch (err) {
        console.error("Error toggling like:", err);
        fetchUserAndPosts(); // Revert on error
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 dark:text-teal-100 font-headline tracking-tight">Traveler Community</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2">Connect, share, and get inspired by fellow SafarAI travelers.</p>
      </div>

      {/* Dual-View Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Create Post Component */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200/50 dark:border-stone-800 relative overflow-hidden">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-amber-500 to-tertiary"></div>
            
            <div className="flex gap-4">
              <img src={currentUser?.user_metadata?.avatar_url || "/avatar.png"} alt="You" className="w-12 h-12 rounded-full object-cover border-2 border-stone-100 dark:border-stone-800 flex-shrink-0" />
              <div className="flex-1">
                <textarea 
                  className="w-full bg-stone-50 dark:bg-stone-950/50 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none font-body text-sm"
                  placeholder={currentUser ? "Share a travel tip, ask a question, or post a photo..." : "Please log in to post..."}
                  rows="3"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  disabled={!currentUser || isPosting}
                ></textarea>
                
                {/* Image Upload Area */}
                {showImageInput && (
                  <div className="mt-3 bg-stone-100 dark:bg-stone-900 rounded-lg p-3 border border-stone-200 dark:border-stone-800 animate-fade-in-up">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-stone-400 text-sm">photo_library</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="flex-1 bg-transparent text-sm text-stone-700 dark:text-stone-300 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                        onChange={handleImageSelect}
                        disabled={!currentUser || isPosting}
                      />
                      {imageFile && (
                        <button onClick={clearImage} className="text-stone-400 hover:text-red-500">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowImageInput(!showImageInput)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 ${showImageInput ? 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'text-stone-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20'}`} 
                      disabled={!currentUser}
                    >
                      <span className="material-symbols-outlined text-lg">image</span>
                      <span className="hidden sm:inline">Photo</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm font-medium disabled:opacity-50" disabled={!currentUser}>
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      <span className="hidden sm:inline">Location</span>
                    </button>
                  </div>
                  <button 
                    onClick={handlePost}
                    disabled={(!postText.trim() && !imageFile) || !currentUser || isPosting}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-6">
            {isLoading ? (
               <div className="flex justify-center p-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
               </div>
            ) : posts.length === 0 ? (
               <div className="text-center p-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/50 dark:border-stone-800">
                   <span className="material-symbols-outlined text-4xl text-stone-300 mb-2">forum</span>
                   <p className="text-stone-500 font-medium">No posts yet. Be the first to share your journey!</p>
               </div>
            ) : (
              posts.map((post) => {
                const authorName = post.users ? `${post.users.first_name} ${post.users.last_name}` : 'Anonymous Traveler';
                const authorAvatar = post.users?.avatar_url || '/avatar.png';
                const likeCount = post.post_likes?.length || 0;
                const commentCount = post.post_comments?.length || 0;
                const hasLiked = currentUser && post.post_likes?.some(like => like.user_id === currentUser.id);

                return (
                  <article key={post.id} className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/50 dark:border-stone-800 hover:shadow-md transition-shadow">
                    <div className="p-5">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">{authorName}</h3>
                            <p className="text-stone-500 text-xs">{formatRelativeTime(post.created_at)}</p>
                          </div>
                        </div>
                        <button className="text-stone-400 hover:text-teal-600 transition-colors">
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                      </div>

                      {/* Post Body */}
                      <p className="text-stone-700 dark:text-stone-300 font-body text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>
                      
                      {post.image_url && (
                        <div className="mb-4 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 max-h-[400px]">
                          <img src={post.image_url} alt="Post content" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                    </div>

                    {/* Reactions Footer */}
                    <div className="px-5 py-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <button 
                        onClick={() => handleLike(post.id, hasLiked)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all group ${hasLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                      >
                        <span className={`material-symbols-outlined ${hasLiked ? 'fill-current' : 'group-hover:fill-current'}`} style={hasLiked ? {fontVariationSettings: "'FILL' 1"} : {}}>favorite</span>
                        <span className="text-sm font-medium">{likeCount}</span>
                      </button>
                      
                      <button className="flex items-center gap-1.5 text-stone-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 px-3 py-1.5 rounded-lg transition-all">
                        <span className="material-symbols-outlined">chat_bubble</span>
                        <span className="text-sm font-medium">{commentCount}</span>
                      </button>
                      
                      <button className="flex items-center gap-1.5 text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-all">
                        <span className="material-symbols-outlined">send</span>
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
          
        </div>

        {/* Sidebar Column (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          
          {/* Trending Topics */}
          <div className="bg-surface-container-low dark:bg-stone-900 rounded-2xl p-6 border border-stone-200/50 dark:border-stone-800">
            <h3 className="font-bold text-teal-900 dark:text-teal-100 font-headline mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">trending_up</span>
              Trending in Morocco
            </h3>
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">Destination</p>
                <p className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-teal-600 transition-colors">#EssaouiraVibes</p>
                <p className="text-stone-400 text-xs mt-0.5">1.2k posts today</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">Food & Culture</p>
                <p className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-amber-600 transition-colors">#BestTagine</p>
                <p className="text-stone-400 text-xs mt-0.5">856 posts today</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">Experience</p>
                <p className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-tertiary transition-colors">#SaharaTrekking</p>
                <p className="text-stone-400 text-xs mt-0.5">432 posts today</p>
              </div>
            </div>
          </div>

          {/* Guidelines / Mini-Footer */}
          <div className="bg-gradient-to-br from-teal-50 to-stone-50 dark:from-teal-950/20 dark:to-stone-900/50 rounded-2xl p-6 border border-teal-100 dark:border-teal-900/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-teal-600">info</span>
              <h4 className="font-bold text-teal-800 dark:text-teal-200">Community Rules</h4>
            </div>
            <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-2 list-disc pl-4 font-body">
              <li>Be respectful and kind to fellow travelers.</li>
              <li>Share authentic, personal experiences.</li>
              <li>No spam or unapproved promotional content.</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}
