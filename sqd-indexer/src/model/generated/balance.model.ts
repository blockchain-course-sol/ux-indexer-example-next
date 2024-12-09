import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Balance {
    constructor(props?: Partial<Balance>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    wallet!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    value!: bigint

    @Index_()
    @FloatColumn_({nullable: false})
    valueBD!: number

    @Index_()
    @IntColumn_({nullable: false})
    lastUpdateblock!: number
}
