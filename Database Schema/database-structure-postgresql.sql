-- USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    affiliation TEXT,
    role VARCHAR(20) CHECK (role IN ('author', 'editor', 'reviewer', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JOURNALS TABLE
CREATE TABLE journals (
    journal_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    scope TEXT,
    submission_guidelines TEXT,
    editorial_board TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ISSUES TABLE
CREATE TABLE issues (
    issue_id SERIAL PRIMARY KEY,
    journal_id INT REFERENCES journals(journal_id) ON DELETE CASCADE,
    volume INT,
    number INT,
    publication_date DATE,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'published')) DEFAULT 'scheduled'
);

-- ARTICLES TABLE
CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    abstract TEXT,
    current_version_id INT,
    author_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    journal_id INT REFERENCES journals(journal_id),
    issue_id INT REFERENCES issues(issue_id),
    status VARCHAR(30) CHECK (status IN ('submitted', 'under_review', 'revision', 'accepted', 'rejected', 'published')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ARTICLE VERSIONS TABLE
CREATE TABLE article_versions (
    version_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    version_number INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments TEXT
);

-- PEER REVIEWS TABLE
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    version_id INT REFERENCES article_versions(version_id),
    reviewer_id INT REFERENCES users(user_id),
    comments TEXT,
    recommendation VARCHAR(20) CHECK (recommendation IN ('accept', 'minor_revision', 'major_revision', 'reject')),
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ARTICLE EDITOR ASSIGNMENTS
CREATE TABLE article_editors (
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    editor_id INT REFERENCES users(user_id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (article_id, editor_id)
);

-- REVIEWER ASSIGNMENTS
CREATE TABLE article_reviewers (
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users(user_id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (article_id, reviewer_id)
);

-- MESSAGES TABLE (author-editor communication)
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(user_id),
    receiver_id INT REFERENCES users(user_id),
    article_id INT REFERENCES articles(article_id),
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENTS TABLE (for APCs)
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    user_id INT REFERENCES users(user_id),
    amount DECIMAL(10,2),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
