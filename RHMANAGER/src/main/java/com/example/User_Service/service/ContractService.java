package com.example.User_Service.service;


import com.example.User_Service.entity.rhentities.Contract;
import com.example.User_Service.repository.REPORH.ContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;

    public Page<Contract> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable);
    }

    public Contract createContract(Contract contract) {
        return contractRepository.save(contract);
    }

    public Contract getById(Long id) {
        return contractRepository.findById(id).orElse(null);
    }

    public void deleteContract(Long id) {
        contractRepository.deleteById(id);
    }
}
