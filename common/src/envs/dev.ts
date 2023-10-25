import { EnvConfig, PROD_CONFIG } from './prod'

export const DEV_CONFIG: EnvConfig = {
  ...PROD_CONFIG,
  domain: 'dev.manifold.markets',
  loveDomain: 'dev.manifold.love',
  firebaseConfig: {
    apiKey: 'AIzaSyBZzpS7hPSaVHUkZw19dCaQTWGwk4zyUjw',
    authDomain: 'manifold-test-27be7.firebaseapp.com',
    projectId: 'manifold-test-27be7',
    region: 'us-central1',
    storageBucket: 'manifold-test-27be7.appspot.com',
    messagingSenderId: '23904044021',
    appId: '1:23904044021:web:3fac6c498f285a2766d6bc',
    measurementId: 'G-BE6RBNHMB5',
  },
  cloudRunId: 'w3txbmd3ba',
  cloudRunRegion: 'uc',
  amplitudeApiKey: 'fd8cbfd964b9a205b8678a39faae71b3',
  supabaseInstanceId: 'zyxolldekxubafxddowi',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eG9sbGRla3h1YmFmeGRkb3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNzM0NzQsImV4cCI6MjAxMzg0OTQ3NH0.g0RZQeVzefIzLjguy6v6CTQZYa7l3riplLRGoMZT_qc',
  twitchBotEndpoint: 'https://dev-twitch-bot.manifold.markets',
  sprigEnvironmentId: 'Tu7kRZPm7daP',
  expoConfig: {
    iosClientId:
      '134303100058-lioqb7auc8minvqt9iamuit2pg10pubt.apps.googleusercontent.com',
    expoClientId:
      '134303100058-2uvio555s8mnhde20b4old97ptjnji3u.apps.googleusercontent.com',
    androidClientId:
      '134303100058-mu6dbubhks8khpqi3dq0fokqnkbputiq.apps.googleusercontent.com',
  },
  adminIds: ['pfKxvtgSEua5DxoIfiPXxR4fAWd2', '6hHpzvRG0pMq8PNJs7RZj2qlZGn2'],
}
