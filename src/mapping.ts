import { BigInt } from "@graphprotocol/graph-ts"
import {
  LooksRare,
  CancelAllOrders,
  CancelMultipleOrders,
  NewCurrencyManager,
  NewExecutionManager,
  NewProtocolFeeRecipient,
  NewRoyaltyFeeManager,
  NewTransferSelectorNFT,
  OwnershipTransferred,
  RoyaltyPayment,
  TakerAsk,
  TakerBid
} from "../generated/LooksRare/LooksRare"
import { ExampleEntity } from "../generated/schema"

export function handleCancelAllOrders(event: CancelAllOrders): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.user = event.params.user
  entity.newMinNonce = event.params.newMinNonce

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DOMAIN_SEPARATOR(...)
  // - contract.WETH(...)
  // - contract.currencyManager(...)
  // - contract.executionManager(...)
  // - contract.isUserOrderNonceExecutedOrCancelled(...)
  // - contract.owner(...)
  // - contract.protocolFeeRecipient(...)
  // - contract.royaltyFeeManager(...)
  // - contract.transferSelectorNFT(...)
  // - contract.userMinOrderNonce(...)
}

export function handleCancelMultipleOrders(event: CancelMultipleOrders): void {}

export function handleNewCurrencyManager(event: NewCurrencyManager): void {}

export function handleNewExecutionManager(event: NewExecutionManager): void {}

export function handleNewProtocolFeeRecipient(
  event: NewProtocolFeeRecipient
): void {}

export function handleNewRoyaltyFeeManager(event: NewRoyaltyFeeManager): void {}

export function handleNewTransferSelectorNFT(
  event: NewTransferSelectorNFT
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRoyaltyPayment(event: RoyaltyPayment): void {}

export function handleTakerAsk(event: TakerAsk): void {}

export function handleTakerBid(event: TakerBid): void {}
