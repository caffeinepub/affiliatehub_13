import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";

actor {
  type Offer = {
    title : Text;
    category : Text;
    commissionPercentage : Nat;
    description : Text;
  };

  module Offer {
    public func compare(offer1 : Offer, offer2 : Offer) : Order.Order {
      Text.compare(offer1.title, offer2.title);
    };
  };

  type Deal = {
    title : Text;
    badgeLabel : Text;
    tagLabel : Text;
  };

  module Deal {
    public func compare(deal1 : Deal, deal2 : Deal) : Order.Order {
      Text.compare(deal1.title, deal2.title);
    };
  };

  let offers = [
    {
      title = "Tech Gadget Store";
      category = "Tech";
      commissionPercentage = 15;
      description = "Earn 15% commission on all tech gadget purchases.";
    },
    {
      title = "Fashion Retailer";
      category = "Fashion";
      commissionPercentage = 10;
      description = "Get 10% commission on fashion products.";
    },
    {
      title = "Health Supplements";
      category = "Health";
      commissionPercentage = 20;
      description = "Promote health supplements and earn 20% commission.";
    },
    {
      title = "Finance Tools";
      category = "Finance";
      commissionPercentage = 8;
      description = "Earn 8% commission on finance tool subscriptions.";
    },
  ];

  let deals = [
    {
      title = "50% Off Gadget";
      badgeLabel = "Half Price";
      tagLabel = "Limited Time";
    },
    {
      title = "Free Shipping";
      badgeLabel = "Exclusive";
      tagLabel = "All Orders";
    },
    {
      title = "Buy One Get One";
      badgeLabel = "BOGO";
      tagLabel = "Fashion";
    },
  ];

  let totalAffiliatesJoined = 1200;
  let totalOffersAvailable = 4;
  let totalPayoutsMade = 250_000;

  public query ({ caller }) func getAllOffers() : async [Offer] {
    offers.sort();
  };

  public query ({ caller }) func getAllDeals() : async [Deal] {
    deals.sort();
  };

  public query ({ caller }) func getTotalAffiliatesJoined() : async Nat {
    totalAffiliatesJoined;
  };

  public query ({ caller }) func getTotalOffersAvailable() : async Nat {
    totalOffersAvailable;
  };

  public query ({ caller }) func getTotalPayoutsMade() : async Nat {
    totalPayoutsMade;
  };
};
