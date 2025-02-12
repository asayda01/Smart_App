-- smart_app\init_table.sql
-- Required for Docker containerization
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    predicted_category VARCHAR(50) NOT NULL,
    confidence_scores JSON NOT NULL,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
