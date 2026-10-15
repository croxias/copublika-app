CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" text PRIMARY KEY NOT NULL,
	"kicker" text NOT NULL,
	"title" text NOT NULL,
	"title_accent" text DEFAULT '' NOT NULL,
	"dek" text NOT NULL,
	"cta_label" text NOT NULL,
	"cta_href" text NOT NULL,
	"secondary_label" text,
	"secondary_href" text,
	"image_src" text NOT NULL,
	"image_alt" text NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_sections" (
	"key" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
