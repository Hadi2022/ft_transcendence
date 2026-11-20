
ALTER TABLE friends ADD CONSTRAINT "same_id" CHECK (
        "sender_id" != "receiver_id"
);

CREATE UNIQUE INDEX "already_exists" ON "friends" (
    LEAST("sender_id", "receiver_id"),
    GREATEST("sender_id", "receiver_id")
);