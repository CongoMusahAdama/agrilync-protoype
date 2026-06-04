import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { leadership, coFounders, TeamMember } from '@/data/teamData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const leaders = [leadership, ...coFounders];

const shortRole = (member: TeamMember) =>
  member.isCEO ? member.role : member.role.split('(')[0].trim();

export const TeamSection: React.FC = () => {
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  return (
    <section className="py-14 md:py-16 bg-[#f8faf9] border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div
          ref={ref}
          className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <span className="text-[#7ede56] text-xs font-bold uppercase tracking-[0.2em]">
              Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-montserrat text-[#002f37] mt-2 leading-tight">
              Meet the people behind <span className="italic">AgriLync</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/team')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#002f37] hover:text-[#7ede56] transition-colors shrink-0"
          >
            View full team <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {leaders.map((member, i) => (
            <button
              key={member.id}
              type="button"
              onClick={() => navigate(`/team/${member.id}`)}
              className={`group relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ede56] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: visible ? `${i * 80}ms` : '0ms' }}
            >
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: member.imagePosition || 'center top' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] via-[#002f37]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-left">
                <p className="text-white text-xs md:text-sm font-bold font-montserrat leading-tight">
                  {member.name}
                </p>
                <p className="text-[#7ede56] text-[9px] md:text-[10px] font-semibold uppercase tracking-wide mt-1">
                  {shortRole(member)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
