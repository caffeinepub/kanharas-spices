import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    available : Bool;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  var nextProductId = 0;

  // Persistent storage for products and carts
  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, [CartItem]>();

  // Add a new product
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, imageUrl : Text, available : Bool) : async Nat {
    let productId = nextProductId;
    let newProduct : Product = {
      id = productId;
      name;
      description;
      price;
      imageUrl;
      available;
    };
    products.add(productId, newProduct);
    nextProductId += 1;
    productId;
  };

  // Get all products
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Get product by ID
  public query ({ caller }) func getProductById(productId : Nat) : async ?Product {
    products.get(productId);
  };

  // Add item to cart
  public shared ({ caller }) func addItemToCart(productId : Nat, quantity : Nat) : async () {
    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    let updatedCart = currentCart.concat([{ productId; quantity }]);
    carts.add(caller, updatedCart);
  };

  // Get cart for user
  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
  };
};
