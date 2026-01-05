export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    initials: string;
    description: string;
    longBio?: string;
    socials?: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
    };
    isCEO?: boolean;
    imagePosition?: string;
    borderColor?: string;
    scale?: number;
    expertise?: string[];
}

export const leadership: TeamMember = {
    id: 'congo-musah-adama',
    name: 'Congo Musah Adama',
    role: 'CEO and Founder',
    image: '/lovable-uploads/f.jpg',
    initials: 'CA',
    isCEO: true,
    description: 'Technical leadership, backend architecture, AI integration, strategic vision, and cross-department coordination.',
    longBio: `Congo is the driving force behind AgriLync’s vision and execution, leading operations across all cross-platform and departmental functions. As a software engineer and agricultural change agent, he ensures our technology is deeply aligned with real field needs, while also providing hands-on consultation and guidance to farmers.

Beyond product development, he actively manages our farming communities and coordinates overall departmental activities, bridging technology, operations, and grassroots engagement to build solutions that truly work for farmers. His leadership, clarity of purpose, and commitment to impact continue to shape AgriLync’s growth journey.`,
    socials: {
        twitter: 'https://x.com/1real_vee',
        linkedin: 'https://www.linkedin.com/in/congo-musah-ad-deen-766bb3224/'
    },
    expertise: ['Software Engineering', 'Full Stack Development', 'Strategic Leadership', 'Agricultural Innovation', 'AI Integration'],
    imagePosition: 'center 20%',
    borderColor: 'border-[#0EA5E9]'
};

export const coFounders: TeamMember[] = [
    {
        id: 'takyi-robert',
        name: 'Takyi Robert',
        role: 'Co-Founder (Finance & Partnerships)',
        image: '/lovable-uploads/robert.jpg',
        initials: 'TR',
        description: 'Finance, partnerships, investor relations, financial planning, and strategic collaborations.',
        longBio: `As Co-Founder overseeing Finance and Partnerships, Robert brings a strategic edge to AgriLync's growth. He specializes in building robust financial frameworks and securing high-value partnerships that drive sustainability and expansion.

Robert's expertise ensures that AgriLync not only innovates technologically but also thrives economically. He manages investor relations, financial planning, and the cultivation of strategic alliances that extend the organization's reach and impact. His work is pivotal in creating a stable and scalable foundation for the company's ambitious goals.`,
        imagePosition: 'center',
        scale: 1.15,
        expertise: ['Financial Analysis', 'Strategic Partnerships', 'Investor Relations', 'Corporate Finance', 'Business Strategy'],
        borderColor: 'border-[#22c55e]'
    },
    {
        id: 'agbenyenu-sedem-prince',
        name: 'Agbenyenu Sedem Prince',
        role: 'Co-Founder (CTO)',
        image: '/lovable-uploads/prince-sedem.jpg',
        initials: 'AP',
        description: 'Software development, product management, technical execution, and cross-team coordination.',
        longBio: `Sedem, as Chief Technology Officer, is the driving force behind AgriLync's technical excellence. He combines deep software engineering knowledge with product leadership to deliver reliable and scalable platforms.

His role involves overseeing the entire software development lifecycle, from architectural decisions to deployment. Sedem ensures that the technical vision aligns with business objectives, fostering a culture of innovation and precision within the engineering team. He is passionate about building systems that are not just functional but transformative for the user.`,
        socials: {
            instagram: 'https://www.instagram.com/prinzsedem/?hl=en',
            twitter: 'https://x.com/PrinzSedem'
        },
        expertise: ['Software Architecture', 'Technical Leadership', 'Product Management', 'Full Stack Development', 'System Design'],
        borderColor: 'border-[#f97316]'
    },
    {
        id: 'boah-samuel',
        name: 'Boah Samuel',
        role: 'Co-Founder (Product Experience)',
        image: '/lovable-uploads/boahsamuel.jpg',
        initials: 'BS',
        description: 'User experience direction, product consistency, and inclusive interface design across platforms.',
        longBio: `Samuel leads Product Experience with a focus on creating intuitive and inclusive designs. He believes that technology should be accessible to everyone, regardless of their digital literacy.

By championing user-centric design principles, Samuel ensures that AgriLync's products are not only aesthetically pleasing but also highly functional for farmers and stakeholders alike. He oversees the product roadmap, ensuring consistency across all platforms and advocating for the user at every stage of the development process.`,
        imagePosition: 'center 20%',
        socials: {
            linkedin: 'https://www.linkedin.com/in/samuel-boah',
            instagram: 'https://www.instagram.com/gentle___sammy?igsh=aTl6ZTJ0ZjIxaWo4&utm_source=qr'
        },
        expertise: ['Product Strategy', 'User Experience Design (UX)', 'Product Lifecycle Management', 'User Research', 'Design Thinking'],
        borderColor: 'border-[#eab308]'
    }
];

