"""
recommendation_service.py
Loads the ML model once at module import time and provides
recommend_topics() and generate_learning_path() functions.
"""

import os
import pickle
import logging
from typing import List, Dict, Any

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# ─── Path Configuration ──────────────────────────────────────────────────────
# Ensure we find the ML directory regardless of where the app is started from
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # app/
ML_DIR = os.path.join(BASE_DIR, "ml")
VECTORIZER_PATH = os.path.join(ML_DIR, "vectorizer.pkl")
MODEL_PATH = os.path.join(ML_DIR, "model.pkl")

# ─── Load model artifacts ONCE at startup ────────────────────────────────────
_vectorizer = None
_model_data: Dict[str, Any] = {}

def _load_model():
    global _vectorizer, _model_data
    try:
        # Check if model files exist
        if not os.path.exists(VECTORIZER_PATH) or not os.path.exists(MODEL_PATH):
            logger.info("[*] Model artifacts missing. Triggering automatic training...")
            try:
                from app.ml.train_model import train
                train()
            except ImportError:
                logger.error("[✗] Could not import training script. Please ensure app/ml/train_model.py exists.")
                return
            except Exception as train_error:
                logger.error(f"[✗] Automatic training failed: {train_error}")
                return

        with open(VECTORIZER_PATH, "rb") as f:
            _vectorizer = pickle.load(f)
        with open(MODEL_PATH, "rb") as f:
            _model_data = pickle.load(f)
        
        logger.info(f"[✓] ML model loaded successfully from {ML_DIR}")
    except Exception as e:
        logger.error(f"[✗] Failed to load ML model: {e}")
        _vectorizer = None
        _model_data = {}

_load_model()  # Load immediately on import


# ─── Service Functions ────────────────────────────────────────────────────────

def _is_model_ready() -> bool:
    return _vectorizer is not None and "df" in _model_data


def recommend_topics(interest: str, top_n: int = 5) -> List[Dict]:
    """
    Given a user interest string, find the top_n most similar topics
    from the dataset using TF-IDF cosine similarity.
    """
    if not _is_model_ready():
        logger.warning("Model not ready; returning empty recommendations.")
        return []

    df: pd.DataFrame = _model_data["df"]
    unique_interests: List[str] = _model_data["unique_interests"]
    tfidf_matrix = _model_data["tfidf_matrix"]

    # Vectorize user query
    query_vec = _vectorizer.transform([interest.lower()])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()

    # Get top matching interest labels
    top_indices = similarities.argsort()[::-1][:top_n]
    matched_interests = [unique_interests[i] for i in top_indices if similarities[i] > 0]

    if not matched_interests:
        # Fallback: just return first domain topics
        matched_interests = [unique_interests[0]]

    # Gather unique topics from matched interests
    matched_df = df[df["interest"].isin(matched_interests)]
    unique_topics = (
        matched_df[["topic", "difficulty"]]
        .drop_duplicates(subset=["topic"])
        .head(top_n)
    )

    results = []
    for i, row in enumerate(unique_topics.itertuples(), start=1):
        results.append({
            "id": str(i),
            "title": row.topic,
            "difficulty": row.difficulty,
        })

    return results


def generate_learning_path(interest: str = "Web Development") -> List[Dict]:
    """
    Generate a sequential learning roadmap derived from the ML model.
    Uses the best-matching domain and returns its ordered steps.
    """
    if not _is_model_ready():
        logger.warning("Model not ready; returning empty path.")
        return []

    df: pd.DataFrame = _model_data["df"]
    unique_interests: List[str] = _model_data["unique_interests"]
    tfidf_matrix = _model_data["tfidf_matrix"]

    # Vectorize query
    query_vec = _vectorizer.transform([interest.lower()])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    best_idx = int(similarities.argmax())
    best_interest = unique_interests[best_idx]

    # Get all steps for the matching domain
    matched_domain_id = df[df["interest"] == best_interest]["domain_id"].iloc[0]
    path_df = (
        df[df["domain_id"] == matched_domain_id]
        .drop_duplicates(subset=["learning_step_order"])
        .sort_values("learning_step_order")
    )

    steps = []
    for row in path_df.itertuples():
        steps.append({
            "id": str(row.learning_step_order),
            "title": row.learning_step,
            "description": str(row.description) if pd.notna(getattr(row, "description", None)) else None,
            "status": "pending",
        })

    return steps
