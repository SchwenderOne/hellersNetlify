/**
 * Admin Dashboard Script
 * For Hellers Kaffees Comment Moderation
 */

(() => {
  'use strict';

  // ===========================================
  // CONFIGURATION
  // ===========================================
  const SUPABASE_URL = 'https://huwlvkqrnboerbghzsqo.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d2x2a3FybmJvZXJiZ2h6c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDA5ODYsImV4cCI6MjA4MDAxNjk4Nn0.dkKIjJMGUT6v-5iMjzkt8qBn9ZveYcQiBq_fuLYUCHs';
  const OWNER_EMAIL = 'unotuscha@gmail.com';

  // ===========================================
  // STATE
  // ===========================================
  let supabase = null;
  let currentUser = null;
  let allComments = [];
  let pendingComments = [];
  let adminAccessList = [];
  let isOwnerUser = false;

  // ===========================================
  // INITIALIZATION
  // ===========================================
  const init = async () => {
    try {
      // Wait for Supabase to be available
      if (typeof window.supabase === 'undefined') {
        showAuthStatus('Supabase nicht verfügbar. Bitte Seite neu laden.');
        return;
      }

      // Initialize Supabase client
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        currentUser = session.user;
        isOwnerUser = session.user.email === OWNER_EMAIL;
        if (await determineAdminAccess()) {
          showDashboard();
          await loadAllData();
        } else {
          showAuthStatus('Sie haben keinen Zugriff auf diesen Bereich.');
        }
      } else {
        showAuthStatus('Bitte melden Sie sich auf einer Rezeptseite an.');
      }

      // Set up auth state listener
      supabase.auth.onAuthStateChange(handleAuthStateChange);

      // Set up event listeners
      setupEventListeners();

    } catch (error) {
      console.error('Admin init error:', error);
      showAuthStatus('Fehler beim Laden. Bitte Seite neu laden.');
    }
  };

  // ===========================================
  // AUTH HANDLING
  // ===========================================
  const handleAuthStateChange = async (event, session) => {
    console.log('Admin auth state changed:', event);
    
    if (session) {
      currentUser = session.user;
      isOwnerUser = session.user.email === OWNER_EMAIL;
      if (await determineAdminAccess()) {
        showDashboard();
        await loadAllData();
      } else {
        hideDashboard();
        showAuthStatus('Sie haben keinen Zugriff auf diesen Bereich.');
      }
    } else {
      currentUser = null;
      isOwnerUser = false;
      hideDashboard();
      showAuthStatus('Bitte melden Sie sich auf einer Rezeptseite an.');
    }
  };

  const isOwner = () => currentUser && currentUser.email === OWNER_EMAIL;

  const determineAdminAccess = async () => {
    if (!currentUser) return false;
    if (isOwner()) return true;

    try {
      const { data, error } = await supabase
        .from('admin_access')
        .select('email')
        .eq('email', currentUser.email)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin access:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  };

  // ===========================================
  // UI STATE
  // ===========================================
  const showAuthStatus = (message) => {
    const statusEl = document.getElementById('admin-auth-status');
    if (statusEl) statusEl.textContent = message;
  };

  const showDashboard = () => {
    const authSection = document.getElementById('admin-auth-required');
    const dashboard = document.getElementById('admin-dashboard');
    if (authSection) authSection.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
  };

  const hideDashboard = () => {
    const authSection = document.getElementById('admin-auth-required');
    const dashboard = document.getElementById('admin-dashboard');
    if (authSection) authSection.style.display = 'block';
    if (dashboard) dashboard.style.display = 'none';
  };

  // ===========================================
  // DATA LOADING
  // ===========================================
  const loadAllData = async () => {
    if (!isOwner()) return;

    try {
      // Load all comments with profiles
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Load profiles for comment authors
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
      allComments = commentsData.map(comment => ({
        ...comment,
        profile: profilesMap[comment.user_id] || null
      }));

      pendingComments = allComments.filter(c => c.status === 'pending');

      // Load admin access list if owner
      if (isOwnerUser) {
        await loadAdminAccessList();
        toggleAdminAccessSection(true);
      } else {
        toggleAdminAccessSection(false);
      }

      // Update UI
      updateStats();
      renderPendingComments();
      renderAllComments();
      populatePageFilter();

    } catch (error) {
      console.error('Error loading data:', error);
      showError('pending-comments', 'Fehler beim Laden der Kommentare.');
      showError('all-comments', 'Fehler beim Laden der Kommentare.');
    }
  };

  // ===========================================
  // UI RENDERING
  // ===========================================
  const updateStats = () => {
    const pending = allComments.filter(c => c.status === 'pending').length;
    const flagged = allComments.filter(c => c.is_flagged).length;
    const total = allComments.length;

    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-flagged').textContent = flagged;
    document.getElementById('stat-total').textContent = total;
  };

  const renderPendingComments = () => {
    const container = document.getElementById('pending-comments');
    if (!container) return;

    if (pendingComments.length === 0) {
      container.innerHTML = '<div class="admin-empty">Keine ausstehenden Kommentare.</div>';
      return;
    }

    container.innerHTML = pendingComments.map(comment => renderCommentCard(comment, true)).join('');
    
    // Add event listeners for action buttons
    container.querySelectorAll('.admin-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => handleApprove(btn.dataset.id));
    });
    container.querySelectorAll('.admin-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => handleReject(btn.dataset.id));
    });
  };

  const renderAllComments = () => {
    const container = document.getElementById('all-comments');
    if (!container) return;

    const statusFilter = document.getElementById('filter-status')?.value || 'all';
    const pageFilter = document.getElementById('filter-page')?.value || 'all';

    let filtered = allComments;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (pageFilter !== 'all') {
      filtered = filtered.filter(c => c.page_id === pageFilter);
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="admin-empty">Keine Kommentare gefunden.</div>';
      return;
    }

    container.innerHTML = filtered.map(comment => renderCommentCard(comment, false)).join('');

    // Add event listeners for action buttons
    container.querySelectorAll('.admin-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => handleApprove(btn.dataset.id));
    });
    container.querySelectorAll('.admin-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => handleReject(btn.dataset.id));
    });
    container.querySelectorAll('.admin-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => handleDelete(btn.dataset.id));
    });
  };

  const renderCommentCard = (comment, showTimer) => {
    const authorName = comment.profile?.display_name || 'Anonym';
    const avatarUrl = comment.profile?.avatar_url || generateAvatarUrl(authorName);
    const createdDate = formatDate(comment.created_at);
    const pageLabel = formatPageId(comment.page_id);
    
    // Calculate time remaining for auto-approve
    let timeRemaining = '';
    if (showTimer && comment.auto_approve_at) {
      timeRemaining = getTimeRemaining(comment.auto_approve_at);
    }

    const statusClass = `status-${comment.status}`;
    const flaggedClass = comment.is_flagged ? 'is-flagged' : '';

    return `
      <div class="admin-comment-card ${statusClass} ${flaggedClass}" data-id="${comment.id}">
        <div class="admin-comment-header">
          <div class="admin-comment-user">
            <img src="${avatarUrl}" alt="" class="admin-comment-avatar" onerror="this.src='${generateAvatarUrl(authorName)}'">
            <div>
              <span class="admin-comment-author">${escapeHtml(authorName)}</span>
              <span class="admin-comment-meta">${createdDate} · ${pageLabel}</span>
            </div>
          </div>
          <div class="admin-comment-badges">
            ${comment.is_flagged ? `
              <span class="admin-badge badge-flagged" title="${escapeHtml(comment.flagged_reason || 'Markiert')}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Markiert
              </span>
            ` : ''}
            <span class="admin-badge badge-${comment.status}">${getStatusLabel(comment.status)}</span>
          </div>
        </div>
        
        <div class="admin-comment-content">${escapeHtml(comment.content)}</div>
        
        ${comment.flagged_reason ? `
          <div class="admin-comment-reason">
            <strong>Grund:</strong> ${escapeHtml(comment.flagged_reason)}
          </div>
        ` : ''}
        
        ${timeRemaining ? `
          <div class="admin-comment-timer">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Auto-Freigabe in: <strong>${timeRemaining}</strong>
          </div>
        ` : ''}
        
        <div class="admin-comment-actions">
          ${comment.status !== 'approved' ? `
            <button type="button" class="admin-action-btn admin-approve-btn" data-id="${comment.id}">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Freigeben
            </button>
          ` : ''}
          ${comment.status !== 'rejected' ? `
            <button type="button" class="admin-action-btn admin-reject-btn" data-id="${comment.id}">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Ablehnen
            </button>
          ` : ''}
          <button type="button" class="admin-action-btn admin-delete-btn" data-id="${comment.id}">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Löschen
          </button>
        </div>
      </div>
    `;
  };

  const renderAdminAccessList = () => {
    const container = document.getElementById('admin-access-list');
    if (!container) return;

    if (adminAccessList.length === 0) {
      container.innerHTML = '<div class="admin-empty">Noch keine weiteren Administratoren.</div>';
      return;
    }

    container.innerHTML = adminAccessList.map(entry => `
      <div class="admin-access-item" data-email="${entry.email}">
        <div>
          <strong>${entry.email}</strong>
          <span class="admin-access-meta">hinzugefügt am ${formatDate(entry.created_at)}</span>
        </div>
        <button type="button" class="admin-access-remove" data-email="${entry.email}">
          Entfernen
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.admin-access-remove').forEach(btn => {
      btn.addEventListener('click', () => handleRemoveAdminEmail(btn.dataset.email));
    });
  };

  const populatePageFilter = () => {
    const select = document.getElementById('filter-page');
    if (!select) return;

    const pages = [...new Set(allComments.map(c => c.page_id))];
    
    // Keep the "All" option
    select.innerHTML = '<option value="all">Alle Seiten</option>';
    
    pages.forEach(pageId => {
      const option = document.createElement('option');
      option.value = pageId;
      option.textContent = formatPageId(pageId);
      select.appendChild(option);
    });
  };

  const showError = (containerId, message) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `<div class="admin-error">${escapeHtml(message)}</div>`;
    }
  };

  const toggleAdminAccessSection = (visible) => {
    const section = document.getElementById('admin-access-section');
    if (!section) return;
    section.style.display = visible ? 'block' : 'none';
  };

  const showAdminAccessMessage = (text, isError = false) => {
    const message = document.getElementById('admin-access-message');
    if (!message) return;
    message.textContent = text;
    message.classList.toggle('error', isError);
    message.classList.toggle('success', !isError);
  };

  const loadAdminAccessList = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_access')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      adminAccessList = data || [];
      renderAdminAccessList();
    } catch (error) {
      console.error('Error loading admin access list:', error);
      const container = document.getElementById('admin-access-list');
      if (container) {
        container.innerHTML = '<div class="admin-error">Fehler beim Laden der Liste.</div>';
      }
    }
  };

  // ===========================================
  // ACTIONS
  // ===========================================
  const handleApprove = async (commentId) => {
    if (!isOwner() || !commentId) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ 
          status: 'approved',
          is_flagged: false,
          auto_approve_at: null
        })
        .eq('id', commentId);

      if (error) throw error;

      // Update local state
      updateLocalComment(commentId, { status: 'approved', is_flagged: false, auto_approve_at: null });
      
      // Re-render
      updateStats();
      renderPendingComments();
      renderAllComments();

    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Fehler beim Freigeben des Kommentars.');
    }
  };

  const handleReject = async (commentId) => {
    if (!isOwner() || !commentId) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ 
          status: 'rejected',
          auto_approve_at: null
        })
        .eq('id', commentId);

      if (error) throw error;

      // Update local state
      updateLocalComment(commentId, { status: 'rejected', auto_approve_at: null });
      
      // Re-render
      updateStats();
      renderPendingComments();
      renderAllComments();

    } catch (error) {
      console.error('Error rejecting comment:', error);
      alert('Fehler beim Ablehnen des Kommentars.');
    }
  };

  const handleDelete = async (commentId) => {
    if (!isOwner() || !commentId) return;

    if (!confirm('Möchten Sie diesen Kommentar wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Update local state
      allComments = allComments.filter(c => c.id !== commentId);
      pendingComments = pendingComments.filter(c => c.id !== commentId);
      
      // Re-render
      updateStats();
      renderPendingComments();
      renderAllComments();

    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Fehler beim Löschen des Kommentars.');
    }
  };

  const handleAddAdminEmail = async (event) => {
    event.preventDefault();
    if (!isOwnerUser) return;

    const input = document.getElementById('admin-access-input');
    if (!input) return;

    const email = input.value.trim().toLowerCase();
    if (!email) {
      showAdminAccessMessage('Bitte E-Mail-Adresse eingeben.', true);
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_access')
        .insert({ email, added_by: currentUser.id });

      if (error) throw error;

      showAdminAccessMessage('Zugriff hinzugefügt.', false);
      input.value = '';
      await loadAdminAccessList();
    } catch (error) {
      console.error('Error adding admin email:', error);
      showAdminAccessMessage('Fehler beim Hinzufügen.', true);
    }
  };

  const handleRemoveAdminEmail = async (email) => {
    if (!isOwnerUser || !email) return;

    if (!confirm(`Zugriff für ${email} entfernen?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_access')
        .delete()
        .eq('email', email);

      if (error) throw error;

      await loadAdminAccessList();
    } catch (error) {
      console.error('Error removing admin email:', error);
      alert('Fehler beim Entfernen.');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateLocalComment = (commentId, updates) => {
    const index = allComments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      allComments[index] = { ...allComments[index], ...updates };
    }
    pendingComments = allComments.filter(c => c.status === 'pending');
  };

  // ===========================================
  // EVENT LISTENERS
  // ===========================================
  const setupEventListeners = () => {
    // Logout button
    document.getElementById('admin-logout-btn')?.addEventListener('click', handleLogout);

    // Filter changes
    document.getElementById('filter-status')?.addEventListener('change', renderAllComments);
    document.getElementById('filter-page')?.addEventListener('change', renderAllComments);

    // Admin access form
    document.getElementById('admin-access-form')?.addEventListener('submit', handleAddAdminEmail);
  };

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================
  const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPageId = (pageId) => {
    if (!pageId) return 'Unbekannt';
    // Convert page IDs like "french-press" to "French Press"
    return pageId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Freigegeben';
      case 'pending': return 'Ausstehend';
      case 'rejected': return 'Abgelehnt';
      default: return status;
    }
  };

  const getTimeRemaining = (autoApproveAt) => {
    if (!autoApproveAt) return '';
    
    const now = new Date();
    const target = new Date(autoApproveAt);
    const diff = target - now;
    
    if (diff <= 0) return 'Wird freigegeben...';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const generateAvatarUrl = (name) => {
    const seed = encodeURIComponent(name || 'user');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=c97a5c&textColor=ffffff`;
  };

  // ===========================================
  // INIT
  // ===========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
