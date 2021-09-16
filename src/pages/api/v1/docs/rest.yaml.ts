import { promises as fs } from 'fs'
import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSentry } from '@sentry/nextjs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const path = join(process.cwd(), 'public/rest.yaml')
    const file = await fs.readFile(path, 'utf-8')
    res.status(200).setHeader('Content-Type', 'application/yaml')
    res.send(file)
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
}
export default withSentry(handler)
