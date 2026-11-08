(function () {
  'use strict';

  const projectCatalog = window.portfolioProjects || {};
  const translations = window.portfolioTranslations || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let galleryImages = [];
  let activeGalleryIndex = 0;
  let activeGalleryProjectName = '';
  let activeGalleryProjectId = '';
  let touchStartX = null;
  let suppressGalleryClick = false;

  function getLanguage() {
    try {
      return window.localStorage.getItem('preferredLang') === 'en' ? 'en' : 'fr';
    } catch (error) {
      return 'fr';
    }
  }

  function getCopy(key, language) {
    const locale = language || getLanguage();
    return translations[locale] && translations[locale][key]
      ? translations[locale][key]
      : translations.fr[key] || key;
  }

  function setText(element, value) {
    if (element) element.textContent = value;
  }

  function hasContent(value) {
    if (Array.isArray(value)) return value.some(hasContent);
    return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
  }

  function getProjectValue(project, content, key, language) {
    const localized = content && content[key];
    if (hasContent(localized)) return localized;
    const shared = project[key];
    if (shared && typeof shared === 'object' && !Array.isArray(shared)) {
      return shared[language] || shared.fr || '';
    }
    return shared;
  }

  function setupNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.primary-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = isOpen ? 'bi bi-x' : 'bi bi-list';
    });

    nav.addEventListener('click', function (event) {
      if (!event.target.closest('a')) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'bi bi-list';
    });

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!('IntersectionObserver' in window) || !sections.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.id;
        document.querySelectorAll('.primary-nav a[href*="#"]').forEach(function (link) {
          const isActive = link.hash === '#' + activeId || link.hash.endsWith('#' + activeId);
          link.classList.toggle('is-active', isActive);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function setupReveals() {
    const elements = document.querySelectorAll('.reveal');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function (element) {
        element.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function projectMatches(project, filter, language) {
    if (filter === 'all') return true;

    const formats = project.formats || [project.category];
    if (filter === 'professional') {
      const context = (project.content && project.content[language] && project.content[language].context) || '';
      return project.group === 'ytech' || /client/i.test(context);
    }
    if (filter === 'independent') return project.group === 'independent';
    return formats.includes(filter);
  }

  function makeProjectCard(id, project, language) {
    const content = project.content && (project.content[language] || project.content.fr);
    if (!content || !project.images || !project.images.length) return null;
    const categoryText = getProjectValue(project, content, 'category', language);

    const card = document.createElement('article');
    card.className = 'project-card reveal is-visible';
    card.dataset.projectId = id;

    const formats = project.formats || [project.category];
    const imageLink = document.createElement('a');
    imageLink.className = 'project-card__image';
    imageLink.dataset.fit = formats.includes('mobile') ? 'contain' : 'cover';
    imageLink.href = 'portfolio-details.html?project=' + encodeURIComponent(id);
    imageLink.setAttribute('aria-label', (categoryText || project.name) + ' — ' + project.name);

    const image = document.createElement('img');
    image.src = project.images[0];
    image.alt = project.name + (hasContent(categoryText) ? ' — ' + categoryText : '');
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 800;
    image.height = 450;
    image.addEventListener('error', function () {
      imageLink.hidden = true;
    }, { once: true });

    const badge = document.createElement('span');
    badge.className = 'project-card__badge';
    if (hasContent(categoryText)) {
      badge.textContent = categoryText;
      imageLink.append(image, badge);
    } else {
      imageLink.append(image);
    }
    card.dataset.format = formats.join(' ');

    const body = document.createElement('div');
    body.className = 'project-card__body';

    const meta = document.createElement('div');
    meta.className = 'project-card__meta';
    if (project.group === 'ytech' || project.group === 'independent') {
      const group = document.createElement('span');
      group.className = 'project-card__group';
      group.textContent = getCopy(project.group === 'ytech' ? 'group_ytech' : 'group_independent', language);
      meta.append(group);
    }
    if (hasContent(content.context)) {
      const context = document.createElement('span');
      context.textContent = content.context;
      meta.append(context);
    }
    if (meta.childElementCount) body.append(meta);

    const title = document.createElement('h3');
    title.textContent = project.name;

    body.append(title);
    if (hasContent(content.description)) {
      const description = document.createElement('p');
      description.textContent = content.description;
      body.append(description);
    }

    const technologies = document.createElement('div');
    technologies.className = 'project-card__technologies';
    technologies.setAttribute('aria-label', getCopy('project_technologies', language));
    const projectTechnologies = Array.isArray(project.technologies) ? project.technologies.filter(hasContent) : [];
    projectTechnologies.forEach(function (technology) {
      const tag = document.createElement('span');
      tag.textContent = technology;
      technologies.append(tag);
    });
    if (projectTechnologies.length) body.append(technologies);

    const footer = document.createElement('div');
    footer.className = 'project-card__footer';
    if (hasContent(categoryText)) {
      const category = document.createElement('span');
      category.className = 'project-card__category';
      category.textContent = categoryText;
      footer.append(category);
    }

    const link = document.createElement('a');
    link.className = 'project-card__link';
    link.href = imageLink.href;
    link.textContent = getCopy('project_link', language);
    const linkIcon = document.createElement('i');
    linkIcon.className = 'bi bi-arrow-up-right';
    linkIcon.setAttribute('aria-hidden', 'true');
    link.append(linkIcon);

    footer.append(link);
    body.append(footer);
    card.append(imageLink, body);
    return card;
  }

  function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    const previousPositions = new Map(
      Array.from(grid.querySelectorAll('.project-card')).map(function (card) {
        card.getAnimations().forEach(function (animation) {
          animation.cancel();
        });
        return [card.dataset.projectId, card.getBoundingClientRect()];
      })
    );
    const language = getLanguage();
    const filterButton = document.querySelector('.project-filters button[aria-pressed="true"]');
    const activeFilter = filterButton ? filterButton.dataset.filter : 'all';
    const entries = Object.entries(projectCatalog).filter(function (entry) {
      return entry[1].publishable !== false && projectMatches(entry[1], activeFilter, language);
    });

    grid.replaceChildren();
    const layoutPattern = ['wide', 'medium', 'medium', 'wide', 'balanced-wide', 'balanced-medium'];
    const cards = [];
    entries.forEach(function (entry, index) {
      const card = makeProjectCard(entry[0], entry[1], language);
      if (!card) return;
      card.dataset.layout = layoutPattern[index % layoutPattern.length];
      if (entries.length % 2 === 1 && index === entries.length - 1) {
        card.dataset.singleLast = 'true';
      }
      cards.push(card);
    });
    grid.replaceChildren(...cards);

    if (!reducedMotion) {
      cards.forEach(function (card) {
        const previous = previousPositions.get(card.dataset.projectId);
        const current = card.getBoundingClientRect();
        if (previous) {
          const deltaX = previous.left - current.left;
          const deltaY = previous.top - current.top;
          if (deltaX || deltaY) {
            card.animate([
              { transform: 'translate(' + deltaX + 'px, ' + deltaY + 'px)' },
              { transform: 'translate(0, 0)' }
            ], { duration: 260, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
          }
        } else {
          card.animate([
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 220, easing: 'ease-out' });
        }
      });
    }

    const emptyState = document.getElementById('projects-empty');
    if (emptyState) emptyState.hidden = grid.children.length > 0;
  }

  function setupProjectFilters() {
    document.querySelectorAll('.project-filters [data-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('.project-filters [data-filter]').forEach(function (item) {
          item.setAttribute('aria-pressed', String(item === button));
        });
        renderProjects();
      });
    });
    renderProjects();
  }

  function appendGallery(project) {
    const gallery = document.getElementById('project-gallery');
    const controls = document.getElementById('gallery-controls');
    const heading = document.getElementById('gallery-heading');
    const stage = document.getElementById('gallery-stage');
    const image = document.getElementById('gallery-image');
    const thumbnails = document.getElementById('gallery-thumbnails');
    if (!gallery || !stage || !image || !thumbnails) return;

    const previousSource = activeGalleryProjectId === project.id ? galleryImages[activeGalleryIndex] : null;
    galleryImages = Array.isArray(project.images) ? project.images.filter(hasContent) : [];
    activeGalleryProjectName = project.name;
    activeGalleryProjectId = project.id;
    activeGalleryIndex = previousSource ? Math.max(0, galleryImages.indexOf(previousSource)) : 0;
    thumbnails.replaceChildren();

    if (!galleryImages.length) {
      gallery.hidden = true;
      if (heading) heading.hidden = true;
      if (controls) controls.hidden = true;
      return;
    }

    gallery.hidden = false;
    if (heading) heading.hidden = false;
    galleryImages.forEach(function (source, index) {
      const thumbnail = document.createElement('button');
      thumbnail.className = 'gallery-thumbnail';
      thumbnail.type = 'button';
      thumbnail.dataset.index = String(index);
      thumbnail.setAttribute('aria-label', getCopy('gallery_thumbnail') + ' ' + (index + 1));
      thumbnail.setAttribute('aria-pressed', 'false');
      const thumbnailImage = document.createElement('img');
      thumbnailImage.src = source;
      thumbnailImage.alt = '';
      thumbnailImage.loading = 'lazy';
      thumbnailImage.decoding = 'async';
      thumbnail.append(thumbnailImage);
      thumbnails.append(thumbnail);
    });

    const hasMultiple = galleryImages.length > 1;
    if (controls) controls.hidden = !hasMultiple;
    thumbnails.hidden = !hasMultiple;
    document.getElementById('gallery-prev').setAttribute('aria-label', getCopy('gallery_previous'));
    document.getElementById('gallery-next').setAttribute('aria-label', getCopy('gallery_next'));
    document.getElementById('lightbox-prev').setAttribute('aria-label', getCopy('gallery_previous'));
    document.getElementById('lightbox-next').setAttribute('aria-label', getCopy('gallery_next'));
    document.getElementById('lightbox-close').setAttribute('aria-label', getCopy('gallery_close'));
    updateGalleryImage(false);
  }

  function updateGalleryImage(animate) {
    const image = document.getElementById('gallery-image');
    const stage = document.getElementById('gallery-stage');
    const thumbnails = document.getElementById('gallery-thumbnails');
    const counter = document.getElementById('gallery-count');
    const lightbox = document.getElementById('project-lightbox');
    if (!image || !stage || !galleryImages.length) return;

    const source = galleryImages[activeGalleryIndex];
    image.alt = activeGalleryProjectName + ' — ' + getCopy('details_gallery') + ' ' + (activeGalleryIndex + 1);
    stage.setAttribute('aria-label', getCopy('gallery_open') + ' — ' + image.alt);
    const thumbnailItems = thumbnails.querySelectorAll('.gallery-thumbnail');
    thumbnailItems.forEach(function (thumbnail, index) {
      const isActive = index === activeGalleryIndex;
      thumbnail.setAttribute('aria-pressed', String(isActive));
      thumbnail.classList.toggle('is-active', isActive);
    });

    const count = String(activeGalleryIndex + 1).padStart(2, '0') + ' / ' + String(galleryImages.length).padStart(2, '0');
    if (counter) counter.textContent = count;
    const lightboxCount = document.getElementById('lightbox-count');
    if (lightboxCount) lightboxCount.textContent = count;
    if (lightbox && lightbox.open) {
      const lightboxImage = document.getElementById('lightbox-image');
      if (lightboxImage) {
        lightboxImage.src = source;
        lightboxImage.alt = image.alt;
      }
    }

    image.onload = function () {
      stage.dataset.orientation = image.naturalHeight > image.naturalWidth ? 'portrait' : 'landscape';
    };
    image.onerror = function () {
      galleryImages.splice(activeGalleryIndex, 1);
      activeGalleryIndex = Math.min(activeGalleryIndex, galleryImages.length - 1);
      appendGallery({ id: activeGalleryProjectId, name: activeGalleryProjectName, images: galleryImages });
    };
    image.src = source;

    const activeThumbnail = thumbnailItems[activeGalleryIndex];
    if (animate && activeThumbnail) activeThumbnail.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (animate && !reducedMotion && typeof image.animate === 'function') {
      image.animate(
        [{ opacity: 0.55, transform: 'scale(0.99)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 180, easing: 'ease-out' }
      );
    }
  }

  function moveGallery(direction) {
    if (galleryImages.length < 2) return;
    activeGalleryIndex = (activeGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    updateGalleryImage(true);
  }

  function openGalleryLightbox() {
    const lightbox = document.getElementById('project-lightbox');
    const image = document.getElementById('lightbox-image');
    if (!lightbox || !image || !galleryImages.length || lightbox.open) return;
    image.src = galleryImages[activeGalleryIndex];
    image.alt = activeGalleryProjectName + ' — ' + getCopy('details_gallery') + ' ' + (activeGalleryIndex + 1);
    lightbox.showModal();
    document.getElementById('lightbox-close').focus();
  }

  function setupGalleryControls() {
    const stage = document.getElementById('gallery-stage');
    const thumbnails = document.getElementById('gallery-thumbnails');
    const lightbox = document.getElementById('project-lightbox');
    if (!stage || !thumbnails || !lightbox) return;

    document.getElementById('gallery-prev').addEventListener('click', function () {
      moveGallery(-1);
    });
    document.getElementById('gallery-next').addEventListener('click', function () {
      moveGallery(1);
    });
    thumbnails.addEventListener('click', function (event) {
      const button = event.target.closest('.gallery-thumbnail');
      if (!button) return;
      activeGalleryIndex = Number(button.dataset.index);
      updateGalleryImage(true);
    });
    stage.addEventListener('click', function (event) {
      if (suppressGalleryClick) {
        suppressGalleryClick = false;
        event.preventDefault();
        return;
      }
      openGalleryLightbox();
    });
    stage.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse') return;
      touchStartX = event.clientX;
    });
    stage.addEventListener('pointerup', function (event) {
      if (touchStartX === null) return;
      const distance = event.clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) < 45 || galleryImages.length < 2) return;
      suppressGalleryClick = true;
      window.setTimeout(function () {
        suppressGalleryClick = false;
      }, 400);
      moveGallery(distance < 0 ? 1 : -1);
    });
    stage.addEventListener('pointercancel', function () {
      touchStartX = null;
    });
    document.getElementById('lightbox-prev').addEventListener('click', function () {
      moveGallery(-1);
    });
    document.getElementById('lightbox-next').addEventListener('click', function () {
      moveGallery(1);
    });
    document.getElementById('lightbox-close').addEventListener('click', function () {
      lightbox.close();
    });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('cancel', function (event) {
      event.preventDefault();
      lightbox.close();
    });
    lightbox.addEventListener('close', function () {
      stage.focus();
    });
    document.addEventListener('keydown', function (event) {
      const galleryFocused = document.getElementById('project-gallery').contains(event.target);
      if (!lightbox.open && !galleryFocused) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveGallery(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveGallery(1);
      } else if (event.key === 'Escape' && lightbox.open) {
        event.preventDefault();
        lightbox.close();
      }
    });
  }

  function appendVideo(project) {
    const container = document.getElementById('project-video');
    const section = document.getElementById('video-section');
    if (!container || !section) return;
    container.replaceChildren();

    if (!hasContent(project.video)) {
      section.hidden = true;
      return;
    }

    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    const source = document.createElement('source');
    source.src = project.video;
    source.type = project.video.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
    video.append(source);
    container.append(video);
    section.hidden = false;
  }

  function renderProjectSections(project, content, language) {
    const container = document.getElementById('project-sections');
    if (!container) return;
    container.replaceChildren();

    const fields = [
      ['description', 'details_overview'],
      ['problem', 'details_problem'],
      ['solution', 'details_solution'],
      ['objectives', 'details_objectives'],
      ['features', 'details_features'],
      ['contributions', 'details_contribution'],
      ['role', 'details_role'],
      ['team', 'details_team'],
      ['architecture', 'details_architecture'],
      ['challenges', 'details_challenges'],
      ['results', 'details_results'],
      ['technologies', 'details_technologies']
    ];

    fields.forEach(function (field) {
      const value = getProjectValue(project, content, field[0], language);
      if (!hasContent(value)) return;

      const section = document.createElement('section');
      section.className = 'detail-block';
      const heading = document.createElement('p');
      heading.className = 'eyebrow';
      heading.textContent = getCopy(field[1], language);
      section.append(heading);

      const entries = Array.isArray(value) ? value.filter(hasContent) : [value];
      if (Array.isArray(value)) {
        const list = document.createElement('ul');
        list.className = 'detail-list';
        entries.forEach(function (entry) {
          const item = document.createElement('li');
          item.textContent = entry;
          list.append(item);
        });
        section.append(list);
      } else {
        const text = document.createElement('p');
        text.className = field[0] === 'description' ? 'detail-block__lead' : '';
        text.textContent = value;
        section.append(text);
      }
      container.append(section);
    });
  }

  function renderProjectDetails() {
    const details = document.getElementById('project-details');
    if (!details) return;

    const projectId = new URLSearchParams(window.location.search).get('project');
    const project = projectId ? projectCatalog[projectId] : null;
    const notFound = document.getElementById('project-not-found');
    const title = document.getElementById('project-title');

    if (!project || project.publishable === false || !project.content) {
      details.hidden = true;
      if (notFound) notFound.hidden = false;
      setText(title, getCopy('details_missing'));
      document.title = getCopy('details_missing') + ' — Issiaka Ouédraogo';
      return;
    }

    const language = getLanguage();
    const content = project.content[language] || project.content.fr;
    const context = getProjectValue(project, content, 'context', language);
    const category = getProjectValue(project, content, 'category', language);
    const status = getProjectValue(project, content, 'status', language);
    if (notFound) notFound.hidden = true;
    details.hidden = false;
    setText(title, project.name);
    setText(document.getElementById('project-context'), context);
    const heroContext = document.getElementById('project-context');
    if (heroContext) heroContext.hidden = !hasContent(context);
    setText(document.getElementById('project-name'), project.name);
    setText(document.getElementById('project-context-info'), context);
    setText(document.getElementById('project-category'), category);
    const contextRow = document.getElementById('project-context-row');
    const categoryRow = document.getElementById('project-category-row');
    if (contextRow) contextRow.hidden = !hasContent(context);
    if (categoryRow) categoryRow.hidden = !hasContent(category);
    const statusRow = document.getElementById('project-status-row');
    setText(document.getElementById('project-status'), status);
    if (statusRow) statusRow.hidden = !hasContent(status);
    document.title = project.name + ' — Issiaka Ouédraogo';
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const socialTitle = document.querySelector('meta[property="og:title"]');
    const socialDescription = document.querySelector('meta[property="og:description"]');
    const socialUrl = document.querySelector('meta[property="og:url"]');
    if (descriptionMeta && hasContent(content.description)) descriptionMeta.content = content.description;
    if (socialTitle) socialTitle.content = document.title;
    if (socialDescription && hasContent(content.description)) socialDescription.content = content.description;
    if (socialUrl) socialUrl.content = window.location.href;

    const link = document.getElementById('project-link');
    const safeUrl = typeof project.url === 'string' && /^https:\/\/[^\s]+$/i.test(project.url);
    if (link) {
      link.hidden = !safeUrl;
      if (safeUrl) link.href = project.url;
    }

    const githubLink = document.getElementById('project-github-link');
    const safeGithub = typeof project.github === 'string' && /^https:\/\/github\.com\/[^\s]+$/i.test(project.github);
    if (githubLink) {
      githubLink.hidden = !safeGithub;
      if (safeGithub) githubLink.href = project.github;
    }

    renderProjectSections(project, content, language);
    appendGallery({ id: projectId, name: project.name, images: project.images });
    appendVideo(project);
  }

  function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const button = form.querySelector('button[type="submit"]');
    const label = button && button.querySelector('[data-key="form_send"]');
    if (!status || !button || !label) return;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      status.hidden = true;
      status.className = 'form-status';
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      setText(label, getCopy('form_sending'));

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          throw new Error('PHP_ENDPOINT_UNAVAILABLE');
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'CONTACT_SUBMISSION_FAILED');
        }

        status.classList.add('is-success');
        setText(status, getCopy('form_success'));
        form.reset();
      } catch (error) {
        console.error('Contact form submission failed.', error);
        status.classList.add('is-error');
        const message = error.message === 'PHP_ENDPOINT_UNAVAILABLE' || error instanceof TypeError
          ? getCopy('form_php_notice') + ' ' + getCopy('form_error')
          : getCopy('form_error');
        setText(status, message);
      } finally {
        status.hidden = false;
        button.disabled = false;
        button.removeAttribute('aria-busy');
        setText(label, getCopy('form_send'));
      }
    });
  }

  function setupLanguageControls() {
    document.querySelectorAll('[data-language]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.changeLanguage(button.dataset.language);
      });
    });

    window.addEventListener('portfolio-language-change', function () {
      renderProjects();
      renderProjectDetails();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupReveals();
    setupProjectFilters();
    setupContactForm();
    setupLanguageControls();
    renderProjectDetails();
    setupGalleryControls();

    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
