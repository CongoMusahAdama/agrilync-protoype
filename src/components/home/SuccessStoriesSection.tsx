import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const stories = [
  {
    name: "Sarah Mensah",
    role: "Vegetable Farmer",
    location: "Volta Region",
    image: "/lovable-uploads/image%20copy%2020.png",
    title: "Transformed our daily operations",
    feedback: "Agrilync Nexus changed the game for me. I no longer worry about my vegetables going to waste; the AI insights and investor matches as a Lync Grower have given my farm a new lease on life."
  },
  {
    name: "John Baah",
    role: "Maize Farmer",
    location: "Brong Ahafo, Techiman",
    image: "/lovable-uploads/success_story_3.jpg",
    title: "AI & field support and accountability",
    feedback: "The AI crop consultation saved my maize harvest from a pest outbreak. The advice was timely, accurate, and easy to follow. The system is intuitive and support is always responsive."
  }
];

export const SuccessStoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const [successStoriesRef, successStoriesVisible] = useScrollReveal();

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16">

          {/* Left Column */}
          <div className="flex flex-col gap-12">
            <div ref={successStoriesRef} className={`transition-all duration-700 ease-out ${successStoriesVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'}`}>
              <div className="flex items-center mb-6">
                <span className="text-[#7ede56] font-bold text-sm uppercase tracking-[0.2em]">Reviews</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight text-[#002f37] mb-8">
                Hear What Our{' '}
                <span className="relative inline-block bg-[#002f37] text-white px-4 md:px-6 py-1 mx-1 md:mx-2 rounded-2xl transform -rotate-1 shadow-lg">
                  Clients
                  <svg className="absolute -bottom-3 left-0 w-full h-4 text-[#7ede56] opacity-80" viewBox="0 0 200 20" fill="none">
                    <path d="M5 15C50 5 150 5 195 15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                Say About Us
              </h2>
              <p className="text-gray-600 text-lg md:text-xl font-sans leading-relaxed mb-10 max-w-xl">
                Experience transformative agricultural journeys with AgriLync Nexus, revolutionizing farming experiences using advanced AI technology and seamless investor connections.
              </p>
              <Button onClick={() => navigate('/about')} className="bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] px-8 py-7 rounded-lg text-sm font-bold shadow-[0_10px_30px_-10px_rgba(126,222,86,0.5)] transition-all transform hover:scale-105">
                View All Reviews
              </Button>
            </div>

            {/* Featured Case Study */}
            <div className={`bg-[#002f37] rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group transition-all duration-700 delay-300 ${successStoriesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-150"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#7ede56] shadow-lg">
                    <img src="/lovable-uploads/signup2.jpg" alt="Gabienu Emmanuel" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ objectPosition: "center 10%" }} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold font-montserrat text-[#7ede56]">Gabienu Emmanuel</h3>
                    <p className="text-white/70 font-medium tracking-wide">Cattle Livestock Farmer, Ashanti Region</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-xl md:text-2xl font-bold mb-4 font-montserrat italic underline decoration-[#7ede56]/40 underline-offset-8 text-[#7ede56]">"Health data for my livestock is vital"</h4>
                  <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 italic font-sans">"Securing funding for my cattle ranch was a challenge until AgriLync Nexus. Now, I have the field support and health data needed to ensure my livestock thrives. The transformation has been incredible."</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story Cards */}
          <div className={`bg-[#7ede56] rounded-[3rem] p-5 md:p-8 flex flex-col gap-6 shadow-2xl transition-all duration-700 delay-500 ${successStoriesVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            {stories.map((story, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-6 md:p-7 shadow-xl flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#7ede56]/20 group-hover:border-[#7ede56] transition-colors">
                    <img src={story.image} alt={story.name} loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${story.name}&background=7ede56&color=002f37`; }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#002f37] text-xl font-montserrat">{story.name}</h4>
                    <p className="text-gray-500 text-sm font-medium">{story.role}, {story.location}</p>
                  </div>
                </div>
                <div className="border-t border-gray-50 pt-6 mt-auto">
                  <h5 className="text-[#002f37] font-bold text-lg mb-3 font-montserrat leading-tight group-hover:text-[#7ede56] transition-colors">{story.title}</h5>
                  <p className="text-gray-600 text-base leading-relaxed mb-4 font-sans">"{story.feedback}"</p>
                  <div className="flex gap-1 mt-auto">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-[#7ede56] text-[#7ede56]" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
