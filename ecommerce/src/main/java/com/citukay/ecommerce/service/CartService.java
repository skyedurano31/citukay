package com.citukay.ecommerce.service;

import com.citukay.ecommerce.entity.Cart;
import com.citukay.ecommerce.entity.CartItem;
import com.citukay.ecommerce.entity.Product;
import com.citukay.ecommerce.repository.CartItemRepository;
import com.citukay.ecommerce.repository.CartRepository;
import com.citukay.ecommerce.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.Optional;

public class CartService {
    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;
    private ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartByUserId(Long userId) {
        Optional<Cart> cart = cartRepository.findByUserId(userId);
        if (cart.isPresent()) {
            return cart.get();
        } else {
            Cart newCart = new Cart();
            // Note: You'll need to set user here if needed
            return cartRepository.save(newCart);
        }
    }

    public Cart addToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, product, quantity);
            cart.addCartItem(newItem);
            cartItemRepository.save(newItem);
        }

        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(Long userId, Long productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        Optional<CartItem> itemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (!itemOpt.isPresent()) {
            throw new RuntimeException("Item not found in cart");
        }

        CartItem item = itemOpt.get();
        if (quantity <= 0) {
            cart.removeCartItem(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        Optional<CartItem> itemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (!itemOpt.isPresent()) {
            throw new RuntimeException("Item not found in cart");
        }

        CartItem item = itemOpt.get();
        cart.removeCartItem(item);
        cartItemRepository.delete(item);

        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        for (CartItem item : cart.getCartItems()) {
            cartItemRepository.delete(item);
        }
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private void calculateTotal(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getCartItems()) {
            total = total.add(item.getItemTotal());
        }
        cart.setTotalAmount(total);
    }
}
