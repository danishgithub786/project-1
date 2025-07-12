import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/jobs?${params}`);
      setJobs(response.data.jobs);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      const response = await axios.post('/jobs', jobData);
      return { success: true, job: response.data.job };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create job' 
      };
    }
  };

  const getJobById = async (id) => {
    try {
      const response = await axios.get(`/jobs/${id}`);
      return { success: true, job: response.data.job };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch job' 
      };
    }
  };

  const applyForJob = async (jobId, resumeId) => {
    try {
      await axios.post(`/jobs/${jobId}/apply`, { resumeId });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to apply for job' 
      };
    }
  };

  const value = {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    getJobById,
    applyForJob
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
}; 