package com.example.churn_pred;

public class JdkTest {
    public static void main(String[] args) {
        System.out.println("Java version: " + System.getProperty("java.version"));
        System.out.println("Java home: " + System.getProperty("java.home"));

        // Test des imports java.time
        java.time.LocalDate date = java.time.LocalDate.now();
        System.out.println("LocalDate works: " + date);
    }
}