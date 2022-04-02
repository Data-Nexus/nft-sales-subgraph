import { BigDecimal, BigInt } from "@graphprotocol/graph-ts"
import {
  TakerAsk,
  TakerBid
} from "../generated/LooksRare/LooksRare"
import { 
  collection,
  token, 
  transfer, 
  dailyCollectionSnapshot, 
  weeklyCollectionSnapshot, 
  monthlyCollectionSnapshot
 } from "../generated/schema"


// TakerAsk Handler starts here
export function handleTakerAsk(event: TakerAsk): void {

  // The amount paid 
  let transferAmount  = event.params.price.divDecimal(BigDecimal.fromString('1000000000000000000'))

  // If collection already exists
  let collectionEntity = collection.load(event.params.collection.toHex())

  // If collection does not exist
  if (!collectionEntity) {

      // Adding new collection to store
      collectionEntity = new collection(event.params.collection.toHex())

      // Address of the collection
      collectionEntity.id                         = event.params.collection.toHex()

      collectionEntity.name                       = 'test'
      collectionEntity.totalSales                 = 0
      collectionEntity.totalVolume                = BigDecimal.fromString('0')
      collectionEntity.topSale                    = BigDecimal.fromString('0')
    
      collectionEntity.save()
    }
  
  // If the NFT already exist
  let tokenEntity = token.load((collectionEntity.id.toString() + '-' + event.params.tokenId.toString()))
  
  // If the NFT does not exist
  if (!tokenEntity) {

    // Adding new NFT to store
    tokenEntity = new token(event.params.tokenId.toString())

    // Collection Address - Token Id
    tokenEntity.id                                = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString())

    // Token Id
    tokenEntity.identifier                        = event.params.tokenId
    tokenEntity.collection                        = event.params.collection.toHex()
    tokenEntity.lastPrice                         = BigDecimal.fromString('0')
    tokenEntity.topSale                           = BigDecimal.fromString('0')

    tokenEntity.save()
  }
  

  // If transfer already exists
  let transferEntity = transfer.load(event.transaction.hash.toHex())
    
  // If transfer does not exist
  if (!transferEntity) {

    transferEntity = new transfer(event.transaction.from.toHex())
    
    transferEntity.id                             = event.transaction.hash.toHex()
    transferEntity.collection                     = event.params.collection.toHex()

    // Collection Address - token Id
    transferEntity.token                          = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString())
    transferEntity.tokenId                        = event.params.tokenId                                                     
    transferEntity.blockNum                       = event.block.number.toI32()
    transferEntity.senderAddress                  = event.params.taker
    transferEntity.receiverAddress                = event.params.maker       
    transferEntity.amount                         = transferAmount
    transferEntity.platform                       = 'LooksRare'
  }
  
  // Updating total sales & total volume & top sale 
  collectionEntity.totalSales = collectionEntity.totalSales + 1 
  collectionEntity.totalVolume = collectionEntity.totalVolume.plus(transferAmount)
  if (transferAmount > collectionEntity.topSale) {
    collectionEntity.topSale = transferAmount
  }

  // Updating the NFT last price & top sale
  tokenEntity.lastPrice = transferAmount
  if (transferAmount > tokenEntity.topSale) {
    tokenEntity.topSale = transferAmount
  }

  // dailyCollectionSnapshot entity starts here

  // The timestamp is in seconds - day = 864000 seconds
  const day = event.block.timestamp.toI32() / 86400

  // The actuall timestamp
  const date = event.block.timestamp.toI32()

  // Collection Address - Day
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
    dailyCollectionSnapshotEntity.bottomSale         = BigDecimal.fromString('0')

    dailyCollectionSnapshotEntity.save()
  }

  // Updating daily total volume & top sale
  dailyCollectionSnapshotEntity.dailyVolume = dailyCollectionSnapshotEntity.dailyVolume.plus(transferAmount)
  if (transferAmount > dailyCollectionSnapshotEntity.topSale) {
    dailyCollectionSnapshotEntity.topSale = transferAmount
  }

  // Updating daily total number of transactions
  dailyCollectionSnapshotEntity.dailyTransactions = dailyCollectionSnapshotEntity.dailyTransactions + 1

  // Daily bottom sale
  if (transferAmount < dailyCollectionSnapshotEntity.bottomSale 
      || (dailyCollectionSnapshotEntity.bottomSale == BigDecimal.fromString('0') && transferAmount != BigDecimal.fromString('0'))
      ) {
    dailyCollectionSnapshotEntity.bottomSale = transferAmount
  }

  // dailyCollectionSnapshot entity ends here

  // weeklyCollectionSnapshot entity starts here

  // The timestamp is in seconds - week = 604800 seconds
  const week = event.block.timestamp.toI32() / 604800

  // Collection Address - Week
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
      weeklyCollectionSnapshotEntity.bottomSale         = BigDecimal.fromString('0')

      weeklyCollectionSnapshotEntity.save()
    }

  // Updating weekly volume & top sale
  weeklyCollectionSnapshotEntity.weeklyVolume = weeklyCollectionSnapshotEntity.weeklyVolume.plus(transferAmount)
  if (transferAmount > weeklyCollectionSnapshotEntity.topSale) {
    weeklyCollectionSnapshotEntity.topSale = transferAmount
    }

  // Updating weekly total number of transactions
  weeklyCollectionSnapshotEntity.weeklyTransactions = weeklyCollectionSnapshotEntity.weeklyTransactions + 1

  // Weekly bottom sale
  if (transferAmount < weeklyCollectionSnapshotEntity.bottomSale
    || (weeklyCollectionSnapshotEntity.bottomSale == BigDecimal.fromString('0') && transferAmount != BigDecimal.fromString('0'))
      ) {
    weeklyCollectionSnapshotEntity.bottomSale = transferAmount
    }
  
  // weeklyCollectionSnapshot entity ends here
  
  // monthlyCollectionSnapshot entity starts here

  // The timestamp is in seconds - month = 2628288 seconds
  const month = event.block.timestamp.toI32() / 2628288

  // Collection Address - Month
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
      monthlyCollectionSnapshotEntity.bottomSale         = BigDecimal.fromString('0')
  
      monthlyCollectionSnapshotEntity.save()
    }
  // Updating monthly volume & top sale
  monthlyCollectionSnapshotEntity.monthlyVolume = monthlyCollectionSnapshotEntity.monthlyVolume.plus(transferAmount)
  if (transferAmount > monthlyCollectionSnapshotEntity.topSale) {
    monthlyCollectionSnapshotEntity.topSale = transferAmount
    }

  // Updating monthly total number of transactions
  monthlyCollectionSnapshotEntity.monthlyTransactions = monthlyCollectionSnapshotEntity.monthlyTransactions + 1
  
  // Monthly bottom sale
  if (transferAmount < monthlyCollectionSnapshotEntity.bottomSale
    || (monthlyCollectionSnapshotEntity.bottomSale == BigDecimal.fromString('0') && transferAmount != BigDecimal.fromString('0'))
      ) {
    monthlyCollectionSnapshotEntity.bottomSale = transferAmount
    }

  // Save entities
  collectionEntity.save()
  tokenEntity.save()
  transferEntity.save()
  dailyCollectionSnapshotEntity.save()
  weeklyCollectionSnapshotEntity.save()
  monthlyCollectionSnapshotEntity.save()

}

