import {getLocalEnv, initAdmin} from 'shared/init-admin'
initAdmin()
import {createSupabaseDirectClient} from 'shared/supabase/init'
import {getServiceAccountCredentials, loadSecretsToEnv} from 'common/secrets'
import * as path from 'path'
import * as fg from 'fast-glob'
import * as fs from 'fs'
import * as readline from 'node:readline/promises'

const main = async () => {
    const wantedResponse = "I am become death destroyer of worlds"
    const response = await readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    }).question(`This script will wipe the supabase db. If you really want to continue type this: ${wantedResponse}:\n`)
    if (response != wantedResponse) {
        throw new Error(`You typed the wrong thing: (${response}) VS (${wantedResponse})`)
    }

    // Get SQL scripts to execute and order them
    const sqlFiles = await fg.async([
        path.join(__dirname, '..', 'supabase/**/*.sql'),
    ])
    sqlFiles
        .sort((a, b) => {
            // Manual priority to kickstart stuff
            const orderedPriorityFiles = [
                'supabase/debug-reset-schema.sql',
                'supabase/seed.sql',
                'supabase/helper_functions/is_admin.sql',
                'supabase/helper_functions/random_alphanumeric.sql',
                'supabase/group_members/create.sql',
                'supabase/group_contracts.sql',
                'supabase/users/create.sql',
                'supabase/contracts/functions.sql',
                'supabase/views.sql',
                'supabase/functions.sql',
                'supabase/private-user-messages.sql',
            ]
            for (const file of orderedPriorityFiles) {
                if (a.endsWith(file)) {
                    return -1
                }
                if (b.endsWith(file)) {
                    return 1
                }
            }

            // Execute seed_data.sql last
            if (a.endsWith('supabase/seed_data.sql')) {
                return 1
            }
            if (b.endsWith('supabase/seed_data.sql')) {
                return -1
            }

            // Give any create.sql priority
            if (a.endsWith('create.sql')) {
                return -1
            }
            if (b.endsWith('create.sql')) {
                return 1
            }

            // Shorter, the logic is that longer filenames depend on more stuff
            const diff = a.length - b.length
            if (diff != 0) {
                return diff
            }

            // Sort alphabetically, not really important but just to keep consistency
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
        await db.none(sql)
    }
}

if (require.main === module) main().then(() => process.exit())
