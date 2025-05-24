package com.himusharier.ajps_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/ajps-uploads/**")
                .addResourceLocations("file:ajps-uploads/"); // or "file:/absolute/path/to/uploads/profile/"
    }
}
