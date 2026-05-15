import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Filter, Pencil, Trash2, BarChart3, Settings, Database, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <HelpCard
          icon={Plus}
          title="Adding Applications"
          steps={[
            'Click the "Add Application" button in the toolbar',
            'Fill in the company name, role, and other details',
            'Select a status from the dropdown (Applied, Assessment, Interview, etc.)',
            'Click "Add Application" to save',
          ]}
        />

        <HelpCard
          icon={Pencil}
          title="Editing & Deleting"
          steps={[
            'Click the pencil icon on any row to edit an application',
            'Modify any fields in the modal and click "Save Changes"',
            'Click the trash icon to delete — you\'ll be asked to confirm first',
            'On mobile, tap a card to view details, then use Edit or Delete buttons',
          ]}
        />

        <HelpCard
          icon={Search}
          title="Search & Filter"
          steps={[
            'Use the search bar to filter by company name, role, or location',
            'Use the status dropdown to show only specific application statuses',
            'Use the sort dropdown to order by date or company name',
            'Filters can be combined for precise results',
          ]}
        />

        <HelpCard
          icon={BarChart3}
          title="Analytics"
          steps={[
            'The dashboard shows summary cards: Total, Interviews, Rejected, Offers',
            'Navigate to the Analytics page for detailed breakdowns and progress bars',
            'Track your response rate and conversion metrics',
          ]}
        />

        <HelpCard
          icon={Database}
          title="Google Sheets Backend"
          steps={[
            'By default, data is stored in your browser\'s localStorage',
            'To use Google Sheets, create a Sheet with the required columns',
            'Deploy the provided Google Apps Script as a Web App',
            'Set the VITE_API_URL environment variable to your deployment URL',
          ]}
        />

        {/* Keyboard shortcuts */}
        <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent-purple/10 flex-shrink-0">
              <BookOpen size={16} className="text-accent-purple" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Tips</h3>
              <p className="text-xs text-dark-400 mt-0.5">Helpful tips for using JobTracker</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-dark-300">
            <li className="flex items-start gap-2">
              <span className="text-accent-blue mt-0.5">•</span>
              Click the company name external link icon to open the job posting directly
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue mt-0.5">•</span>
              On mobile, tap any company card to see full details in a slide-over panel
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue mt-0.5">•</span>
              Export your data from Settings as a JSON backup
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-blue mt-0.5">•</span>
              The sidebar collapses on desktop with the arrow button for more table space
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function HelpCard({ icon: Icon, title, steps }) {
  return (
    <div className="rounded-2xl border border-glass-border bg-glass backdrop-blur-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-xl bg-accent-blue/10 flex-shrink-0">
          <Icon size={16} className="text-accent-blue" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      </div>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-dark-300">
            <span className="w-5 h-5 rounded-full bg-dark-600 flex items-center justify-center text-[10px] font-bold text-dark-200 flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
