create table "public"."bottling_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "batch_log_id" uuid,
    "container_volume_liters" numeric
);


create table "public"."fertilizing_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_log_id" uuid,
    "fertilizing_profile_id" uuid
);


create table "public"."fertilizing_profiles" (
    "id" uuid not null default uuid_generate_v4(),
    "nitrogen" boolean default false,
    "potassium" boolean default false,
    "phosphore" boolean default false,
    "borron" boolean default false,
    "chicken_manure" boolean default false,
    "lime" boolean default false,
    "gypsum" boolean default false,
    "created_at" timestamp with time zone default now()
);


create table "public"."filtering_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "batch_log_id" uuid,
    "plant_name" text,
    "price" numeric,
    "notes" text
);


create table "public"."flowering_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_log_id" uuid,
    "percentage_initial" numeric,
    "percentage_remaining" numeric
);


create table "public"."harvesting_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_log_id" uuid,
    "amount_kgs" numeric,
    "harvesting_profile_id" uuid
);


create table "public"."harvesting_profiles" (
    "id" uuid not null default uuid_generate_v4(),
    "type" text,
    "contractor_name" text,
    "price" numeric,
    "created_at" timestamp with time zone default now()
);


create table "public"."irrigation_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_log_id" uuid,
    "number_of_drippers" integer,
    "number_of_hours" numeric
);


create table "public"."oil_processing_batch_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "batch_id" uuid,
    "date" date not null,
    "action_type" text not null,
    "created_at" timestamp with time zone default now()
);


create table "public"."oil_processing_batches" (
    "id" uuid not null default uuid_generate_v4(),
    "date" date not null,
    "tree_ids" uuid[] not null,
    "created_at" timestamp with time zone default now()
);


create table "public"."pickling_batches" (
    "id" uuid not null default uuid_generate_v4(),
    "date" date not null,
    "tree_ids" uuid[] not null,
    "variety" text,
    "ripeness" text,
    "notes" text,
    "supplier" text,
    "salt_percentage" numeric,
    "bruised" boolean default false,
    "recipe_notes" text,
    "created_at" timestamp with time zone default now()
);


create table "public"."processing_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "batch_log_id" uuid,
    "plant_name" text,
    "notes" text,
    "price" numeric,
    "weight_kgs" numeric,
    "yield_liters" numeric,
    "percentage" numeric
);


create table "public"."pruning_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_log_id" uuid,
    "vase_shape" boolean default false,
    "bushy_shape" boolean default false,
    "clear_trunk" boolean default false,
    "skirt" boolean default false,
    "high_growing_ends" boolean default false,
    "wild_shoots" boolean default false
);


create table "public"."transportation_grove_to_plant_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "batch_log_id" uuid,
    "driver_name" text,
    "price" numeric
);


create table "public"."transportation_plant_to_home_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "batch_log_id" uuid,
    "driver_name" text,
    "price" numeric
);


create table "public"."treatment_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_log_id" uuid,
    "white_oil" boolean default false,
    "other" text
);


create table "public"."tree_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_id" uuid,
    "date" date not null,
    "action_type" text not null,
    "created_at" timestamp with time zone default now()
);


create table "public"."trees" (
    "id" uuid not null default uuid_generate_v4(),
    "position_row" integer not null,
    "position_col" integer not null,
    "variety" text,
    "year_planted" integer,
    "supplier" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."weather_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "tree_log_id" uuid,
    "weather_profile_id" uuid
);


