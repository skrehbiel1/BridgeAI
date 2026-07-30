import { Auction } from "../Auction";
import { Bid } from "../Bid";


const auction =
    new Auction();


auction.addBid(
    new Bid(1,"S")
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