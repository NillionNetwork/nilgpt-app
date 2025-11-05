# nilGPT

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a development build locally

```bash
pnpm build:ios:dev
```

- Builds the app locally (not on EAS servers)
- Uses the `development` profile from `eas.json`
- Outputs an iOS build that can be installed on a device or simulator

**Note:** Requires EAS CLI to be installed and configured. You'll need to have Xcode installed for local iOS builds.

3. Start Expo development server for iOS

```bash
pnpm ios
```
