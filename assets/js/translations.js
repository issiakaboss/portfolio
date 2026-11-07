(function () {
  'use strict';

  const translations = {
    fr: {
      nav_home: 'Accueil',
      nav_about: 'À propos',
      nav_skills: 'Compétences',
      nav_services: 'Services',
      nav_experience: 'Expériences',
      nav_projects: 'Projets',
      nav_contact: 'Contact',
      nav_resume: 'Mon parcours',
      language_label: 'Langue',
      hero_eyebrow: 'INGÉNIEUR LOGICIEL · DÉVELOPPEUR FULL-STACK',
      hero_title: 'Des idées utiles, transformées en produits numériques.',
      hero_intro: 'Je conçois et développe des applications mobiles, des plateformes web et des API, de la compréhension du besoin jusqu’à la mise en production.',
      hero_primary: 'Découvrir mes projets',
      hero_secondary: 'Mon parcours',
      hero_available: 'Ouvert aux opportunités',
      hero_role: 'Flutter · Laravel · API REST',
      about_eyebrow: 'À PROPOS',
      about_title: 'Concevoir, développer et faire évoluer des solutions concrètes.',
      about_intro: 'Formé en informatique, j’interviens sur plusieurs couches d’un produit numérique : interfaces mobiles et web, logique métier, API et données.',
      about_paragraph: 'Après une formation en informatique et entrepreneuriat au Burkina Institute of Technology (BIT), de 2020 à 2023, j’ai acquis de l’expérience en entreprise et en stage au Burkina Faso. J’ai contribué à des applications mobiles et à des logiciels de gestion, en portant une attention particulière à la compréhension du besoin, à la qualité du code et à la fiabilité des solutions livrées.',
      about_location: 'Basé à Ouagadougou, Burkina Faso',
      education_title: 'Formation',
      education_degree: 'Licence en informatique et entrepreneuriat',
      education_school: 'Burkina Institute of Technology (BIT)',
      skills_eyebrow: 'COMPÉTENCES',
      skills_title: 'Mon expertise technique',
      skills_intro: 'Des outils choisis selon le contexte du produit, avec une expérience centrée sur Flutter et Laravel.',
      skill_mobile: 'Développement mobile',
      skill_backend: 'Backend & API',
      skill_frontend: 'Frontend',
      skill_database: 'Bases de données',
      skill_tools: 'Outils & exploitation',
      skill_learning: 'En apprentissage',
      services_eyebrow: 'ACCOMPAGNEMENT',
      services_title: 'Des compétences au service de vos projets.',
      services_intro: 'Développement de solutions, conception d’interfaces et partage de connaissances.',
      service_fullstack: 'Développement full-stack',
      service_fullstack_desc: 'Conception et développement d’applications mobiles et web ainsi que d’API adaptées aux besoins du projet.',
      service_design: 'Accompagnement UI/UX',
      service_design_desc: 'Initiation aux principes de conception d’interfaces et aux outils de prototypage.',
      service_training: 'Formation en programmation',
      service_training_desc: 'Transmission des bases du développement web, de Flutter et de Laravel.',
      experience_eyebrow: 'PARCOURS',
      experience_title: 'Mon parcours professionnel',
      experience_intro: 'Expériences et stages présentés à partir des informations de mon parcours.',
      exp_current_role: 'Développeur full-stack',
      exp_current_desc: 'Participation en équipe au développement de logiciels de gestion et d’applications mobiles pour des clients. Contribution également à des formations en programmation.',
      exp_intern_role: 'Stage professionnel',
      exp_intern_desc: 'Développement d’un logiciel avec Filament, un outil de l’écosystème Laravel.',
      exp_matrix_role: 'Stage académique — Département informatique',
      exp_matrix_desc: 'Participation au développement d’un logiciel de gestion de stock.',
      exp_joz_role: 'Stage académique — Informatique',
      exp_joz_desc: 'Réalisation d’un site web en HTML et CSS.',
      projects_eyebrow: 'SÉLECTION DE PROJETS',
      projects_title: 'Quelques projets que j’ai réalisés',
      projects_intro: 'Des idées transformées en solutions numériques.',
      filter_all: 'Tous les projets',
      filter_mobile: 'Applications mobiles',
      filter_webapp: 'Applications web',
      filter_website: 'Sites web',
      filter_professional: 'Projets professionnels',
      filter_independent: 'Projets indépendants',
      project_link: 'Découvrir le projet',
      project_technologies: 'Technologies du projet',
      project_technologies_unknown: 'Technologies à préciser',
      group_ytech: 'Collaboration YTech',
      group_independent: 'Projet indépendant',
      projects_empty: 'Aucun projet ne correspond à ce filtre.',
      contact_eyebrow: 'CONTACT',
      contact_title: 'Travaillons ensemble',
      contact_intro: 'Vous avez un projet, une opportunité professionnelle ou une idée à concrétiser ? Écrivez-moi.',
      contact_location: 'Ouagadougou, Burkina Faso',
      contact_form_title: 'Envoyer un message',
      form_name: 'Nom',
      form_email: 'Adresse e-mail',
      form_subject: 'Sujet',
      form_message: 'Message',
      form_send: 'Envoyer le message',
      form_sending: 'Envoi en cours…',
      form_success: 'Votre message a bien été envoyé. Merci !',
      form_error: 'Le message n’a pas pu être envoyé. Réessayez ou contactez-moi par e-mail.',
      form_php_notice: 'Le formulaire nécessite un hébergement compatible avec PHP. Vous pouvez aussi m’écrire directement.',
      form_required: 'Ce champ est obligatoire.',
      footer_tagline: 'Je transforme des besoins concrets en solutions numériques.',
      footer_rights: 'Tous droits réservés.',
      details_back: 'Retour aux projets',
      details_overview: 'Présentation',
      details_context: 'Contexte',
      details_category: 'Catégorie',
      details_technologies: 'Technologies',
      details_contribution: 'Contribution',
      details_contribution_note: 'Le détail de ma contribution personnelle reste à préciser.',
      details_gallery: 'Aperçus du projet',
      details_demo: 'Démonstration vidéo',
      details_visit: 'Visiter le projet',
      details_missing: 'Ce projet n’est pas disponible ou ses informations doivent être complétées.',
      details_missing_link: 'Lien non renseigné',
      no_video: 'Aucune démonstration vidéo disponible.',
      tech_unlisted: 'Les technologies propres à ce projet ne sont pas précisées dans les informations disponibles.',
      experience_employer: 'Employeur',
      contact_phone: 'Téléphone',
      contact_email: 'E-mail',
      contact_github: 'GitHub',
      contact_linkedin: 'LinkedIn',
      contact_facebook: 'Facebook',
      contact_whatsapp: 'WhatsApp',
      image_portrait: 'Portrait d’Issiaka Ouédraogo',
      skip_content: 'Aller au contenu'
    },
    en: {
      nav_home: 'Home',
      nav_about: 'About',
      nav_skills: 'Skills',
      nav_services: 'Services',
      nav_experience: 'Experience',
      nav_projects: 'Projects',
      nav_contact: 'Contact',
      nav_resume: 'My background',
      language_label: 'Language',
      hero_eyebrow: 'SOFTWARE ENGINEER · FULL-STACK DEVELOPER',
      hero_title: 'Turning useful ideas into digital products.',
      hero_intro: 'I design and build mobile applications, web platforms, and APIs—from understanding the need through to production.',
      hero_primary: 'Explore my projects',
      hero_secondary: 'My background',
      hero_available: 'Open to opportunities',
      hero_role: 'Flutter · Laravel · REST APIs',
      about_eyebrow: 'ABOUT',
      about_title: 'Designing, building, and evolving practical solutions.',
      about_intro: 'With a computer science background, I work across several layers of a digital product: mobile and web interfaces, business logic, APIs, and data.',
      about_paragraph: 'After studying computer science and entrepreneurship at Burkina Institute of Technology (BIT) from 2020 to 2023, I gained experience through company work and internships in Burkina Faso. I contributed to mobile applications and management software, focusing on requirements, code quality, and reliable solutions.',
      about_location: 'Based in Ouagadougou, Burkina Faso',
      education_title: 'Education',
      education_degree: 'Bachelor’s degree in computer science and entrepreneurship',
      education_school: 'Burkina Institute of Technology (BIT)',
      skills_eyebrow: 'SKILLS',
      skills_title: 'Technical expertise',
      skills_intro: 'Tools selected for each product, with experience centered on Flutter and Laravel.',
      skill_mobile: 'Mobile development',
      skill_backend: 'Backend & APIs',
      skill_frontend: 'Frontend',
      skill_database: 'Databases',
      skill_tools: 'Tools & operations',
      skill_learning: 'Currently learning',
      services_eyebrow: 'HOW I CAN HELP',
      services_title: 'Skills in service of your projects.',
      services_intro: 'Building solutions, designing interfaces, and sharing knowledge.',
      service_fullstack: 'Full-stack development',
      service_fullstack_desc: 'Designing and building mobile and web applications and APIs that fit project needs.',
      service_design: 'UI/UX guidance',
      service_design_desc: 'Introduction to interface design principles and prototyping tools.',
      service_training: 'Programming training',
      service_training_desc: 'Teaching web development fundamentals, Flutter, and Laravel.',
      experience_eyebrow: 'BACKGROUND',
      experience_title: 'Professional experience',
      experience_intro: 'Roles and internships based on the information in my background.',
      exp_current_role: 'Full-stack developer',
      exp_current_desc: 'Worked with the team on management software and mobile applications for clients, and contributed to programming training sessions.',
      exp_intern_role: 'Professional internship',
      exp_intern_desc: 'Developed software using Filament, a tool in the Laravel ecosystem.',
      exp_matrix_role: 'Academic internship — IT department',
      exp_matrix_desc: 'Contributed to the development of inventory management software.',
      exp_joz_role: 'Academic internship — IT',
      exp_joz_desc: 'Built a website using HTML and CSS.',
      projects_eyebrow: 'SELECTED WORK',
      projects_title: 'A selection of projects I have built',
      projects_intro: 'Ideas transformed into digital solutions.',
      filter_all: 'All projects',
      filter_mobile: 'Mobile apps',
      filter_webapp: 'Web applications',
      filter_website: 'Websites',
      filter_professional: 'Professional projects',
      filter_independent: 'Independent projects',
      project_link: 'Explore project',
      project_technologies: 'Project technologies',
      project_technologies_unknown: 'Technologies to confirm',
      group_ytech: 'YTech collaboration',
      group_independent: 'Independent project',
      projects_empty: 'No projects match this filter.',
      contact_eyebrow: 'CONTACT',
      contact_title: 'Let’s work together',
      contact_intro: 'Have a project, a professional opportunity, or an idea to bring to life? Get in touch.',
      contact_location: 'Ouagadougou, Burkina Faso',
      contact_form_title: 'Send a message',
      form_name: 'Name',
      form_email: 'Email address',
      form_subject: 'Subject',
      form_message: 'Message',
      form_send: 'Send message',
      form_sending: 'Sending…',
      form_success: 'Your message has been sent. Thank you!',
      form_error: 'Your message could not be sent. Please try again or email me directly.',
      form_php_notice: 'The form requires PHP-compatible hosting. You can also email me directly.',
      form_required: 'This field is required.',
      footer_tagline: 'I turn practical needs into digital solutions.',
      footer_rights: 'All rights reserved.',
      details_back: 'Back to projects',
      details_overview: 'Overview',
      details_context: 'Context',
      details_category: 'Category',
      details_technologies: 'Technologies',
      details_contribution: 'Contribution',
      details_contribution_note: 'Details of my personal contribution need to be confirmed.',
      details_gallery: 'Project previews',
      details_demo: 'Video demo',
      details_visit: 'Visit project',
      details_missing: 'This project is unavailable or its information needs to be completed.',
      details_missing_link: 'Link not provided',
      no_video: 'No video demo is available.',
      tech_unlisted: 'Project-specific technologies are not specified in the available information.',
      experience_employer: 'Employer',
      contact_phone: 'Phone',
      contact_email: 'Email',
      contact_github: 'GitHub',
      contact_linkedin: 'LinkedIn',
      contact_facebook: 'Facebook',
      contact_whatsapp: 'WhatsApp',
      image_portrait: 'Portrait of Issiaka Ouédraogo',
      skip_content: 'Skip to content'
    }
  };

  function applyTranslations(language) {
    const locale = translations[language] ? language : 'fr';
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-key]').forEach((element) => {
      const key = element.getAttribute('data-key');
      const value = translations[locale][key];
      if (!value) return;

      if (element.matches('input, textarea')) {
        element.setAttribute('placeholder', value);
      } else if (element instanceof HTMLImageElement && key === 'image_portrait') {
        element.alt = value;
      } else {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-language]').forEach((button) => {
      const isActive = button.getAttribute('data-language') === locale;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    window.dispatchEvent(new CustomEvent('portfolio-language-change', {
      detail: { language: locale }
    }));
    return locale;
  }

  window.portfolioTranslations = translations;
  window.applyTranslations = applyTranslations;
  window.changeLanguage = function (language) {
    const locale = translations[language] ? language : 'fr';
    try {
      window.localStorage.setItem('preferredLang', locale);
    } catch (error) {
      console.warn('Language preference could not be saved.', error);
    }
    applyTranslations(locale);
  };

  document.addEventListener('DOMContentLoaded', function () {
    let savedLanguage = 'fr';
    try {
      savedLanguage = window.localStorage.getItem('preferredLang') || 'fr';
    } catch (error) {
      console.warn('Language preference could not be loaded.', error);
    }
    applyTranslations(savedLanguage);
  });
})();
