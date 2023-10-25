1. Open terminal, and navigate to this `docker` folder
2. Run `./run.sh`
3. Wait until it finishes, it'll say some error about firebase
4. On another terminal tab, go to this folder again, and run `docker-compose exec manifold firebase login` and follow the instructions
5. Then, run `docker-compose exec manifold /google-cloud-sdk/bin/gcloud auth login` and follow the instructions
6. Create a firebase project, and change both `.firebaserc`'s dev value, and `docker/docker-dev.sh`'s GCLOUD_PROJECT_ID value to the created project id
7. Activate the Secret Manager API for the project
8. Create a Service Account, download it's credential file and put it in `docker/dev-firebase-credentials.json`
9. Go to IAM and give the role "Secret Manager Admin" to the created account (firebase-adminsdk)
10. Run `docker-compose exec manifold sh docker/firebase-create-secrets.sh`
11. Download https://drive.google.com/drive/folders/1C_EuERO9KlQEH9hg9aCMjcKYvL39kTrU and copy `firestore_export` folder to `backend/functions/firestore_export`
12. Run `docker-compose exec manifold yarn --cwd=backend/functions build`
13. On the original terminal tab, stop `./run.sh` (Ctrl+c), and run it again
14. All done! On your browser, you can now open http://localhost:3000/. It'll take a while to load the first time. You should see a log `[NEXT] - wait compiling / (client and server)...` on the terminal
