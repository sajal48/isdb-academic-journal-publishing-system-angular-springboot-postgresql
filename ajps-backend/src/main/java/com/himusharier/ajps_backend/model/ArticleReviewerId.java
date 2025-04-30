package com.himusharier.ajps_backend.model;

import java.io.Serializable;
import java.util.Objects;

public class ArticleReviewerId implements Serializable {
    private Long article;
    private Long reviewer;

    public ArticleReviewerId() {}

    public ArticleReviewerId(Long article, Long reviewer) {
        this.article = article;
        this.reviewer = reviewer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ArticleReviewerId)) return false;
        ArticleReviewerId that = (ArticleReviewerId) o;
        return Objects.equals(article, that.article) && Objects.equals(reviewer, that.reviewer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(article, reviewer);
    }
}
