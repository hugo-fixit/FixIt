import path from 'node:path'
import fsExtra from 'fs-extra'

const { copySync, removeSync } = fsExtra
const workspace = path.resolve(__dirname, '../../../')

removeSync(path.join(workspace, 'public'))
copySync(path.join(workspace, 'apps/demo/public'), path.join(workspace, 'public'), { overwrite: true })
copySync(path.join(workspace, 'apps/test/public'), path.join(workspace, 'public/test'), { overwrite: true })
