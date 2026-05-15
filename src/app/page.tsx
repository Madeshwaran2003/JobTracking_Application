'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Briefcase, BarChart3, Settings, HelpCircle,
  Plus, Search, Edit3, Trash2, ChevronDown, X, Menu,
  FileText, MapPin, Calendar, Link2, StickyNote, Download,
  Trash, CheckCircle2, XCircle, Clock, Users, TrendingUp,
  ChevronUp, ArrowUpDown, ExternalLink
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = 'Applied' | 'Assessment' | 'Interview' | 'HR Round' | 'Rejected' | 'Offer Received'
type Page = 'dashboard' | 'applications' | 'analytics' | 'settings' | 'help'

interface Application {
  id: string
  company: string
  role: string
  jobLink: string
  location: string
  dateApplied: string
  status: Status
  notes: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES: Status[] = ['Applied', 'Assessment', 'Interview', 'HR Round', 'Rejected', 'Offer Received']

const STATUS_CONFIG: Record<Status, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  'Applied': { color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: FileText },
  'Assessment': { color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30', icon: Clock },
  'Interview': { color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: Users },
  'HR Round': { color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', icon: TrendingUp },
  'Rejected': { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', icon: XCircle },
  'Offer Received': { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: CheckCircle2 },
}

const NAV_ITEMS: { key: Page; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'applications', label: 'Applications', icon: Briefcase },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'help', label: 'Help', icon: HelpCircle },
]

const EMPTY_FORM: Omit<Application, 'id'> = {
  company: '', role: '', jobLink: '', location: '', dateApplied: '', status: 'Applied', notes: '',
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={`${config.bg} ${config.color} ${config.border} border gap-1 font-medium`}>
      <Icon className="size-3" />
      {status}
    </Badge>
  )
}

// ─── Analytics Card ──────────────────────────────────────────────────────────

