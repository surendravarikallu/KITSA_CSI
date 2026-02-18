import { SectionHeader } from "@/components/shared/PublicComponents";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <SectionHeader 
        title="About CSI" 
        subtitle="The Computer Society of India (CSI) is the largest and most professionally managed association of IT professionals in India."
      />
      
      <div className="grid gap-12 max-w-4xl mx-auto">
        <section className="prose prose-blue dark:prose-invert max-w-none">
          <h3 className="text-2xl font-bold mb-4">Mission & Vision</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h4 className="font-bold text-primary mb-2">Our Mission</h4>
              <p className="text-muted-foreground italic">"To facilitate research, knowledge sharing, learning and career enhancement for all categories of IT professionals."</p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h4 className="font-bold text-primary mb-2">Our Vision</h4>
              <p className="text-muted-foreground italic">"To be the premier association for information technology professionals and students in India."</p>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 p-8 rounded-xl border border-primary/10">
          <h3 className="text-2xl font-bold mb-4">Faculty Coordinator Message</h3>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex-shrink-0" />
            <div>
              <p className="text-lg italic text-muted-foreground mb-4">
                "Our CSI Student Chapter is dedicated to bridging the gap between academia and industry. We strive to provide our students with the best opportunities to learn, grow, and excel in the field of technology."
              </p>
              <p className="font-bold">- Prof. Sarah Smith</p>
              <p className="text-sm text-primary">Faculty Coordinator, CSI Student Chapter</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-8 text-center">Milestones</h3>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent">
            {[
              { year: "2020", event: "Chapter Founded with 50 initial members" },
              { year: "2021", event: "Awarded Best Emerging Student Chapter" },
              { year: "2022", event: "First National Level Hackathon hosted" },
              { year: "2023", event: "Reached milestone of 500+ active members" },
            ].map((m, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <span className="text-xs font-bold">{m.year}</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                  <p className="text-sm text-slate-500">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
