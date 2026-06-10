import { fromRoot } from '@hugo-fixit/shared'
import fsExtra from 'fs-extra'

const { copySync, removeSync } = fsExtra

removeSync(fromRoot('public'))
copySync(fromRoot('apps/demo/public'), fromRoot('public'), { overwrite: true })
copySync(fromRoot('apps/test/public'), fromRoot('public/test'), { overwrite: true })
