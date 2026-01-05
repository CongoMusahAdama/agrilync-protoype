import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMemberById } from '@/data/teamData';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

const TeamMemberProfile = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const member = memberId ? getMemberById(memberId) : undefined;

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [memberId]);

    if (!member) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center pt-24">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Member Not Found</h2>
                        <Link to="/team">
                            <Button>Back to Team</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const BRAND_TEAL = '#002F37';
    const BRAND_GREEN = '#7ede56';

    return (
        <div className="min-h-screen bg-white font-manrope">
            <Navbar variant="solid" />

            {/* Header Section */}
            <div className="bg-[#002F37] text-white pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link to="/team" className="hover:text-white transition-colors">Our Team</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-[#7ede56]">{member.name}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">{member.name}</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Left Column: Image */}
                    <div className="w-full lg:w-1/3 flex-shrink-0">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] bg-gray-100">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: member.imagePosition || 'center' }}
                            />
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        <div>
                            <h2 className="text-[#7ede56] font-bold text-sm tracking-widest uppercase mb-2">
                                {member.role}
                            </h2>
                            <h3 className="text-3xl font-bold text-[#002F37] mb-4">
                                {member.name}
                            </h3>

                            {/* Social Media Links */}
                            {member.socials && (
                                <div className="flex items-center gap-4 mb-8">
                                    {member.socials.linkedin && (
                                        <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:opacity-80 transition-opacity">
                                            <Linkedin className="w-6 h-6" />
                                        </a>
                                    )}
                                    {member.socials.twitter && (
                                        <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-80 transition-opacity">
                                            <Twitter className="w-6 h-6" />
                                        </a>
                                    )}
                                    {member.socials.instagram && (
                                        <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:opacity-80 transition-opacity">
                                            <Instagram className="w-6 h-6" />
                                        </a>
                                    )}
                                    {member.socials.facebook && (
                                        <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80 transition-opacity">
                                            <Facebook className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                                {/* If longBio exists, split by paragraphs. If not, use description */}
                                {member.longBio ? (
                                    member.longBio.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4 whitespace-pre-line">{paragraph}</p>
                                    ))
                                ) : (
                                    <p>{member.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h4 className="text-[#002F37] font-bold text-lg mb-4">Qualifications & Expertise</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(member.expertise || ['Strategic Planning', 'Project Management', 'Leadership', 'Agricultural Development']).map((skill, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-[#7ede56]"></div>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8">
                            <Button
                                onClick={() => navigate('/team')}
                                variant="outline"
                                className="gap-2 border-[#002F37] text-[#002F37] hover:bg-[#002F37] hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Team
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TeamMemberProfile;
