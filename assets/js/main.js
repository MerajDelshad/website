(function($) {
  var $window = $(window),
      $body = $('body');

  // Play initial animation on page load.
  $window.on('load', function() {
    window.setTimeout(function() {
      $body.removeClass('is-preload');
    }, 100);
  });

  // ===== Reusable Thumbnail Slideshow =====
  // Finds all .thumb-slideshow elements and cycles their .slide children.
  // Options: interval (ms), transition (ms) — set via data attributes.
  function initSlideshows() {
    $('.thumb-slideshow').each(function() {
      var $slideshow = $(this);
      var $slides = $slideshow.find('.slide');
      if ($slides.length <= 1) return;

      var interval = parseInt($slideshow.data('interval'), 10) || 1500;
      var current = 0;

      // First slide is active (in-flow), rest are absolute
      $slides.eq(0).addClass('active');

      setInterval(function() {
        $slides.eq(current).removeClass('active').css('position', 'absolute');
        current = (current + 1) % $slides.length;
        $slides.eq(current).addClass('active').css('position', 'relative');
      }, interval);
    });
  }

  initSlideshows();

  // ===== Pieces Modal / Lightbox (Works page) =====
  var $modal = $('#piece-modal');
  var $modalContent = $modal.find('.modal-content');
  var $modalOverlay = $modal;

  function openModal(src, type, alt) {
    var mediaHtml = '';
    if (type === 'video') {
      mediaHtml = '<video src="' + src + '" controls autoplay></video>';
    } else {
      mediaHtml = '<img src="' + src + '" alt="' + (alt || 'Piece') + '" />';
    }
    $modalContent.html(mediaHtml);
    $modal.addClass('active');
    $body.addClass('modal-open');
  }

  function closeModal() {
    $modal.removeClass('active');
    $body.removeClass('modal-open');
    var $video = $modalContent.find('video');
    if ($video.length) {
      $video[0].pause();
      $video[0].currentTime = 0;
    }
    $modalContent.empty();
  }

  // Open modal when a piece is clicked (Works page)
  $(document).on('click', '.piece-card', function(e) {
    e.preventDefault();
    var $this = $(this);
    var src = $this.data('src');
    var type = $this.data('type');
    var alt = $this.find('.piece-name').text() || 'Piece';
    openModal(src, type, alt);
  });

  // Open modal when a project media item is clicked (Project pages)
  $(document).on('click', '.project-media-item.clickable', function() {
    var $item = $(this);
    var $img = $item.find('img');
    var $video = $item.find('video');
    if ($video.length) {
      openModal($video.attr('src'), 'video', '');
    } else if ($img.length) {
      openModal($img.attr('src'), 'image', $img.attr('alt') || '');
    }
  });

  // Close modal on overlay click (but not on content)
  $modalOverlay.on('click', function(e) {
    if (e.target === $modalOverlay[0]) {
      closeModal();
    }
  });

  // Close on close button
  $modal.find('.modal-close').on('click', function(e) {
    e.stopPropagation();
    closeModal();
  });

  // Close on Escape key (generic piece modal)
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $modal.hasClass('active')) {
      closeModal();
    }
  });

  // ===== Resume Modal =====
  var $resumeModal = $('#resume-modal');

  $('#resume-btn').on('click', function() {
    $resumeModal.addClass('active');
    $body.addClass('modal-open');
  });

  function closeResumeModal() {
    $resumeModal.removeClass('active');
    $body.removeClass('modal-open');
  }

  $resumeModal.on('click', function(e) {
    if (e.target === $resumeModal[0]) {
      closeResumeModal();
    }
  });

  $resumeModal.find('.modal-close').on('click', function(e) {
    e.stopPropagation();
    closeResumeModal();
  });

  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $resumeModal.hasClass('active')) {
      closeResumeModal();
    }
  });

})(jQuery);
