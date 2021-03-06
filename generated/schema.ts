// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class collection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("totalSales", Value.fromI32(0));
    this.set("totalVolume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("topSale", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save collection entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save collection entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("collection", id.toString(), this);
    }
  }

  static load(id: string): collection | null {
    return changetype<collection | null>(store.get("collection", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get totalSales(): i32 {
    let value = this.get("totalSales");
    return value!.toI32();
  }

  set totalSales(value: i32) {
    this.set("totalSales", Value.fromI32(value));
  }

  get totalVolume(): BigDecimal {
    let value = this.get("totalVolume");
    return value!.toBigDecimal();
  }

  set totalVolume(value: BigDecimal) {
    this.set("totalVolume", Value.fromBigDecimal(value));
  }

  get topSale(): BigDecimal {
    let value = this.get("topSale");
    return value!.toBigDecimal();
  }

  set topSale(value: BigDecimal) {
    this.set("topSale", Value.fromBigDecimal(value));
  }

  get dailyCollectionSnapshot(): Array<string> {
    let value = this.get("dailyCollectionSnapshot");
    return value!.toStringArray();
  }

  set dailyCollectionSnapshot(value: Array<string>) {
    this.set("dailyCollectionSnapshot", Value.fromStringArray(value));
  }

  get weeklyCollectionSnapshot(): Array<string> {
    let value = this.get("weeklyCollectionSnapshot");
    return value!.toStringArray();
  }

  set weeklyCollectionSnapshot(value: Array<string>) {
    this.set("weeklyCollectionSnapshot", Value.fromStringArray(value));
  }

  get monthlyCollectionSnapshot(): Array<string> {
    let value = this.get("monthlyCollectionSnapshot");
    return value!.toStringArray();
  }

  set monthlyCollectionSnapshot(value: Array<string>) {
    this.set("monthlyCollectionSnapshot", Value.fromStringArray(value));
  }
}

export class token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("collection", Value.fromString(""));
    this.set("lastPrice", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("topSale", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save token entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("token", id.toString(), this);
    }
  }

  static load(id: string): token | null {
    return changetype<token | null>(store.get("token", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get identifier(): BigInt | null {
    let value = this.get("identifier");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set identifier(value: BigInt | null) {
    if (!value) {
      this.unset("identifier");
    } else {
      this.set("identifier", Value.fromBigInt(<BigInt>value));
    }
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get lastPrice(): BigDecimal {
    let value = this.get("lastPrice");
    return value!.toBigDecimal();
  }

  set lastPrice(value: BigDecimal) {
    this.set("lastPrice", Value.fromBigDecimal(value));
  }

  get topSale(): BigDecimal {
    let value = this.get("topSale");
    return value!.toBigDecimal();
  }

  set topSale(value: BigDecimal) {
    this.set("topSale", Value.fromBigDecimal(value));
  }
}

export class transfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("collection", Value.fromString(""));
    this.set("token", Value.fromString(""));
    this.set("blockNum", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save transfer entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save transfer entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("transfer", id.toString(), this);
    }
  }

  static load(id: string): transfer | null {
    return changetype<transfer | null>(store.get("transfer", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    return value!.toString();
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get tokenId(): BigInt | null {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt | null) {
    if (!value) {
      this.unset("tokenId");
    } else {
      this.set("tokenId", Value.fromBigInt(<BigInt>value));
    }
  }

  get blockNum(): i32 {
    let value = this.get("blockNum");
    return value!.toI32();
  }

  set blockNum(value: i32) {
    this.set("blockNum", Value.fromI32(value));
  }

  get senderAddress(): Bytes | null {
    let value = this.get("senderAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set senderAddress(value: Bytes | null) {
    if (!value) {
      this.unset("senderAddress");
    } else {
      this.set("senderAddress", Value.fromBytes(<Bytes>value));
    }
  }

  get receiverAddress(): Bytes | null {
    let value = this.get("receiverAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set receiverAddress(value: Bytes | null) {
    if (!value) {
      this.unset("receiverAddress");
    } else {
      this.set("receiverAddress", Value.fromBytes(<Bytes>value));
    }
  }

  get amount(): BigDecimal | null {
    let value = this.get("amount");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set amount(value: BigDecimal | null) {
    if (!value) {
      this.unset("amount");
    } else {
      this.set("amount", Value.fromBigDecimal(<BigDecimal>value));
    }
  }

  get platform(): string | null {
    let value = this.get("platform");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set platform(value: string | null) {
    if (!value) {
      this.unset("platform");
    } else {
      this.set("platform", Value.fromString(<string>value));
    }
  }
}

export class dailyCollectionSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("timestamp", Value.fromI32(0));
    this.set("collection", Value.fromString(""));
    this.set("dailyVolume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("dailyTransactions", Value.fromI32(0));
    this.set("topSale", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("bottomSale", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save dailyCollectionSnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save dailyCollectionSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("dailyCollectionSnapshot", id.toString(), this);
    }
  }

  static load(id: string): dailyCollectionSnapshot | null {
    return changetype<dailyCollectionSnapshot | null>(
      store.get("dailyCollectionSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value!.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get dailyVolume(): BigDecimal {
    let value = this.get("dailyVolume");
    return value!.toBigDecimal();
  }

  set dailyVolume(value: BigDecimal) {
    this.set("dailyVolume", Value.fromBigDecimal(value));
  }

  get dailyTransactions(): i32 {
    let value = this.get("dailyTransactions");
    return value!.toI32();
  }

  set dailyTransactions(value: i32) {
    this.set("dailyTransactions", Value.fromI32(value));
  }

  get topSale(): BigDecimal {
    let value = this.get("topSale");
    return value!.toBigDecimal();
  }

  set topSale(value: BigDecimal) {
    this.set("topSale", Value.fromBigDecimal(value));
  }

  get bottomSale(): BigDecimal {
    let value = this.get("bottomSale");
    return value!.toBigDecimal();
  }

  set bottomSale(value: BigDecimal) {
    this.set("bottomSale", Value.fromBigDecimal(value));
  }
}

export class weeklyCollectionSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("timestamp", Value.fromI32(0));
    this.set("collection", Value.fromString(""));
    this.set("weeklyVolume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("weeklyTransactions", Value.fromI32(0));
    this.set("topSale", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("bottomSale", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save weeklyCollectionSnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save weeklyCollectionSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("weeklyCollectionSnapshot", id.toString(), this);
    }
  }

  static load(id: string): weeklyCollectionSnapshot | null {
    return changetype<weeklyCollectionSnapshot | null>(
      store.get("weeklyCollectionSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value!.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get weeklyVolume(): BigDecimal {
    let value = this.get("weeklyVolume");
    return value!.toBigDecimal();
  }

  set weeklyVolume(value: BigDecimal) {
    this.set("weeklyVolume", Value.fromBigDecimal(value));
  }

  get weeklyTransactions(): i32 {
    let value = this.get("weeklyTransactions");
    return value!.toI32();
  }

  set weeklyTransactions(value: i32) {
    this.set("weeklyTransactions", Value.fromI32(value));
  }

  get topSale(): BigDecimal {
    let value = this.get("topSale");
    return value!.toBigDecimal();
  }

  set topSale(value: BigDecimal) {
    this.set("topSale", Value.fromBigDecimal(value));
  }

  get bottomSale(): BigDecimal {
    let value = this.get("bottomSale");
    return value!.toBigDecimal();
  }

  set bottomSale(value: BigDecimal) {
    this.set("bottomSale", Value.fromBigDecimal(value));
  }
}

export class monthlyCollectionSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("timestamp", Value.fromI32(0));
    this.set("collection", Value.fromString(""));
    this.set("monthlyVolume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("monthlyTransactions", Value.fromI32(0));
    this.set("topSale", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("bottomSale", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save monthlyCollectionSnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save monthlyCollectionSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("monthlyCollectionSnapshot", id.toString(), this);
    }
  }

  static load(id: string): monthlyCollectionSnapshot | null {
    return changetype<monthlyCollectionSnapshot | null>(
      store.get("monthlyCollectionSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value!.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get monthlyVolume(): BigDecimal {
    let value = this.get("monthlyVolume");
    return value!.toBigDecimal();
  }

  set monthlyVolume(value: BigDecimal) {
    this.set("monthlyVolume", Value.fromBigDecimal(value));
  }

  get monthlyTransactions(): i32 {
    let value = this.get("monthlyTransactions");
    return value!.toI32();
  }

  set monthlyTransactions(value: i32) {
    this.set("monthlyTransactions", Value.fromI32(value));
  }

  get topSale(): BigDecimal {
    let value = this.get("topSale");
    return value!.toBigDecimal();
  }

  set topSale(value: BigDecimal) {
    this.set("topSale", Value.fromBigDecimal(value));
  }

  get bottomSale(): BigDecimal {
    let value = this.get("bottomSale");
    return value!.toBigDecimal();
  }

  set bottomSale(value: BigDecimal) {
    this.set("bottomSale", Value.fromBigDecimal(value));
  }
}
