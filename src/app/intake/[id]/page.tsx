import intakes from '../../../../data/intakes.json'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Intake {
  id: string
  name: string
  business: string
  channel: string
  username: string
  chatId: string
  date: string
  url: string
  status: string
  referralCode: string
  intake: string
  sections: string[]
  stockPhotos: boolean
  assets: string[]
}

export function generateStaticParams() {
  return (intakes as Intake[]).map((intake) => ({ id: intake.id }))
}

export default async function IntakeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const intake = (intakes as Intake[]).find(i => i.id === id)

  if (!intake) notFound()

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">
            ← Back
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">{intake.business}</h1>
          </div>
          <StatusBadge status={intake.status} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Quick Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoCard label="Client" value={intake.name} sub={intake.username} />
          <InfoCard label="Channel" value={intake.channel} sub={`Chat ID: ${intake.chatId}`} />
          <InfoCard label="Date" value={intake.date} sub="Intake completed" />
          <InfoCard label="Referral" value={intake.referralCode} sub="swats.ai/?ref=..." />
        </div>

        {/* URL */}
        {intake.url && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">Live URL</p>
            <a href={intake.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-mono text-sm break-all">
              {intake.url}
            </a>
          </div>
        )}

        {/* Intake Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Business Description</p>
          <p className="text-gray-300 leading-relaxed">{intake.intake}</p>
        </div>

        {/* Sections & Assets */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Website Sections</p>
            <div className="flex flex-wrap gap-2">
              {intake.sections.map((section) => (
                <span key={section} className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300">
                  {section}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Assets ({intake.assets.length})</p>
            <div className="space-y-1.5">
              {intake.assets.map((asset) => (
                <div key={asset} className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <span className="text-gray-600">📎</span>
                  {asset}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800">
              <span className={`text-xs ${intake.stockPhotos ? 'text-green-400' : 'text-gray-500'}`}>
                Stock Photos: {intake.stockPhotos ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white truncate">{value}</p>
      <p className="text-xs text-gray-500 truncate mt-0.5">{sub}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    building: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {status === 'live' && '●'} {status.toUpperCase()}
    </span>
  )
}
