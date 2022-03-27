import { BigDecimal } from "@graphprotocol/graph-ts"
import { bigInt } from "@graphprotocol/graph-ts"
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
  TakerBid,
  TakerAsk__Params
} from "../generated/LooksRare/LooksRare"
import { collection } from "../generated/schema"
import { token } from "../generated/schema"
import { transfer } from "../generated/schema"


//export function handleCancelAllOrders(event: CancelAllOrders): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
//  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
//  if (!entity) {
//    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
//    entity.count = BigInt.fromI32(0)
//  }

  // BigInt and BigDecimal math are supported
//  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
//  entity.user = event.params.user
//  entity.newMinNonce = event.params.newMinNonce

  // Entities can be written to the store with `.save()`
//  entity.save()

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
//}

export function handleTakerAsk(event: TakerAsk): void {

  //declare and set variables
  let transferAmount  = event.params.price.divDecimal(BigDecimal.fromString('1000000000000000000'))


  let collectionEntity = collection.load(event.params.collection.toHex())

  //if collection has not been indexed create it
  if (!collectionEntity) {
      collectionEntity = new collection(event.params.collection.toHex())
  
      collectionEntity.id                         = event.params.collection.toHex()
      collectionEntity.name                       = 'test'
      collectionEntity.totalSales                 = 0
      collectionEntity.totalVolume                = BigDecimal.fromString('0')
      collectionEntity.topSale                    = BigDecimal.fromString('0')
      collectionEntity.dailyVolume                = BigDecimal.fromString('0')
      collectionEntity.dailyTransactions          = 0
      collectionEntity.weeklyVolume               = BigDecimal.fromString('0')
      collectionEntity.weeklyTransactions         = 0
      collectionEntity.monthlyVolume              = BigDecimal.fromString('0')
      collectionEntity.monthlyTransactions        = 0
    
      collectionEntity.save()
    }
  
  let tokenEntity = token.load((collectionEntity.id.toString() + '-' + event.params.tokenId.toString()))
  
  //if token has not been indexed create it
  if (!tokenEntity) {
    tokenEntity = new token(event.params.tokenId.toString())

    tokenEntity.id                                = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString())
    tokenEntity.identifier                        = event.params.tokenId
    tokenEntity.collectionId                      = event.params.collection
    tokenEntity.lastPrice                         = BigDecimal.fromString('0')
    tokenEntity.topSale                           = BigDecimal.fromString('0')

    tokenEntity.save()
  }
  

  //check if transfer already exists
  let transferEntity = transfer.load(event.transaction.hash.toHex())
    
  //if transfer has not yet been indexed
  if (!transferEntity) {

    transferEntity = new transfer(event.transaction.from.toHex())
    
    transferEntity.id = event.transaction.hash.toHex()
    transferEntity.collectionId = event.params.collection 
    transferEntity.tokenId = event.params.tokenId
    transferEntity.blockNum = event.block.number.toI32()
    transferEntity.senderAddress = event.params.taker
    transferEntity.receiverAddress = event.params.maker       
    transferEntity.amount = transferAmount
    transferEntity.platform = 'LooksRare'

  }
  
  //Update collection metrics
  collectionEntity.totalSales = collectionEntity.totalSales + 1 
  collectionEntity.totalVolume = collectionEntity.totalVolume.plus(transferAmount)
  if (transferAmount > collectionEntity.topSale) {
    collectionEntity.topSale = transferAmount
  }

  //Update token metrics 
  tokenEntity.lastPrice = transferAmount
  if (transferAmount > tokenEntity.topSale) {
    tokenEntity.topSale = transferAmount
  }

  //Save entities
  collectionEntity.save()
  tokenEntity.save()
  transferEntity.save()


}

///////////////////Bring back in once it's ready for TakerBids/////////////////////
//export function handleTakerBid(event: TakerBid): void {

//  let entity = transfer.load(event.transaction.hash.toHex())

//}
