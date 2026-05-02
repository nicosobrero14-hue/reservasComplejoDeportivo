package com.nsobrero.reservasTurnos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ReservasTurnosApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReservasTurnosApplication.class, args);
	}

}
