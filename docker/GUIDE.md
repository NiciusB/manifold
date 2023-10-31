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
11. Go to Pub/Sub and create a topic named "firestoreWrite"
12. Create a Cloud Storage Bucket
13. Download https://drive.google.com/drive/folders/1C_EuERO9KlQEH9hg9aCMjcKYvL39kTrU 's "firestore_export_18-10-2022-15-35" folder, unzip it, and upload the unzipped folder to the bucket 
14. Create a Firestore Database, choose "Native mode" when prompted, and the same region as the previously created Cloud Storage Bucket
15. Go to the "Import/Export" on the database, and select the file "firestore_export.overall_export_metadata" from the bucket
16. Go to Firebase, open your database, open the tab "Rules", copy the contents of the file `firestore.rules`, and click "Publish"
17. Create a Service Account, download it's credential file and put it in `docker/dev-firebase-credentials.json`
18. Go to IAM and give the role "Secret Manager Admin" to the created account (firebase-adminsdk)
19. Run `docker-compose exec manifold sh docker/firebase-create-secrets.sh`
20. Download https://drive.google.com/drive/folders/1C_EuERO9KlQEH9hg9aCMjcKYvL39kTrU and copy `firestore_export` folder to `backend/functions/firestore_export`
21. Run `docker-compose exec manifold yarn --cwd=backend/functions build`
22. Create a Supabase project and database. Enable the following extensions on it: vector, pg_trgm, and pg_repack. TODO: pg_repack shows some error permission on Supabase's UI?
23. Set the values `supabaseInstanceId` and `supabaseAnonKey` for `common/src/envs/dev.ts`
24. Set the following secret in Google Cloud: `SUPABASE_PASSWORD`
25. Run `docker-compose exec manifold yarn cross-env GOOGLE_APPLICATION_CREDENTIALS_DEV=/home/node/app/docker/dev-firebase-credentials.json yarn --cwd backend/scripts ts-node init-supabase-db.ts`
26. You can now close the extra tab. On the original terminal tab, stop `./run.sh` (Ctrl+c), and run it again
27. All done! On your browser, you can now open http://localhost:3000/. It'll take a while to load the first time. You should see a log `[NEXT] - wait compiling / (client and server)...` on the terminal
