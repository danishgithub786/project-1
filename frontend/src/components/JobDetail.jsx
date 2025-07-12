import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { MapPin, DollarSign, Clock, Building, User, FileText } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getJobById, applyForJob } = useJobs();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState('');
  const [userResumes, setUserResumes] = useState([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user?.userType === 'jobseeker') {
      fetchUserResumes();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const result = await getJobById(id);
      if (result.success) {
        setJob(result.job);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResumes = async () => {
    try {
      const response = await fetch('https://jobportalbackend-srks.onrender.com/api/resumes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUserResumes(data.resumes);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  };

  const handleApply = async () => {
    if (!selectedResume) {
      alert('Please select a resume to apply with');
      return;
    }

    setApplying(true);
    try {
      const result = await applyForJob(id, selectedResume);
      if (result.success) {
        alert('Application submitted successfully!');
        navigate('/jobs');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800'
    };
    return colors[jobType] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceColor = (experience) => {
    const colors = {
      'entry': 'bg-green-100 text-green-800',
      'mid': 'bg-blue-100 text-blue-800',
      'senior': 'bg-purple-100 text-purple-800',
      'lead': 'bg-red-100 text-red-800'
    };
    return colors[experience] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Job Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <Building className="h-5 w-5 mr-2" />
            <span className="font-medium">{job.company}</span>
            <span className="mx-2">•</span>
            <MapPin className="h-5 w-5 mr-2" />
            <span>{job.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
              {job.jobType.replace('-', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(job.experience)}`}>
              {job.experience} level
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <DollarSign className="h-5 w-5 mr-2" />
            <span className="font-medium text-lg">
              {formatSalary(job.salary.min, job.salary.max)}
            </span>
            <span className="mx-2">•</span>
            <Clock className="h-5 w-5 mr-2" />
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
          </div>
        </div>

        {/* Employer Information */}
        {job.employer && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Employer</h2>
            <div className="flex items-center">
              <User className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">
                  {job.employer.firstName} {job.employer.lastName}
                </p>
                <p className="text-gray-600">{job.employer.email}</p>
                {job.employer.phone && (
                  <p className="text-gray-600">{job.employer.phone}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Application Section for Jobseekers */}
        {user?.userType === 'jobseeker' && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h2>
            
            {userResumes.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
                <p>You need to upload a resume before applying. <a href="/upload-resume" className="underline">Upload Resume</a></p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Resume
                  </label>
                  <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a resume...</option>
                    {userResumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.originalName} ({new Date(resume.uploadedAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying || !selectedResume}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Applications List for Employers */}
        {user?.userType === 'employer' && job.applications && job.applications.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications ({job.applications.length})</h2>
            <div className="space-y-3">
              {job.applications.map((application) => (
                <div key={application._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.jobseeker?.firstName} {application.jobseeker?.lastName}
                      </p>
                      <p className="text-gray-600">{application.jobseeker?.email}</p>
                      <p className="text-sm text-gray-500">
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail; 