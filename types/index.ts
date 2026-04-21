export interface CreateProductRequest {
    name: string;
    price: number;
    stock: number;
    categoryId?: string;
    imageUrl?: string;
}

export interface Product extends CreateProductRequest {
    id: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt?: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    categoryId?: string;
    imageUrl?: string;
}

export interface UserOrder {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: string;
    createdAt: string;
}