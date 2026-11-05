package com.pdfplatform.processing;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.net.http.HttpClient;
import java.util.concurrent.Executors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import com.pdfplatform.config.AppProperties;
import com.pdfplatform.dto.ProcessingResult;
import com.pdfplatform.exception.ApiException;

@Component
public class PdfProcessingClient {

    private final RestClient restClient;

    public PdfProcessingClient(AppProperties appProperties) {
        Duration requestTimeout = Duration.ofSeconds(appProperties.getProcessing().getTimeoutSeconds());
        HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(requestTimeout)
            .executor(Executors.newFixedThreadPool(16))
            .build();

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(requestTimeout);

        this.restClient = RestClient.builder()
            .baseUrl(appProperties.getProcessing().getWorkerBaseUrl())
            .requestFactory(requestFactory)
            .build();
    }

    public ProcessingResult process(String operation, List<String> inputFiles, String outputFile, Map<String, Object> configuration) {
        WorkerRequest request = new WorkerRequest();
        request.setOperation(operation);
        request.setInputFiles(inputFiles);
        request.setOutputFile(outputFile);
        request.setConfiguration(configuration);

        ResponseEntity<WorkerResponse> response = restClient.post()
            .uri("/process")
            .body(request)
            .retrieve()
            .toEntity(WorkerResponse.class);

        WorkerResponse body = response.getBody();
        if (body == null || !body.isSuccess()) {
            throw new ApiException(body == null ? "Worker returned empty response" : body.getError(), "PROCESSING_ERROR");
        }

        Path outputPath = Path.of(body.getOutputFile());
        if (!Files.exists(outputPath)) {
            throw new ApiException("Worker output missing", "PROCESSING_ERROR");
        }

        try {
            return new ProcessingResult(body.getOutputFile(), Files.size(outputPath));
        } catch (Exception ex) {
            throw new ApiException("Unable to read output file metadata", "PROCESSING_ERROR");
        }
    }
}
