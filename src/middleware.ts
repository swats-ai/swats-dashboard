import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const USER = process.env.DASHBOARD_USER || 'swats'
const PASS = process.env.DASHBOARD_PASS || 'sxsw2026'

export function middleware(request: NextRequest) {
  // Allow API routes for external updates
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const apiKey = request.headers.get('x-api-key')
    if (apiKey === (process.env.API_KEY || 'swats-dashboard-key-2026')) {
      return NextResponse.next()
    }
    // For GET requests, check basic auth too
    if (request.method === 'GET') {
      const authHeader = request.headers.get('authorization')
      if (authHeader && isValidAuth(authHeader)) {
        return NextResponse.next()
      }
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !isValidAuth(authHeader)) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="SWATS Dashboard"',
      },
    })
  }

  return NextResponse.next()
}

function isValidAuth(authHeader: string): boolean {
  try {
    const base64 = authHeader.split(' ')[1]
    const [user, pass] = atob(base64).split(':')
    return user === USER && pass === PASS
  } catch {
    return false
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
