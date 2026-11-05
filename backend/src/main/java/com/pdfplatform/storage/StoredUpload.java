package com.pdfplatform.storage;

import java.util.List;

public class StoredUpload {

	private final List<String> absolutePaths;
	private final long totalSizeBytes;

	public StoredUpload(List<String> absolutePaths, long totalSizeBytes) {
		this.absolutePaths = absolutePaths;
		this.totalSizeBytes = totalSizeBytes;
	}

	public List<String> absolutePaths() {
		return absolutePaths;
	}

	public long totalSizeBytes() {
		return totalSizeBytes;
	}
}
