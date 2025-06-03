package com.himusharier.ajps_backend.util;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class BdtZoneTimeUtil {
    private static final ZoneId BDT_ZONE = ZoneId.of("Asia/Dhaka");

    public static LocalDateTime timeInBDT() {
        return LocalDateTime.now(BDT_ZONE);
    }
    /*public static LocalDateTime timeInBDT() {
        return LocalDateTime.now();
    }*/
}
