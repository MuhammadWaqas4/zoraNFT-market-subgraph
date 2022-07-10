import {
  TokenURIUpdated as TokenURIUpatedEvent,
  Transfer as TransferEvent,
  Token as TokenContract
} from '../generated/Token/Token'

import {
  Token , User 
} from '../generated/schema'

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString())
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.creator = event.params.to.toHexString();
    token.tokenId = event.params.tokenId;
    token.createdAtTimestamp = event.block.timestamp;

    let tokenContract = TokenContract.bind(event.address);
    token.contentURI = tokenContract.tokenURI(event.params.tokenId);
    token.metadataURI = tokenContract.tokenMetadataURI(event.params.tokenId);
  }
  token.owner = event.params.to.toHexString();
  token.save();

  let user = User.load(event.params.to.toHexString())
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}

  
export function handleTokenURIUpdated(event: TokenURIUpatedEvent): void {
  let token = Token.load(event.params._tokenId.toString());

  token.contentURI = event.params._uri;
  token.save();
}