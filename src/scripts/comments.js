/**
 * Comment System for Brew Method Pages
 * Uses Cusdis API for comment storage and retrieval
 */

(() => {
  'use strict';

  // Cusdis Configuration
  // TODO: Replace with your Cusdis App ID after setting up account at https://cusdis.com
  const CUSDIS_CONFIG = {
    appId: '2010b007-810d-4c02-8d16-bd9e8f58921b', // Replace with your Cusdis App ID
    apiUrl: 'https://cusdis.com/api',
    autoApprove: true // Comments are auto-approved
  };

  // Check if running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

  // State
  let currentPageId = null;
  let comments = [];
  let overlay = null;
  let form = null;

  /**
   * Initialize comment system
   */
  const initComments = () => {
    // Check if we're on a brew method page
    const commentPreview = document.querySelector('.comment-preview');
    if (!commentPreview) {
      return; // Not on a brew method page
    }

    // Get page ID from data attribute
    currentPageId = commentPreview.dataset.commentPageId;
    if (!currentPageId) {
      console.warn('Comment system: No page ID found');
      return;
    }

    // Check if Cusdis is configured
    if (CUSDIS_CONFIG.appId === 'YOUR_CUSDIS_APP_ID') {
      console.warn('Comment system: Cusdis not configured. Please add your App ID in comments.js');
      // Show placeholder message
      showPlaceholderMessage();
      return;
    }

    // Initialize overlay
    initOverlay();

    // Load comments
    loadComments();

    // Set up event listeners
    setupEventListeners();
  };

  /**
   * Show placeholder message when Cusdis is not configured
   */
  const showPlaceholderMessage = () => {
    const preview = document.querySelector('.comment-preview-card');
    if (preview) {
      preview.innerHTML = `
        <p class="comment-placeholder">Kommentarfunktion wird eingerichtet...</p>
      `;
    }
  };

  /**
   * Initialize overlay/modal
   */
  const initOverlay = () => {
    overlay = document.getElementById('comment-overlay');
    if (!overlay) {
      createOverlay();
      overlay = document.getElementById('comment-overlay');
    }
    form = document.getElementById('comment-form');
  };

  /**
   * Create overlay HTML structure
   */
  const createOverlay = () => {
    const overlayHTML = `
      <div class="comment-overlay" id="comment-overlay" aria-hidden="true" role="dialog" aria-labelledby="comment-overlay-title">
        <div class="comment-overlay-backdrop"></div>
        <div class="comment-overlay-content">
          <button class="comment-overlay-close" aria-label="Kommentare schließen" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <h2 id="comment-overlay-title" class="comment-overlay-title">Kommentare</h2>
          
          <!-- Comment Form -->
          <form class="comment-form" id="comment-form" novalidate>
            <div class="comment-form-group">
              <label for="comment-name" class="comment-form-label">Name *</label>
              <input 
                type="text" 
                id="comment-name" 
                name="name" 
                class="comment-form-input" 
                required 
                aria-required="true"
                placeholder="Ihr Name"
              >
            </div>
            
            <div class="comment-form-group">
              <label for="comment-email" class="comment-form-label">E-Mail (optional)</label>
              <input 
                type="email" 
                id="comment-email" 
                name="email" 
                class="comment-form-input" 
                placeholder="ihre-email@beispiel.de"
              >
            </div>
            
            <div class="comment-form-group">
              <label for="comment-content" class="comment-form-label">Kommentar *</label>
              <textarea 
                id="comment-content" 
                name="content" 
                class="comment-form-textarea" 
                rows="4" 
                required 
                aria-required="true"
                placeholder="Teilen Sie Ihre Erfahrungen mit dieser Zubereitungsmethode..."
              ></textarea>
            </div>
            
            <div class="comment-form-actions">
              <button type="submit" class="comment-form-submit">
                Kommentar absenden
              </button>
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

    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    overlay = document.getElementById('comment-overlay');
    form = document.getElementById('comment-form');
  };

  /**
   * Set up event listeners
   */
  const setupEventListeners = () => {
    // View all comments button
    const viewAllBtn = document.querySelector('.comment-view-all-btn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', openOverlay);
    }

    // Close overlay buttons
    const closeBtn = document.querySelector('.comment-overlay-close');
    const backdrop = document.querySelector('.comment-overlay-backdrop');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeOverlay);
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', closeOverlay);
    }

    // Form submission
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay && !overlay.hasAttribute('aria-hidden')) {
        closeOverlay();
      }
    });
  };

  /**
   * Check if error is a CORS error
   */
  const isCORSError = (error) => {
    return error.message.includes('CORS') || 
           error.message.includes('Failed to fetch') ||
           error.name === 'TypeError' && error.message.includes('fetch');
  };

  /**
   * Load comments from Cusdis API
   */
  const loadComments = async () => {
    // Show localhost warning if applicable
    if (isLocalhost) {
      const previewCard = document.querySelector('.comment-preview-card');
      if (previewCard && comments.length === 0) {
        previewCard.innerHTML = `
          <p class="comment-preview-empty">
            <strong>Entwicklungsumgebung:</strong> Kommentare funktionieren nur auf der produktiven Website. 
            Die Cusdis API erlaubt keine Anfragen von localhost.
          </p>
        `;
      }
    }

    try {
      const response = await fetch(
        `${CUSDIS_CONFIG.apiUrl}/comments?appId=${CUSDIS_CONFIG.appId}&pageId=${currentPageId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load comments: ${response.status}`);
      }

      const data = await response.json();
      comments = data.data || [];

      // Update preview
      updateCommentPreview();

      // Update list in overlay
      updateCommentList();
    } catch (error) {
      console.error('Error loading comments:', error);
      
      if (isCORSError(error) && isLocalhost) {
        // Show helpful message for localhost CORS issue
        showError('Kommentare können in der Entwicklungsumgebung (localhost) nicht geladen werden. ' +
                  'Dies funktioniert nur auf der produktiven Website.');
      } else {
        showError('Kommentare konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
      }
    }
  };

  /**
   * Update comment preview (shows latest comment)
   */
  const updateCommentPreview = () => {
    const previewCard = document.querySelector('.comment-preview-card');
    if (!previewCard) return;

    if (comments.length === 0) {
      previewCard.innerHTML = `
        <p class="comment-preview-empty">Noch keine Kommentare. Seien Sie der Erste!</p>
      `;
      return;
    }

    // Get latest comment
    const latestComment = comments[comments.length - 1];
    const authorName = latestComment.by_nickname || 'Anonym';
    const commentDate = formatDate(latestComment.created_at);
    const commentText = truncateText(latestComment.content, 150);

    previewCard.innerHTML = `
      <div class="comment-preview-author">${escapeHtml(authorName)}</div>
      <div class="comment-preview-date">${commentDate}</div>
      <div class="comment-preview-text">${escapeHtml(commentText)}</div>
    `;
  };

  /**
   * Update comment list in overlay
   */
  const updateCommentList = () => {
    const listContainer = document.getElementById('comment-list');
    if (!listContainer) return;

    if (comments.length === 0) {
      listContainer.innerHTML = `
        <div class="comment-empty">
          <p>Noch keine Kommentare. Seien Sie der Erste, der einen Kommentar hinterlässt!</p>
        </div>
      `;
      return;
    }

    // Sort comments by date (newest first)
    const sortedComments = [...comments].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    listContainer.innerHTML = sortedComments.map(comment => {
      const authorName = comment.by_nickname || 'Anonym';
      const commentDate = formatDate(comment.created_at);
      const commentText = comment.content;

      return `
        <div class="comment-item">
          <div class="comment-item-header">
            <div class="comment-item-author">${escapeHtml(authorName)}</div>
            <div class="comment-item-date">${commentDate}</div>
          </div>
          <div class="comment-item-content">${escapeHtml(commentText).replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }).join('');
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const content = formData.get('content').trim();

    // Validation
    if (!name || !content) {
      showFormMessage('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
      return;
    }

    // Disable form
    const submitBtn = form.querySelector('.comment-form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet...';
    showFormMessage('', '');

    // Check for localhost before submitting
    if (isLocalhost) {
      showFormMessage(
        'Entwicklungsumgebung: Kommentare können auf localhost nicht gesendet werden. ' +
        'Die Cusdis API erlaubt keine Anfragen von localhost. ' +
        'Bitte testen Sie auf der produktiven Website.',
        'error'
      );
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      return;
    }

    try {
      const response = await fetch(`${CUSDIS_CONFIG.apiUrl}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: CUSDIS_CONFIG.appId,
          pageId: currentPageId,
          by_nickname: name,
          by_email: email || undefined,
          content: content,
          approved: CUSDIS_CONFIG.autoApprove
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to submit comment: ${response.status}`);
      }

      // Success
      showFormMessage('Vielen Dank! Ihr Kommentar wurde erfolgreich gesendet.', 'success');
      form.reset();

      // Reload comments after a short delay
      setTimeout(() => {
        loadComments();
      }, 1000);

    } catch (error) {
      console.error('Error submitting comment:', error);
      
      if (isCORSError(error)) {
        showFormMessage(
          'Fehler: Die Kommentarfunktion funktioniert nur auf der produktiven Website. ' +
          'Bitte testen Sie nach dem Deployment.',
          'error'
        );
      } else {
        showFormMessage('Fehler beim Senden des Kommentars. Bitte versuchen Sie es erneut.', 'error');
      }
    } finally {
      // Re-enable form
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  };

  /**
   * Show form message
   */
  const showFormMessage = (message, type) => {
    const messageEl = document.getElementById('comment-form-message');
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.className = `comment-form-message ${type}`;
    messageEl.setAttribute('aria-live', 'polite');

    if (type === 'success') {
      // Clear message after 5 seconds
      setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'comment-form-message';
      }, 5000);
    }
  };

  /**
   * Show error message
   */
  const showError = (message) => {
    const listContainer = document.getElementById('comment-list');
    if (listContainer) {
      listContainer.innerHTML = `
        <div class="comment-error">
          <p>${escapeHtml(message)}</p>
        </div>
      `;
    }
  };

  /**
   * Open overlay
   */
  const openOverlay = () => {
    if (!overlay) return;

    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Focus on first input
    const firstInput = overlay.querySelector('.comment-form-input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  };

  /**
   * Close overlay
   */
  const closeOverlay = () => {
    if (!overlay) return;

    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    document.body.style.overflow = ''; // Restore scrolling

    // Clear form message
    showFormMessage('', '');
  };

  /**
   * Format date
   */
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
      // Format as date
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  /**
   * Truncate text
   */
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  /**
   * Escape HTML
   */
  const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComments);
  } else {
    initComments();
  }

  // Export for manual initialization if needed
  window.hellers = window.hellers || {};
  window.hellers.comments = {
    init: initComments,
    open: openOverlay,
    close: closeOverlay
  };
})();

