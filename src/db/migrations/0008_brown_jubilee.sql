ALTER TABLE "orders" ADD COLUMN "shipping_cep" varchar(9) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_street" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_number" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_complement" varchar(100);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_neighborhood" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_state" varchar(2) NOT NULL;