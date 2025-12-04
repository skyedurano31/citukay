package com.citukay.ecommerce.controller;

import com.citukay.ecommerce.entity.Address;
import com.citukay.ecommerce.entity.User;
import com.citukay.ecommerce.repository.AddressRepository;
import com.citukay.ecommerce.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    // Get all addresses for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getUserAddresses(@PathVariable Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    // Get specific address
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddress(@PathVariable Long id) {
        Optional<Address> address = addressRepository.findById(id);
        return address.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Create new address for user
    @PostMapping("/user/{userId}")
    public ResponseEntity<Address> createAddress(@PathVariable Long userId, @RequestBody Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        address.setUser(user);

        // If this address is set as default, unset any existing default addresses
        if (address.isDefault()) {
            List<Address> defaultAddresses = addressRepository.findByUserIdAndIsDefault(userId, true);
            for (Address defaultAddr : defaultAddresses) {
                defaultAddr.setDefault(false);
                addressRepository.save(defaultAddr);
            }
        }

        Address savedAddress = addressRepository.save(address);
        return ResponseEntity.ok(savedAddress);
    }

    // Update existing address
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address addressDetails) {
        Optional<Address> addressOptional = addressRepository.findById(id);

        if (addressOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Address address = addressOptional.get();

        // Update fields
        address.setStreet(addressDetails.getStreet());
        address.setCity(addressDetails.getCity());
        address.setZipCode(addressDetails.getZipCode());

        // Handle default address logic
        if (addressDetails.isDefault() && !address.isDefault()) {
            // Unset any existing default addresses for this user
            List<Address> defaultAddresses = addressRepository.findByUserIdAndIsDefault(
                    address.getUser().getId(), true);

            for (Address defaultAddr : defaultAddresses) {
                defaultAddr.setDefault(false);
                addressRepository.save(defaultAddr);
            }

            address.setDefault(true);
        } else if (!addressDetails.isDefault() && address.isDefault()) {
            // If unchecking default, keep it as default if no other addresses exist
            List<Address> userAddresses = addressRepository.findByUserId(address.getUser().getId());
            if (userAddresses.size() > 1) {
                address.setDefault(false);
            }
        }

        Address updatedAddress = addressRepository.save(address);
        return ResponseEntity.ok(updatedAddress);
    }

    // Set address as default
    @PutMapping("/{id}/set-default")
    public ResponseEntity<Address> setDefaultAddress(@PathVariable Long id) {
        Optional<Address> addressOptional = addressRepository.findById(id);

        if (addressOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Address address = addressOptional.get();

        // Unset any existing default addresses for this user
        List<Address> defaultAddresses = addressRepository.findByUserIdAndIsDefault(
                address.getUser().getId(), true);

        for (Address defaultAddr : defaultAddresses) {
            if (!defaultAddr.getId().equals(id)) {
                defaultAddr.setDefault(false);
                addressRepository.save(defaultAddr);
            }
        }

        address.setDefault(true);
        Address updatedAddress = addressRepository.save(address);

        return ResponseEntity.ok(updatedAddress);
    }

    // Delete address
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        Optional<Address> addressOptional = addressRepository.findById(id);

        if (addressOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Address address = addressOptional.get();

        // If deleting default address, set another address as default if available
        if (address.isDefault()) {
            List<Address> userAddresses = addressRepository.findByUserId(address.getUser().getId());
            userAddresses.remove(address);

            if (!userAddresses.isEmpty()) {
                Address newDefault = userAddresses.get(0);
                newDefault.setDefault(true);
                addressRepository.save(newDefault);
            }
        }

        addressRepository.delete(address);
        return ResponseEntity.ok().build();
    }
}