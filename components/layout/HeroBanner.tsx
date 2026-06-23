const STATS = [
  { value: "248", label: "Aktivne licitacije" },
  { value: "1,840", label: "Ponude danas" },
  { value: "94%", label: "Završene" },
] as const;

export function HeroBanner() {
  return (
    <div className="bg-gradient-to-br from-[#004182] to-[#0a66c2] text-white py-6 sm:py-7">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
        <div>
          <h1 className="text-xl sm:text-[22px] font-bold tracking-tight mb-1">
            Aukcija uživo
          </h1>
          <p className="text-[13px] opacity-80 font-light">
            Licitirajte i prodajte svoje predmete. Pridružite se našoj zajednici
            i otkrijte neverovatne ponude svaki dan!
          </p>
        </div>

        <div className="flex gap-6 sm:gap-8 justify-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-[24px] font-bold tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="text-[11px] opacity-70 mt-0.5 uppercase tracking-[0.05em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
