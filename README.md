# Bono

RaceHub's community API provides authenticated file upload, file checks, and machine logs. It has no payment or subscription routes.

## Run your own instance

- Create a Firebase project with Authentication, Firestore, and Cloud Storage.
- Set the default Storage bucket in the Firebase deployment configuration.
- Give the deployment identity access to its own database and bucket. It must be able to sign upload URLs.
- Select your own Firebase project before deployment. Keep local project mappings and credentials out of Git.
- Use Node.js 22. Install dependencies with `npm ci --ignore-scripts` in `functions`.
- Run `npm run build` in `functions`.

The API uses the verified user's ID for each operation. A signed-in user needs no paid RaceHub account. The instance operator provides the cloud infrastructure. Cloud usage can have costs.

The functions use the explicit Firebase v1 API with current server SDKs.
A live deployment integration test has not run for this release.

## Community

See [LICENSING.md](LICENSING.md), [CONTRIBUTING.md](CONTRIBUTING.md), and [SECURITY.md](SECURITY.md). RaceHub-owned source uses CC0. Third-party terms remain in force. The operator supplies any optional cloud infrastructure.
