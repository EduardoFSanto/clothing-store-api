ALTER TABLE "payments" ADD COLUMN "checkout_url" varchar(500);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "invoice_slug" varchar(150);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "transaction_nsu" varchar(150);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "receipt_url" varchar(500);