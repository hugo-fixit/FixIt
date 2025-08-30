import path from 'node:path'
import { workspaceRoot } from '@hugo-fixit/shared'
import fsExtra from 'fs-extra'

const { copySync, removeSync } = fsExtra

removeSync(path.join(workspaceRoot, 'public'))
copySync(path.join(workspaceRoot, 'apps/demo/public'), path.join(workspaceRoot, 'public'), { overwrite: true })
copySync(path.join(workspaceRoot, 'apps/test/public'), path.join(workspaceRoot, 'public/test'), { overwrite: true })
