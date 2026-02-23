import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    price: bigint;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface backendInterface {
    addItemToCart(productId: bigint, quantity: bigint): Promise<void>;
    addProduct(name: string, description: string, price: bigint, imageUrl: string, available: boolean): Promise<bigint>;
    getAllProducts(): Promise<Array<Product>>;
    getCart(): Promise<Array<CartItem>>;
    getProductById(productId: bigint): Promise<Product | null>;
}
