import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase'; // Import your Firestore instance
import './FounderDashboard.css';

function FounderDashboard() {
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    salary: '',
    equity: '',
  });
  const [formError, setFormError] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const ideasQuery = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(ideasQuery);
        const ideasList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIdeas(ideasList);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const handleViewApplications = async (ideaId) => {
    try {
      const applicationsQuery = query(
        collection(db, 'jobRequests'),
        where('ideaId', '==', ideaId)
      );
      const querySnapshot = await getDocs(applicationsQuery);
      const applications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSelectedApplications(applications);
      setIsApplicationModalOpen(true);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleContact = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIdea((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newIdea.title || !newIdea.description || !newIdea.salary || !newIdea.equity) {
      setFormError('Please fill out all fields before submitting.');
      return;
    }

    try {
      await addDoc(collection(db, 'ideas'), {
        ...newIdea,
        createdAt: new Date(),
        creator: user.email,
      });

      setNewIdea({ title: '', description: '', salary: '', equity: '' });
      setShowForm(false);
      setFormError('');
      alert('Idea posted successfully!');
    } catch (error) {
      console.error('Error posting idea:', error);
      setFormError('Error posting idea. Please try again.');
    }
  };

  return (
    <div className="founder-dashboard">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <span className="account-name">{user ? user.email : 'Loading...'}</span>
        </div>
        <div className="navbar-right">
          <button className="post-idea-button" onClick={() => setShowForm(true)}>Post New Job</button>
        </div>
      </div>

      {loading && <div className="loading-indicator">Loading ideas...</div>}

      <div className="ideas-container">
        {!loading && ideas.length === 0 && <div className="no-ideas-warning">No ideas posted yet. Please add a new idea.</div>}
        {ideas.map((idea) => (
          <div className="idea-card" key={idea.id}>
            <h3 className="idea-title">{idea.title}</h3>
            <p className="idea-creator">Creator: {idea.creator}</p>
            <p className="idea-description">Description: {idea.description}</p>
            <p className="idea-equity">Equity: {idea.equity}</p>
            <p className="idea-salary">Salary: ${idea.salary}</p>
            <button className="view-applications-button" onClick={() => handleViewApplications(idea.id)}>View Developer Applications</button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="post-idea-form">
          <form onSubmit={handleSubmit}>
            <h2>Post a New Idea</h2>

            {formError && <div className="form-error">{formError}</div>}

            <input
              type="text"
              name="title"
              placeholder="Idea Title"
              value={newIdea.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Idea Description"
              value={newIdea.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={newIdea.salary}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="equity"
              placeholder="Equity"
              value={newIdea.equity}
              onChange={handleInputChange}
              required
            />
            <div className="form-buttons">
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isApplicationModalOpen && (
        <div className="application-modal">
          <h2>Applications for Selected Idea</h2>
          {selectedApplications.length === 0 ? (
            <p>No applications available.</p>
          ) : (
            selectedApplications.map((application) => (
              <div key={application.id} className="application-details">
                <p><strong>Developer Name:</strong> {application.developerName}</p>
                <p><strong>Email:</strong> {application.email}</p>
                <p><strong>Phone Number:</strong> {application.phoneNumber}</p>
                <p><strong>Experience:</strong> {application.note}</p>
                <p><strong>Submitted At:</strong> {new Date(application.createdAt.seconds * 1000).toLocaleString()}</p>
                <button
                  className="contact-button"
                  onClick={() => handleContact(application.email)}
                >
                  Contact
                </button>
              </div>
            ))
          )}
          <button className="close-modal-button" onClick={() => setIsApplicationModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default FounderDashboard;
