import type { AppLanguage } from './types';

type Dict = Record<string, string>;

const en: Dict = {
  // Nav
  'nav.home': 'Home',
  'nav.whoWeAre': 'Who We Are',
  'nav.visionMission': 'Vision & Mission',
  'nav.coreValues': 'Core Values',
  'nav.whoWeServe': 'Who We Serve',
  'nav.ourProcess': 'Our Process',
  'nav.whyChooseUs': 'Why Choose Us',
  'nav.mobileApp': 'Mobile App',
  'nav.team': 'Team',
  'nav.leadership': 'Leadership',
  'nav.foundingTeam': 'Founding Team',
  'nav.productDesign': 'Product, Design & Engineering',
  'nav.strategyMarketing': 'Strategy & Marketing',
  'nav.operations': 'Operations',
  'nav.portfolio': 'Portfolio',
  'nav.blog': 'Blog',
  'nav.latestNews': 'Latest News',
  'nav.successStories': 'Success Stories',
  'nav.industryInsights': 'Industry Insights',
  'nav.eventsWebinars': 'Events & Webinars',
  'nav.resources': 'Resources',
  'nav.toolsCalculators': 'Tools & Calculators',
  'nav.guidesEbooks': 'Guides & eBooks',
  'nav.templates': 'Templates',
  'nav.videoRecordings': 'Video Recordings',
  'nav.marketReports': 'Market Reports',
  'nav.contact': 'Contact',
  'nav.sendMessage': 'Send a Message',
  'nav.contactInfo': 'Contact Info',
  'nav.bookConsultation': 'Book Consultation',
  'nav.community': 'Community',
  'nav.signIn': 'Sign In',
  'nav.getStarted': 'Get Started',
  'nav.needConsultation': 'Need Free Consultation?',
  'nav.bookSchedule': 'Book Schedule Now',
  'nav.toggleMenu': 'Toggle menu',
  'lang.select': 'Select language',
  'lang.english': 'ENGLISH',
  'lang.french': 'FRENCH',

  // Hero
  'hero.headlineBefore': 'Building the infrastructure that makes',
  'hero.headlineHighlight': 'smallholder agriculture',
  'hero.headlineInvestable': 'investable',
  'hero.connect': 'CONNECT',
  'hero.improve': 'IMPROVE',
  'hero.and': '&',
  'hero.grow': 'GROW',
  'hero.getInTouch': 'Lync Grower',
  'hero.getStarted': 'Partner with Us',
  'hero.getStartedTooltip': 'For institutions, partners & investors',

  // Footer
  'footer.blurb':
    'Agrilync Nexus is a finance-first, training-led AgriFinTech platform transforming African agriculture through transparent finance, AI advisory, and local agent networks.',
  'footer.disclaimer':
    'Agrilync Nexus is a technology-enabled agricultural platform that connects farmers, agricultural experts, and independent investors. We do not operate as a fund manager, financial institution, or farm operator. Agrilync Nexus does not custody user funds or guarantee investment returns.',
  'footer.contactSupport': 'Contact Support',
  'footer.contactUs': 'Contact us',
  'footer.location': 'Accra, Ghana',
  'footer.trustTitle': 'Trust & Compliance',
  'footer.trust1': 'Registered business entity',
  'footer.trust2': 'Secure payment processing',
  'footer.trust3': 'Data protection compliant',
  'footer.trust4': 'Encrypted platform security',
  'footer.trust5': 'Transparent reporting',
  'footer.trust6': 'Independent verification',
  'footer.trust7': 'Safeguarding policy in place',
  'footer.legalTitle': 'Legal Links',
  'footer.safeguarding': 'Safeguarding Policy',
  'footer.terms': 'Terms of Service',
  'footer.privacy': 'Privacy Policy',
  'footer.risk': 'Risk Disclosure',
  'footer.refund': 'Refund Policy',
  'footer.community': 'Community',
  'footer.subscribe': 'Subscribe',
  'footer.subscribeBlurb': 'Stay updated with agricultural insights and news.',
  'footer.subscribed': 'Successfully subscribed!',
  'footer.emailPlaceholder': 'Your email',
  'footer.subscribing': 'Subscribing...',
  'footer.subscribeBtn': 'Subscribe',
  'footer.rights': '© 2026 Agrilync Nexus. All rights reserved.',
  'footer.joinWhatsapp': 'Join our WhatsApp Community',

  // Support widget
  'support.title': 'AgriLync Nexus Support',
  'support.intro':
    "Hello! Welcome to AgriLync Nexus, your finance-first agri platform. I'm here to help.",
  'support.chat': 'Chat with us',
  'support.aria': 'Contact AgriLync Nexus support',
  'support.dismiss': 'Dismiss message',
  'support.whatsappPrefill': 'Hello AgriLync Nexus, I need support.',

  // Home — innovation / challenge / services
  'home.our': 'Our',
  'home.innovation': 'Innovation',
  'home.innovationP1':
    'Agrilync Nexus provides a finance-first, training-led platform that connects smallholder farmers and investors/partners, supported by AI advisory and local agent operations.',
  'home.innovationP2':
    'By empowering farmers, investors, and field agents with reliable information and capital, we turn agricultural gaps into stable income and de-risked investments.',
  'home.challengeLabel': 'THE CHALLENGE',
  'home.challengeTitle': 'The Challenge',
  'home.challengeBody':
    'Farmers are not crying without reason. They need timely access to the right information to boost productivity, ready markets immediately after harvest to reduce post-harvest losses, and most importantly, flexible financing and investor partnerships to scale and improve yield.',
  'home.expertise': 'Our Expertise',
  'home.expertiseTitle': 'Everything you need to',
  'home.expertiseHighlight': 'succeed with us',
  'home.expertiseSide':
    "We combine deep-rooted farming tradition with the world's most advanced intelligence to empower the hands that feed the nation.",
  'home.coreProduct': 'Core Product',
  'home.farmPartner': 'FarmPartner Initiative',
  'home.farmPartnerDesc':
    'Structured farm investment products where investors and partner organizations fund verified Lync Growers while receiving continuous visibility.',
  'home.learnMore': 'Learn More',
  'home.aiAdvisory': 'AI Advisory Agent',
  'home.aiAdvisoryDesc':
    "AI-powered crop and livestock advisory aligned with each farm project's plan, guidance on best practices, and risk mitigation.",
  'home.getAdvisory': 'Get Advisory',
  'home.lyncAgents': 'Lync Agents',
  'home.lyncAgentsDesc':
    'Lync Agents onboard farmers, collect baseline data, and provide regular visits to ensure ground truth and accountability for Lync Growers and investors.',
  'home.becomeAgent': 'Become a Lync Agent',

  // Impact
  'impact.titleThe': 'The ',
  'impact.titleImpact': 'Impact',
  'impact.p1a': 'Sarah spent',
  'impact.p1b': 'months growing her vegetables',
  'impact.p1c':
    ". But once they're picked, the real race begins. Without a way to connect with the right",
  'impact.p1d': 'investors and buyers',
  'impact.p1e':
    ', even her best harvest can go to waste before it reaches the market.',
  'impact.p2a': "It's the same for",
  'impact.p2b': 'farmers like Emmanuel',
  'impact.p2c': ". His hard work is valuable in cattle rearing, but without",
  'impact.p2d': 'timely health data and field support',
  'impact.p2e':
    ", his livestock's health or growth potential could be compromised.",
  'impact.meet': 'Meet {name}, {age}',
  'impact.stat.farmers': 'Pilot Farmers',
  'impact.stat.farmersDesc': 'Across 7 regions in Ghana',
  'impact.stat.income': 'Income Growth',
  'impact.stat.incomeDesc': 'Average annual increase',
  'impact.stat.engagement': 'Engagement',
  'impact.stat.engagementDesc': 'WhatsApp community active',
  'impact.stat.webinars': 'Webinars',
  'impact.stat.webinarsDesc': 'Training sessions delivered',
  'impact.stat.waitlist': 'Waitlist',
  'impact.stat.waitlistDesc': 'Organic platform signups',
  'impact.stat.consultations': 'Consultations',
  'impact.stat.consultationsDesc': 'One-on-one expert sessions',
  'impact.sdgTitle': 'Our SDG Commitments',
  'impact.sdgBlurb':
    'Aligning AgriLync Nexus with the UN Sustainable Development Goals that matter most to smallholder farmers.',
  'impact.sdg1': 'NO POVERTY',
  'impact.sdg2': 'ZERO HUNGER',
  'impact.sdg5': 'GENDER EQUALITY',
  'impact.sdg13': 'CLIMATE ACTION',
  'impact.sdg17': 'PARTNERSHIPS FOR THE GOALS',

  // FarmPartner section
  'packages.label': 'FarmPartner Initiative',
  'packages.title': 'Fund Real',
  'packages.titleHighlight': 'Farm Production',
  'packages.blurb':
    'Connecting verified smallholder farmers with partners who want to invest with clarity and control.',
  'packages.banner1':
    'The Agrilync Nexus FarmPartner Initiative connects verified smallholder farmers with partners who want to fund real farm production in a structured, transparent way.',
  'packages.banner2':
    'We manage farmer verification, training, field monitoring, AI advisory, milestone-based disbursement, and harvest reporting so partners can invest with absolute clarity and control.',
  'packages.bannerTag':
    'Connecting verified smallholder farmers with partners to fund real farm production.',
  'packages.cta': 'Partner With Us',
  'packages.tap': 'Tap to explore initiative',
  'packages.whatsapp':
    'Hello Agrilync, I am interested in the FarmPartner Initiative.',

  // Success stories
  'stories.reviews': 'Reviews',
  'stories.titleBefore': 'Hear What Our',
  'stories.clients': 'Clients',
  'stories.titleAfter': 'Say About Us',
  'stories.blurb':
    'Experience transformative agricultural journeys with AgriLync Nexus, revolutionizing farming experiences using advanced AI technology and seamless investor connections.',
  'stories.viewAll': 'View All Reviews',
  'stories.featuredRole': 'Cattle Livestock Farmer, Ashanti Region',
  'stories.featuredQuote': '"Health data for my livestock is vital"',
  'stories.featuredBody':
    '"Securing funding for my cattle ranch was a challenge until AgriLync Nexus. Now, I have the field support and health data needed to ensure my livestock thrives. The transformation has been incredible."',
  'stories.s1.role': 'Vegetable Farmer',
  'stories.s1.title': 'Transformed our daily operations',
  'stories.s1.feedback':
    'Agrilync Nexus changed the game for me. I no longer worry about my vegetables going to waste; the AI insights and investor matches as a Lync Grower have given my farm a new lease on life.',
  'stories.s2.role': 'Maize Farmer',
  'stories.s2.title': 'AI & field support and accountability',
  'stories.s2.feedback':
    'The AI crop consultation saved my maize harvest from a pest outbreak. The advice was timely, accurate, and easy to follow. The system is intuitive and support is always responsive.',

  // Team
  'team.label': 'Leadership',
  'team.title': 'Meet the people behind',
  'team.viewFull': 'View full team',

  // FAQ
  'faq.label': 'FAQ',
  'faq.title': 'Frequently Asked',
  'faq.titleHighlight': 'Questions?',
  'faq.blurb':
    'Discover how AgriLync Nexus is bridging the gap in agricultural finance, offering effective, secure solutions for everyone involved.',
  'faq.contactCta': 'Still have questions? Contact us',
  'faq.q1': 'How does AgriLync Nexus ensure the safety of my investment?',
  'faq.a1':
    'We employ a rigorous vetting process for all farmers and implement strict monitoring protocols. Additionally, we work with insurance partners to provide coverage for crops against unforeseen weather events and pests.',
  'faq.q2': 'How accurate is the AI crop consultation?',
  'faq.a2':
    'Our AI model is trained on a vast database of plant pathology and continuously updated by agricultural experts. It currently boasts a 95% accuracy rate in early disease detection, though we always recommend verifying with our human experts for critical issues.',
  'faq.q3': 'Can I choose which specific farm to invest in?',
  'faq.a3':
    'Yes! Our platform provides detailed profiles for each farm, including their crop history, risk assessment, and projected yield. You can browse and select the partnerships that align with your financial goals and values.',
  'faq.q4': 'Is AgriLync Nexus available to small-scale farmers?',
  'faq.a4':
    'Absolutely. Our core mission is to empower smallholder farmers. The platform is designed to be accessible even on basic smartphones, and we have local agents to assist farmers with limited digital literacy.',
  'faq.q5': 'What is the minimum amount required to start investing?',
  'faq.a5':
    'We believe in democratizing agricultural investment. You can start supporting a farm with as little as GHS 500. We offer various tiers to suit different investment capacities.',
  'faq.q6': 'Do you support livestock farming as well?',
  'faq.a6':
    'Yes! We support livestock sectors including poultry and small ruminants. Our health monitoring protocols are adapted to ensure animal welfare and secure returns for investors.',

  // Safeguarding
  'safe.label': 'Safeguarding',
  'safe.title': 'Safety, dignity, and wellbeing, always',
  'safe.blurb':
    'Agrilync Nexus is committed to protecting every farmer, family, and community we work with, from farm visits to the stories we share.',
  'safe.cta': 'Read our Safeguarding Policy',
  'safe.h1': 'Informed consent before any photo, video, or story is shared',
  'safe.h2':
    'Extra precautions to protect children during farm and community activities',
  'safe.h3': 'Equal respect and dignity for every farmer, agent, and partner',
  'safe.h4':
    'Confidential reporting, no impact on your access to our services',
  'safe.report': 'To report a concern:',
};

