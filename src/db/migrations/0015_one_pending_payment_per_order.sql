CREATE UNIQUE INDEX "payments_pending_order_provider_unique" ON "payments" USING btree ("order_id", "provider") WHERE "status" = 'pending';
