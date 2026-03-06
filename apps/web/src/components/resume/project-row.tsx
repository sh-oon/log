import { ArrowRight } from 'lucide-react';

interface ProjectRowProps {
  title: string;
  desc: string;
}

export const ProjectRow = ({ title, desc }: ProjectRowProps) => (
  <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white transition-all cursor-pointer group">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h4>
      <ArrowRight
        size={16}
        className="text-gray-300 group-hover:text-black dark:group-hover:text-white transform transition-all group-hover:translate-x-1"
      />
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-light">{desc}</p>
  </div>
);
