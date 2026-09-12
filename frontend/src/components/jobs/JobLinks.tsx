import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../common/Button';

interface JobLinksProps {
  linkedinUrl: string;
  naukriUrl: string;
  internshalaUrl: string;
}

export function JobLinks({ linkedinUrl, naukriUrl, internshalaUrl }: JobLinksProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="outline" size="sm" className="w-full text-indigo-300 border-indigo-500/30" icon={<ExternalLink className="w-3.5 h-3.5" />}>
          LinkedIn
        </Button>
      </a>

      <a href={naukriUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="outline" size="sm" className="w-full text-blue-300 border-blue-500/30" icon={<ExternalLink className="w-3.5 h-3.5" />}>
          Naukri
        </Button>
      </a>

      <a href={internshalaUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="outline" size="sm" className="w-full text-teal-300 border-teal-500/30" icon={<ExternalLink className="w-3.5 h-3.5" />}>
          Internshala
        </Button>
      </a>
    </div>
  );
}
