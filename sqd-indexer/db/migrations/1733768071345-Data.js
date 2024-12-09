module.exports = class Data1733768071345 {
    name = 'Data1733768071345'

    async up(db) {
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "token_address" text NOT NULL, "symbol" text NOT NULL, "name" text NOT NULL, "decimals" integer NOT NULL, "total_supply" numeric NOT NULL, "total_transfers" integer NOT NULL, "holders" integer NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "balance" ("id" character varying NOT NULL, "wallet" text NOT NULL, "value" numeric NOT NULL, "value_bd" numeric NOT NULL, "last_updateblock" integer NOT NULL, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_3042c35864bcd822a8814a4b29" ON "balance" ("wallet") `)
        await db.query(`CREATE INDEX "IDX_1f825e9a10102acf52f8faa3b8" ON "balance" ("value") `)
        await db.query(`CREATE INDEX "IDX_9dafa0907eaf7405cbdd2cbe1b" ON "balance" ("value_bd") `)
        await db.query(`CREATE INDEX "IDX_41a3d4810eca88124af9196f5b" ON "balance" ("last_updateblock") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP TABLE "balance"`)
        await db.query(`DROP INDEX "public"."IDX_3042c35864bcd822a8814a4b29"`)
        await db.query(`DROP INDEX "public"."IDX_1f825e9a10102acf52f8faa3b8"`)
        await db.query(`DROP INDEX "public"."IDX_9dafa0907eaf7405cbdd2cbe1b"`)
        await db.query(`DROP INDEX "public"."IDX_41a3d4810eca88124af9196f5b"`)
    }
}
