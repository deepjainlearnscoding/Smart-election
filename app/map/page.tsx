'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin, Search, Clock, Phone, FileText,
  AlertCircle, CheckCircle2, Navigation,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const documents = [
  { name: 'Voter ID Card (EPIC)', required: true },
  { name: 'Aadhaar Card', required: true },
  { name: 'Passport', required: false },
  { name: 'Driving License', required: false },
  { name: 'PAN Card (with photo)', required: false },
  { name: 'Bank Passbook with photo', required: false },
  { name: 'Pension document with photo', required: false },
];

const sampleBooths = [
  { id: 'B001', name: 'Govt. Primary School, Sector 15', address: 'Sector 15, Block C, New Delhi', timing: '7:00 AM – 6:00 PM', status: 'Active', voters: 1234 },
  { id: 'B002', name: 'Community Hall, Rajiv Nagar', address: 'Rajiv Nagar, Near Metro Station', timing: '7:00 AM – 6:00 PM', status: 'Active', voters: 987 },
  { id: 'B003', name: 'Municipal School, Ward 12', address: 'Ward 12, MG Road, Delhi', timing: '7:00 AM – 6:00 PM', status: 'Active', voters: 1102 },
];

export default function MapPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Polling Info</p>
            <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-white mb-4">Find Your Polling Booth</h1>
            <p className="text-slate-400 text-lg">Enter your constituency or area to find booth details</p>
          </div>

          {/* Search */}
          <div className="glass-strong rounded-3xl p-8 mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="booth-search-input"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSearched(true); }}
                  placeholder="Enter your constituency, ward, or pincode..."
                  className="input-field pl-12 text-base"
                />
              </div>
              <button
                id="booth-search-btn"
                onClick={() => setSearched(true)}
                className="btn-primary px-6 py-3 flex-shrink-0"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            {/* Important notice */}
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-300 font-medium">Official Verification Required</p>
                <p className="text-xs text-slate-500 mt-1">
                  For accurate polling booth information, visit{' '}
                  <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">
                    voters.eci.gov.in
                  </a>{' '}
                  or call the Voter Helpline: <strong className="text-white">1950</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Booth Results */}
            <div className="lg:col-span-3">
              <h2 className="font-outfit font-bold text-xl text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                {searched && search ? `Results for "${search}"` : 'Sample Polling Booths'}
              </h2>
              <div className="flex flex-col gap-4">
                {sampleBooths.map((booth) => (
                  <div key={booth.id} className="glass rounded-2xl p-5 hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-slate-600 font-mono">{booth.id}</span>
                        <h3 className="font-semibold text-white mt-1">{booth.name}</h3>
                      </div>
                      <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded-full">
                        ● {booth.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-slate-400">
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-600" /> {booth.address}</span>
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-600" /> {booth.timing}</span>
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-slate-600" /> {booth.voters.toLocaleString()} registered voters</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" /> Get Directions
                      </button>
                      <button className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 glass rounded-2xl overflow-hidden h-64 flex items-center justify-center border-dashed border-2 border-white/10">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Interactive map coming soon</p>
                  <a
                    href={`https://www.google.com/maps/search/polling+booth+${encodeURIComponent(search || 'near me')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 text-xs mt-2 inline-block hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Documents Checklist */}
            <div className="lg:col-span-2">
              <h2 className="font-outfit font-bold text-xl text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                Required Documents
              </h2>
              <div className="glass rounded-2xl p-5">
                <p className="text-sm text-slate-400 mb-4">Bring at least one of these photo ID documents:</p>
                <div className="flex flex-col gap-2">
                  {documents.map(({ name, required }) => (
                    <div key={name} className={`flex items-center gap-3 p-3 rounded-xl ${required ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-white/3 border border-white/5'}`}>
                      {required
                        ? <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        : <CheckCircle2 className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      }
                      <span className="text-sm text-slate-300">{name}</span>
                      {required && <span className="ml-auto text-xs text-violet-400 font-medium">Primary</span>}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-500 mb-3">Voter Helpline</p>
                  <a href="tel:1950" className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                    <Phone className="w-5 h-5" />
                    <div>
                      <p className="font-bold text-lg">1950</p>
                      <p className="text-xs text-slate-500">Free helpline, 24x7</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
