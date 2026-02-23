import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useLocation } from "wouter";

export function Footer() {
  const [location] = useLocation();

  // Do not render the public Footer on protected dashboard or profile pages
  if (
    location.startsWith("/admin/") ||
    location.startsWith("/organizer/") ||
    location.startsWith("/student/") ||
    location.startsWith("/profile")
  ) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800 pb-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Useful Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xl text-white border-b border-slate-700 pb-2 inline-block">Useful Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/#home" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">›</span> Home</a></li>
              <li><a href="/#about" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">›</span> About us</a></li>
              <li><a href="/#gallery" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">›</span> Gallery</a></li>
              <li><a href="/#team" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">›</span> Team</a></li>
              <li><a href="/#membership" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">›</span> Pricing</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xl text-white border-b border-slate-700 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
                <span className="leading-relaxed">NH 16, Yanamadala (V & P),<br />Opp. Katuri Medical College,<br />Guntur Dist, AP 522019</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>0863-2288886, 0863-2288887</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:principal@kitsakshar.ac.in" className="hover:text-white transition-colors">principal@kitsakshar.ac.in</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-bold text-blue-400">🌐</span>
                <a href="https://www.kitsakshar.ac.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">www.kitsakshar.ac.in</a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a href="https://www.instagram.com/kits_csi_official/" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors border border-slate-700 hover:border-blue-500 text-blue-400 hover:text-white">
                  <Instagram className="h-4 w-4" />
                  <span className="font-medium text-xs tracking-wider uppercase">Follow Instagram</span>
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-white border-b border-slate-700 pb-2 inline-block">About KITSakshar CSI</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Established on 28th Sep, 2016. Benefiting the students in all round development.
            </p>
            <div className="pt-4">
              <img
                src="/college.webp"
                alt="KITS Logo"
                className="h-20 w-auto bg-white rounded-md p-1.5 inline-block opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} <strong className="text-slate-400">KITS Akshar Institute of Technology CSI Student Chapter</strong>. All rights reserved.</p>
          <p>Designed for KITS Akshar Institute of Technology</p>
        </div>
      </div>
    </footer>
  );
}
