import { BigDecimal } from "@graphprotocol/graph-ts"
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


import { 
  collection,
  token, 
  transfer, 
  dailyCollectionSnapshot, 
  weeklyCollectionSnapshot, 
  monthlyCollectionSnapshot
 } from "../generated/schema"


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
    
      collectionEntity.save()
    }
  
  let tokenEntity = token.load((collectionEntity.id.toString() + '-' + event.params.tokenId.toString()))
  
  //if token has not been indexed create it
  if (!tokenEntity) {
    tokenEntity = new token(event.params.tokenId.toString())

    tokenEntity.id                                = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString())
    tokenEntity.identifier                        = event.params.tokenId
    tokenEntity.collection                        = event.params.collection.toHex()
    tokenEntity.lastPrice                         = BigDecimal.fromString('0')
    tokenEntity.topSale                           = BigDecimal.fromString('0')

    tokenEntity.save()
  }
  

  //check if transfer already exists
  let transferEntity = transfer.load(event.transaction.hash.toHex())
    
  //if transfer has not yet been indexed
  if (!transferEntity) {

    transferEntity = new transfer(event.transaction.from.toHex())
    
    transferEntity.id                             = event.transaction.hash.toHex()
    transferEntity.collection                     = event.params.collection.toHex()
    transferEntity.token                          = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString()) //relates to token entity's id (collectionId-tokenId)
    transferEntity.tokenId                        = event.params.tokenId                                                     //actual id of the token
    transferEntity.blockNum                       = event.block.number.toI32()
    transferEntity.senderAddress                  = event.params.taker
    transferEntity.receiverAddress                = event.params.maker       
    transferEntity.amount                         = transferAmount
    transferEntity.platform                       = 'LooksRare'
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

  // dailyCollectionSnapshot Entity
  const day = event.block.timestamp.toI32() / 86400
  const date = day * 86400

  //This is i64 = 9223372036854775807
  const max = BigDecimal.fromString(i64.MAX_VALUE.toString())

  let dailyCollectionSnapshotEntityId = event.params.collection.toHex() + '-' + day.toString()
  
  let dailyCollectionSnapshotEntity = dailyCollectionSnapshot.load(dailyCollectionSnapshotEntityId)

  if(!dailyCollectionSnapshotEntity) {
    dailyCollectionSnapshotEntity = new dailyCollectionSnapshot(event.params.collection.toString())
    
    dailyCollectionSnapshotEntity.id                 = dailyCollectionSnapshotEntityId
    dailyCollectionSnapshotEntity.timestamp          = date
    dailyCollectionSnapshotEntity.collection         = event.params.collection.toHex()
    dailyCollectionSnapshotEntity.dailyVolume        = BigDecimal.fromString('0')
    dailyCollectionSnapshotEntity.dailyTransactions  = 0
    dailyCollectionSnapshotEntity.topSale            = BigDecimal.fromString('0')
    dailyCollectionSnapshotEntity.bottomSale         = max

    dailyCollectionSnapshotEntity.save()
  }
  //dailyVolume & DailytopSale
  dailyCollectionSnapshotEntity.dailyVolume = dailyCollectionSnapshotEntity.dailyVolume.plus(transferAmount)
  if (transferAmount > dailyCollectionSnapshotEntity.topSale) {
    dailyCollectionSnapshotEntity.topSale = transferAmount
  }

  // dailyTransactions
  dailyCollectionSnapshotEntity.dailyTransactions = dailyCollectionSnapshotEntity.dailyTransactions + 1

  //bottomSale
  if (transferAmount < dailyCollectionSnapshotEntity.bottomSale) {
    dailyCollectionSnapshotEntity.bottomSale = transferAmount
  }

  // weeklyCollectionSnapshot Entity
  const week = event.block.timestamp.toI32() / 604800

  let weeklyCollectionSnapshotEntityId = event.params.collection.toHex() + '-' + week.toString()
    
  let weeklyCollectionSnapshotEntity = weeklyCollectionSnapshot.load(weeklyCollectionSnapshotEntityId)

  if(!weeklyCollectionSnapshotEntity) {
      weeklyCollectionSnapshotEntity = new weeklyCollectionSnapshot(event.params.collection.toString())
      
      weeklyCollectionSnapshotEntity.id                 = weeklyCollectionSnapshotEntityId
      weeklyCollectionSnapshotEntity.timestamp          = date
      weeklyCollectionSnapshotEntity.collection         = event.params.collection.toHex()
      weeklyCollectionSnapshotEntity.weeklyVolume        = BigDecimal.fromString('0')
      weeklyCollectionSnapshotEntity.weeklyTransactions  = 0
      weeklyCollectionSnapshotEntity.topSale            = BigDecimal.fromString('0')
      weeklyCollectionSnapshotEntity.bottomSale         = max

      weeklyCollectionSnapshotEntity.save()
    }
  //weeklyVolume & weeklyTopSale
  weeklyCollectionSnapshotEntity.weeklyVolume = weeklyCollectionSnapshotEntity.weeklyVolume.plus(transferAmount)
  if (transferAmount > weeklyCollectionSnapshotEntity.topSale) {
    weeklyCollectionSnapshotEntity.topSale = transferAmount
    }

  //weeklyTransactions
  weeklyCollectionSnapshotEntity.weeklyTransactions = weeklyCollectionSnapshotEntity.weeklyTransactions + 1

  //weeklyBottomSale
  if (transferAmount < weeklyCollectionSnapshotEntity.bottomSale) {
    weeklyCollectionSnapshotEntity.bottomSale = transferAmount
    }

  //monthlyCollectionSnapshot Entity
  const month = event.block.timestamp.toI32() / 2628288

  let monthlyCollectionSnapshotEntityId = event.params.collection.toHex() + '-' + month.toString()
      
  let monthlyCollectionSnapshotEntity = monthlyCollectionSnapshot.load(monthlyCollectionSnapshotEntityId)
  
  if(!monthlyCollectionSnapshotEntity) {
      monthlyCollectionSnapshotEntity = new monthlyCollectionSnapshot(event.params.collection.toString())
        
      monthlyCollectionSnapshotEntity.id                 = monthlyCollectionSnapshotEntityId
      monthlyCollectionSnapshotEntity.timestamp          = date
      monthlyCollectionSnapshotEntity.collection         = event.params.collection.toHex()
      monthlyCollectionSnapshotEntity.monthlyVolume        = BigDecimal.fromString('0')
      monthlyCollectionSnapshotEntity.monthlyTransactions  = 0
      monthlyCollectionSnapshotEntity.topSale            = BigDecimal.fromString('0')
      monthlyCollectionSnapshotEntity.bottomSale         = max
  
      monthlyCollectionSnapshotEntity.save()
    }
  //monthlyVolume & monthlyTopSale
  monthlyCollectionSnapshotEntity.monthlyVolume = monthlyCollectionSnapshotEntity.monthlyVolume.plus(transferAmount)
  if (transferAmount > monthlyCollectionSnapshotEntity.topSale) {
    monthlyCollectionSnapshotEntity.topSale = transferAmount
    }

  //monthlyTransactions
  monthlyCollectionSnapshotEntity.monthlyTransactions = monthlyCollectionSnapshotEntity.monthlyTransactions + 1
  
  //monthlyBottomSale
  if (transferAmount < monthlyCollectionSnapshotEntity.bottomSale) {
    monthlyCollectionSnapshotEntity.bottomSale = transferAmount
    }

  //Save entities
  collectionEntity.save()
  tokenEntity.save()
  transferEntity.save()
  dailyCollectionSnapshotEntity.save()
  weeklyCollectionSnapshotEntity.save()
  monthlyCollectionSnapshotEntity.save()

}