// TakerAsk Handler ends here

// TakerBid Handler starts here
export function handleTakerBid(event: TakerBid): void {

  // The amount paid 
  let transferAmount  = event.params.price.divDecimal(BigDecimal.fromString('1000000000000000000'))

  // If collection already exists
  let collectionEntity = collection.load(event.params.collection.toHex())

  // If collection does not exist
  if (!collectionEntity) {

      // Adding new collection to store
      collectionEntity = new collection(event.params.collection.toHex())

      // Address of the collection
      collectionEntity.id                         = event.params.collection.toHex()

      collectionEntity.name                       = 'test'
      collectionEntity.totalSales                 = 0
      collectionEntity.totalVolume                = BigDecimal.fromString('0')
      collectionEntity.topSale                    = BigDecimal.fromString('0')
    
      collectionEntity.save()
    }
  
  // If the NFT already exist
  let tokenEntity = token.load((collectionEntity.id.toString() + '-' + event.params.tokenId.toString()))
  
  // If the NFT does not exist
  if (!tokenEntity) {

    // Adding new NFT to store
    tokenEntity = new token(event.params.tokenId.toString())

    // Collection Address - Token Id
    tokenEntity.id                                = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString())

    // Token Id
    tokenEntity.identifier                        = event.params.tokenId
    tokenEntity.collection                        = event.params.collection.toHex()
    tokenEntity.lastPrice                         = BigDecimal.fromString('0')
    tokenEntity.topSale                           = BigDecimal.fromString('0')

    tokenEntity.save()
  }
  

  // If transfer already exists
  let transferEntity = transfer.load(event.transaction.hash.toHex())
    
  // If transfer does not exist
  if (!transferEntity) {

    transferEntity = new transfer(event.transaction.from.toHex())
    
    transferEntity.id                             = event.transaction.hash.toHex()
    transferEntity.collection                     = event.params.collection.toHex()

    // Collection Address - token Id
    transferEntity.token                          = (collectionEntity.id.toString() + '-' + event.params.tokenId.toString())
    transferEntity.tokenId                        = event.params.tokenId                                                     
    transferEntity.blockNum                       = event.block.number.toI32()
    transferEntity.senderAddress                  = event.params.taker
    transferEntity.receiverAddress                = event.params.maker       
    transferEntity.amount                         = transferAmount
    transferEntity.platform                       = 'LooksRare'
  }
  
  // Updating total sales & total volume & top sale 
  collectionEntity.totalSales = collectionEntity.totalSales + 1 
  collectionEntity.totalVolume = collectionEntity.totalVolume.plus(transferAmount)
  if (transferAmount > collectionEntity.topSale) {
    collectionEntity.topSale = transferAmount
  }

  // Updating the NFT last price & top sale
  tokenEntity.lastPrice = transferAmount
  if (transferAmount > tokenEntity.topSale) {
    tokenEntity.topSale = transferAmount
  }

  // dailyCollectionSnapshot entity starts here

  // The timestamp is in seconds - day = 864000 seconds
  const day = event.block.timestamp.toI32() / 86400

  // The actuall timestamp
  const date = event.block.timestamp.toI32()

  // Collection Address - Day
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
    dailyCollectionSnapshotEntity.bottomSale         = BigDecimal.fromString('0')

    dailyCollectionSnapshotEntity.save()
  }

  // Updating daily total volume & top sale
  dailyCollectionSnapshotEntity.dailyVolume = dailyCollectionSnapshotEntity.dailyVolume.plus(transferAmount)
  if (transferAmount > dailyCollectionSnapshotEntity.topSale) {
    dailyCollectionSnapshotEntity.topSale = transferAmount
  }

  // Updating daily total number of transactions
  dailyCollectionSnapshotEntity.dailyTransactions = dailyCollectionSnapshotEntity.dailyTransactions + 1

  // Daily bottom sale
  if (transferAmount < dailyCollectionSnapshotEntity.bottomSale
    || (dailyCollectionSnapshotEntity.bottomSale == BigDecimal.fromString('0') && transferAmount != BigDecimal.fromString('0'))
      ) {
    dailyCollectionSnapshotEntity.bottomSale = transferAmount
  }

  // dailyCollectionSnapshot entity ends here

  // weeklyCollectionSnapshot entity starts here

  // The timestamp is in seconds - week = 604800 seconds
  const week = event.block.timestamp.toI32() / 604800

  // Collection Address - Week
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
      weeklyCollectionSnapshotEntity.bottomSale         = BigDecimal.fromString('0')

      weeklyCollectionSnapshotEntity.save()
    }

  // Updating weekly volume & top sale
  weeklyCollectionSnapshotEntity.weeklyVolume = weeklyCollectionSnapshotEntity.weeklyVolume.plus(transferAmount)
  if (transferAmount > weeklyCollectionSnapshotEntity.topSale) {
    weeklyCollectionSnapshotEntity.topSale = transferAmount
    }

  // Updating weekly total number of transactions
  weeklyCollectionSnapshotEntity.weeklyTransactions = weeklyCollectionSnapshotEntity.weeklyTransactions + 1

  // Weekly bottom sale
  if (transferAmount < weeklyCollectionSnapshotEntity.bottomSale
    || (weeklyCollectionSnapshotEntity.bottomSale == BigDecimal.fromString('0') && transferAmount != BigDecimal.fromString('0'))
      ) {
    weeklyCollectionSnapshotEntity.bottomSale = transferAmount
    }
  
  // weeklyCollectionSnapshot entity ends here
  
  // monthlyCollectionSnapshot entity starts here

  // The timestamp is in seconds - week = 2628288 seconds
  const month = event.block.timestamp.toI32() / 2628288

  // Collection Address - Month
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
      monthlyCollectionSnapshotEntity.bottomSale         = BigDecimal.fromString('0')
  
      monthlyCollectionSnapshotEntity.save()
    }
  // Updating monthly volume & top sale
  monthlyCollectionSnapshotEntity.monthlyVolume = monthlyCollectionSnapshotEntity.monthlyVolume.plus(transferAmount)
  if (transferAmount > monthlyCollectionSnapshotEntity.topSale) {
    monthlyCollectionSnapshotEntity.topSale = transferAmount
    }

  // Updating monthly total number of transactions
  monthlyCollectionSnapshotEntity.monthlyTransactions = monthlyCollectionSnapshotEntity.monthlyTransactions + 1
  
  // Monthly bottom sale
  if (transferAmount < monthlyCollectionSnapshotEntity.bottomSale
    || (monthlyCollectionSnapshotEntity.bottomSale == BigDecimal.fromString('0') && transferAmount != BigDecimal.fromString('0'))
      ) {
    monthlyCollectionSnapshotEntity.bottomSale = transferAmount
    }

  // Save entities
  collectionEntity.save()
  tokenEntity.save()
  transferEntity.save()
  dailyCollectionSnapshotEntity.save()
  weeklyCollectionSnapshotEntity.save()
  monthlyCollectionSnapshotEntity.save()

}