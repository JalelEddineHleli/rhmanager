package com.example.User_Service.service;


import com.example.User_Service.entity.rhentities.LeaveRequest;
import com.example.User_Service.repository.REPORH.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public Page<LeaveRequest> getAllLeaveRequests(Pageable pageable) {
        return leaveRequestRepository.findAll(pageable);
    }

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest getById(Long id) {
        return leaveRequestRepository.findById(id).orElse(null);
    }

    public void deleteLeaveRequest(Long id) {
        leaveRequestRepository.deleteById(id);
    }
}

