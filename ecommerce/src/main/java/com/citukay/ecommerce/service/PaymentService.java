package com.citukay.ecommerce.service;

import com.citukay.ecommerce.entity.Order;
import com.citukay.ecommerce.entity.Payment;
import com.citukay.ecommerce.repository.OrderRepository;
import com.citukay.ecommerce.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository,OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Payment createPayment(Long orderId, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus("COMPLETED");
        payment.setTransactionId(generateTransactionId());

        // Update order status
        order.setStatus("CONFIRMED");
        orderRepository.save(order);

        return paymentRepository.save(payment);
    }

    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis();
    }

}
