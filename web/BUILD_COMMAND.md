# Updated Build Command for Render

Due to a failed migration issue, the build command needs to include a cleanup script.

## Updated Build Command

Update your Render web service build command to:

```bash
npm install && npx prisma generate && node scripts/fix-failed-migration.js && npx prisma migrate deploy && npm run build
```

## How to Update

1. Go to your Render Dashboard
2. Navigate to your web service
3. Go to "Settings"
4. Find "Build Command"
5. Replace it with the command above
6. Save and trigger a new deployment

## What This Does

1. Installs dependencies
2. Generates Prisma Client
3. **Cleans up any failed migration records** (new step)
4. Runs database migrations
5. Builds the Next.js application

## After Migration Succeeds

Once the migration runs successfully and account creation works, you can:
1. Remove the `scripts/fix-failed-migration.js` file
2. Update the build command back to:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```

