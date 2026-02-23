import { SectionHeader } from "@/components/shared/PublicComponents";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Loader2 } from "lucide-react";
import { useCommittee } from "@/hooks/use-committee";

const managingTeam = [
  { name: "Sri. K. Subba Rao", role: "Chairman KITS college", email: "chairman@kitsakshar.ac.in", image: "/chairman.webp" },
  { name: "Sri. K. Sekhar", role: "Secretary KITS college", email: "secretary@kitsakshar.ac.in", image: "https://kitscsignt.web.app/assets/images/secretary.jpeg" },
  { name: "Dr. K.Rama Kotaiah", role: "Principal KITS college", email: "principal@kitsakshar.ac.in", image: "https://kitscsignt.web.app/assets/images/principal.jpeg" },
  { name: "G.Samba Siva Rao", role: "Director KITS college", email: "director@kitsakshar.ac.in", image: "https://kitscsignt.web.app/assets/images/drctr.jpeg" },
  { name: "Dr. G. Guru Kesava Das", role: "Professor & Head - Academic", email: "csehod@kitsakshar.ac.in", extra: "Professor & Head of the Department CSE", image: "https://kitscsignt.web.app/assets/images/hod.jpg" },
  { name: "Dr.sk.mahamud rafi", role: "Associate Professor / CSI Coordinator", email: "csicoordinator@kitsakshar.ac.in", extra: "Associate Professor CSE", image: "https://kitscsignt.web.app/assets/images/img2.jpg" },
];

const studentOrganizers = [
  { name: "Sathwika", rollNo: "20JR1A1289", year: "3rd Year", branch: "IT" },
  { name: "Aguru Sindhuja", rollNo: "20JR1A0501", year: "3rd Year", branch: "CSE" },
  { name: "G. VYSHNAVI", rollNo: "20JR144308", year: "3rd Year", branch: "CAI" },
  { name: "N.Saketh", rollNo: "20JR1A0329", year: "3rd Year", branch: "Mech" },
  { name: "Narne Pavani", rollNo: "20JR1A4320", year: "3rd Year", branch: "CAI" },
];

const coordinators = [
  { name: "V.Hemanth Kumar", rollNo: "21JR1A05I8", year: "2nd Year", branch: "CSE" },
];

export default function Team() {
  const { members, isLoading } = useCommittee();

  return (
    <div className="container mx-auto px-4 py-16">
      <SectionHeader
        title="Managing Team"
        subtitle="We are proudly presenting you our team who are managing the CSI in KITS college Guntur."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
        {managingTeam.map((member, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
            <div className="w-28 h-28 mb-5 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm group-hover:scale-105 transition-transform">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-1">{member.name}</h3>
            <p className="text-primary font-medium mb-2">{member.role}</p>
            {member.extra && <p className="text-sm text-slate-600 mb-3">{member.extra}</p>}
            <a href={`mailto:${member.email}`} className="mt-auto flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              {member.email}
            </a>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="font-display font-bold text-3xl mb-6 text-slate-800 border-b pb-2 text-center uppercase tracking-wide">Committee Members</h2>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-12">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : members && members.length > 0 ? (
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="hover:bg-slate-900 border-b-0">
                  <TableHead className="font-bold text-lg text-white text-center py-4 border-r border-slate-700 w-1/4">DESIGNATION</TableHead>
                  <TableHead className="font-bold text-lg text-white text-center py-4 border-r border-slate-700 w-1/4">NAME</TableHead>
                  <TableHead className="font-bold text-lg text-white text-center py-4 border-r border-slate-700 w-1/4">ROLL NO</TableHead>
                  <TableHead className="font-bold text-lg text-white text-center py-4 border-r border-slate-700 w-1/8">YEAR</TableHead>
                  <TableHead className="font-bold text-lg text-white text-center py-4 w-1/8">BRANCH</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, i) => (
                  <TableRow key={member.id} className="hover:bg-slate-50 border-b border-slate-200">
                    <TableCell className="font-bold text-slate-800 text-center uppercase border-r border-slate-200">{member.designation}</TableCell>
                    <TableCell className="font-bold text-slate-700 text-center uppercase border-r border-slate-200">{member.name}</TableCell>
                    <TableCell className="font-bold text-slate-600 text-center uppercase border-r border-slate-200">{member.rollNo || "-"}</TableCell>
                    <TableCell className="font-bold text-slate-600 text-center uppercase border-r border-slate-200">{member.year || "-"}</TableCell>
                    <TableCell className="font-bold text-slate-600 text-center uppercase">{member.branch || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground font-medium">
              Committee Members are currently being updated.
            </div>
          )}
        </div>

        <h2 className="font-display font-bold text-3xl mb-6 text-slate-800 border-b pb-2">Organizers</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-12">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-lg text-slate-900">Name</TableHead>
                <TableHead className="font-bold text-lg text-slate-900">Roll no</TableHead>
                <TableHead className="font-bold text-lg text-slate-900">Year</TableHead>
                <TableHead className="font-bold text-lg text-slate-900">Branch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentOrganizers.map((student, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-slate-700">{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h2 className="font-display font-bold text-3xl mb-6 text-slate-800 border-b pb-2">Coordinators</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-lg text-slate-900">Name</TableHead>
                <TableHead className="font-bold text-lg text-slate-900">Roll no</TableHead>
                <TableHead className="font-bold text-lg text-slate-900">Year</TableHead>
                <TableHead className="font-bold text-lg text-slate-900">Branch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coordinators.map((student, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-slate-700">{student.name}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
