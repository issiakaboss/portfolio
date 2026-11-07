(function () {
  'use strict';

  const projectCatalog = window.portfolioProjects || {};
  const translations = window.portfolioTranslations || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    const card = document.createElement('article');
    card.className = 'project-card reveal is-visible';
    card.dataset.projectId = id;

    const imageLink = document.createElement('a');
    imageLink.className = 'project-card__image';
    imageLink.href = 'portfolio-details.html?project=' + encodeURIComponent(id);
    imageLink.setAttribute('aria-label', content.category + ' — ' + project.name);

    const image = document.createElement('img');
    image.src = project.images[0];
    image.alt = project.name + ' — ' + content.category;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 800;
    image.height = 450;
    image.addEventListener('error', function () {
      imageLink.hidden = true;
    }, { once: true });
    imageLink.append(image);

    const body = document.createElement('div');
    body.className = 'project-card__body';

    const meta = document.createElement('div');
    meta.className = 'project-card__meta';
    const group = document.createElement('span');
    group.className = 'project-card__group';
    group.textContent = getCopy(project.group === 'ytech' ? 'group_ytech' : 'group_independent', language);
    const context = document.createElement('span');
    context.textContent = content.context;
    meta.append(group, context);

    const title = document.createElement('h3');
    title.textContent = project.name;

    const description = document.createElement('p');
    description.textContent = content.description;

    const footer = document.createElement('div');
    footer.className = 'project-card__footer';
    const category = document.createElement('span');
    category.className = 'project-card__category';
    category.textContent = content.category;

    const link = document.createElement('a');
    link.className = 'project-card__link';
    link.href = imageLink.href;
    link.textContent = getCopy('project_link', language);
    const linkIcon = document.createElement('i');
    linkIcon.className = 'bi bi-arrow-up-right';
    linkIcon.setAttribute('aria-hidden', 'true');
    link.append(linkIcon);

    footer.append(category, link);
    body.append(meta, title, description, footer);
    card.append(imageLink, body);
    return card;
  }

  function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    const language = getLanguage();
    const filterButton = document.querySelector('.project-filters button[aria-pressed="true"]');
    const activeFilter = filterButton ? filterButton.dataset.filter : 'all';
    const entries = Object.entries(projectCatalog).filter(function (entry) {
      return entry[1].publishable !== false && projectMatches(entry[1], activeFilter, language);
    });

    grid.replaceChildren();
    entries.forEach(function (entry) {
      const card = makeProjectCard(entry[0], entry[1], language);
      if (card) grid.append(card);
    });

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
    if (!gallery) return;
    gallery.replaceChildren();

    project.images.forEach(function (source, index) {
      const figure = document.createElement('figure');
      figure.className = 'gallery-image';
      const image = document.createElement('img');
      image.src = source;
      image.alt = project.name + ' — ' + getCopy('details_gallery') + ' ' + (index + 1);
      image.loading = index === 0 ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', function () {
        figure.remove();
      }, { once: true });
      figure.append(image);
      gallery.append(figure);
    });

    if (controls) controls.hidden = true;
  }

  function appendVideo(project) {
    const container = document.getElementById('project-video');
    const empty = document.getElementById('video-empty');
    if (!container || !empty) return;
    container.replaceChildren();

    if (!project.video) {
      empty.hidden = false;
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
    empty.hidden = true;
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
    if (notFound) notFound.hidden = true;
    details.hidden = false;
    setText(title, project.name);
    setText(document.getElementById('project-context'), content.context);
    setText(document.getElementById('project-name'), project.name);
    setText(document.getElementById('project-context-info'), content.context);
    setText(document.getElementById('project-category'), content.category);
    setText(document.getElementById('project-description'), content.description);
    document.title = project.name + ' — Issiaka Ouédraogo';
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const socialTitle = document.querySelector('meta[property="og:title"]');
    const socialDescription = document.querySelector('meta[property="og:description"]');
    const socialUrl = document.querySelector('meta[property="og:url"]');
    if (descriptionMeta) descriptionMeta.content = content.description;
    if (socialTitle) socialTitle.content = document.title;
    if (socialDescription) socialDescription.content = content.description;
    if (socialUrl) socialUrl.content = window.location.href;

    const link = document.getElementById('project-link');
    const safeUrl = typeof project.url === 'string' && /^https:\/\/[^\s]+$/i.test(project.url);
    if (link) {
      link.hidden = !safeUrl;
      if (safeUrl) link.href = project.url;
    }

    appendGallery(project);
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

    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