export function handleTakerBid(event: TakerBid): void {

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
    
      collectionEntity.save()
    }
  
  let tokenEntity = token.load((collectionEntity.id.toString() + '-' + event.params.tokenId.toString()))
  
  //if token has not been indexed create it
  if (!tokenEntity) {
    tokenEntity = new token(event.params.tokenId.toString())

    tokenEntity.id                                = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString())
    tokenEntity.identifier                        = event.params.tokenId
    tokenEntity.collection                        = event.params.collection.toHex()
    tokenEntity.lastPrice                         = BigDecimal.fromString('0')
    tokenEntity.topSale                           = BigDecimal.fromString('0')

    tokenEntity.save()
  }
  

  //check if transfer already exists
  let transferEntity = transfer.load(event.transaction.hash.toHex())
    
  //if transfer has not yet been indexed
  if (!transferEntity) {

    transferEntity = new transfer(event.transaction.from.toHex())
    
    transferEntity.id                             = event.transaction.hash.toHex()
    transferEntity.collection                     = event.params.collection.toHex()
    transferEntity.token                          = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString()) //relates to token entity's id (collectionId-tokenId)
    transferEntity.tokenId                        = event.params.tokenId                                                     //actual id of the token
    transferEntity.blockNum                       = event.block.number.toI32()
    transferEntity.senderAddress                  = event.params.taker
    transferEntity.receiverAddress                = event.params.maker       
    transferEntity.amount                         = transferAmount
    transferEntity.platform                       = 'LooksRare'
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

  // dailyCollectionSnapshot Entity
  const day = event.block.timestamp.toI32() / 86400
  const date = day * 86400

  //This is i64 = 9223372036854775807
  const max = BigDecimal.fromString(i64.MAX_VALUE.toString())

  let dailyCollectionSnapshotEntityId = event.params.collection.toHex() + '-' + day.toString()
  
  let dailyCollectionSnapshotEntity = dailyCollectionSnapshot.load(dailyCollectionSnapshotEntityId)

  if(!dailyCollectionSnapshotEntity) {
    dailyCollectionSnapshotEntity = new dailyCollectionSnapshot(event.params.collection.toString())
    
    dailyCollectionSnapshotEntity.id                 = dailyCollectionSnapshotEntityId
    dailyCollectionSnapshotEntity.timestamp          = date
    dailyCollectionSnapshotEntity.collection         = event.params.collection.toHex()
    dailyCollectionSnapshotEntity.dailyVolume        = BigDecimal.fromString('0')
    dailyCollectionSnapshotEntity.dailyTransactions  = 0
    dailyCollectionSnapshotEntity.topSale            = BigDecimal.fromString('0')
    dailyCollectionSnapshotEntity.bottomSale         = max

    dailyCollectionSnapshotEntity.save()
  }
  //dailyVolume & DailytopSale
  dailyCollectionSnapshotEntity.dailyVolume = dailyCollectionSnapshotEntity.dailyVolume.plus(transferAmount)
  if (transferAmount > dailyCollectionSnapshotEntity.topSale) {
    dailyCollectionSnapshotEntity.topSale = transferAmount
  }

  // dailyTransactions
  dailyCollectionSnapshotEntity.dailyTransactions = dailyCollectionSnapshotEntity.dailyTransactions + 1

  //bottomSale
  if (transferAmount < dailyCollectionSnapshotEntity.bottomSale) {
    dailyCollectionSnapshotEntity.bottomSale = transferAmount
  }

  // weeklyCollectionSnapshot Entity
  const week = event.block.timestamp.toI32() / 604800

  let weeklyCollectionSnapshotEntityId = event.params.collection.toHex() + '-' + week.toString()
    
  let weeklyCollectionSnapshotEntity = weeklyCollectionSnapshot.load(weeklyCollectionSnapshotEntityId)

  if(!weeklyCollectionSnapshotEntity) {
      weeklyCollectionSnapshotEntity = new weeklyCollectionSnapshot(event.params.collection.toString())
      
      weeklyCollectionSnapshotEntity.id                 = weeklyCollectionSnapshotEntityId
      weeklyCollectionSnapshotEntity.timestamp          = date
      weeklyCollectionSnapshotEntity.collection         = event.params.collection.toHex()
      weeklyCollectionSnapshotEntity.weeklyVolume        = BigDecimal.fromString('0')
      weeklyCollectionSnapshotEntity.weeklyTransactions  = 0
      weeklyCollectionSnapshotEntity.topSale            = BigDecimal.fromString('0')
      weeklyCollectionSnapshotEntity.bottomSale         = max

      weeklyCollectionSnapshotEntity.save()
    }
  //weeklyVolume & weeklyTopSale
  weeklyCollectionSnapshotEntity.weeklyVolume = weeklyCollectionSnapshotEntity.weeklyVolume.plus(transferAmount)
  if (transferAmount > weeklyCollectionSnapshotEntity.topSale) {
    weeklyCollectionSnapshotEntity.topSale = transferAmount
    }

  //weeklyTransactions
  weeklyCollectionSnapshotEntity.weeklyTransactions = weeklyCollectionSnapshotEntity.weeklyTransactions + 1

  //weeklyBottomSale
  if (transferAmount < weeklyCollectionSnapshotEntity.bottomSale) {
    weeklyCollectionSnapshotEntity.bottomSale = transferAmount
    }

  //monthlyCollectionSnapshot Entity
  const month = event.block.timestamp.toI32() / 2628288

  let monthlyCollectionSnapshotEntityId = event.params.collection.toHex() + '-' + month.toString()
      
  let monthlyCollectionSnapshotEntity = monthlyCollectionSnapshot.load(monthlyCollectionSnapshotEntityId)
  
  if(!monthlyCollectionSnapshotEntity) {
      monthlyCollectionSnapshotEntity = new monthlyCollectionSnapshot(event.params.collection.toString())
        
      monthlyCollectionSnapshotEntity.id                 = monthlyCollectionSnapshotEntityId
      monthlyCollectionSnapshotEntity.timestamp          = date
      monthlyCollectionSnapshotEntity.collection         = event.params.collection.toHex()
      monthlyCollectionSnapshotEntity.monthlyVolume        = BigDecimal.fromString('0')
      monthlyCollectionSnapshotEntity.monthlyTransactions  = 0
      monthlyCollectionSnapshotEntity.topSale            = BigDecimal.fromString('0')
      monthlyCollectionSnapshotEntity.bottomSale         = max
  
      monthlyCollectionSnapshotEntity.save()
    }
  //monthlyVolume & monthlyTopSale
  monthlyCollectionSnapshotEntity.monthlyVolume = monthlyCollectionSnapshotEntity.monthlyVolume.plus(transferAmount)
  if (transferAmount > monthlyCollectionSnapshotEntity.topSale) {
    monthlyCollectionSnapshotEntity.topSale = transferAmount
    }

  //monthlyTransactions
  monthlyCollectionSnapshotEntity.monthlyTransactions = monthlyCollectionSnapshotEntity.monthlyTransactions + 1
  
  //monthlyBottomSale
  if (transferAmount < monthlyCollectionSnapshotEntity.bottomSale) {
    monthlyCollectionSnapshotEntity.bottomSale = transferAmount
    }

  //Save entities
  collectionEntity.save()
  tokenEntity.save()
  transferEntity.save()
  dailyCollectionSnapshotEntity.save()
  weeklyCollectionSnapshotEntity.save()
  monthlyCollectionSnapshotEntity.save()
}