function AnalyticsCard({ title, value, icon: Icon, color, delay }: {
  title: string; value: number; icon: React.ElementType; color: string; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className={`${color} rounded-xl p-3`}>
              <Icon className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // State
  const [applications, setApplications] = useState<Application[]>([])
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All')
  const [sortBy, setSortBy] = useState<'date' | 'company'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)

  // Modal state
  const [showAddEdit, setShowAddEdit] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null)

  // Mobile detail panel
  const [detailApp, setDetailApp] = useState<Application | null>(null)

  // Fetch data
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/applications')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setApplications(data)
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // CRUD handlers
  const handleAdd = () => {
    setEditingApp(null)
    setFormData(EMPTY_FORM)
    setShowAddEdit(true)
  }

  const handleEdit = (app: Application) => {
    setEditingApp(app)
    setFormData({
      company: app.company,
      role: app.role,
      jobLink: app.jobLink,
      location: app.location,
      dateApplied: app.dateApplied,
      status: app.status,
      notes: app.notes,
    })
    setShowAddEdit(true)
    setDetailApp(null)
  }

  const handleSave = async () => {
    if (!formData.company || !formData.role) {
      toast({ title: 'Validation Error', description: 'Company and Role are required', variant: 'destructive' })
      return
    }

    try {
      if (editingApp) {
        const res = await fetch('/api/applications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingApp.id, ...formData }),
        })
        if (!res.ok) throw new Error('Failed to update')
        toast({ title: 'Updated!', description: `${formData.company} application updated` })
      } else {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error('Failed to add')
        toast({ title: 'Added!', description: `${formData.company} application added` })
      }
      setShowAddEdit(false)
      fetchApplications()
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/applications?id=${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast({ title: 'Deleted!', description: `${deleteTarget.company} application removed` })
      setDeleteTarget(null)
      setDetailApp(null)
      fetchApplications()
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' })
    }
  }

  const handleClearAll = async () => {
    try {
      // Delete all one by one
      for (const app of applications) {
        await fetch(`/api/applications?id=${app.id}`, { method: 'DELETE' })
      }
      setApplications([])
      toast({ title: 'Cleared!', description: 'All applications removed' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to clear data', variant: 'destructive' })
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'job-applications.json'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported!', description: 'Applications exported as JSON' })
  }

  // Filtering & sorting
  const filteredApps = applications
    .filter((app) => {
      const matchesSearch = searchQuery === '' ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'date') {
        return dir * (new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime())
      }
      return dir * a.company.localeCompare(b.company)
    })

  // Stats
  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'Interview' || a.status === 'HR Round').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
    offers: applications.filter(a => a.status === 'Offer Received').length,
  }

  const statusBreakdown = STATUSES.map(status => ({
    status,
    count: applications.filter(a => a.status === status).length,
    percentage: applications.length > 0 ? Math.round((applications.filter(a => a.status === status).length / applications.length) * 100) : 0,
  }))

  const responseRate = applications.length > 0
    ? Math.round(((applications.filter(a => a.status !== 'Applied').length) / applications.length) * 100)
    : 0

  // ─── Sidebar ─────────────────────────────────────────────────────────────

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl p-2">
          <Briefcase className="size-5 text-black" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">JobTracker</h1>
          <p className="text-xs text-muted-foreground">Pro Dashboard</p>
        </div>
      </div>
      <Separator className="bg-white/10" />
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = currentPage === item.key
          return (
            <button
              key={item.key}
              onClick={() => {
                setCurrentPage(item.key)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="size-5" />
              {item.label}
            </button>
          )
        })}
      </nav>
      <div className="p-4">
        <Separator className="bg-white/10 mb-4" />
        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-sm font-medium text-emerald-400">{stats.total} Applications</p>
          <p className="text-xs text-muted-foreground mt-1">Keep tracking!</p>
        </div>
      </div>
    </div>
  )

  // ─── Page Components ────────────────────────────────────────────────────

  const DashboardPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Overview of your job applications</p>
        </div>
        <Button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-2">
          <Plus className="size-4" /> Add Application
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard title="Total Applications" value={stats.total} icon={Briefcase} color="bg-blue-500/20 text-blue-400" delay={0} />
        <AnalyticsCard title="Interviews" value={stats.interviews} icon={Users} color="bg-orange-500/20 text-orange-400" delay={0.1} />
        <AnalyticsCard title="Rejected" value={stats.rejected} icon={XCircle} color="bg-red-500/20 text-red-400" delay={0.2} />
        <AnalyticsCard title="Offers" value={stats.offers} icon={CheckCircle2} color="bg-emerald-500/20 text-emerald-400" delay={0.3} />
      </div>

      {isMobile ? <MobileCardList /> : <ApplicationTable />}
    </div>
  )

  const ApplicationsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Applications</h2>
          <p className="text-muted-foreground text-sm mt-1">All your job applications in one place</p>
        </div>
        <Button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-2">
          <Plus className="size-4" /> Add New
        </Button>
      </div>
      {isMobile ? <MobileCardList /> : <ApplicationTable />}
    </div>
  )

  const AnalyticsPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground text-sm mt-1">Insights into your job search progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Response Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-bold">{responseRate}%</span>
                <span className="text-muted-foreground text-sm mb-1">of applications got a response</span>
              </div>
              <Progress value={responseRate} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Applications</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Process</span>
                <span className="font-semibold">{stats.total - stats.rejected - stats.offers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Offer Rate</span>
                <span className="font-semibold">{stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusBreakdown.map(sb => {
              const config = STATUS_CONFIG[sb.status]
              return (
                <div key={sb.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sb.status} />
                    </div>
                    <span className="text-sm text-muted-foreground">{sb.count} ({sb.percentage}%)</span>
                  </div>
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sb.percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      className={`absolute inset-y-0 left-0 rounded-full ${config.bg}`}
                      style={{ borderColor: 'transparent' }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )

  const SettingsPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your application data</p>
      </div>

      <div className="grid gap-4">
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="size-5" /> Export Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download all your applications as a JSON file. You can use this to back up your data or import it elsewhere.
            </p>
            <Button variant="outline" onClick={handleExport} className="gap-2 border-white/20">
              <Download className="size-4" /> Export as JSON
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-md border-red-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-400">
              <Trash className="size-5" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete all your application data. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleClearAll} className="gap-2">
              <Trash className="size-4" /> Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const HelpPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Help & Guide</h2>
        <p className="text-muted-foreground text-sm mt-1">Learn how to use JobTracker Pro</p>
      </div>

      <div className="grid gap-4">
        {[
          {
            icon: Plus,
            title: 'Adding Applications',
            desc: 'Click the "Add Application" button on the Dashboard or Applications page. Fill in the company name, role, location, date applied, and status. You can also add a job link and notes for reference.',
          },
          {
            icon: Edit3,
            title: 'Editing Applications',
            desc: 'Click the edit icon (pencil) on any application row, or tap a mobile card and use the Edit button. All fields including status can be updated.',
          },
          {
            icon: Trash2,
            title: 'Deleting Applications',
            desc: 'Click the delete icon (trash) on any application row. You will be asked to confirm before the application is permanently removed.',
          },
          {
            icon: Search,
            title: 'Search & Filter',
            desc: 'Use the search bar at the top to search by company name, role, or location. Use the status filter to narrow down by application status. Sort by date or company name.',
          },
          {
            icon: BarChart3,
            title: 'Analytics',
            desc: 'The Analytics page shows your response rate, offer rate, and a detailed breakdown of your applications by status with progress bars.',
          },
          {
            icon: Settings,
            title: 'Data Management',
            desc: 'In Settings, you can export your data as JSON for backup, or clear all data to start fresh. Be careful with the clear option as it cannot be undone.',
          },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                <CardContent className="p-6 flex gap-4">
                  <div className="bg-emerald-500/15 text-emerald-400 rounded-xl p-3 h-fit">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  // ─── Application Table (Desktop) ──────────────────────────────────────

  const ApplicationTable = () => {
    if (loading) {
      return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <div className="animate-pulse text-muted-foreground">Loading applications...</div>
          </CardContent>
        </Card>
      )
    }

    if (filteredApps.length === 0) {
      return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <Briefcase className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Start by adding your first application'}
            </p>
            <Button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-2">
              <Plus className="size-4" /> Add Application
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold">Company</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Role</TableHead>
                <TableHead className="text-muted-foreground font-semibold hidden md:table-cell">Location</TableHead>
                <TableHead className="text-muted-foreground font-semibold">
                  <button
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    onClick={() => {
                      if (sortBy === 'date') setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                      else { setSortBy('date'); setSortDir('desc') }
                    }}
                  >
                    Date Applied
                    <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                <TableHead className="text-muted-foreground font-semibold hidden lg:table-cell">Notes</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredApps.map((app, idx) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {app.jobLink ? (
                          <a
                            href={app.jobLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-400 transition-colors"
                          >
                            {app.company}
                          </a>
                        ) : (
                          app.company
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{app.role}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {app.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : '—'}
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={app.status} /></TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate hidden lg:table-cell">
                      {app.notes || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-white" onClick={() => handleEdit(app)}>
                          <Edit3 className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-red-400" onClick={() => setDeleteTarget(app)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </Card>
    )
  }

  // ─── Mobile Card List ─────────────────────────────────────────────────

  const MobileCardList = () => {
    if (loading) {
      return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      )
    }

    if (filteredApps.length === 0) {
      return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
          <CardContent className="p-12 text-center">
            <Briefcase className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Start by adding your first application'}
            </p>
            <Button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-2">
              <Plus className="size-4" /> Add Application
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-3">
        <AnimatePresence>
          {filteredApps.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className="border-white/10 bg-white/5 backdrop-blur-md cursor-pointer hover:border-white/20 transition-all active:scale-[0.98]"
                onClick={() => setDetailApp(app)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{app.company}</h3>
                      <p className="text-sm text-muted-foreground">{app.role}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{app.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{app.dateApplied ? new Date(app.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  // ─── Page Router ──────────────────────────────────────────────────────

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />
      case 'applications': return <ApplicationsPage />
      case 'analytics': return <AnalyticsPage />
      case 'settings': return <SettingsPage />
      case 'help': return <HelpPage />
      default: return <DashboardPage />
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 border-r border-white/10 bg-white/[0.02] flex-shrink-0">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-background border-white/10">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Main navigation menu</SheetDescription>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-4 md:px-6 py-3">
            {isMobile && (
              <Button variant="ghost" size="icon" className="size-9" onClick={() => setSidebarOpen(true)}>
                <Menu className="size-5" />
              </Button>
            )}

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search company, role, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 focus:border-white/20 h-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 border-white/10 bg-white/5 text-xs">
                    <span className="hidden sm:inline">{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
                    <span className="sm:hidden">Filter</span>
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-white/10">
                  <DropdownMenuItem onClick={() => setStatusFilter('All')} className="focus:bg-white/10">
                    <span className="text-muted-foreground">All Status</span>
                  </DropdownMenuItem>
                  {STATUSES.map(status => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="focus:bg-white/10">
                      <StatusBadge status={status} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 border-white/10 bg-white/5 text-xs">
                    <ArrowUpDown className="size-3" />
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-white/10">
                  <DropdownMenuItem onClick={() => { setSortBy('date'); setSortDir('desc') }} className="focus:bg-white/10">
                    <Calendar className="size-4 mr-2" /> Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('date'); setSortDir('asc') }} className="focus:bg-white/10">
                    <Calendar className="size-4 mr-2" /> Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('company'); setSortDir('asc') }} className="focus:bg-white/10">
                    <ChevronUp className="size-4 mr-2" /> Company A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('company'); setSortDir('desc') }} className="focus:bg-white/10">
                    <ChevronDown className="size-4 mr-2" /> Company Z-A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add button (navbar) */}
              <Button onClick={handleAdd} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-1.5">
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Add/Edit Dialog ────────────────────────────────────────────── */}
      <Dialog open={showAddEdit} onOpenChange={setShowAddEdit}>
        <DialogContent className="bg-background border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingApp ? 'Edit Application' : 'Add Application'}</DialogTitle>
            <DialogDescription>
              {editingApp ? 'Update the application details' : 'Fill in the details of your job application'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobLink">Job Link</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="jobLink"
                  value={formData.jobLink}
                  onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bangalore, India"
                    className="bg-white/5 border-white/10 pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dateApplied">Date Applied</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="dateApplied"
                    type="date"
                    value={formData.dateApplied}
                    onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                    className="bg-white/5 border-white/10 pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Custom Status Dropdown */}
            <div className="grid gap-2">
              <Label>Status</Label>
              <DropdownMenu open={statusDropdownOpen} onOpenChange={setStatusDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-white/10 bg-white/5 hover:bg-white/10"
                  >
                    {formData.status ? (
                      <StatusBadge status={formData.status} />
                    ) : (
                      <span className="text-muted-foreground">Select status</span>
                    )}
                    <ChevronDown className="size-4 ml-auto opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full min-w-[200px] bg-popover border-white/10">
                  {STATUSES.map(status => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        setFormData({ ...formData, status })
                        setStatusDropdownOpen(false)
                      }}
                      className="focus:bg-white/10 cursor-pointer py-2.5"
                    >
                      <StatusBadge status={status} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes..."
                rows={3}
                className="bg-white/5 border-white/10 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEdit(false)} className="border-white/10">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
              {editingApp ? 'Update' : 'Add Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <AlertDialogContent className="bg-background border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application for <strong className="text-foreground">{deleteTarget?.company}</strong> — {deleteTarget?.role}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Mobile Detail Sheet ────────────────────────────────────────── */}
      <Sheet open={!!detailApp} onOpenChange={(open) => { if (!open) setDetailApp(null) }}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-background border-white/10">
          <SheetHeader className="border-b border-white/10 pb-4 mb-0">
            <SheetTitle className="text-xl">{detailApp?.company}</SheetTitle>
            <SheetDescription className="text-base">{detailApp?.role}</SheetDescription>
          </SheetHeader>

          {detailApp && (
            <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
              <div className="p-4 space-y-5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={detailApp.status} />
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  {detailApp.jobLink && (
                    <div className="flex items-start gap-3">
                      <Link2 className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Job Link</p>
                        <a href={detailApp.jobLink} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:underline flex items-center gap-1">
                          {detailApp.jobLink} <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm">{detailApp.location || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date Applied</p>
                      <p className="text-sm">
                        {detailApp.dateApplied
                          ? new Date(detailApp.dateApplied).toLocaleDateString('en-US', {
                              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {detailApp.notes && (
                    <div className="flex items-start gap-3">
                      <StickyNote className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm leading-relaxed">{detailApp.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}

          <div className="border-t border-white/10 p-4 flex gap-3 mt-auto">
            <Button
              variant="outline"
              className="flex-1 gap-2 border-white/10"
              onClick={() => detailApp && handleEdit(detailApp)}
            >
              <Edit3 className="size-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => detailApp && setDeleteTarget(detailApp)}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
