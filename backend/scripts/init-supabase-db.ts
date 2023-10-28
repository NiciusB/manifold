import {getLocalEnv, initAdmin} from 'shared/init-admin'
initAdmin()
import { createSupabaseDirectClient} from 'shared/supabase/init'
import {getServiceAccountCredentials, loadSecretsToEnv} from 'common/secrets'
import * as path from 'path'
import * as fg from 'fast-glob'
import * as fs from 'fs'

const main = async () => {
    // Get SQL scripts to execute and order them
    const sqlFiles = await fg.async([
        path.join(__dirname, '..', 'supabase/**/*.sql'),
    ])
    sqlFiles
        .sort((a, b) => {
            if (a.endsWith('supabase/seed.sql')) {
                return -1
            }
            if (b.endsWith('supabase/seed.sql')) {
                return 1
            }

            return a < b ? -1 : 1
        })

    // Connect to Supabase db
    await loadSecretsToEnv(getServiceAccountCredentials(getLocalEnv()))
    const db = createSupabaseDirectClient()

    // Execute sql scripts in order
    for (const sqlPath of sqlFiles) {
        console.log(`Running ${sqlPath}...`)

        const sql = fs.readFileSync(sqlPath).toString('utf-8')

        // run sql
        await db.query(sql)
    }
}

if (require.main === module) main().then(() => process.exit())
