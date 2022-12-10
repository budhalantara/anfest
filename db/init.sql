CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."users" (
    "id" bigint DEFAULT nextval('users_id_seq') NOT NULL,
    "name" character varying NOT NULL,
    "spotify_user_id" character varying,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz,
    "profile_picture_url" text,
    "spotify_oauth_data" text,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER "update_users_updated_at_column" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();;
