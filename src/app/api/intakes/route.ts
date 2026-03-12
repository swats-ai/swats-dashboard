import { NextResponse } from 'next/server'
import intakes from '../../../../data/intakes.json'

export async function GET() {
  return NextResponse.json(intakes)
}
