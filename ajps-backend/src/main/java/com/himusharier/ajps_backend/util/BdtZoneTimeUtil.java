package com.himusharier.ajps_backend.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class BdtZoneTimeUtil {
    private static final ZoneId BDT_ZONE = ZoneId.of("Asia/Dhaka"); // Bangladesh Standard Time

    public static LocalDateTime timeInBDT() {
        return ZonedDateTime.now(BDT_ZONE).toLocalDateTime();
    }
    /*public static LocalDateTime timeInBDT() {
        return LocalDateTime.now();
    }*/
}