create table "public"."weather_profiles" (
    "id" uuid not null default uuid_generate_v4(),
    "frost" boolean default false,
    "rain" boolean default false,
    "temperature" numeric,
    "created_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX bottling_logs_pkey ON public.bottling_logs USING btree (id);

CREATE UNIQUE INDEX fertilizing_logs_pkey ON public.fertilizing_logs USING btree (id);

CREATE UNIQUE INDEX fertilizing_profiles_pkey ON public.fertilizing_profiles USING btree (id);

CREATE UNIQUE INDEX filtering_logs_pkey ON public.filtering_logs USING btree (id);

CREATE UNIQUE INDEX flowering_logs_pkey ON public.flowering_logs USING btree (id);

CREATE UNIQUE INDEX harvesting_logs_pkey ON public.harvesting_logs USING btree (id);

CREATE UNIQUE INDEX harvesting_profiles_pkey ON public.harvesting_profiles USING btree (id);

CREATE INDEX idx_oil_processing_batches_date ON public.oil_processing_batches USING btree (date);

CREATE INDEX idx_pickling_batches_date ON public.pickling_batches USING btree (date);

CREATE INDEX idx_tree_logs_date ON public.tree_logs USING btree (date);

CREATE INDEX idx_tree_logs_tree_id ON public.tree_logs USING btree (tree_id);

CREATE INDEX idx_trees_position ON public.trees USING btree (position_row, position_col);

CREATE UNIQUE INDEX irrigation_logs_pkey ON public.irrigation_logs USING btree (id);

CREATE UNIQUE INDEX oil_processing_batch_logs_pkey ON public.oil_processing_batch_logs USING btree (id);

CREATE UNIQUE INDEX oil_processing_batches_pkey ON public.oil_processing_batches USING btree (id);

CREATE UNIQUE INDEX pickling_batches_pkey ON public.pickling_batches USING btree (id);

CREATE UNIQUE INDEX processing_logs_pkey ON public.processing_logs USING btree (id);

CREATE UNIQUE INDEX pruning_logs_pkey ON public.pruning_logs USING btree (id);

CREATE UNIQUE INDEX transportation_grove_to_plant_logs_pkey ON public.transportation_grove_to_plant_logs USING btree (id);

CREATE UNIQUE INDEX transportation_plant_to_home_logs_pkey ON public.transportation_plant_to_home_logs USING btree (id);

CREATE UNIQUE INDEX treatment_logs_pkey ON public.treatment_logs USING btree (id);

CREATE UNIQUE INDEX tree_logs_pkey ON public.tree_logs USING btree (id);

CREATE UNIQUE INDEX trees_pkey ON public.trees USING btree (id);

CREATE UNIQUE INDEX weather_logs_pkey ON public.weather_logs USING btree (id);

CREATE UNIQUE INDEX weather_profiles_pkey ON public.weather_profiles USING btree (id);

alter table "public"."bottling_logs" add constraint "bottling_logs_pkey" PRIMARY KEY using index "bottling_logs_pkey";

alter table "public"."fertilizing_logs" add constraint "fertilizing_logs_pkey" PRIMARY KEY using index "fertilizing_logs_pkey";

alter table "public"."fertilizing_profiles" add constraint "fertilizing_profiles_pkey" PRIMARY KEY using index "fertilizing_profiles_pkey";

alter table "public"."filtering_logs" add constraint "filtering_logs_pkey" PRIMARY KEY using index "filtering_logs_pkey";

alter table "public"."flowering_logs" add constraint "flowering_logs_pkey" PRIMARY KEY using index "flowering_logs_pkey";

alter table "public"."harvesting_logs" add constraint "harvesting_logs_pkey" PRIMARY KEY using index "harvesting_logs_pkey";

alter table "public"."harvesting_profiles" add constraint "harvesting_profiles_pkey" PRIMARY KEY using index "harvesting_profiles_pkey";

alter table "public"."irrigation_logs" add constraint "irrigation_logs_pkey" PRIMARY KEY using index "irrigation_logs_pkey";

alter table "public"."oil_processing_batch_logs" add constraint "oil_processing_batch_logs_pkey" PRIMARY KEY using index "oil_processing_batch_logs_pkey";

alter table "public"."oil_processing_batches" add constraint "oil_processing_batches_pkey" PRIMARY KEY using index "oil_processing_batches_pkey";

alter table "public"."pickling_batches" add constraint "pickling_batches_pkey" PRIMARY KEY using index "pickling_batches_pkey";

alter table "public"."processing_logs" add constraint "processing_logs_pkey" PRIMARY KEY using index "processing_logs_pkey";

alter table "public"."pruning_logs" add constraint "pruning_logs_pkey" PRIMARY KEY using index "pruning_logs_pkey";

alter table "public"."transportation_grove_to_plant_logs" add constraint "transportation_grove_to_plant_logs_pkey" PRIMARY KEY using index "transportation_grove_to_plant_logs_pkey";

alter table "public"."transportation_plant_to_home_logs" add constraint "transportation_plant_to_home_logs_pkey" PRIMARY KEY using index "transportation_plant_to_home_logs_pkey";

alter table "public"."treatment_logs" add constraint "treatment_logs_pkey" PRIMARY KEY using index "treatment_logs_pkey";

alter table "public"."tree_logs" add constraint "tree_logs_pkey" PRIMARY KEY using index "tree_logs_pkey";

alter table "public"."trees" add constraint "trees_pkey" PRIMARY KEY using index "trees_pkey";

alter table "public"."weather_logs" add constraint "weather_logs_pkey" PRIMARY KEY using index "weather_logs_pkey";

alter table "public"."weather_profiles" add constraint "weather_profiles_pkey" PRIMARY KEY using index "weather_profiles_pkey";

alter table "public"."bottling_logs" add constraint "bottling_logs_batch_log_id_fkey" FOREIGN KEY (batch_log_id) REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE not valid;

alter table "public"."bottling_logs" validate constraint "bottling_logs_batch_log_id_fkey";

alter table "public"."fertilizing_logs" add constraint "fertilizing_logs_fertilizing_profile_id_fkey" FOREIGN KEY (fertilizing_profile_id) REFERENCES fertilizing_profiles(id) not valid;

alter table "public"."fertilizing_logs" validate constraint "fertilizing_logs_fertilizing_profile_id_fkey";

alter table "public"."fertilizing_logs" add constraint "fertilizing_logs_tree_log_id_fkey" FOREIGN KEY (tree_log_id) REFERENCES tree_logs(id) ON DELETE CASCADE not valid;

alter table "public"."fertilizing_logs" validate constraint "fertilizing_logs_tree_log_id_fkey";

alter table "public"."filtering_logs" add constraint "filtering_logs_batch_log_id_fkey" FOREIGN KEY (batch_log_id) REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE not valid;

alter table "public"."filtering_logs" validate constraint "filtering_logs_batch_log_id_fkey";

alter table "public"."flowering_logs" add constraint "flowering_logs_tree_log_id_fkey" FOREIGN KEY (tree_log_id) REFERENCES tree_logs(id) ON DELETE CASCADE not valid;

alter table "public"."flowering_logs" validate constraint "flowering_logs_tree_log_id_fkey";

alter table "public"."harvesting_logs" add constraint "harvesting_logs_harvesting_profile_id_fkey" FOREIGN KEY (harvesting_profile_id) REFERENCES harvesting_profiles(id) not valid;

alter table "public"."harvesting_logs" validate constraint "harvesting_logs_harvesting_profile_id_fkey";

alter table "public"."harvesting_logs" add constraint "harvesting_logs_tree_log_id_fkey" FOREIGN KEY (tree_log_id) REFERENCES tree_logs(id) ON DELETE CASCADE not valid;

alter table "public"."harvesting_logs" validate constraint "harvesting_logs_tree_log_id_fkey";

alter table "public"."harvesting_profiles" add constraint "harvesting_profiles_type_check" CHECK ((type = ANY (ARRAY['mechanical'::text, 'manual'::text]))) not valid;

alter table "public"."harvesting_profiles" validate constraint "harvesting_profiles_type_check";

alter table "public"."irrigation_logs" add constraint "irrigation_logs_tree_log_id_fkey" FOREIGN KEY (tree_log_id) REFERENCES tree_logs(id) ON DELETE CASCADE not valid;

alter table "public"."irrigation_logs" validate constraint "irrigation_logs_tree_log_id_fkey";

alter table "public"."oil_processing_batch_logs" add constraint "oil_processing_batch_logs_batch_id_fkey" FOREIGN KEY (batch_id) REFERENCES oil_processing_batches(id) ON DELETE CASCADE not valid;

alter table "public"."oil_processing_batch_logs" validate constraint "oil_processing_batch_logs_batch_id_fkey";

alter table "public"."processing_logs" add constraint "processing_logs_batch_log_id_fkey" FOREIGN KEY (batch_log_id) REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE not valid;

alter table "public"."processing_logs" validate constraint "processing_logs_batch_log_id_fkey";

alter table "public"."pruning_logs" add constraint "pruning_logs_tree_log_id_fkey" FOREIGN KEY (tree_log_id) REFERENCES tree_logs(id) ON DELETE CASCADE not valid;

alter table "public"."pruning_logs" validate constraint "pruning_logs_tree_log_id_fkey";

alter table "public"."transportation_grove_to_plant_logs" add constraint "transportation_grove_to_plant_logs_batch_log_id_fkey" FOREIGN KEY (batch_log_id) REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE not valid;

alter table "public"."transportation_grove_to_plant_logs" validate constraint "transportation_grove_to_plant_logs_batch_log_id_fkey";

alter table "public"."transportation_plant_to_home_logs" add constraint "transportation_plant_to_home_logs_batch_log_id_fkey" FOREIGN KEY (batch_log_id) REFERENCES oil_processing_batch_logs(id) ON DELETE CASCADE not valid;

alter table "public"."transportation_plant_to_home_logs" validate constraint "transportation_plant_to_home_logs_batch_log_id_fkey";

alter table "public"."treatment_logs" add constraint "treatment_logs_tree_log_id_fkey" FOREIGN KEY (tree_log_id) REFERENCES tree_logs(id) ON DELETE CASCADE not valid;

alter table "public"."treatment_logs" validate constraint "treatment_logs_tree_log_id_fkey";

alter table "public"."tree_logs" add constraint "tree_logs_tree_id_fkey" FOREIGN KEY (tree_id) REFERENCES trees(id) ON DELETE CASCADE not valid;

alter table "public"."tree_logs" validate constraint "tree_logs_tree_id_fkey";

alter table "public"."trees" add constraint "trees_variety_check" CHECK ((variety = ANY (ARRAY['frontoyo'::text, 'kalamata'::text, 'jumbo kalamata'::text, 'spanish queen'::text, 'burnia'::text]))) not valid;

alter table "public"."trees" validate constraint "trees_variety_check";

alter table "public"."weather_logs" add constraint "weather_logs_tree_log_id_fkey" FOREIGN KEY (tree_log_id) REFERENCES tree_logs(id) ON DELETE CASCADE not valid;

alter table "public"."weather_logs" validate constraint "weather_logs_tree_log_id_fkey";

alter table "public"."weather_logs" add constraint "weather_logs_weather_profile_id_fkey" FOREIGN KEY (weather_profile_id) REFERENCES weather_profiles(id) not valid;

alter table "public"."weather_logs" validate constraint "weather_logs_weather_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."bottling_logs" to "anon";

grant insert on table "public"."bottling_logs" to "anon";

grant references on table "public"."bottling_logs" to "anon";

grant select on table "public"."bottling_logs" to "anon";

grant trigger on table "public"."bottling_logs" to "anon";

grant truncate on table "public"."bottling_logs" to "anon";

grant update on table "public"."bottling_logs" to "anon";

grant delete on table "public"."bottling_logs" to "authenticated";

grant insert on table "public"."bottling_logs" to "authenticated";

grant references on table "public"."bottling_logs" to "authenticated";

grant select on table "public"."bottling_logs" to "authenticated";

grant trigger on table "public"."bottling_logs" to "authenticated";

grant truncate on table "public"."bottling_logs" to "authenticated";

grant update on table "public"."bottling_logs" to "authenticated";

grant delete on table "public"."bottling_logs" to "service_role";

grant insert on table "public"."bottling_logs" to "service_role";

grant references on table "public"."bottling_logs" to "service_role";

grant select on table "public"."bottling_logs" to "service_role";

grant trigger on table "public"."bottling_logs" to "service_role";

grant truncate on table "public"."bottling_logs" to "service_role";

grant update on table "public"."bottling_logs" to "service_role";

grant delete on table "public"."fertilizing_logs" to "anon";

grant insert on table "public"."fertilizing_logs" to "anon";

grant references on table "public"."fertilizing_logs" to "anon";

grant select on table "public"."fertilizing_logs" to "anon";

grant trigger on table "public"."fertilizing_logs" to "anon";

grant truncate on table "public"."fertilizing_logs" to "anon";

grant update on table "public"."fertilizing_logs" to "anon";

grant delete on table "public"."fertilizing_logs" to "authenticated";

grant insert on table "public"."fertilizing_logs" to "authenticated";

grant references on table "public"."fertilizing_logs" to "authenticated";

grant select on table "public"."fertilizing_logs" to "authenticated";

grant trigger on table "public"."fertilizing_logs" to "authenticated";

grant truncate on table "public"."fertilizing_logs" to "authenticated";

grant update on table "public"."fertilizing_logs" to "authenticated";

grant delete on table "public"."fertilizing_logs" to "service_role";

grant insert on table "public"."fertilizing_logs" to "service_role";

grant references on table "public"."fertilizing_logs" to "service_role";

grant select on table "public"."fertilizing_logs" to "service_role";

grant trigger on table "public"."fertilizing_logs" to "service_role";

grant truncate on table "public"."fertilizing_logs" to "service_role";

grant update on table "public"."fertilizing_logs" to "service_role";

grant delete on table "public"."fertilizing_profiles" to "anon";

grant insert on table "public"."fertilizing_profiles" to "anon";

grant references on table "public"."fertilizing_profiles" to "anon";

grant select on table "public"."fertilizing_profiles" to "anon";

grant trigger on table "public"."fertilizing_profiles" to "anon";

grant truncate on table "public"."fertilizing_profiles" to "anon";

grant update on table "public"."fertilizing_profiles" to "anon";

grant delete on table "public"."fertilizing_profiles" to "authenticated";

grant insert on table "public"."fertilizing_profiles" to "authenticated";

grant references on table "public"."fertilizing_profiles" to "authenticated";

grant select on table "public"."fertilizing_profiles" to "authenticated";

grant trigger on table "public"."fertilizing_profiles" to "authenticated";

grant truncate on table "public"."fertilizing_profiles" to "authenticated";

grant update on table "public"."fertilizing_profiles" to "authenticated";

grant delete on table "public"."fertilizing_profiles" to "service_role";

grant insert on table "public"."fertilizing_profiles" to "service_role";

grant references on table "public"."fertilizing_profiles" to "service_role";

grant select on table "public"."fertilizing_profiles" to "service_role";

grant trigger on table "public"."fertilizing_profiles" to "service_role";

grant truncate on table "public"."fertilizing_profiles" to "service_role";

grant update on table "public"."fertilizing_profiles" to "service_role";

grant delete on table "public"."filtering_logs" to "anon";

grant insert on table "public"."filtering_logs" to "anon";

grant references on table "public"."filtering_logs" to "anon";

grant select on table "public"."filtering_logs" to "anon";

grant trigger on table "public"."filtering_logs" to "anon";

grant truncate on table "public"."filtering_logs" to "anon";

grant update on table "public"."filtering_logs" to "anon";

grant delete on table "public"."filtering_logs" to "authenticated";

grant insert on table "public"."filtering_logs" to "authenticated";

grant references on table "public"."filtering_logs" to "authenticated";

grant select on table "public"."filtering_logs" to "authenticated";

grant trigger on table "public"."filtering_logs" to "authenticated";

grant truncate on table "public"."filtering_logs" to "authenticated";

grant update on table "public"."filtering_logs" to "authenticated";

grant delete on table "public"."filtering_logs" to "service_role";

grant insert on table "public"."filtering_logs" to "service_role";

grant references on table "public"."filtering_logs" to "service_role";

grant select on table "public"."filtering_logs" to "service_role";

grant trigger on table "public"."filtering_logs" to "service_role";

grant truncate on table "public"."filtering_logs" to "service_role";

grant update on table "public"."filtering_logs" to "service_role";

grant delete on table "public"."flowering_logs" to "anon";

grant insert on table "public"."flowering_logs" to "anon";

grant references on table "public"."flowering_logs" to "anon";

grant select on table "public"."flowering_logs" to "anon";

grant trigger on table "public"."flowering_logs" to "anon";

grant truncate on table "public"."flowering_logs" to "anon";

grant update on table "public"."flowering_logs" to "anon";

grant delete on table "public"."flowering_logs" to "authenticated";

grant insert on table "public"."flowering_logs" to "authenticated";

grant references on table "public"."flowering_logs" to "authenticated";

grant select on table "public"."flowering_logs" to "authenticated";

grant trigger on table "public"."flowering_logs" to "authenticated";

grant truncate on table "public"."flowering_logs" to "authenticated";

grant update on table "public"."flowering_logs" to "authenticated";

grant delete on table "public"."flowering_logs" to "service_role";

grant insert on table "public"."flowering_logs" to "service_role";

grant references on table "public"."flowering_logs" to "service_role";

grant select on table "public"."flowering_logs" to "service_role";

grant trigger on table "public"."flowering_logs" to "service_role";

grant truncate on table "public"."flowering_logs" to "service_role";

grant update on table "public"."flowering_logs" to "service_role";

grant delete on table "public"."harvesting_logs" to "anon";

grant insert on table "public"."harvesting_logs" to "anon";

grant references on table "public"."harvesting_logs" to "anon";

grant select on table "public"."harvesting_logs" to "anon";

grant trigger on table "public"."harvesting_logs" to "anon";

grant truncate on table "public"."harvesting_logs" to "anon";

grant update on table "public"."harvesting_logs" to "anon";

grant delete on table "public"."harvesting_logs" to "authenticated";

grant insert on table "public"."harvesting_logs" to "authenticated";

grant references on table "public"."harvesting_logs" to "authenticated";

grant select on table "public"."harvesting_logs" to "authenticated";

grant trigger on table "public"."harvesting_logs" to "authenticated";

grant truncate on table "public"."harvesting_logs" to "authenticated";

grant update on table "public"."harvesting_logs" to "authenticated";

grant delete on table "public"."harvesting_logs" to "service_role";

grant insert on table "public"."harvesting_logs" to "service_role";

grant references on table "public"."harvesting_logs" to "service_role";

grant select on table "public"."harvesting_logs" to "service_role";

grant trigger on table "public"."harvesting_logs" to "service_role";

grant truncate on table "public"."harvesting_logs" to "service_role";

grant update on table "public"."harvesting_logs" to "service_role";

grant delete on table "public"."harvesting_profiles" to "anon";

grant insert on table "public"."harvesting_profiles" to "anon";

grant references on table "public"."harvesting_profiles" to "anon";

grant select on table "public"."harvesting_profiles" to "anon";

grant trigger on table "public"."harvesting_profiles" to "anon";

grant truncate on table "public"."harvesting_profiles" to "anon";

grant update on table "public"."harvesting_profiles" to "anon";

grant delete on table "public"."harvesting_profiles" to "authenticated";

grant insert on table "public"."harvesting_profiles" to "authenticated";

grant references on table "public"."harvesting_profiles" to "authenticated";

grant select on table "public"."harvesting_profiles" to "authenticated";

grant trigger on table "public"."harvesting_profiles" to "authenticated";

grant truncate on table "public"."harvesting_profiles" to "authenticated";

grant update on table "public"."harvesting_profiles" to "authenticated";

grant delete on table "public"."harvesting_profiles" to "service_role";

grant insert on table "public"."harvesting_profiles" to "service_role";

grant references on table "public"."harvesting_profiles" to "service_role";

grant select on table "public"."harvesting_profiles" to "service_role";

grant trigger on table "public"."harvesting_profiles" to "service_role";

grant truncate on table "public"."harvesting_profiles" to "service_role";

grant update on table "public"."harvesting_profiles" to "service_role";

grant delete on table "public"."irrigation_logs" to "anon";

grant insert on table "public"."irrigation_logs" to "anon";

grant references on table "public"."irrigation_logs" to "anon";

grant select on table "public"."irrigation_logs" to "anon";

grant trigger on table "public"."irrigation_logs" to "anon";

grant truncate on table "public"."irrigation_logs" to "anon";

grant update on table "public"."irrigation_logs" to "anon";

grant delete on table "public"."irrigation_logs" to "authenticated";

grant insert on table "public"."irrigation_logs" to "authenticated";

grant references on table "public"."irrigation_logs" to "authenticated";

grant select on table "public"."irrigation_logs" to "authenticated";

grant trigger on table "public"."irrigation_logs" to "authenticated";

grant truncate on table "public"."irrigation_logs" to "authenticated";

grant update on table "public"."irrigation_logs" to "authenticated";

grant delete on table "public"."irrigation_logs" to "service_role";

grant insert on table "public"."irrigation_logs" to "service_role";

grant references on table "public"."irrigation_logs" to "service_role";

grant select on table "public"."irrigation_logs" to "service_role";

grant trigger on table "public"."irrigation_logs" to "service_role";

grant truncate on table "public"."irrigation_logs" to "service_role";

grant update on table "public"."irrigation_logs" to "service_role";

grant delete on table "public"."oil_processing_batch_logs" to "anon";

grant insert on table "public"."oil_processing_batch_logs" to "anon";

grant references on table "public"."oil_processing_batch_logs" to "anon";

grant select on table "public"."oil_processing_batch_logs" to "anon";

grant trigger on table "public"."oil_processing_batch_logs" to "anon";

grant truncate on table "public"."oil_processing_batch_logs" to "anon";

grant update on table "public"."oil_processing_batch_logs" to "anon";

grant delete on table "public"."oil_processing_batch_logs" to "authenticated";

grant insert on table "public"."oil_processing_batch_logs" to "authenticated";

grant references on table "public"."oil_processing_batch_logs" to "authenticated";

grant select on table "public"."oil_processing_batch_logs" to "authenticated";

grant trigger on table "public"."oil_processing_batch_logs" to "authenticated";

grant truncate on table "public"."oil_processing_batch_logs" to "authenticated";

grant update on table "public"."oil_processing_batch_logs" to "authenticated";

grant delete on table "public"."oil_processing_batch_logs" to "service_role";

grant insert on table "public"."oil_processing_batch_logs" to "service_role";

grant references on table "public"."oil_processing_batch_logs" to "service_role";

grant select on table "public"."oil_processing_batch_logs" to "service_role";

grant trigger on table "public"."oil_processing_batch_logs" to "service_role";

grant truncate on table "public"."oil_processing_batch_logs" to "service_role";

grant update on table "public"."oil_processing_batch_logs" to "service_role";

grant delete on table "public"."oil_processing_batches" to "anon";

grant insert on table "public"."oil_processing_batches" to "anon";

grant references on table "public"."oil_processing_batches" to "anon";

grant select on table "public"."oil_processing_batches" to "anon";

grant trigger on table "public"."oil_processing_batches" to "anon";

grant truncate on table "public"."oil_processing_batches" to "anon";

grant update on table "public"."oil_processing_batches" to "anon";

grant delete on table "public"."oil_processing_batches" to "authenticated";

grant insert on table "public"."oil_processing_batches" to "authenticated";

grant references on table "public"."oil_processing_batches" to "authenticated";

grant select on table "public"."oil_processing_batches" to "authenticated";

grant trigger on table "public"."oil_processing_batches" to "authenticated";

grant truncate on table "public"."oil_processing_batches" to "authenticated";

grant update on table "public"."oil_processing_batches" to "authenticated";

grant delete on table "public"."oil_processing_batches" to "service_role";

grant insert on table "public"."oil_processing_batches" to "service_role";

grant references on table "public"."oil_processing_batches" to "service_role";

grant select on table "public"."oil_processing_batches" to "service_role";

grant trigger on table "public"."oil_processing_batches" to "service_role";

grant truncate on table "public"."oil_processing_batches" to "service_role";

grant update on table "public"."oil_processing_batches" to "service_role";

grant delete on table "public"."pickling_batches" to "anon";

grant insert on table "public"."pickling_batches" to "anon";

grant references on table "public"."pickling_batches" to "anon";

grant select on table "public"."pickling_batches" to "anon";

grant trigger on table "public"."pickling_batches" to "anon";

grant truncate on table "public"."pickling_batches" to "anon";

grant update on table "public"."pickling_batches" to "anon";

grant delete on table "public"."pickling_batches" to "authenticated";

grant insert on table "public"."pickling_batches" to "authenticated";

grant references on table "public"."pickling_batches" to "authenticated";

grant select on table "public"."pickling_batches" to "authenticated";

grant trigger on table "public"."pickling_batches" to "authenticated";

grant truncate on table "public"."pickling_batches" to "authenticated";

grant update on table "public"."pickling_batches" to "authenticated";

grant delete on table "public"."pickling_batches" to "service_role";

grant insert on table "public"."pickling_batches" to "service_role";

grant references on table "public"."pickling_batches" to "service_role";

grant select on table "public"."pickling_batches" to "service_role";

grant trigger on table "public"."pickling_batches" to "service_role";

grant truncate on table "public"."pickling_batches" to "service_role";

grant update on table "public"."pickling_batches" to "service_role";

grant delete on table "public"."processing_logs" to "anon";

grant insert on table "public"."processing_logs" to "anon";

grant references on table "public"."processing_logs" to "anon";

grant select on table "public"."processing_logs" to "anon";

grant trigger on table "public"."processing_logs" to "anon";

grant truncate on table "public"."processing_logs" to "anon";

grant update on table "public"."processing_logs" to "anon";

grant delete on table "public"."processing_logs" to "authenticated";

grant insert on table "public"."processing_logs" to "authenticated";

grant references on table "public"."processing_logs" to "authenticated";

grant select on table "public"."processing_logs" to "authenticated";

grant trigger on table "public"."processing_logs" to "authenticated";

grant truncate on table "public"."processing_logs" to "authenticated";

grant update on table "public"."processing_logs" to "authenticated";

grant delete on table "public"."processing_logs" to "service_role";

grant insert on table "public"."processing_logs" to "service_role";

grant references on table "public"."processing_logs" to "service_role";

grant select on table "public"."processing_logs" to "service_role";

grant trigger on table "public"."processing_logs" to "service_role";

grant truncate on table "public"."processing_logs" to "service_role";

grant update on table "public"."processing_logs" to "service_role";

grant delete on table "public"."pruning_logs" to "anon";

grant insert on table "public"."pruning_logs" to "anon";

grant references on table "public"."pruning_logs" to "anon";

grant select on table "public"."pruning_logs" to "anon";

grant trigger on table "public"."pruning_logs" to "anon";

grant truncate on table "public"."pruning_logs" to "anon";

grant update on table "public"."pruning_logs" to "anon";

grant delete on table "public"."pruning_logs" to "authenticated";

grant insert on table "public"."pruning_logs" to "authenticated";

grant references on table "public"."pruning_logs" to "authenticated";

grant select on table "public"."pruning_logs" to "authenticated";

grant trigger on table "public"."pruning_logs" to "authenticated";

grant truncate on table "public"."pruning_logs" to "authenticated";

grant update on table "public"."pruning_logs" to "authenticated";

grant delete on table "public"."pruning_logs" to "service_role";

grant insert on table "public"."pruning_logs" to "service_role";

grant references on table "public"."pruning_logs" to "service_role";

grant select on table "public"."pruning_logs" to "service_role";

grant trigger on table "public"."pruning_logs" to "service_role";

grant truncate on table "public"."pruning_logs" to "service_role";

grant update on table "public"."pruning_logs" to "service_role";

grant delete on table "public"."transportation_grove_to_plant_logs" to "anon";

grant insert on table "public"."transportation_grove_to_plant_logs" to "anon";

grant references on table "public"."transportation_grove_to_plant_logs" to "anon";

grant select on table "public"."transportation_grove_to_plant_logs" to "anon";

grant trigger on table "public"."transportation_grove_to_plant_logs" to "anon";

grant truncate on table "public"."transportation_grove_to_plant_logs" to "anon";

grant update on table "public"."transportation_grove_to_plant_logs" to "anon";

grant delete on table "public"."transportation_grove_to_plant_logs" to "authenticated";

grant insert on table "public"."transportation_grove_to_plant_logs" to "authenticated";

grant references on table "public"."transportation_grove_to_plant_logs" to "authenticated";

grant select on table "public"."transportation_grove_to_plant_logs" to "authenticated";

grant trigger on table "public"."transportation_grove_to_plant_logs" to "authenticated";

grant truncate on table "public"."transportation_grove_to_plant_logs" to "authenticated";

grant update on table "public"."transportation_grove_to_plant_logs" to "authenticated";

grant delete on table "public"."transportation_grove_to_plant_logs" to "service_role";

grant insert on table "public"."transportation_grove_to_plant_logs" to "service_role";

grant references on table "public"."transportation_grove_to_plant_logs" to "service_role";

grant select on table "public"."transportation_grove_to_plant_logs" to "service_role";

grant trigger on table "public"."transportation_grove_to_plant_logs" to "service_role";

grant truncate on table "public"."transportation_grove_to_plant_logs" to "service_role";

grant update on table "public"."transportation_grove_to_plant_logs" to "service_role";

grant delete on table "public"."transportation_plant_to_home_logs" to "anon";

grant insert on table "public"."transportation_plant_to_home_logs" to "anon";

grant references on table "public"."transportation_plant_to_home_logs" to "anon";

grant select on table "public"."transportation_plant_to_home_logs" to "anon";

grant trigger on table "public"."transportation_plant_to_home_logs" to "anon";

grant truncate on table "public"."transportation_plant_to_home_logs" to "anon";

grant update on table "public"."transportation_plant_to_home_logs" to "anon";

grant delete on table "public"."transportation_plant_to_home_logs" to "authenticated";

grant insert on table "public"."transportation_plant_to_home_logs" to "authenticated";

grant references on table "public"."transportation_plant_to_home_logs" to "authenticated";

grant select on table "public"."transportation_plant_to_home_logs" to "authenticated";

grant trigger on table "public"."transportation_plant_to_home_logs" to "authenticated";

grant truncate on table "public"."transportation_plant_to_home_logs" to "authenticated";

grant update on table "public"."transportation_plant_to_home_logs" to "authenticated";

grant delete on table "public"."transportation_plant_to_home_logs" to "service_role";

grant insert on table "public"."transportation_plant_to_home_logs" to "service_role";

grant references on table "public"."transportation_plant_to_home_logs" to "service_role";

grant select on table "public"."transportation_plant_to_home_logs" to "service_role";

grant trigger on table "public"."transportation_plant_to_home_logs" to "service_role";

grant truncate on table "public"."transportation_plant_to_home_logs" to "service_role";

grant update on table "public"."transportation_plant_to_home_logs" to "service_role";

grant delete on table "public"."treatment_logs" to "anon";

grant insert on table "public"."treatment_logs" to "anon";

grant references on table "public"."treatment_logs" to "anon";

grant select on table "public"."treatment_logs" to "anon";

grant trigger on table "public"."treatment_logs" to "anon";

grant truncate on table "public"."treatment_logs" to "anon";

grant update on table "public"."treatment_logs" to "anon";

grant delete on table "public"."treatment_logs" to "authenticated";

grant insert on table "public"."treatment_logs" to "authenticated";

grant references on table "public"."treatment_logs" to "authenticated";

grant select on table "public"."treatment_logs" to "authenticated";

grant trigger on table "public"."treatment_logs" to "authenticated";

grant truncate on table "public"."treatment_logs" to "authenticated";

grant update on table "public"."treatment_logs" to "authenticated";

grant delete on table "public"."treatment_logs" to "service_role";

grant insert on table "public"."treatment_logs" to "service_role";

grant references on table "public"."treatment_logs" to "service_role";

grant select on table "public"."treatment_logs" to "service_role";

grant trigger on table "public"."treatment_logs" to "service_role";

grant truncate on table "public"."treatment_logs" to "service_role";

grant update on table "public"."treatment_logs" to "service_role";

grant delete on table "public"."tree_logs" to "anon";

grant insert on table "public"."tree_logs" to "anon";

grant references on table "public"."tree_logs" to "anon";

grant select on table "public"."tree_logs" to "anon";

grant trigger on table "public"."tree_logs" to "anon";

grant truncate on table "public"."tree_logs" to "anon";

grant update on table "public"."tree_logs" to "anon";

grant delete on table "public"."tree_logs" to "authenticated";

grant insert on table "public"."tree_logs" to "authenticated";

grant references on table "public"."tree_logs" to "authenticated";

grant select on table "public"."tree_logs" to "authenticated";

grant trigger on table "public"."tree_logs" to "authenticated";

grant truncate on table "public"."tree_logs" to "authenticated";

grant update on table "public"."tree_logs" to "authenticated";

grant delete on table "public"."tree_logs" to "service_role";

grant insert on table "public"."tree_logs" to "service_role";

grant references on table "public"."tree_logs" to "service_role";

grant select on table "public"."tree_logs" to "service_role";

grant trigger on table "public"."tree_logs" to "service_role";

grant truncate on table "public"."tree_logs" to "service_role";

grant update on table "public"."tree_logs" to "service_role";

grant delete on table "public"."trees" to "anon";

grant insert on table "public"."trees" to "anon";

grant references on table "public"."trees" to "anon";

grant select on table "public"."trees" to "anon";

grant trigger on table "public"."trees" to "anon";

grant truncate on table "public"."trees" to "anon";

grant update on table "public"."trees" to "anon";

grant delete on table "public"."trees" to "authenticated";

grant insert on table "public"."trees" to "authenticated";

grant references on table "public"."trees" to "authenticated";

grant select on table "public"."trees" to "authenticated";

grant trigger on table "public"."trees" to "authenticated";

grant truncate on table "public"."trees" to "authenticated";

grant update on table "public"."trees" to "authenticated";

grant delete on table "public"."trees" to "service_role";

grant insert on table "public"."trees" to "service_role";

grant references on table "public"."trees" to "service_role";

grant select on table "public"."trees" to "service_role";

grant trigger on table "public"."trees" to "service_role";

grant truncate on table "public"."trees" to "service_role";

grant update on table "public"."trees" to "service_role";

grant delete on table "public"."weather_logs" to "anon";

grant insert on table "public"."weather_logs" to "anon";

grant references on table "public"."weather_logs" to "anon";

grant select on table "public"."weather_logs" to "anon";

grant trigger on table "public"."weather_logs" to "anon";

grant truncate on table "public"."weather_logs" to "anon";

grant update on table "public"."weather_logs" to "anon";

grant delete on table "public"."weather_logs" to "authenticated";

grant insert on table "public"."weather_logs" to "authenticated";

grant references on table "public"."weather_logs" to "authenticated";

grant select on table "public"."weather_logs" to "authenticated";

grant trigger on table "public"."weather_logs" to "authenticated";

grant truncate on table "public"."weather_logs" to "authenticated";

grant update on table "public"."weather_logs" to "authenticated";

grant delete on table "public"."weather_logs" to "service_role";

grant insert on table "public"."weather_logs" to "service_role";

grant references on table "public"."weather_logs" to "service_role";

grant select on table "public"."weather_logs" to "service_role";

grant trigger on table "public"."weather_logs" to "service_role";

grant truncate on table "public"."weather_logs" to "service_role";

grant update on table "public"."weather_logs" to "service_role";

grant delete on table "public"."weather_profiles" to "anon";

grant insert on table "public"."weather_profiles" to "anon";

grant references on table "public"."weather_profiles" to "anon";

grant select on table "public"."weather_profiles" to "anon";

grant trigger on table "public"."weather_profiles" to "anon";

grant truncate on table "public"."weather_profiles" to "anon";

grant update on table "public"."weather_profiles" to "anon";

grant delete on table "public"."weather_profiles" to "authenticated";

grant insert on table "public"."weather_profiles" to "authenticated";

grant references on table "public"."weather_profiles" to "authenticated";

grant select on table "public"."weather_profiles" to "authenticated";

grant trigger on table "public"."weather_profiles" to "authenticated";

grant truncate on table "public"."weather_profiles" to "authenticated";

grant update on table "public"."weather_profiles" to "authenticated";

grant delete on table "public"."weather_profiles" to "service_role";

grant insert on table "public"."weather_profiles" to "service_role";

grant references on table "public"."weather_profiles" to "service_role";

grant select on table "public"."weather_profiles" to "service_role";

grant trigger on table "public"."weather_profiles" to "service_role";

grant truncate on table "public"."weather_profiles" to "service_role";

grant update on table "public"."weather_profiles" to "service_role";

CREATE TRIGGER update_trees_updated_at BEFORE UPDATE ON public.trees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


