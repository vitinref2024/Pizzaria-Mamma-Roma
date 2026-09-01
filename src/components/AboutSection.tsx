import React from 'react';
import { Award, Clock, Flame, Truck } from 'lucide-react';
import { StoreSettings } from '../types';

interface AboutSectionProps {
  settings: StoreSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="sobre" className="py-14 sm:py-20 px-4 bg-[#0a0a0a] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 text-center">
        {/* Official Logo & Badge */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-[#E52521] via-[#FFD21A] to-[#168A45] shadow-xl shadow-black/80">
            <div className="w-full h-full rounded-full overflow-hidden bg-black">
              <img
                src={settings.logo || '/logo.jpg'}
                alt="Pizzaria Mamma Roma Logo"
                loading="lazy"
                decoding="async"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E52521]/15 border border-[#E52521]/30 text-[#E52521] text-xs font-black uppercase tracking-widest">
            <Award className="w-4 h-4 text-[#FFD21A]" />
            <span>{settings.slogan}</span>
          </div>
        </div>

        {/* Title & Authentic Text */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            TRADIÇÃO QUE ATRAVESSA GERAÇÕES
          </h2>
          <p className="text-base sm:text-xl text-white/80 leading-relaxed font-medium">
            "Desde 2002, a Pizzaria Mamma Roma faz parte da história de seus clientes, oferecendo pizzas salgadas e doces, promoções especiais e atendimento para delivery."
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#E52521]/20 border border-[#E52521]/40 flex items-center justify-center text-[#E52521]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Desde 2002</h4>
            <p className="text-xs text-white/60">Mais de 24 anos de tradição em pizzas artesanais</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#FFD21A]/20 border border-[#FFD21A]/40 flex items-center justify-center text-[#FFD21A]">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Forno a Lenha</h4>
            <p className="text-xs text-white/60">Massa crocante e recheios fartos e gratinados</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#168A45]/20 border border-[#168A45]/40 flex items-center justify-center text-[#168A45]">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Delivery Ágil</h4>
            <p className="text-xs text-white/60">Entregamos quentinha direto na sua porta</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Todos os Dias</h4>
            <p className="text-xs text-white/60">Atendimento das 18h à 1h da madrugada</p>
          </div>
        </div>
      </div>
    </section>
  );
};