export const productTeam: TeamMember[] = [
    {
        id: 'osei-prince',
        name: 'Osei Prince',
        role: 'UI/UX & Product Design Lead',
        image: '/lovable-uploads/princeosei.jpg',
        initials: 'OP',
        description: 'Product design, user experience, design standards, and interface consistency.',
        longBio: `Prince leads the UI/UX & Product Design team, crafting visual systems that define the AgriLync brand. His expertise lies in translating complex requirements into clean, engaging, and easy-to-use interfaces.

He focuses on maintaining design consistency and high standards across all user touchpoints. Prince creates the visual language that guides users through the platform, ensuring a seamless and enjoyable experience that enhances engagement and satisfaction.`,
        socials: {
            instagram: 'https://www.instagram.com/prince.ui.ux/',
            linkedin: 'https://www.linkedin.com/in/prince-osei-597605207/'
        },
        expertise: ['UI/UX Design', 'Visual Prototyping', 'Design Systems', 'User Interface Design', 'Interactive Design'],
        borderColor: 'border-[#a855f7]'
    },
    {
        id: 'cecil-odonkor',
        name: 'Cecil Odonkor',
        role: 'UI/UX Designer & Frontend Support',
        image: '/lovable-uploads/cecilodonkoh.jpg',
        initials: 'CO',
        description: 'Interface design, frontend development, responsive design, and user-friendly interaction.',
        longBio: `Cecil bridges the gap between design and development as a UI/UX Designer and Frontend Support. He ensures that the beautiful designs created are faithfully implemented in code.

With a strong eye for detail and proficiency in modern frontend technologies, Cecil contributes to building responsive and accessible interfaces. He works closely with the development team to ensure that the user interface is robust, performant, and true to the design vision.`,
        socials: {
            linkedin: 'https://www.linkedin.com/in/cecil-odonkor-559650266?trk=contact-info',
            twitter: 'https://x.com/terminator7845?s=21'
        },
        expertise: ['Frontend Development', 'Responsive Web Design', 'User Interface Engineering', 'React Development', 'Web Accessibility'],
        borderColor: 'border-[#14b8a6]'
    },
    {
        id: 'kwaku-essah',
        name: 'Kwaku Essah',
        role: 'Backend Developer & AI Support',
        image: '/lovable-uploads/kwakuessah.jpg',
        initials: 'KE',
        description: 'Backend systems, APIs, AI integration, system security, and data processing.',
        longBio: `Kwaku is a critical asset to the engineering team, specializing in Backend Development and AI Support. He builds the powerful engines that drive AgriLync's data processing and intelligent features.

His work focuses on creating secure, efficient APIs and integrating AI models that provide actionable insights to users. Kwaku ensures that the system's infrastructure is reliable, secure, and capable of handling the complex data flows essential for modern agricultural management.`,
        socials: {
            linkedin: 'https://www.linkedin.com/in/kwaku-essah',
            twitter: 'https://x.com/hexstories_'
        },
        imagePosition: 'center 0%',
        scale: 1.08,
        expertise: ['Backend Development', 'API Engineering', 'Database Management', 'AI Integration', 'System Security'],
        borderColor: 'border-[#ec4899]'
    }
];

