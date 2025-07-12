import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Download, Trash2, AlertCircle } from 'lucide-react';

const ResumeUpload = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.userType === 'jobseeker') {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jobportalbackend-srks.onrender.com/api/resumes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and Word documents are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('https://jobportalbackend-srks.onrender.com/api/resumes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Resume uploaded successfully!');
        fetchResumes();
        e.target.value = ''; // Clear file input
      } else {
        setError(data.message || 'Failed to upload resume');
      }
    } catch (error) {
      setError('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resumeId, originalName) => {
    try {
      const response = await fetch(`https://jobportalbackend-srks.onrender.com/api/resumes/${resumeId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      setError('Failed to download resume');
    }
  };

  const handleDelete = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`https://jobportalbackend-srks.onrender.com/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setSuccess('Resume deleted successfully!');
        fetchResumes();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete resume');
      }
    } catch (error) {
      setError('Failed to delete resume');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (user?.userType !== 'jobseeker') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only job seekers can upload resumes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Management</h1>
        <p className="text-gray-600">Upload and manage your resumes</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Resume</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop your resume here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: PDF, DOC, DOCX (Max size: 5MB)
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
        </div>
      </div>

      {/* Resumes List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Resumes</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resumes uploaded yet</p>
            <p className="text-sm text-gray-500">Upload your first resume to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div key={resume._id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">{resume.originalName}</h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(resume.fileSize)} • Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(resume._id, resume.originalName)}
                    className="text-blue-600 hover:text-blue-700 p-2"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload; 