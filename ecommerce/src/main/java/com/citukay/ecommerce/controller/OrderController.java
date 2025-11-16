package com.citukay.ecommerce.controller;

import com.citukay.ecommerce.entity.Order;
import com.citukay.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Order> createOrder(
            @PathVariable Long userId,
            @RequestBody List<OrderService.OrderItemRequest> itemRequests) {
        try {
            Order order = orderService.createOrder(userId, itemRequests);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
