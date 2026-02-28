import React, { useState, useEffect } from 'react';
import { BookOpen, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import * as parentApi from '../services/parentApi';

/**
 * ParentResultsPage Component
 * Displays child's academic results in read-only format
 * Validates: Requirements 5.1, 5.2, 5.3, 5.5
 */
const ParentResultsPage = ({ selectedChild }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!selectedChild) {
      setError('No child selected');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await parentApi.getChildResults(selectedChild.id, currentPage);
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedChild, currentPage]);

  if (!selectedChild) {
    return (
      <div className="results-page">
        <div className="error-message">
          <p>Please select a child to view their results</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="results-page">
        <div className="loading-container">
          <Loader className="spinner" size={40} />
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!results || !results.results || results.results.length === 0) {
    return (
      <div className="results-page">
        <div className="no-data-message">
          <BookOpen size={48} />
          <p>No results available yet</p>
        </div>
      </div>
    );
  }

  const { student, results: resultsList, statistics, pagination } = results;

  const getGradeColor = (grade) => {
    if (!grade) return '#999';
    if (grade === 'A' || grade === 'A-') return '#10b981';
    if (grade === 'B') return '#3b82f6';
    if (grade === 'C') return '#f59e0b';
    if (grade === 'D