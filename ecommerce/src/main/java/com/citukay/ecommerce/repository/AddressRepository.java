package com.citukay.ecommerce.repository;

import com.citukay.ecommerce.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Long> {
    List<Address> findByUserId(Long userId);
    List<Address> findByUserIdAndIsDefaultTrue(Long userId);
}
