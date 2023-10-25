PATH="/google-cloud-sdk/bin:$PATH" # not sure if needed
export JAVA_TOOL_OPTIONS="-Xmx4g" # Needed for firestore emulator

NEXT_ENV=DEV
FIREBASE_PROJECT=dev
GCLOUD_PROJECT_ID=manifold-test-27be7 # TODO: we could get the value from .firebaserc using jq and $FIREBASE_PROJECT as the object key

export GOOGLE_APPLICATION_CREDENTIALS_DEV=/home/node/app/docker/dev-firebase-credentials.json
firebase use $FIREBASE_PROJECT
gcloud config set project $GCLOUD_PROJECT_ID

npx concurrently \
    -n FIRESTORE,FUNCTIONS,NEXT,NEXT_TS_WATCH \
    -c green,white,magenta,cyan \
    "yarn --cwd=backend/functions localDbScript" \
    "cross-env FIRESTORE_EMULATOR_HOST=0.0.0.0:8080 \
               yarn --cwd=backend/api dev" \
    "cross-env NEXT_PUBLIC_API_URL=http://localhost:8088 \
             NEXT_PUBLIC_FIREBASE_EMULATE=TRUE \
             NEXT_PUBLIC_FIREBASE_ENV=${NEXT_ENV} \
             yarn --cwd=web serve" \
    "yarn --cwd=web ts-watch"
