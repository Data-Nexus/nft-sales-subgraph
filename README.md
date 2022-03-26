# nft-sales-subgraph
Subgraph to index NFT Sales across multiple marketplaces


# TODO:
# OpenSea
Gather ABI's for applicable OpenSea contracts. Utilize https://github.com/protofire/opensea-wyvern-exchange-subgraph as needed.

Identify all applicable events required to index all sale activity 

-Taker Bids

-Taker Asks

-Bundle Sales


Add OpenSeaSale in mapping

Step1 load and apply null check on collection - if null create collection 

Step2 load and apply null check token - if null create token 

Step3 load and apply null check transfer - if null create transfer

Step4 load and update and apply null check dailySnapshot - if null create dailySnapshot 

Step5 load and update and apply null check weeklySnapshot - if null create weeklySnapshot

Step6 load and update and apply null check monthlySnapshot - if null create monthlySnapshot 


# LooksRare:
Finish out TakerAsk:


Find how to gather the token identifier and contract address 


Step1 load and apply null check on collection - if null create collection 

Step2 load and apply null check token - if null create token 

Step3 load and apply null check transfer - if null create transfer

Step4 load and update and apply null check dailySnapshot - if null create dailySnapshot 


Step5 load and update and apply null check weeklySnapshot - if null create weeklySnapshot

Step6 load and update and apply null check monthlySnapshot - if null create monthlySnapshot 



identify which value returns the nft receiver's address

TakerBid - 0xcb84b421d0e355f02e4beace7ec54edaa57cdcd68ca4c1e2b69af6636c33fe5d

TakerAsk - 0xf76051068ae86d602265feeb835677cff7105a718d010de6fd412e57dec87af4



Name desired metrics for Daily, Weekly and Monthly snapshot entities (currently in the fields for # of transactions & total volume. From this you can derive average price. 

