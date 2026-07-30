import { Auction } from "./Auction";
import { Bid } from "./Bid";
import { Suit } from "../cards/Card";

const auction =
    new Auction();


auction.addBid(
    new Bid(1,Suit.Spades)
);


auction.addBid(
    Bid.Pass()
);


auction.addBid(
    Bid.Pass()
);
	

auction.addBid(
    Bid.Pass()
);


console.log(
    auction.isComplete()
);

console.log(
    auction.lastContract()
        ?.toString()
);