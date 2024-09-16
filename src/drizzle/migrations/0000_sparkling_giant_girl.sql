CREATE TABLE IF NOT EXISTS "userAuth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "userAuth_email_unique" UNIQUE("email")
);
