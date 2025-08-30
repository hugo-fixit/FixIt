import process from 'node:process'
import { updateVersion } from './update-version'

const type: string = process.argv[2]
if (type !== 'dev' && type !== 'prod') {
  console.error('Invalid argument. Please specify "dev" or "prod".')
  process.exit(1)
}

updateVersion(type)
