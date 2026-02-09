-- Delete broken employee profiles (they will be recreated with usernames)
DELETE FROM "profiles" WHERE role = 'employee';

-- Add username column
ALTER TABLE "profiles" ADD COLUMN "username" TEXT;

-- Set username for existing admin
UPDATE "profiles" SET "username" = 'admin' WHERE email = 'admin@roia.com';

-- Make username NOT NULL and UNIQUE
ALTER TABLE "profiles" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
