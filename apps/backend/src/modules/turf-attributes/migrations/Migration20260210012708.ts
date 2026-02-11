import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260210012708 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "turf_attributes" ("id" text not null, "product_id" text not null, "pile_height" integer not null, "face_weight" integer not null, "roll_width" integer not null default 15, "backing_type" text check ("backing_type" in ('permeable', 'perforated', 'solid')) not null, "warranty_years" integer not null default 15, "primary_use" text check ("primary_use" in ('landscape', 'pet', 'putting')) not null, "pet_friendly" boolean not null default false, "golf_optimized" boolean not null default false, "has_thatch" boolean not null default false, "pfas_free" boolean not null default true, "lead_free" boolean not null default true, "fire_rating" text check ("fire_rating" in ('Class_A', 'Class_B', 'Class_C')) not null default 'Class_A', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "turf_attributes_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_turf_attributes_deleted_at" ON "turf_attributes" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "turf_attributes" cascade;`);
  }

}
