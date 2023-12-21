CREATE TABLE IF NOT EXISTS "federated_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"provider" text,
	"subject" text,
	CONSTRAINT "federated_credentials_provider_subject_unique" UNIQUE("provider","subject")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "federated_credentials" ADD CONSTRAINT "federated_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
