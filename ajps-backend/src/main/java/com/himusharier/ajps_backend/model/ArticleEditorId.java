package com.himusharier.ajps_backend.model;

import java.io.Serializable;
import java.util.Objects;

public class ArticleEditorId implements Serializable {
    private Long article;
    private Long editor;

    public ArticleEditorId() {}

    public ArticleEditorId(Long article, Long editor) {
        this.article = article;
        this.editor = editor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ArticleEditorId)) return false;
        ArticleEditorId that = (ArticleEditorId) o;
        return Objects.equals(article, that.article) && Objects.equals(editor, that.editor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(article, editor);
    }
}
