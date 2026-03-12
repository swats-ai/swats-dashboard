import intakes from '../../data/intakes.json'

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

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const data = intakes as Intake[]
  const liveCount = data.filter(i => i.status === 'live').length
  const pendingCount = data.filter(i => i.status === 'pending').length
  const totalCount = data.length

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <div>
              <h1 className="text-lg font-bold text-white">SWATS Dashboard</h1>
              <p className="text-xs text-gray-500">SXSW 2026 Website Challenge</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-gray-400">Live</span>
              </span>
            </div>
            <time className="text-xs text-gray-500 font-mono" suppressHydrationWarning>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Intakes" value={totalCount} color="blue" />
          <StatCard label="Live Sites" value={liveCount} color="green" />
          <StatCard label="Pending Build" value={pendingCount} color="yellow" />
          <StatCard label="Channels" value={[...new Set(data.map(i => i.channel))].length} color="purple" />
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Intake Requests</h2>
            <span className="text-xs text-gray-500">{totalCount} total</span>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Business</th>
                  <th className="px-5 py-3 font-medium">Channel</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">URL</th>
                  <th className="px-5 py-3 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {data.map((intake) => (
                  <IntakeRow key={intake.id} intake={intake} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-800/50">
            {data.map((intake) => (
              <MobileIntakeCard key={intake.id} intake={intake} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
    green: 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-400',
    yellow: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].split(' ').pop()}`}>{value}</p>
    </div>
  )
}

function IntakeRow({ intake }: { intake: Intake }) {
  return (
    <tr className="hover:bg-gray-800/40 transition-colors">
      <td className="px-5 py-3.5">
        <span className="font-medium text-white">{intake.name}</span>
        <span className="block text-xs text-gray-500">{intake.username}</span>
      </td>
      <td className="px-5 py-3.5 text-gray-300">{intake.business}</td>
      <td className="px-5 py-3.5">
        <ChannelBadge channel={intake.channel} />
      </td>
      <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{intake.date}</td>
      <td className="px-5 py-3.5">
        <StatusBadge status={intake.status} />
      </td>
      <td className="px-5 py-3.5">
        {intake.url ? (
          <a href={intake.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs font-mono truncate block max-w-[200px]">
            {intake.url.replace('https://', '')}
          </a>
        ) : <span className="text-gray-600">—</span>}
      </td>
      <td className="px-5 py-3.5">
        <a href={`/intake/${intake.id}`} className="text-orange-400 hover:text-orange-300 text-xs font-medium cursor-pointer">
          View →
        </a>
      </td>
    </tr>
  )
}

function MobileIntakeCard({ intake }: { intake: Intake }) {
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-white">{intake.name}</span>
        <StatusBadge status={intake.status} />
      </div>
      <p className="text-sm text-gray-400">{intake.business}</p>
      <div className="flex items-center gap-3 text-xs">
        <ChannelBadge channel={intake.channel} />
        <span className="text-gray-500 font-mono">{intake.date}</span>
      </div>
      {intake.url && (
        <a href={intake.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs font-mono block truncate">
          {intake.url.replace('https://', '')}
        </a>
      )}
      <a href={`/intake/${intake.id}`} className="text-orange-400 text-xs font-medium inline-block mt-1">
        View Details →
      </a>
    </div>
  )
}

function ChannelBadge({ channel }: { channel: string }) {
  const styles: Record<string, string> = {
    telegram: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    whatsapp: 'bg-green-500/10 text-green-400 border-green-500/20',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[channel] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {channel === 'telegram' ? '✈' : '💬'} {channel}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    building: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
      {status === 'live' && '●'} {status}
    </span>
  )
}