export const marketingTeam: TeamMember[] = [
    {
        id: 'kwagbedzi-dela',
        name: 'Kwagbedzi Dela',
        role: 'Marketing & Partnership Lead',
        image: '/lovable-uploads/dela.jpg',
        initials: 'KD',
        description: 'Marketing strategy, brand communication, partnership development, and business growth.',
        longBio: `Dela spearheads AgriLync's marketing and partnership initiatives, driving brand awareness and strategic growth. He is an expert in crafting compelling narratives that resonate with diverse audiences.

His strategic approach helps position AgriLync as a leader in the agritech space. Dela identifies and nurtures key partnerships, develops comprehensive marketing campaigns, and ensures that the company's value proposition is clearly communicated to stakeholders and customers.`,
        socials: {
            linkedin: 'https://www.linkedin.com/public-profile/settings',
            facebook: 'https://www.facebook.com/share/1CuccL8ABV/?mibextid=wwXIfr'
        },
        expertise: ['Strategic Marketing', 'Brand Management', 'Market Research', 'Partnership Development', 'Digital Strategy'],
        borderColor: 'border-[#f43f5e]'
    },
    {
        id: 'adzah-isabella',
        name: 'Adzah Isabella',
        role: 'Sales & Content Support',
        image: '/lovable-uploads/isabel.jpg',
        initials: 'AI',
        description: 'Sales initiatives, content creation, community engagement, and partnership activations.',
        longBio: `Isabella plays a vital role in supporting sales and content strategy. She is a creative force who develops engaging content that connects with the community and drives interest.

Her work involves supporting sales initiatives through targeted content and engagement strategies. Isabella helps to build a vibrant community around the brand, fostering relationships and ensuring that customer interactions are positive and meaningful.`,
        socials: {
            instagram: 'https://www.instagram.com/itz_lil_anaaaa?igsh=MWQ0c3pjajZ0aTk2aA%3D%3D&utm_source=qr'
        },
        expertise: ['Sales Strategy', 'Content Creation', 'Digital Marketing', 'Customer Relationship Management', 'Social Media Marketing'],
        borderColor: 'border-[#8b5cf6]'
    },
    {
        id: 'vorlashie-raphael',
        name: 'Vorlashie Raphael',
        role: 'Communications Lead',
        image: '/lovable-uploads/mawuli.jpg',
        initials: 'VR',
        description: 'Public relations, internal communication, media content, and brand visibility.',
        longBio: `Raphael leads Communications, ensuring that AgriLync's voice is consistent, clear, and impactful. He manages public relations and internal communications to maintain brand integrity.

He is responsible for media content and visibility strategies that enhance the company's reputation. Raphael's work ensures that all communications align with the company's mission and values, effectively telling the AgriLync story to the world.`,
        socials: {
            linkedin: 'https://www.linkedin.com/in/raphaelvorlash',
            facebook: 'https://www.facebook.com/share/1BfjDGjJnt/',
            instagram: 'https://www.instagram.com/raphaelvorlash_mawuli?igsh=MTBxajk4aGlscTdlMw=='
        },
        expertise: ['Public Relations', 'Corporate Communications', 'Content Strategy', 'Media Relations', 'Brand Storytelling'],
        borderColor: 'border-[#3b82f6]'
    }
];

export const operationsTeam: TeamMember[] = [
    {
        id: 'wontumi-gabriel-oti',
        name: 'Wontumi Gabriel Oti',
        role: 'Field Operations Lead',
        image: '/lovable-uploads/wontumi.jpg',
        initials: 'WG',
        description: 'Community engagement, field agents, farmer onboarding, and regional operations.',
        longBio: `Gabriel is the boots-on-the-ground leader for Field Operations. He ensures that AgriLync's impact is felt directly in the farming communities served by maintaining seamless operations.

He manages field agents, oversees farmer onboarding processes, and coordinates regional operations. Gabriel's work is essential in bridging the gap between the technology and the farmers, ensuring successful adoption and operational excellence at the field level.`,
        socials: {
            linkedin: 'http://linkedin.com/in/gabriel-wontumi-aa357928a',
            twitter: 'https://x.com/championwontumi'
        },
        expertise: ['Operations Management', 'Field Logistics', 'Community Engagement', 'Agricultural Extension', 'Project Planning'],
        borderColor: 'border-[#6366f1]'
    },
    {
        id: 'simmons-justice',
        name: 'Simmons Justice',
        role: 'Advisory & Research Lead',
        image: '/lovable-uploads/simons.jpg',
        initials: 'SJ',
        description: 'Field research, agricultural insights, farmer outreach, and ensuring seamless field data collection.',
        longBio: `Justice leads Advisory & Research with a strong focus on field data integrity and community support. He works closely with the farming community to ensure that operations are seamless and that the data collected is accurate and reliable.

His role involves conducting field research and gathering critical agricultural insights that drive decision-making. Justice ensures that the connection between the technical team and the farming community is robust, facilitating smooth operations and ensuring that field data accurately reflects the reality on the ground.`,
        socials: {
            linkedin: 'https://www.linkedin.com/in/justice-simmons-264b29317',
            twitter: 'https://x.com/simmons_ju67046',
            facebook: 'https://www.facebook.com/justice.simmons.963'
        },
        expertise: ['Agricultural Research', 'Field Data Collection', 'Community Operations', 'Agronomy', 'Sustainable Farming'],
        borderColor: 'border-[#06b6d4]'
    }
];

export const getAllMembers = () => {
    return [leadership, ...coFounders, ...productTeam, ...marketingTeam, ...operationsTeam];
};

export const getMemberById = (id: string) => {
    return getAllMembers().find(member => member.id === id);
};
