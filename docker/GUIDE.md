1. Install docker. If you're on Apple Silicon, Make sure to go to the Docker Desktop settings and give Docker at least 8GB, ideally 12GB
2. Open terminal, and navigate to this `docker` folder
3. Run `./run.sh`
4. Wait until it finishes, it'll say some error about firebase
5. On another terminal tab, go to this folder again, and run `docker-compose exec manifold firebase login` and follow the instructions
6. Then, run `docker-compose exec manifold /google-cloud-sdk/bin/gcloud auth login` and follow the instructions
7. Create a firebase project, and change both `.firebaserc`'s dev value, and `docker/docker-dev.sh`'s GCLOUD_PROJECT_ID value to the created project id
8. Create a firebase app, and copy the firebaseConfig to `common/src/envs/dev.ts`
9. Enable Google Authentication login for the firebase app
10. Activate the Secret Manager API for the project
11. Create a Service Account, download it's credential file and put it in `docker/dev-firebase-credentials.json`
12. Go to IAM and give the role "Secret Manager Admin" to the created account (firebase-adminsdk)
13. Run `docker-compose exec manifold sh docker/firebase-create-secrets.sh`
14. Download https://drive.google.com/drive/folders/1C_EuERO9KlQEH9hg9aCMjcKYvL39kTrU and copy `firestore_export` folder to `backend/functions/firestore_export`
15. Run `docker-compose exec manifold yarn --cwd=backend/functions build`
16. Create a Supabase project and database. Enable the following extensions on it: vector, pg_trgm, and pg_repack. TODO: pg_repack shows some error permission on Supabase's UI?
17. Set the values `supabaseInstanceId` and `supabaseAnonKey` for `common/src/envs/dev.ts`
18. Set the following secret in Google Cloud: `SUPABASE_PASSWORD`
19. (TODO: something here to actually prepare supabase db) Run `docker-compose exec manifold yarn cross-env GOOGLE_APPLICATION_CREDENTIALS_DEV=/home/node/app/docker/dev-firebase-credentials.json yarn --cwd backend/scripts ts-node init-supabase-db.ts`
20. You can now close the extra tab. On the original terminal tab, stop `./run.sh` (Ctrl+c), and run it again
21. All done! On your browser, you can now open http://localhost:3000/. It'll take a while to load the first time. You should see a log `[NEXT] - wait compiling / (client and server)...` on the terminal
