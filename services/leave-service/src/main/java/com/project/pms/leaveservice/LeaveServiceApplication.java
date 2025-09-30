package com.project.pms.leaveservice;

import org.springframework.boot.SpringApplication;

@SpringBootApplication
@EnableDiscoveryClient
public class LeaveServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeaveServiceApplication.class, args);
    }

}