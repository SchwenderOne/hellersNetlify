/**
 * Supabase Comments & Authentication System
 * For Hellers Kaffees Brew Method Pages
 */

(() => {
  'use strict';

  // ===========================================
  // CONFIGURATION
  // ===========================================
  const SUPABASE_URL = 'https://huwlvkqrnboerbghzsqo.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d2x2a3FybmJvZXJiZ2h6c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDA5ODYsImV4cCI6MjA4MDAxNjk4Nn0.dkKIjJMGUT6v-5iMjzkt8qBn9ZveYcQiBq_fuLYUCHs';
  
  // Owner/Admin email - has access to moderation dashboard
  const OWNER_EMAIL = 'unotuscha@gmail.com';

  const getEmailRedirectTarget = () => {
    const productionUrl = 'https://hellers-kaffees.netlify.app/';

    if (typeof window === 'undefined') {
      return productionUrl;
    }

    const { origin, hostname, pathname, search } = window.location;
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    if (isLocalhost) {
      return productionUrl;
    }

    return `${origin}${pathname}${search}`;
  };

  // ===========================================
  // STATE
  // ===========================================
  let supabase = null;
  let currentUser = null;
  let currentProfile = null;
  let currentPageId = null;
  let comments = [];
  let isAdminUser = false;

  const resetAdminState = () => {
    isAdminUser = false;
  };

  // DOM Elements (initialized later)
  let commentOverlay = null;
  let authOverlay = null;

  // ===========================================
  // INITIALIZATION
  // ===========================================
  const init = async () => {
    try {
      // Wait for Supabase to be available
      if (typeof window.supabase === 'undefined') {
        console.error('Comments: Supabase client not loaded');
        return;
      }

      // Initialize Supabase client
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        currentUser = session.user;
        await loadUserProfile();
        await determineAdminStatus();
      }

      // Set up auth state listener
      supabase.auth.onAuthStateChange(handleAuthStateChange);

      // Always update header profile icon (for owner access on any page)
      updateHeaderProfileIcon();

      // Check if we're on a page with comments
      const commentPreview = document.querySelector('.comment-preview');
      if (!commentPreview) {
        console.log('Auth initialized (no comments on this page)');
        return;
      }

      currentPageId = commentPreview.dataset.commentPageId;
      if (!currentPageId) {
        console.warn('Comments: No page ID found');
        return;
      }

      // Create UI elements for comment pages
      createAuthOverlay();
      createCommentOverlay();

      // Set up event listeners
      setupEventListeners();

      // Update UI based on auth state
      updateAuthUI();

      // Load comments
      await loadComments();

      console.log('Comments system initialized');
    } catch (error) {
      console.error('Comments init error:', error);
      const commentPreview = document.querySelector('.comment-preview');
      if (commentPreview) {
        showPlaceholderMessage('Fehler beim Laden der Kommentare.');
      }
    }
  };

  // ===========================================
  // AUTH STATE HANDLING
  // ===========================================
  const handleAuthStateChange = async (event, session) => {
    console.log('Auth state changed:', event);
    
    if (session) {
      currentUser = session.user;
      await loadUserProfile();
      await determineAdminStatus();
    } else {
      currentUser = null;
      currentProfile = null;
      resetAdminState();
    }
    
    updateAuthUI();
    updateHeaderProfileIcon();
  };

  // ===========================================
  // OWNER/ADMIN FUNCTIONS
  // ===========================================
  const isOwner = () => currentUser && currentUser.email === OWNER_EMAIL;

  const determineAdminStatus = async () => {
    if (!currentUser) {
      resetAdminState();
      return;
    }

    if (isOwner()) {
      isAdminUser = true;
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_access')
        .select('email')
        .eq('email', currentUser.email)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin access:', error);
        isAdminUser = false;
        return;
      }

      isAdminUser = !!data;
    } catch (error) {
      console.error('Error checking admin access:', error);
      isAdminUser = false;
    }
  };

  const updateHeaderProfileIcon = () => {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    // Remove existing profile icon if present
    const existingIcon = document.getElementById('header-profile-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    // Only show for owner
    if (!isAdminUser) return;

    // Create profile icon button
    const profileBtn = document.createElement('a');
    profileBtn.id = 'header-profile-icon';
    profileBtn.href = '/admin/';
    profileBtn.className = 'header-profile-btn';
    profileBtn.setAttribute('aria-label', 'Admin-Bereich');
    profileBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="header-profile-badge"></span>
    `;

    // Insert before dark mode toggle
    const darkModeToggle = document.getElementById('header-dark-mode-toggle');
    if (darkModeToggle) {
      headerActions.insertBefore(profileBtn, darkModeToggle);
    } else {
      headerActions.prepend(profileBtn);
    }

    // Load pending count for badge
    loadPendingCount();
  };

  const loadPendingCount = async () => {
    if (!supabase || !isAdminUser) return;

    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Error loading pending count:', error);
        return;
      }

      const badge = document.querySelector('.header-profile-badge');
      if (badge && count > 0) {
        badge.textContent = count > 9 ? '9+' : count;
        badge.classList.add('has-count');
      }
    } catch (error) {
      console.error('Error loading pending count:', error);
    }
  };

  const loadUserProfile = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    currentProfile = data;
  };

  // ===========================================
  // AUTHENTICATION FUNCTIONS
  // ===========================================
  const signUp = async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getEmailRedirectTarget(),
        data: {
          display_name: displayName
        }
      }
    });

    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates) => {
    if (!currentUser) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', currentUser.id)
      .select()
      .single();

    if (error) throw error;
    currentProfile = data;
    return data;
  };

  // ===========================================
  // COMMENTS FUNCTIONS
  // ===========================================
  const loadComments = async () => {
    const previewCard = document.querySelector('.comment-preview-card');
    if (previewCard) {
      previewCard.innerHTML = '<div class="comment-loading">Kommentare werden geladen...</div>';
    }

    try {
      // First fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('page_id', currentPageId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Then fetch profiles for all comment authors
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      let profilesMap = {};
      
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', userIds);

        if (!profilesError && profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        }
      }

      // Merge comments with profiles
      comments = commentsData.map(comment => ({
        ...comment,
        profiles: profilesMap[comment.user_id] || null
      }));

      updateCommentPreview();
      updateCommentList();
    } catch (error) {
      console.error('Error loading comments:', error);
      showError('Kommentare konnten nicht geladen werden.');
    }
  };

  const submitComment = async (content) => {
    if (!currentUser) {
      throw new Error('Sie müssen angemeldet sein, um zu kommentieren.');
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: currentUser.id,
        page_id: currentPageId,
        content: content.trim()
      })
      .select('*')
      .single();

    if (error) throw error;

    // Add profile info to the new comment
    const newComment = {
      ...data,
      profiles: currentProfile
    };

    // Add to local comments array
    comments.unshift(newComment);
    updateCommentPreview();
    updateCommentList();

    return newComment;
  };

  const deleteComment = async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', currentUser.id);

    if (error) throw error;

    // Remove from local array
    comments = comments.filter(c => c.id !== commentId);
    updateCommentPreview();
    updateCommentList();
  };

  // ===========================================
  // UI CREATION
  // ===========================================
  const createAuthOverlay = () => {
    const html = `
      <div class="auth-overlay" id="auth-overlay" aria-hidden="true" role="dialog" aria-labelledby="auth-overlay-title">
        <div class="auth-overlay-backdrop"></div>
        <div class="auth-overlay-content">
          <button class="auth-overlay-close" aria-label="Schließen" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login" type="button">Anmelden</button>
            <button class="auth-tab" data-tab="signup" type="button">Registrieren</button>
          </div>
          
          <!-- Login Form -->
          <form class="auth-form" id="login-form">
            <h2 id="auth-overlay-title" class="auth-title">Anmelden</h2>
            <p class="auth-subtitle">Melden Sie sich an, um Kommentare zu hinterlassen.</p>
            
            <div class="auth-form-group">
              <label for="login-email" class="auth-form-label">E-Mail</label>
              <input type="email" id="login-email" name="email" class="auth-form-input" required placeholder="ihre-email@beispiel.de">
            </div>
            
            <div class="auth-form-group">
              <label for="login-password" class="auth-form-label">Passwort</label>
              <input type="password" id="login-password" name="password" class="auth-form-input" required placeholder="Ihr Passwort" minlength="6">
            </div>
            
            <div class="auth-form-actions">
              <button type="submit" class="auth-form-submit">Anmelden</button>
            </div>
            
            <div class="auth-form-message" id="login-message" role="alert" aria-live="polite"></div>
          </form>
          
          <!-- Signup Form -->
          <form class="auth-form" id="signup-form" style="display: none;">
            <h2 class="auth-title">Registrieren</h2>
            <p class="auth-subtitle">Erstellen Sie ein Konto, um Kommentare zu hinterlassen.</p>
            
            <div class="auth-form-group">
              <label for="signup-name" class="auth-form-label">Anzeigename</label>
              <input type="text" id="signup-name" name="displayName" class="auth-form-input" required placeholder="Ihr Name" minlength="2" maxlength="50">
            </div>
            
            <div class="auth-form-group">
              <label for="signup-email" class="auth-form-label">E-Mail</label>
              <input type="email" id="signup-email" name="email" class="auth-form-input" required placeholder="ihre-email@beispiel.de">
            </div>
            
            <div class="auth-form-group">
              <label for="signup-password" class="auth-form-label">Passwort</label>
              <input type="password" id="signup-password" name="password" class="auth-form-input" required placeholder="Mindestens 6 Zeichen" minlength="6">
            </div>
            
            <div class="auth-form-actions">
              <button type="submit" class="auth-form-submit">Konto erstellen</button>
            </div>
            
            <div class="auth-form-message" id="signup-message" role="alert" aria-live="polite"></div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    authOverlay = document.getElementById('auth-overlay');
  };

  const createCommentOverlay = () => {
    const html = `
      <div class="comment-overlay" id="comment-overlay" aria-hidden="true" role="dialog" aria-labelledby="comment-overlay-title">
        <div class="comment-overlay-backdrop"></div>
        <div class="comment-overlay-content">
          <button class="comment-overlay-close" aria-label="Kommentare schließen" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <h2 id="comment-overlay-title" class="comment-overlay-title">Kommentare</h2>
          
          <!-- User Status Bar -->
          <div class="comment-user-bar" id="comment-user-bar">
            <!-- Populated by updateAuthUI -->
          </div>
          
          <!-- Comment Form (only shown when logged in) -->
          <form class="comment-form" id="comment-form" style="display: none;">
            <div class="comment-form-group">
              <label for="comment-content" class="comment-form-label">Ihr Kommentar</label>
              <textarea 
                id="comment-content" 
                name="content" 
                class="comment-form-textarea" 
                rows="4" 
                required 
                placeholder="Teilen Sie Ihre Erfahrungen mit dieser Zubereitungsmethode..."
                maxlength="2000"
              ></textarea>
              <div class="comment-char-count"><span id="char-count">0</span>/2000</div>
            </div>
            
            <div class="comment-form-actions">
              <button type="submit" class="comment-form-submit">Kommentar absenden</button>
            </div>
            
            <div class="comment-form-message" id="comment-form-message" role="alert" aria-live="polite"></div>
          </form>
          
          <!-- Comment List -->
          <div class="comment-list-container">
            <h3 class="comment-list-title">Alle Kommentare</h3>
            <div class="comment-list" id="comment-list">
              <div class="comment-loading">Kommentare werden geladen...</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    commentOverlay = document.getElementById('comment-overlay');
  };

  // ===========================================
  // UI UPDATE FUNCTIONS
  // ===========================================
  const updateAuthUI = () => {
    const userBar = document.getElementById('comment-user-bar');
    const commentForm = document.getElementById('comment-form');
    
    if (!userBar) return;

    if (currentUser && currentProfile) {
      // User is logged in
      const avatarUrl = currentProfile.avatar_url || generateAvatarUrl(currentProfile.display_name);
      userBar.innerHTML = `
        <div class="user-info">
          <img src="${avatarUrl}" alt="" class="user-avatar" onerror="this.src='${generateAvatarUrl(currentProfile.display_name)}'">
          <span class="user-name">${escapeHtml(currentProfile.display_name)}</span>
        </div>
        <button type="button" class="user-logout-btn" id="logout-btn">Abmelden</button>
      `;
      userBar.classList.add('logged-in');
      
      if (commentForm) {
        commentForm.style.display = 'block';
      }

      // Add logout listener
      document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    } else {
      // User is not logged in
      userBar.innerHTML = `
        <p class="login-prompt">
          <button type="button" class="login-link" id="open-auth-btn">Anmelden</button> um einen Kommentar zu hinterlassen.
        </p>
      `;
      userBar.classList.remove('logged-in');
      
      if (commentForm) {
        commentForm.style.display = 'none';
      }

      // Add login button listener
      document.getElementById('open-auth-btn')?.addEventListener('click', openAuthOverlay);
    }
  };

  const updateCommentPreview = () => {
    const previewCard = document.querySelector('.comment-preview-card');
    if (!previewCard) return;

    const approvedComments = comments.filter(c => c.status === 'approved');

    if (approvedComments.length === 0) {
      previewCard.innerHTML = `
        <p class="comment-preview-empty">Noch keine Kommentare. Seien Sie der Erste!</p>
      `;
      return;
    }

    const latestComment = approvedComments[0];
    const authorName = latestComment.profiles?.display_name || 'Anonym';
    const avatarUrl = latestComment.profiles?.avatar_url || generateAvatarUrl(authorName);
    const commentDate = formatDate(latestComment.created_at);
    const commentText = truncateText(latestComment.content, 150);

    previewCard.innerHTML = `
      <div class="comment-preview-header">
        <img src="${avatarUrl}" alt="" class="comment-preview-avatar" onerror="this.src='${generateAvatarUrl(authorName)}'">
        <div>
          <div class="comment-preview-author">${escapeHtml(authorName)}</div>
          <div class="comment-preview-date">${commentDate}</div>
        </div>
      </div>
      <div class="comment-preview-text">${escapeHtml(commentText)}</div>
      <div class="comment-preview-count">${approvedComments.length} Kommentar${approvedComments.length !== 1 ? 'e' : ''}</div>
    `;
  };

  const updateCommentList = () => {
    const listContainer = document.getElementById('comment-list');
    if (!listContainer) return;

    const approvedComments = comments.filter(c => c.status === 'approved');

    if (approvedComments.length === 0) {
      listContainer.innerHTML = `
        <div class="comment-empty">
          <p>Noch keine Kommentare. Seien Sie der Erste!</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = approvedComments.map(comment => {
      const authorName = comment.profiles?.display_name || 'Anonym';
      const avatarUrl = comment.profiles?.avatar_url || generateAvatarUrl(authorName);
      const commentDate = formatDate(comment.created_at);
      const isOwn = currentUser && comment.user_id === currentUser.id;

      return `
        <div class="comment-item" data-comment-id="${comment.id}">
          <div class="comment-item-header">
            <div class="comment-item-user">
              <img src="${avatarUrl}" alt="" class="comment-item-avatar" onerror="this.src='${generateAvatarUrl(authorName)}'">
              <div>
                <div class="comment-item-author">${escapeHtml(authorName)}</div>
                <div class="comment-item-date">${commentDate}</div>
              </div>
            </div>
            ${isOwn ? `
              <button type="button" class="comment-delete-btn" data-comment-id="${comment.id}" aria-label="Kommentar löschen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            ` : ''}
          </div>
          <div class="comment-item-content">${escapeHtml(comment.content).replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }).join('');

    // Add delete listeners
    listContainer.querySelectorAll('.comment-delete-btn').forEach(btn => {
      btn.addEventListener('click', handleDeleteComment);
    });
  };

  // ===========================================
  // EVENT HANDLERS
  // ===========================================
  const setupEventListeners = () => {
    // View all comments button
    const viewAllBtn = document.querySelector('.comment-view-all-btn');
    viewAllBtn?.addEventListener('click', openCommentOverlay);

    // Comment overlay close
    document.querySelector('#comment-overlay .comment-overlay-close')?.addEventListener('click', closeCommentOverlay);
    document.querySelector('#comment-overlay .comment-overlay-backdrop')?.addEventListener('click', closeCommentOverlay);

    // Auth overlay close
    document.querySelector('#auth-overlay .auth-overlay-close')?.addEventListener('click', closeAuthOverlay);
    document.querySelector('#auth-overlay .auth-overlay-backdrop')?.addEventListener('click', closeAuthOverlay);

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', handleAuthTabClick);
    });

    // Login form
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);

    // Signup form
    document.getElementById('signup-form')?.addEventListener('submit', handleSignup);

    // Comment form
    document.getElementById('comment-form')?.addEventListener('submit', handleCommentSubmit);

    // Character count
    const textarea = document.getElementById('comment-content');
    textarea?.addEventListener('input', () => {
      const count = document.getElementById('char-count');
      if (count) count.textContent = textarea.value.length;
    });

    // Escape key to close overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (commentOverlay && !commentOverlay.hasAttribute('aria-hidden')) {
          closeCommentOverlay();
        }
        if (authOverlay && !authOverlay.hasAttribute('aria-hidden')) {
          closeAuthOverlay();
        }
      }
    });
  };

  const handleAuthTabClick = (e) => {
    const tab = e.target.dataset.tab;
    
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show/hide forms
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
    
    // Clear messages
    document.getElementById('login-message').textContent = '';
    document.getElementById('signup-message').textContent = '';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;
    const messageEl = document.getElementById('login-message');
    const submitBtn = form.querySelector('.auth-form-submit');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird angemeldet...';
    messageEl.textContent = '';
    messageEl.className = 'auth-form-message';

    try {
      await signIn(email, password);
      showMessage(messageEl, 'Erfolgreich angemeldet!', 'success');
      setTimeout(() => {
        closeAuthOverlay();
        form.reset();
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      showMessage(messageEl, translateAuthError(error), 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Anmelden';
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const displayName = form.displayName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const messageEl = document.getElementById('signup-message');
    const submitBtn = form.querySelector('.auth-form-submit');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird erstellt...';
    messageEl.textContent = '';
    messageEl.className = 'auth-form-message';

    try {
      await signUp(email, password, displayName);
      showMessage(messageEl, 'Konto erstellt! Bitte bestätigen Sie Ihre E-Mail-Adresse.', 'success');
      form.reset();
    } catch (error) {
      console.error('Signup error:', error);
      showMessage(messageEl, translateAuthError(error), 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Konto erstellen';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const content = form.content.value.trim();
    const messageEl = document.getElementById('comment-form-message');
    const submitBtn = form.querySelector('.comment-form-submit');
    
    if (!content) {
      showMessage(messageEl, 'Bitte geben Sie einen Kommentar ein.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet...';
    messageEl.textContent = '';
    messageEl.className = 'comment-form-message';

    try {
      const newComment = await submitComment(content);
      
      if (newComment.is_flagged) {
        showMessage(messageEl, 'Ihr Kommentar wurde zur Überprüfung eingereicht und wird in Kürze sichtbar.', 'success');
      } else {
        showMessage(messageEl, 'Kommentar erfolgreich gesendet!', 'success');
      }
      
      form.reset();
      document.getElementById('char-count').textContent = '0';
    } catch (error) {
      console.error('Comment submit error:', error);
      showMessage(messageEl, error.message || 'Fehler beim Senden des Kommentars.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kommentar absenden';
    }
  };

  const handleDeleteComment = async (e) => {
    const commentId = e.currentTarget.dataset.commentId;
    
    if (!confirm('Möchten Sie diesen Kommentar wirklich löschen?')) {
      return;
    }

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Fehler beim Löschen des Kommentars.');
    }
  };

  // ===========================================
  // OVERLAY FUNCTIONS
  // ===========================================
  const openCommentOverlay = () => {
    if (!commentOverlay) return;
    commentOverlay.removeAttribute('aria-hidden');
    commentOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeCommentOverlay = () => {
    if (!commentOverlay) return;
    commentOverlay.setAttribute('aria-hidden', 'true');
    commentOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const openAuthOverlay = () => {
    if (!authOverlay) return;
    authOverlay.removeAttribute('aria-hidden');
    authOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
      authOverlay.querySelector('input')?.focus();
    }, 100);
  };

  const closeAuthOverlay = () => {
    if (!authOverlay) return;
    authOverlay.setAttribute('aria-hidden', 'true');
    authOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    
    // Clear forms and messages
    document.getElementById('login-form')?.reset();
    document.getElementById('signup-form')?.reset();
    document.getElementById('login-message').textContent = '';
    document.getElementById('signup-message').textContent = '';
  };

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================
  const showPlaceholderMessage = (message) => {
    const preview = document.querySelector('.comment-preview-card');
    if (preview) {
      preview.innerHTML = `<p class="comment-placeholder">${escapeHtml(message)}</p>`;
    }
  };

  const showError = (message) => {
    const listContainer = document.getElementById('comment-list');
    if (listContainer) {
      listContainer.innerHTML = `<div class="comment-error"><p>${escapeHtml(message)}</p></div>`;
    }
  };

  const showMessage = (element, message, type) => {
    if (!element) return;
    element.textContent = message;
    element.className = `auth-form-message ${type}`;
    
    if (type === 'success') {
      setTimeout(() => {
        element.textContent = '';
        element.className = 'auth-form-message';
      }, 5000);
    }
  };

  const translateAuthError = (error) => {
    const errorMap = {
      'Invalid login credentials': 'Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.',
      'Email not confirmed': 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.',
      'User already registered': 'Diese E-Mail-Adresse ist bereits registriert.',
      'Password should be at least 6 characters': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
      'Unable to validate email address: invalid format': 'Ungültiges E-Mail-Format.',
      'Email rate limit exceeded': 'Zu viele Versuche. Bitte warten Sie einen Moment.'
    };
    
    return errorMap[error.message] || error.message || 'Ein Fehler ist aufgetreten.';
  };

  const generateAvatarUrl = (name) => {
    // Use DiceBear API for generating avatars
    const seed = encodeURIComponent(name || 'anonymous');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=c97a5c&textColor=ffffff`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'gerade eben';
    } else if (diffMins < 60) {
      return `vor ${diffMins} ${diffMins === 1 ? 'Minute' : 'Minuten'}`;
    } else if (diffHours < 24) {
      return `vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`;
    } else if (diffDays < 7) {
      return `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`;
    } else {
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // ===========================================
  // INITIALIZATION
  // ===========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.hellersComments = {
    init,
    openComments: openCommentOverlay,
    closeComments: closeCommentOverlay,
    openAuth: openAuthOverlay,
    closeAuth: closeAuthOverlay,
    refresh: loadComments
  };
})();
