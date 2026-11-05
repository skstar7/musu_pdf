package com.pdfplatform.security;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pdfplatform.config.AppProperties;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final AppProperties properties;
    private final Map<String, Counter> counters = new ConcurrentHashMap<>();

    public RateLimitingFilter(AppProperties properties) {
        this.properties = properties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String ip = request.getRemoteAddr();
        int limit = properties.getSecurity().getRateLimitPerMinute();

        Counter counter = counters.computeIfAbsent(ip, key -> new Counter());
        synchronized (counter) {
            long now = Instant.now().getEpochSecond();
            if (now - counter.windowStart >= 60) {
                counter.windowStart = now;
                counter.count = 0;
            }

            counter.count++;
            if (counter.count > limit) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"message\":\"Rate limit exceeded\",\"errorCode\":\"RATE_LIMIT\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private static class Counter {
        private long windowStart = Instant.now().getEpochSecond();
        private int count;
    }
}
