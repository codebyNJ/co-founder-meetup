import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // Import db and auth from firebase.js
import "./Dashboard.css";

const DeveloperPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormActive, setIsFormActive] = useState(false); // To toggle form visibility
  const [selectedIdea, setSelectedIdea] = useState(null); // To store selected idea for applying
  const [note, setNote] = useState(""); // Developer's experience
  const [phoneNumber, setPhoneNumber] = useState(""); // Developer's phone number
  const [email, setEmail] = useState(""); // Developer's email
  const [error, setError] = useState(""); // To store error messages

  // Fetch ideas from Firestore
  const fetchIdeas = async () => {
    try {
      const ideasCollection = collection(db, "ideas");
      const snapshot = await getDocs(ideasCollection);
      const ideasList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIdeas(ideasList);
    } catch (error) {
      console.error("Error fetching ideas: ", error);
    }
    setLoading(false);
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
  };

  // Show browser notification
  const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/path/to/icon.png", // Optional icon for the notification
      });
    }
  };

  // Open the apply form and set the selected idea
  const handleApply = (idea) => {
    setSelectedIdea(idea);
    setIsFormActive(true);
  };

  // Close the apply form
  const closeForm = () => {
    setIsFormActive(false);
    setNote("");
    setPhoneNumber("");
    setEmail("");
    setError("");
  };

  // Submit the job request along with note, phone number, and email
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure "Experience", "Phone Number", and "Email" are provided
    if (!note) {
      setError("Please add your experience.");
      return;
    }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!auth.currentUser) {
      alert("Please log in to apply.");
      return;
    }

    const user = auth.currentUser;
    const jobRequest = {
      ideaId: selectedIdea.id,
      developerId: user.uid,
      developerName: user.displayName || "Anonymous",
      note: note,
      phoneNumber: phoneNumber,
      email: email,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      // Add job request to Firestore
      await addDoc(collection(db, "jobRequests"), jobRequest);

      // Show a success notification
      showNotification("Job Request Submitted!", "Your job request has been submitted successfully.");

      // Close the form after submission
      closeForm();
    } catch (error) {
      console.error("Error submitting job request: ", error);
      alert("Failed to submit job request.");
    }
  };

  useEffect(() => {
    fetchIdeas();
    requestNotificationPermission(); // Request permission when the component mounts
  }, []);

  return (
    <div className="developer-dashboard">
      <div className="developer-title">
        <h3>Developer Dashboard</h3>
      </div>

      <div className="ideas-container">
        {loading ? (
          <p>Loading ideas...</p>
        ) : (
          ideas.map((idea) => (
            <div key={idea.id} className="idea-card">
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <p>Equity: {idea.equity}</p>
              <p>Salary: {idea.salary}</p>
              <span>Posted by: {idea.creator}</span>
              <button className="apply-button" onClick={() => handleApply(idea)}>
                Apply
              </button>
            </div>
          ))
        )}
      </div>

      {/* Apply Form */}
      <div className={`apply-form ${isFormActive ? "active" : ""}`}>
        <button className="close-btn" onClick={closeForm}>
          X
        </button>
        <h2>Apply for {selectedIdea?.title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="note">Experience (required)</label>
            <textarea
              className="textarea-field"
              id="note"
              rows="4"
              placeholder="Add your experience..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (required)</label>
            <input
              type="tel"
              className="input-field"
              id="phone"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (required)</label>
            <input
              type="email"
              className="input-field"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="apply-button-in-form">
            Submit Application
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default DeveloperPage;