const fr: Dict = {
  'nav.home': 'Accueil',
  'nav.whoWeAre': 'Qui nous sommes',
  'nav.visionMission': 'Vision & Mission',
  'nav.coreValues': 'Valeurs fondamentales',
  'nav.whoWeServe': 'Qui nous servons',
  'nav.ourProcess': 'Notre processus',
  'nav.whyChooseUs': 'Pourquoi nous choisir',
  'nav.mobileApp': 'Application mobile',
  'nav.team': 'Équipe',
  'nav.leadership': 'Direction',
  'nav.foundingTeam': 'Équipe fondatrice',
  'nav.productDesign': 'Produit, Design & Ingénierie',
  'nav.strategyMarketing': 'Stratégie & Marketing',
  'nav.operations': 'Opérations',
  'nav.portfolio': 'Portfolio',
  'nav.blog': 'Blog',
  'nav.latestNews': 'Dernières actualités',
  'nav.successStories': 'Histoires de succès',
  'nav.industryInsights': 'Perspectives du secteur',
  'nav.eventsWebinars': 'Événements & Webinaires',
  'nav.resources': 'Ressources',
  'nav.toolsCalculators': 'Outils & Calculateurs',
  'nav.guidesEbooks': 'Guides & eBooks',
  'nav.templates': 'Modèles',
  'nav.videoRecordings': 'Enregistrements vidéo',
  'nav.marketReports': 'Rapports de marché',
  'nav.contact': 'Contact',
  'nav.sendMessage': 'Envoyer un message',
  'nav.contactInfo': 'Coordonnées',
  'nav.bookConsultation': 'Réserver une consultation',
  'nav.community': 'Communauté',
  'nav.signIn': 'Connexion',
  'nav.getStarted': 'Commencer',
  'nav.needConsultation': 'Besoin d’une consultation gratuite?',
  'nav.bookSchedule': 'Réserver maintenant',
  'nav.toggleMenu': 'Ouvrir le menu',
  'lang.select': 'Choisir la langue',
  'lang.english': 'ANGLAIS',
  'lang.french': 'FRANÇAIS',

  'hero.headlineBefore': 'Construire l’infrastructure qui rend',
  'hero.headlineHighlight': 'l’agriculture des petits producteurs',
  'hero.headlineInvestable': 'investissable',
  'hero.connect': 'CONNECTER',
  'hero.improve': 'AMÉLIORER',
  'hero.and': '&',
  'hero.grow': 'CROÎTRE',
  'hero.getInTouch': 'Lync Grower',
  'hero.getStarted': 'Collaborez avec nous',
  'hero.getStartedTooltip': 'Pour les institutions, partenaires et investisseurs',

  'footer.blurb':
    'Agrilync Nexus est une plateforme AgriFinTech axée sur la finance et la formation, qui transforme l’agriculture africaine grâce à une finance transparente, des conseils IA et des réseaux d’agents locaux.',
  'footer.disclaimer':
    'Agrilync Nexus est une plateforme agricole technologique qui connecte agriculteurs, experts agricoles et investisseurs indépendants. Nous n’agissons pas en tant que gestionnaire de fonds, institution financière ou exploitant agricole. Agrilync Nexus ne conserve pas les fonds des utilisateurs et ne garantit pas de rendements.',
  'footer.contactSupport': 'Support contact',
  'footer.contactUs': 'Nous contacter',
  'footer.location': 'Accra, Ghana',
  'footer.trustTitle': 'Confiance & Conformité',
  'footer.trust1': 'Entreprise enregistrée',
  'footer.trust2': 'Paiements sécurisés',
  'footer.trust3': 'Conformité à la protection des données',
  'footer.trust4': 'Sécurité chiffrée de la plateforme',
  'footer.trust5': 'Rapports transparents',
  'footer.trust6': 'Vérification indépendante',
  'footer.trust7': 'Politique de protection en place',
  'footer.legalTitle': 'Liens juridiques',
  'footer.safeguarding': 'Politique de protection',
  'footer.terms': 'Conditions d’utilisation',
  'footer.privacy': 'Politique de confidentialité',
  'footer.risk': 'Divulgation des risques',
  'footer.refund': 'Politique de remboursement',
  'footer.community': 'Communauté',
  'footer.subscribe': 'S’abonner',
  'footer.subscribeBlurb':
    'Restez informé des actualités et insights agricoles.',
  'footer.subscribed': 'Abonnement réussi!',
  'footer.emailPlaceholder': 'Votre e-mail',
  'footer.subscribing': 'Abonnement...',
  'footer.subscribeBtn': 'S’abonner',
  'footer.rights': '© 2026 Agrilync Nexus. Tous droits réservés.',
  'footer.joinWhatsapp': 'Rejoindre notre communauté WhatsApp',

  'support.title': 'Support AgriLync Nexus',
  'support.intro':
    'Bonjour! Bienvenue sur AgriLync Nexus, votre plateforme agricole axée sur la finance. Je suis là pour vous aider.',
  'support.chat': 'Discuter avec nous',
  'support.aria': 'Contacter le support AgriLync Nexus',
  'support.dismiss': 'Fermer le message',
  'support.whatsappPrefill': 'Bonjour AgriLync Nexus, j’ai besoin d’aide.',

  'home.our': 'Notre',
  'home.innovation': 'Innovation',
  'home.innovationP1':
    'Agrilync Nexus propose une plateforme axée sur la finance et la formation qui connecte les petits agriculteurs et les investisseurs/partenaires, avec le soutien de conseils IA et d’agents locaux.',
  'home.innovationP2':
    'En donnant aux agriculteurs, investisseurs et agents de terrain des informations fiables et du capital, nous transformons les lacunes agricoles en revenus stables et en investissements moins risqués.',
  'home.challengeLabel': 'LE DÉFI',
  'home.challengeTitle': 'Le Défi',
  'home.challengeBody':
    'Les agriculteurs ne crient pas sans raison. Ils ont besoin d’un accès rapide à la bonne information pour booster la productivité, de marchés prêts juste après la récolte pour réduire les pertes, et surtout d’un financement flexible et de partenariats investisseurs pour évoluer et améliorer les rendements.',
  'home.expertise': 'Notre expertise',
  'home.expertiseTitle': 'Tout ce dont vous avez besoin pour',
  'home.expertiseHighlight': 'réussir avec nous',
  'home.expertiseSide':
    'Nous allions la tradition agricole profondément enracinée à l’intelligence la plus avancée pour renforcer les mains qui nourrissent la nation.',
  'home.coreProduct': 'Produit phare',
  'home.farmPartner': 'Initiative FarmPartner',
  'home.farmPartnerDesc':
    'Produits d’investissement agricole structurés où investisseurs et organisations partenaires financent des Lync Growers vérifiés tout en bénéficiant d’une visibilité continue.',
  'home.learnMore': 'En savoir plus',
  'home.aiAdvisory': 'Agent de conseil IA',
  'home.aiAdvisoryDesc':
    'Conseils IA cultures et élevage alignés sur le plan de chaque projet agricole, bonnes pratiques et atténuation des risques.',
  'home.getAdvisory': 'Obtenir un conseil',
  'home.lyncAgents': 'Agents Lync',
  'home.lyncAgentsDesc':
    'Les agents Lync intègrent les agriculteurs, collectent les données de base et effectuent des visites régulières pour assurer la véracité terrain et la responsabilité envers les Lync Growers et les investisseurs.',
  'home.becomeAgent': 'Devenir agent Lync',

  'impact.titleThe': 'L’',
  'impact.titleImpact': 'Impact',
  'impact.p1a': 'Sarah a passé',
  'impact.p1b': 'des mois à cultiver ses légumes',
  'impact.p1c':
    '. Mais une fois récoltés, la vraie course commence. Sans moyen de se connecter aux bons',
  'impact.p1d': 'investisseurs et acheteurs',
  'impact.p1e':
    ', même sa meilleure récolte peut se perdre avant d’atteindre le marché.',
  'impact.p2a': 'C’est la même chose pour',
  'impact.p2b': 'des agriculteurs comme Emmanuel',
  'impact.p2c':
    '. Son travail a de la valeur en élevage bovin, mais sans',
  'impact.p2d': 'données sanitaires et soutien terrain à temps',
  'impact.p2e':
    ', la santé ou le potentiel de croissance de son bétail peut être compromis.',
  'impact.meet': 'Rencontrez {name}, {age}',
  'impact.stat.farmers': 'Agriculteurs pilotes',
  'impact.stat.farmersDesc': 'Dans 7 régions du Ghana',
  'impact.stat.income': 'Croissance des revenus',
  'impact.stat.incomeDesc': 'Augmentation annuelle moyenne',
  'impact.stat.engagement': 'Engagement',
  'impact.stat.engagementDesc': 'Communauté WhatsApp active',
  'impact.stat.webinars': 'Webinaires',
  'impact.stat.webinarsDesc': 'Sessions de formation livrées',
  'impact.stat.waitlist': 'Liste d’attente',
  'impact.stat.waitlistDesc': 'Inscriptions organiques',
  'impact.stat.consultations': 'Consultations',
  'impact.stat.consultationsDesc': 'Sessions individuelles avec experts',
  'impact.sdgTitle': 'Nos engagements ODD',
  'impact.sdgBlurb':
    'Aligner AgriLync Nexus sur les Objectifs de développement durable de l’ONU les plus importants pour les petits agriculteurs.',
  'impact.sdg1': 'PAS DE PAUVRETÉ',
  'impact.sdg2': 'FAIM ZÉRO',
  'impact.sdg5': 'ÉGALITÉ DES SEXES',
  'impact.sdg13': 'MESURES CLIMATIQUES',
  'impact.sdg17': 'PARTENARIATS POUR LES OBJECTIFS',

  'packages.label': 'Initiative FarmPartner',
  'packages.title': 'Financer une vraie',
  'packages.titleHighlight': 'production agricole',
  'packages.blurb':
    'Connecter des petits agriculteurs vérifiés avec des partenaires qui veulent investir avec clarté et contrôle.',
  'packages.banner1':
    'L’initiative FarmPartner d’Agrilync Nexus connecte des petits agriculteurs vérifiés avec des partenaires qui veulent financer une vraie production agricole de façon structurée et transparente.',
  'packages.banner2':
    'Nous gérons la vérification des agriculteurs, la formation, le suivi terrain, les conseils IA, les décaissements par jalons et les rapports de récolte pour que les partenaires investissent en toute clarté.',
  'packages.bannerTag':
    'Connecter des petits agriculteurs vérifiés avec des partenaires pour financer une vraie production agricole.',
  'packages.cta': 'Devenir partenaire',
  'packages.tap': 'Appuyez pour explorer',
  'packages.whatsapp':
    'Bonjour Agrilync, je suis intéressé(e) par l’initiative FarmPartner.',

  'stories.reviews': 'Avis',
  'stories.titleBefore': 'Ce que nos',
  'stories.clients': 'Clients',
  'stories.titleAfter': 'disent de nous',
  'stories.blurb':
    'Découvrez des parcours agricoles transformateurs avec AgriLync Nexus, qui révolutionne l’expérience agricole grâce à l’IA avancée et des connexions investisseurs fluides.',
  'stories.viewAll': 'Voir tous les avis',
  'stories.featuredRole': 'Éleveur de bétail, Région Ashanti',
  'stories.featuredQuote': '"Les données sanitaires de mon bétail sont vitales"',
  'stories.featuredBody':
    '"Obtenir un financement pour mon élevage était un défi jusqu’à AgriLync Nexus. Aujourd’hui, j’ai le soutien terrain et les données sanitaires pour que mon bétail prospère. La transformation a été incroyable."',
  'stories.s1.role': 'Productrice de légumes',
  'stories.s1.title': 'A transformé nos opérations quotidiennes',
  'stories.s1.feedback':
    'Agrilync Nexus a changé la donne pour moi. Je ne m’inquiète plus que mes légumes se perdent; les insights IA et les mises en relation investisseurs en tant que Lync Grower ont donné une nouvelle vie à ma ferme.',
  'stories.s2.role': 'Producteur de maïs',
  'stories.s2.title': 'IA, soutien terrain et responsabilité',
  'stories.s2.feedback':
    'La consultation IA a sauvé ma récolte de maïs d’une infestation. Les conseils étaient opportuns, précis et faciles à suivre. Le système est intuitif et le support toujours réactif.',

  'team.label': 'Direction',
  'team.title': 'Rencontrez les personnes derrière',
  'team.viewFull': 'Voir toute l’équipe',

  'faq.label': 'FAQ',
  'faq.title': 'Questions',
  'faq.titleHighlight': 'fréquentes?',
  'faq.blurb':
    'Découvrez comment AgriLync Nexus comble le fossé du financement agricole, avec des solutions efficaces et sécurisées pour tous.',
  'faq.contactCta': 'Encore des questions? Contactez-nous',
  'faq.q1': 'Comment AgriLync Nexus assure-t-il la sécurité de mon investissement?',
  'faq.a1':
    'Nous appliquons un processus rigoureux de vérification des agriculteurs et des protocoles de suivi stricts. Nous travaillons aussi avec des partenaires d’assurance pour couvrir les cultures contre les aléas climatiques et les ravageurs.',
  'faq.q2': 'Quelle est la précision du conseil IA sur les cultures?',
  'faq.a2':
    'Notre modèle IA est formé sur une vaste base de pathologie végétale et mis à jour en continu par des experts agricoles. Il affiche actuellement 95% de précision en détection précoce des maladies; nous recommandons toujours de vérifier avec nos experts humains pour les enjeux critiques.',
  'faq.q3': 'Puis-je choisir la ferme dans laquelle investir?',
  'faq.a3':
    'Oui! Notre plateforme propose des profils détaillés pour chaque ferme, y compris l’historique des cultures, l’évaluation des risques et le rendement projeté. Vous pouvez parcourir et choisir les partenariats alignés sur vos objectifs.',
  'faq.q4': 'AgriLync Nexus est-il accessible aux petits agriculteurs?',
  'faq.a4':
    'Absolument. Notre mission centrale est d’autonomiser les petits agriculteurs. La plateforme est conçue pour fonctionner même sur des smartphones basiques, et des agents locaux aident ceux qui ont une littératie numérique limitée.',
  'faq.q5': 'Quel est le montant minimum pour commencer à investir?',
  'faq.a5':
    'Nous croyons à la démocratisation de l’investissement agricole. Vous pouvez soutenir une ferme à partir de 500 GHS. Nous proposons différents niveaux selon les capacités d’investissement.',
  'faq.q6': 'Soutenez-vous aussi l’élevage?',
  'faq.a6':
    'Oui! Nous soutenons l’élevage, notamment la volaille et les petits ruminants. Nos protocoles de suivi sanitaire sont adaptés pour le bien-être animal et la sécurité des investisseurs.',

  'safe.label': 'Protection',
  'safe.title': 'Sécurité, dignité et bien-être, toujours',
  'safe.blurb':
    'Agrilync Nexus s’engage à protéger chaque agriculteur, famille et communauté avec lesquels nous travaillons, des visites de ferme aux histoires que nous partageons.',
  'safe.cta': 'Lire notre politique de protection',
  'safe.h1':
    'Consentement éclairé avant tout partage de photo, vidéo ou histoire',
  'safe.h2':
    'Précautions supplémentaires pour protéger les enfants lors des activités agricoles et communautaires',
  'safe.h3':
    'Respect et dignité égaux pour chaque agriculteur, agent et partenaire',
  'safe.h4':
    'Signalement confidentiel, sans impact sur votre accès à nos services',
  'safe.report': 'Pour signaler un problème:',
};

const dictionaries: Record<AppLanguage, Dict> = { en, fr };

export function translate(
  lang: AppLanguage,
  key: string,
  vars?: Record<string, string | number>
): string {
  const raw = dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    raw
  );
}

export { en, fr };
